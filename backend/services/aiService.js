/**
 * aiService.js
 * Handles Groq API communication + FAQ fallback for the chatbot.
 * Model: llama-3.3-70b-versatile (replace with current model if deprecated)
 */

const https = require('https');

// ── Model ────────────────────────────────────────────────────────────────────
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const GROQ_ENDPOINT = 'api.groq.com';
const GROQ_PATH = '/openai/v1/chat/completions';

// ── System prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a friendly and helpful support assistant for an AI-powered healthcare website.

STRICT MEDICAL SAFETY RULES — follow these at all times, without exception:
- You must NEVER diagnose any disease, illness, or medical condition.
- You must NEVER prescribe, recommend, or suggest any medication or treatment.
- You must NEVER claim to be fully accurate or a substitute for professional medical advice.
- You must NEVER tell a user to ignore, delay, or avoid seeking advice from a qualified doctor.
- If a user describes symptoms that may be a medical emergency (chest pain, difficulty breathing, stroke symptoms, severe bleeding, etc.), you MUST immediately advise them to call emergency services (e.g. 911, 1122 in Pakistan) and NOT engage further in medical discussion.

YOUR ROLE — you help users navigate the website and its features:
1. Booking Appointments: Guide users to the Appointments page where they can find and book with specialist doctors.
2. Searching Doctors: Direct users to the Doctors section to search by specialty, location, or name.
3. Searching Medicines: Point users to the Medicines/Pharmacy section for medicine information.
4. Viewing Lab Tests: Explain that the Lab Tests page lists available tests, prices, and allows booking.
5. Contacting Emergency Services: Provide emergency contact information (Pakistan: Rescue 1122, Edhi 115, Chhipa 1020) and always encourage calling directly.
6. Finding Nearby Hospitals: Direct users to the Hospital Finder page which uses their GPS to show nearby hospitals on a map.
7. Reading Health Blogs: Point users to the Health Blogs/Articles section for general wellness content.
8. General Site Navigation: Help users find any other feature or section on the website.

Always be concise, warm, and non-technical. Respond in 2-4 sentences maximum unless the user needs step-by-step guidance. When in doubt about any medical topic, refer the user to a qualified healthcare professional.`;

// ── FAQ fallback ──────────────────────────────────────────────────────────────
// Used ONLY when the Groq API is unavailable (timeout, auth error, rate limit)
const FAQ_FALLBACK = [
  {
    keywords: ['book', 'appointment', 'schedule', 'doctor appointment'],
    answer:
      'To book an appointment, head to the **Appointments** page from the main menu. You can search for doctors by specialty or location and pick an available time slot that suits you.',
  },
  {
    keywords: ['find doctor', 'search doctor', 'specialist', 'physician'],
    answer:
      'You can find doctors on our **Doctors** page. Filter by specialty (e.g. Cardiologist, Dermatologist) or search by name. Each profile shows their qualifications, clinic location, and availability.',
  },
  {
    keywords: ['medicine', 'medication', 'drug', 'pharmacy', 'prescription'],
    answer:
      'Visit our **Medicines** section to search for medication information including uses and general details. For any prescription or treatment decisions, please consult a qualified doctor.',
  },
  {
    keywords: ['lab test', 'blood test', 'test', 'diagnostic'],
    answer:
      'Our **Lab Tests** page lists all available tests (blood work, imaging, etc.) with prices. You can book a test directly from there and receive your results online.',
  },
  {
    keywords: ['emergency', 'urgent', 'ambulance', 'help now', 'critical'],
    answer:
      '⚠️ If this is a medical emergency, please call emergency services **immediately** — Pakistan: Rescue **1122**, Edhi Foundation **115**, Chhipa **1020**. Do not wait. Our **Hospital Finder** can also show you the nearest hospital.',
  },
  {
    keywords: ['hospital', 'nearby', 'near me', 'hospital finder', 'location'],
    answer:
      'Use our **Hospital Finder** page! It uses your GPS to show nearby hospitals on a live map with distances and a one-tap "Get Directions" button.',
  },
  {
    keywords: ['blog', 'article', 'health tip', 'read', 'news'],
    answer:
      'Check out our **Health Blog** section in the main menu for articles on wellness, nutrition, disease prevention, and healthy living written by healthcare professionals.',
  },
  {
    keywords: ['navigate', 'how do i', 'where', 'find', 'page', 'section', 'feature'],
    answer:
      "You can navigate to any feature from the main menu at the top of the page. Key sections include: Doctors, Appointments, Lab Tests, Hospital Finder, Medicines, and Health Blog. Can you tell me more about what you're looking for?",
  },
];

/**
 * Match a user message to an FAQ fallback answer.
 * Returns the best-matching answer string, or a generic fallback.
 */
function matchFAQFallback(userMessage) {
  const lower = userMessage.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const faq of FAQ_FALLBACK) {
    const score = faq.keywords.filter((kw) => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = faq;
    }
  }

  if (bestMatch) return bestMatch.answer;

  return "I'm here to help you navigate the website! You can ask me about booking appointments, finding doctors, lab tests, the hospital finder, medicines, or health articles. What do you need?";
}

// ── HTTPS POST helper ─────────────────────────────────────────────────────────
function httpsPost(hostname, path, body, apiKey, timeoutMs = 20000) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const options = {
      hostname,
      port: 443,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        Authorization: `Bearer ${apiKey}`,
      },
    };

    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', (chunk) => (raw += chunk));
      res.on('end', () => {
        if (res.statusCode === 401) {
          return reject(new Error('Invalid Groq API key (401 Unauthorized)'));
        }
        if (res.statusCode === 429) {
          return reject(new Error('Groq API rate limit reached (429)'));
        }
        if (res.statusCode >= 400) {
          return reject(new Error(`Groq API error: HTTP ${res.statusCode}`));
        }
        try {
          resolve(JSON.parse(raw));
        } catch {
          reject(new Error('Invalid JSON from Groq API'));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(timeoutMs, () => {
      req.destroy();
      reject(new Error('Groq API request timed out'));
    });
    req.write(payload);
    req.end();
  });
}

// ── Main export ───────────────────────────────────────────────────────────────
/**
 * Call Groq with the conversation history + new user message.
 * Returns { content: string, usedFallback: boolean }
 */
async function getAIResponse(conversationHistory, newUserMessage) {
  const apiKey = process.env.AI_API_KEY;

  if (!apiKey) {
    console.warn('[aiService] AI_API_KEY not set — using FAQ fallback');
    return { content: matchFAQFallback(newUserMessage), usedFallback: true };
  }

  // Build messages array: system + history (last 10 pairs max) + new message
  const historySlice = conversationHistory.slice(-20); // last 20 messages = 10 pairs
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...historySlice.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: newUserMessage },
  ];

  try {
    const response = await httpsPost(
      GROQ_ENDPOINT,
      GROQ_PATH,
      {
        model: GROQ_MODEL,
        messages,
        max_tokens: 400,
        temperature: 0.5,
      },
      apiKey
    );

    const content = response.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty response from Groq');

    return { content, usedFallback: false };
  } catch (err) {
    console.error('[aiService] Groq call failed:', err.message, '— using FAQ fallback');
    return { content: matchFAQFallback(newUserMessage), usedFallback: true };
  }
}

module.exports = { getAIResponse, matchFAQFallback };
