import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import Blog from "../models/Blog.js";

dotenv.config();

const blogs = [
  {
    title: "10 Simple Tips for a Healthy Lifestyle",
    description: "Small daily habits can make a big difference in your overall health and wellness.",
    content: `Maintaining a healthy lifestyle doesn't have to be complicated or overwhelming. By incorporating small, consistent habits into your daily routine, you can significantly improve your physical and mental well-being. Here are ten practical tips to help you live a healthier life:

1. **Stay Hydrated**: Drinking enough water throughout the day is essential for digestion, circulation, and temperature regulation. Aim for at least 8 glasses of water daily, and increase your intake during hot weather or physical activity.

2. **Prioritize Sleep**: Quality sleep is crucial for recovery, memory consolidation, and immune function. Adults should aim for 7-9 hours of sleep per night. Establish a consistent sleep schedule by going to bed and waking up at the same time every day, even on weekends.

3. **Eat a Balanced Diet**: Focus on consuming a variety of whole foods including fruits, vegetables, lean proteins, whole grains, and healthy fats. Try to limit processed foods, added sugars, and excessive salt. The Mediterranean diet, rich in olive oil, fish, and vegetables, is widely recommended by health professionals.

4. **Stay Physically Active**: Regular exercise helps maintain a healthy weight, strengthens bones and muscles, and reduces the risk of chronic diseases. Aim for at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity per week, along with strength training exercises twice a week.

5. **Manage Stress**: Chronic stress can negatively impact both physical and mental health. Practice stress management techniques such as deep breathing exercises, meditation, yoga, or simply taking short breaks throughout your day to relax and recharge.

6. **Limit Screen Time**: Excessive use of digital devices can strain your eyes, disrupt sleep patterns, and contribute to a sedentary lifestyle. Set boundaries for screen time, especially before bedtime, and make time for offline activities like reading, hobbies, or spending time in nature.

7. **Maintain Social Connections**: Strong social relationships are linked to better mental health and longevity. Make an effort to stay connected with friends and family through regular calls, video chats, or in-person meetups when possible.

8. **Practice Good Hygiene**: Simple habits like regular hand washing, dental care, and keeping your living space clean can prevent the spread of infections and contribute to overall wellness.

9. **Schedule Regular Checkups**: Preventive healthcare is essential for catching potential health issues early. Visit your healthcare provider for regular checkups, screenings, and vaccinations according to recommended guidelines for your age and risk factors.

10. **Limit Alcohol and Avoid Smoking**: Excessive alcohol consumption and smoking are major risk factors for numerous health conditions including liver disease, cancer, and cardiovascular problems. If you drink alcohol, do so in moderation, and seek support if you need help quitting smoking.

Remember, you don't need to implement all these changes at once. Start with one or two tips, gradually build healthy habits, and celebrate your progress along the way. Always consult with a qualified healthcare professional before making significant changes to your diet or exercise routine.`,
    category: "Health Tips",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800",
    author: "Healthcare Team",
    readTime: "8 min read",
  },
  {
    title: "Understanding Diabetes and Its Warning Signs",
    description: "Learn about common diabetes symptoms, risk factors, and why early medical advice is essential.",
    content: `Diabetes is a chronic metabolic condition characterized by elevated blood sugar levels. According to the International Diabetes Federation, approximately 537 million adults worldwide are living with diabetes, and this number is projected to rise to 643 million by 2030. Understanding the warning signs and risk factors can help with early detection and management.

**What is Diabetes?**

Diabetes occurs when the body either cannot produce enough insulin or cannot effectively use the insulin it produces. Insulin is a hormone produced by the pancreas that regulates blood sugar levels. There are three main types of diabetes:

1. **Type 1 Diabetes**: An autoimmune condition where the immune system attacks insulin-producing cells in the pancreas. It typically develops in childhood or adolescence and requires daily insulin injections.

2. **Type 2 Diabetes**: The most common form, accounting for approximately 90% of all diabetes cases. It develops when the body becomes resistant to insulin or doesn't produce enough. It is often associated with lifestyle factors such as obesity, physical inactivity, and poor diet.

3. **Gestational Diabetes**: Develops during pregnancy and usually resolves after childbirth, but increases the risk of developing type 2 diabetes later in life.

**Common Warning Signs and Symptoms**

Many people with diabetes may not experience noticeable symptoms in the early stages. However, common warning signs include:

- Frequent urination, especially at night
- Excessive thirst and dry mouth
- Unexplained weight loss
- Increased hunger
- Fatigue and weakness
- Blurred vision
- Slow-healing cuts or wounds
- Frequent infections
- Tingling or numbness in the hands or feet
- Darkened skin areas, particularly around the neck or armpits

**Risk Factors for Type 2 Diabetes**

Certain factors can increase your risk of developing type 2 diabetes:

- Family history of diabetes
- Being overweight or obese
- Physical inactivity
- Unhealthy dietary habits
- Age (risk increases after 45)
- History of gestational diabetes
- High blood pressure or high cholesterol
- Polycystic ovary syndrome (PCOS)

**When to See a Doctor**

If you experience any of the above symptoms or have multiple risk factors, it is important to consult a healthcare professional. Early diagnosis through simple blood tests can help prevent or delay complications. The most common diagnostic tests include:

- Fasting Plasma Glucose (FPG) Test
- HbA1c Test (measures average blood sugar over 2-3 months)
- Oral Glucose Tolerance Test (OGTT)

**Prevention and Management**

While type 1 diabetes cannot be prevented, type 2 diabetes can often be delayed or prevented through lifestyle modifications:

- Maintain a healthy weight
- Eat a balanced diet rich in fiber and low in added sugars
- Engage in regular physical activity
- Avoid tobacco use
- Limit alcohol consumption
- Manage stress effectively

**Important Medical Disclaimer**

This information is for general educational purposes only and does not replace professional medical advice. If you suspect you or a loved one may have diabetes, please consult a qualified healthcare provider for proper evaluation, diagnosis, and treatment. Early intervention can significantly improve outcomes and quality of life.`,
    category: "Disease Information",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800",
    author: "Dr. Sarah Khan",
    readTime: "10 min read",
  },
  {
    title: "Why Regular Exercise Supports Better Health",
    description: "Exercise helps improve heart health, strength, mood, and energy levels. Learn how to incorporate physical activity into your daily routine.",
    content: `Regular physical activity is one of the most important things you can do for your health. The World Health Organization recommends that adults aged 18-64 engage in at least 150-300 minutes of moderate-intensity aerobic physical activity per week, or at least 75-150 minutes of vigorous-intensity aerobic activity.

**Physical Benefits of Regular Exercise**

1. **Cardiovascular Health**: Regular exercise strengthens the heart muscle, improves blood circulation, and helps lower blood pressure and cholesterol levels. It reduces the risk of heart disease, stroke, and other cardiovascular conditions.

2. **Weight Management**: Physical activity helps burn calories and build muscle mass, which increases metabolism and supports healthy weight maintenance. Combined with a balanced diet, exercise is an effective strategy for weight management.

3. **Muscle and Bone Strength**: Weight-bearing exercises like walking, running, and strength training help build and maintain strong bones and muscles, reducing the risk of osteoporosis and frailty as we age.

4. **Improved Immune Function**: Moderate regular exercise has been shown to boost the immune system, potentially reducing the risk of infections and chronic diseases.

5. **Better Sleep Quality**: Physical activity can help you fall asleep faster and enjoy deeper sleep. However, avoid vigorous exercise too close to bedtime as it may interfere with sleep for some people.

**Mental Health Benefits**

1. **Stress Reduction**: Exercise triggers the release of endorphins, often called "feel-good" hormones, which can help reduce stress and anxiety levels.

2. **Improved Mood**: Regular physical activity has been shown to be effective in reducing symptoms of mild to moderate depression and anxiety. Even a short walk can improve your mood and mental clarity.

3. **Cognitive Function**: Exercise increases blood flow to the brain and may help improve memory, concentration, and overall cognitive function. It may also reduce the risk of cognitive decline as we age.

4. **Boosted Self-Esteem**: Achieving fitness goals, no matter how small, can improve self-confidence and body image.

**Types of Exercise to Consider**

1. **Aerobic Exercise**: Walking, jogging, swimming, cycling, and dancing improve cardiovascular fitness.

2. **Strength Training**: Using weights, resistance bands, or bodyweight exercises builds muscle and bone strength.

3. **Flexibility Exercises**: Stretching and yoga improve range of motion and reduce the risk of injury.

4. **Balance Exercises**: Tai chi and other balance-focused activities help prevent falls, especially important for older adults.

**Getting Started Safely**

If you are new to exercise or have a pre-existing health condition, consult your healthcare provider before starting a new fitness routine. Start slowly and gradually increase intensity and duration. Listen to your body and rest when needed. Remember that consistency is more important than intensity when building a sustainable exercise habit.

**Medical Disclaimer**

This article provides general information about the benefits of exercise and is not a substitute for professional medical advice. Always consult a qualified healthcare professional before starting any new exercise program, especially if you have underlying health conditions or concerns.`,
    category: "Fitness",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
    author: "Health & Fitness Team",
    readTime: "9 min read",
  },
  {
    title: "Nutrition Basics for Everyday Wellness",
    description: "A balanced diet gives your body the nutrients it needs to function well. Learn essential nutrition principles for better health.",
    content: `Good nutrition is the foundation of good health. The food we eat provides the energy and nutrients our bodies need to function properly, maintain strong immune systems, and reduce the risk of chronic diseases. Understanding basic nutrition principles can help you make informed food choices.

**The Essential Nutrients**

Our bodies require a variety of nutrients to function optimally:

1. **Carbohydrates**: The body's primary source of energy. Choose complex carbohydrates like whole grains, fruits, vegetables, and legumes over refined carbohydrates and added sugars.

2. **Proteins**: Essential for building and repairing tissues, producing enzymes and hormones, and supporting immune function. Good sources include lean meats, poultry, fish, eggs, dairy products, legumes, nuts, and seeds.

3. **Fats**: Necessary for energy storage, cell membrane structure, and absorption of fat-soluble vitamins (A, D, E, K). Focus on healthy unsaturated fats from sources like avocados, olive oil, nuts, seeds, and fatty fish.

4. **Vitamins**: Organic compounds that play various roles in bodily functions. Each vitamin has specific functions, and deficiencies can lead to various health issues. Eat a colorful variety of fruits and vegetables to ensure adequate vitamin intake.

5. **Minerals**: Inorganic elements essential for processes like bone formation, fluid balance, and nerve function. Important minerals include calcium, iron, magnesium, potassium, and zinc.

6. **Water**: Often overlooked but essential for digestion, absorption, circulation, and temperature regulation. Aim for adequate hydration throughout the day.

**Building a Balanced Plate**

A simple way to ensure balanced nutrition is to follow the plate method:

- Fill half your plate with fruits and vegetables
- Fill one-quarter with lean protein
- Fill one-quarter with whole grains or complex carbohydrates
- Include a serving of healthy fats

**Practical Nutrition Tips**

1. **Eat the Rainbow**: Different colored fruits and vegetables contain different nutrients. Aim to include a variety of colors in your diet.

2. **Choose Whole Foods**: Minimally processed foods like fresh produce, whole grains, and lean proteins are generally more nutritious than highly processed alternatives.

3. **Read Food Labels**: Pay attention to serving sizes, added sugars, sodium content, and ingredient lists when buying packaged foods.

4. **Practice Portion Control**: Even healthy foods can contribute to weight gain if consumed in excessive amounts. Learn to recognize appropriate portion sizes.

5. **Limit Added Sugars**: The American Heart Association recommends limiting added sugars to no more than 6 teaspoons (25 grams) per day for women and 9 teaspoons (36 grams) per day for men.

6. **Reduce Sodium Intake**: High sodium intake is linked to increased blood pressure. Aim for less than 2,300 mg of sodium per day, or 1,500 mg for those with hypertension.

7. **Stay Hydrated**: Water is the best choice for hydration. Limit sugary drinks and excessive caffeine.

**Common Nutrition Myths Debunked**

- Myth: Carbohydrates are bad for you. Fact: Complex carbohydrates are essential for energy and health. It's refined and processed carbs that should be limited.
- Myth: All fats are unhealthy. Fact: Healthy fats are essential for bodily functions. Focus on unsaturated fats while limiting trans fats and saturated fats.
- Myth: Skipping meals helps with weight loss. Fact: Regular meals help maintain stable blood sugar levels and prevent overeating later in the day.

**Medical Disclaimer**

This article provides general nutritional information for educational purposes. Individual nutritional needs vary based on age, gender, activity level, health conditions, and other factors. Consult a qualified healthcare professional or registered dietitian for personalized dietary advice.`,
    category: "Nutrition",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800",
    author: "Nutrition Team",
    readTime: "10 min read",
  },
  {
    title: "Mental Health Matters: Managing Daily Stress",
    description: "Stress management is an important part of overall healthcare. Learn effective strategies for maintaining mental wellness.",
    content: `Mental health is an integral part of our overall well-being, yet it is often overlooked or neglected. In our fast-paced world, stress has become a common experience for many people. While some stress can be motivating, chronic stress can negatively impact both mental and physical health if left unmanaged.

**Understanding Stress**

Stress is the body's natural response to perceived threats or challenges. When faced with a stressful situation, the body releases hormones like cortisol and adrenaline, triggering the "fight or flight" response. While this response is helpful in short-term situations, prolonged activation can lead to various health problems including:

- Anxiety and depression
- Sleep disturbances
- Digestive issues
- Weakened immune system
- High blood pressure
- Heart disease
- Weight gain
- Memory and concentration difficulties

**Common Sources of Stress**

Stress can arise from various sources including:

- Work pressure and job insecurity
- Financial concerns
- Relationship difficulties
- Health problems
- Major life changes (moving, divorce, loss of a loved one)
- Academic pressure
- Social media and information overload
- Global events and uncertainty

**Effective Stress Management Strategies**

1. **Practice Mindfulness and Meditation**: Mindfulness involves focusing on the present moment without judgment. Even 5-10 minutes of daily meditation can help reduce stress and improve emotional regulation. Apps like Headspace, Calm, or Insight Timer can guide beginners through meditation practices.

2. **Deep Breathing Exercises**: Simple breathing techniques can activate the body's relaxation response. Try the 4-7-8 technique: inhale for 4 seconds, hold for 7 seconds, and exhale for 8 seconds. Repeat several times until you feel calmer.

3. **Regular Physical Activity**: Exercise is one of the most effective stress-relief strategies. It releases endorphins, improves mood, and helps clear the mind. Even a 20-minute walk can make a significant difference.

4. **Maintain Social Connections**: Talking to trusted friends, family members, or support groups can provide emotional support and perspective. Don't hesitate to reach out when you're feeling overwhelmed.

5. **Establish Healthy Boundaries**: Learn to say no to commitments that drain your energy. Set boundaries around work hours, social obligations, and digital device usage.

6. **Prioritize Sleep**: Lack of sleep can exacerbate stress and make it harder to cope with challenges. Aim for 7-9 hours of quality sleep each night and establish a calming bedtime routine.

7. **Time Management**: Break large tasks into smaller, manageable steps. Use tools like to-do lists, calendars, or time-blocking to organize your day and reduce feelings of overwhelm.

8. **Limit News and Social Media**: Constant exposure to negative news and social media can increase anxiety. Set boundaries for news consumption and take regular "digital detox" breaks.

9. **Engage in Hobbies**: Activities that bring you joy, whether it's reading, gardening, painting, cooking, or playing music, can provide a healthy escape from stress.

10. **Seek Professional Help When Needed**: If stress becomes overwhelming or interferes with daily functioning, consider speaking with a mental health professional. Therapy, counseling, or support groups can provide valuable tools and support.

**When to Seek Professional Help**

It's important to seek professional help if you experience:

- Persistent feelings of sadness, hopelessness, or worthlessness
- Inability to function in daily life
- Thoughts of self-harm or suicide
- Significant changes in appetite or sleep patterns
- Increased use of alcohol or substances to cope
- Withdrawal from social activities and relationships

**Medical Disclaimer**

This article provides general information about mental health and stress management for educational purposes. It is not a substitute for professional mental health care. If you are experiencing a mental health crisis, please contact emergency services immediately or reach out to a mental health crisis hotline. In Pakistan, you can contact the Pakistan Mental Health Helpline at 0311-7786264 or visit your nearest hospital emergency department.`,
    category: "Mental Health",
    image: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800",
    author: "Wellness Team",
    readTime: "11 min read",
  },
];

const seedBlogs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Blog.deleteMany();
    await Blog.insertMany(blogs);
    console.log("Blog data seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Blog seed failed:", error.message);
    process.exit(1);
  }
};

seedBlogs();