/**
 * mapService.js
 * Queries the Overpass API for hospitals within a given radius,
 * then attaches haversine distance to each result.
 */

import https from 'https';

// ─── Haversine distance (km) ─────────────────────────────────────────────────
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Tiny HTTPS GET helper with timeout and headers ─────────────────────
function httpsGet(url, timeoutMs = 20000, headers = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'HealthcareApp/1.0 (contact: admin@healthcareapp.com)',
        'Accept': 'application/json',
        ...headers,
      },
    };

    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', (chunk) => (raw += chunk));
      res.on('end', () => {
        if (res.statusCode === 429) {
          return reject(new Error('Overpass API rate limit reached. Please try again later.'));
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`Overpass API returned HTTP ${res.statusCode}`));
        }
        try {
          resolve(JSON.parse(raw));
        } catch {
          reject(new Error('Invalid JSON from Overpass API'));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(timeoutMs, () => {
      req.destroy();
      reject(new Error('Overpass API request timed out'));
    });
    req.end();
  });
}

// ── Retry wrapper ────────────────────────────────────────────────────────────
/**
 * Calls httpsGet up to `maxAttempts` times, waiting `delayMs` between each.
 * Resolves with the first successful response; rejects with the last error.
 */
async function httpsGetWithRetry(url, timeoutMs = 10000, maxAttempts = 3, delayMs = 1000) {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await httpsGet(url, timeoutMs);
    } catch (err) {
      lastError = err;
      const isLast = attempt === maxAttempts;
      console.warn(
        `[mapService] Overpass attempt ${attempt}/${maxAttempts} failed: ${err.message}` +
        (isLast ? ' — no more retries.' : ` — retrying in ${delayMs}ms…`)
      );
      if (!isLast) {
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }
  throw lastError;
}

// ─── Overpass endpoints ───────────────────────────────────────────────────────
const OVERPASS_PRIMARY  = 'https://overpass-api.de/api/interpreter';
const OVERPASS_FALLBACK = 'https://overpass.kumi.systems/api/interpreter';

// ─── Main export ──────────────────────────────────────────────────────────────
/**
 * Fetch hospitals near (lat, lng) within `radius` metres from Overpass API.
 * Returns an array sorted by ascending distance (km).
 *
 * Resilience strategy:
 *   1. Try primary endpoint (overpass-api.de)  — up to 3 attempts, 1 s apart
 *   2. If all primary attempts fail, try fallback (overpass.kumi.systems) — up to 3 attempts
 *   3. Only throw to the caller if BOTH chains fail completely
 */
async function getNearbyHospitals({ lat, lng, radius = 5000 }) {
  // Overpass QL — hospitals (nodes + ways + relations) within radius
  const query = `
    [out:json][timeout:20];
    (
      node["amenity"="hospital"](around:${radius},${lat},${lng});
      way["amenity"="hospital"](around:${radius},${lat},${lng});
      relation["amenity"="hospital"](around:${radius},${lat},${lng});
    );
    out center tags;
  `.trim();

  const encoded = encodeURIComponent(query);

  // ── Try primary, then fallback ────────────────────────────────────────────
  let data;
  try {
    const primaryUrl = `${OVERPASS_PRIMARY}?data=${encoded}`;
    data = await httpsGetWithRetry(primaryUrl, 10000, 3, 1000);
    console.log('[mapService] Overpass primary succeeded.');
  } catch (primaryErr) {
    console.warn(`[mapService] Primary endpoint exhausted: ${primaryErr.message} — trying fallback…`);
    try {
      const fallbackUrl = `${OVERPASS_FALLBACK}?data=${encoded}`;
      data = await httpsGetWithRetry(fallbackUrl, 10000, 3, 1000);
      console.log('[mapService] Overpass fallback (kumi.systems) succeeded.');
    } catch (fallbackErr) {
      // Both chains failed — surface a clear error to the controller
      throw new Error(
        `All Overpass endpoints failed. Primary: ${primaryErr.message} | Fallback: ${fallbackErr.message}`
      );
    }
  }

  if (!data.elements || !Array.isArray(data.elements)) {
    return [];
  }

  const hospitals = data.elements
    .map((el) => {
      // ways/relations expose coordinates via `center`
      const elLat = el.lat ?? el.center?.lat;
      const elLng = el.lon ?? el.center?.lon;

      if (!elLat || !elLng) return null;

      const tags = el.tags || {};
      const name = tags.name || tags['name:en'] || 'Unnamed Hospital';

      // Build a readable address from available tags
      const addrParts = [
        tags['addr:housenumber'],
        tags['addr:street'],
        tags['addr:suburb'] || tags['addr:neighbourhood'],
        tags['addr:city'] || tags['addr:town'],
      ].filter(Boolean);
      const address = addrParts.length
        ? addrParts.join(', ')
        : tags['addr:full'] || null;

      return {
        id: el.id,
        name,
        lat: elLat,
        lng: elLng,
        address,
        phone: tags.phone || tags['contact:phone'] || null,
        website: tags.website || tags['contact:website'] || null,
        emergency: tags.emergency === 'yes' || tags['emergency'] === 'yes',
        distanceKm: +haversine(lat, lng, elLat, elLng).toFixed(2),
      };
    })
    .filter(Boolean);

  // Deduplicate by name+rounded-coords (ways and nodes can duplicate)
  const seen = new Set();
  const unique = hospitals.filter((h) => {
    const key = `${h.name}|${h.lat.toFixed(3)}|${h.lng.toFixed(3)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by distance ascending
  unique.sort((a, b) => a.distanceKm - b.distanceKm);

  return unique;
}

export { getNearbyHospitals };
