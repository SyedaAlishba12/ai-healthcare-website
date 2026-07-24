/**
 * test-hospitals.js
 * Run: node test-hospitals.js  (backend must be running on :5000)
 */
const http = require('http');

function request(path) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:5000${path}`, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', (e) => resolve({ status: 'ERR', body: e.message }));
  });
}

const PASS = '\x1b[32m✔ PASS\x1b[0m';
const FAIL = '\x1b[31m✖ FAIL\x1b[0m';

function check(label, result, expectedStatus, expectedSuccess) {
  const ok =
    result.status === expectedStatus &&
    (expectedSuccess === undefined || result.body.success === expectedSuccess);
  console.log(`\n${ok ? PASS : FAIL}  ${label}`);
  console.log(`   HTTP ${result.status}  (expected ${expectedStatus})`);
  console.log('   Body:', JSON.stringify(result.body, null, 2));
  return ok;
}

(async () => {
  const results = [];

  // ── MAIN: Lahore hospitals ─────────────────────────────────────────────────
  console.log('\n\x1b[36m=== MAIN: GET /api/hospitals/nearby (Lahore) ===\x1b[0m');
  {
    const r = await request('/api/hospitals/nearby?lat=31.5497&lng=74.3436&radius=5000');
    const ok = check('Lahore nearby hospitals (5 km radius)', r, 200, true);
    results.push(ok);
    if (ok && r.body.data) {
      const h = r.body.data;
      console.log(`   Count: ${h.count}, radius: ${h.radiusMeters}m`);
      if (h.hospitals.length > 0) {
        console.log('   First 3 results (sorted by distance):');
        h.hospitals.slice(0, 3).forEach((hosp, i) => {
          console.log(`     ${i + 1}. ${hosp.name} — ${hosp.distanceKm} km`);
        });
        // Verify sorted ascending
        const sorted = h.hospitals.every((h, i, arr) =>
          i === 0 || arr[i - 1].distanceKm <= h.distanceKm
        );
        console.log(`   Sorted ascending: ${sorted ? '\x1b[32mYES\x1b[0m' : '\x1b[31mNO\x1b[0m'}`);
      }
    }
  }

  // ── a: missing lat/lng ─────────────────────────────────────────────────────
  console.log('\n\x1b[36m=== TEST a: missing lat/lng ===\x1b[0m');
  {
    const r = await request('/api/hospitals/nearby');
    results.push(check('Missing lat/lng → 400', r, 400, false));
  }

  // ── b: invalid lat range ───────────────────────────────────────────────────
  console.log('\n\x1b[36m=== TEST b: lat=999 (out of range) ===\x1b[0m');
  {
    const r = await request('/api/hospitals/nearby?lat=999&lng=74.3436');
    results.push(check('lat=999 → 400', r, 400, false));
  }

  // ── c: non-numeric lat ─────────────────────────────────────────────────────
  console.log('\n\x1b[36m=== TEST c: lat=abc ===\x1b[0m');
  {
    const r = await request('/api/hospitals/nearby?lat=abc&lng=74.3436');
    results.push(check('lat=abc → 400', r, 400, false));
  }

  // ── d: radius=50000 (over 25km cap) ───────────────────────────────────────
  console.log('\n\x1b[36m=== TEST d: radius=50000 (cap check) ===\x1b[0m');
  {
    const r = await request('/api/hospitals/nearby?lat=31.5497&lng=74.3436&radius=50000');
    const ok = check('radius=50000 → clamped to 25000', r, 200, true);
    results.push(ok);
    if (ok) {
      const actual = r.body.data?.radiusMeters;
      const clamped = actual === 25000;
      console.log(`   radiusMeters returned: ${actual}  →  clamped: ${clamped ? '\x1b[32mYES (25000)\x1b[0m' : '\x1b[31mNO\x1b[0m'}`);
    }
  }

  // ── summary ────────────────────────────────────────────────────────────────
  const passed = results.filter(Boolean).length;
  console.log(`\n${'─'.repeat(56)}`);
  console.log(`\x1b[1mResults: ${passed}/${results.length} tests passed\x1b[0m`);
  console.log(passed === results.length ? '\x1b[32m🎉  All passed!\x1b[0m' : '\x1b[31m⚠️  Some failed\x1b[0m');
  process.exit(passed === results.length ? 0 : 1);
})();
