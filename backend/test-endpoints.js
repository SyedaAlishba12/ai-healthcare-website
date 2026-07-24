/**
 * test-endpoints.js
 * Run with: node test-endpoints.js
 * Requires the backend server to already be running on port 5000.
 */

const http = require('http');

// ── tiny http helper ──────────────────────────────────────────────────────────
function request(method, path, body) {
  return new Promise((resolve) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (e) => resolve({ status: 'ERR', body: e.message }));
    if (payload) req.write(payload);
    req.end();
  });
}

// ── test runner ───────────────────────────────────────────────────────────────
const PASS = '\x1b[32m✔ PASS\x1b[0m';
const FAIL = '\x1b[31m✖ FAIL\x1b[0m';

function check(label, result, expectedStatus, expectedSuccessValue) {
  const statusOk = result.status === expectedStatus;
  const successOk =
    expectedSuccessValue !== undefined
      ? result.body.success === expectedSuccessValue
      : true;

  const ok = statusOk && successOk;
  console.log(`\n${ok ? PASS : FAIL}  ${label}`);
  console.log(`   HTTP ${result.status}  (expected ${expectedStatus})`);
  console.log('   Body:', JSON.stringify(result.body, null, 2));
  return ok;
}

// ── IDs from seed ─────────────────────────────────────────────────────────────
const REAL_ID     = '6a56a785bf0138693107ebd4'; // Complete Blood Count
const FAKE_ID     = '6a56a785bf0138693107eb00'; // valid format, doesn't exist
const INVALID_ID  = 'abc123';                    // not a valid ObjectId at all
const FUTURE_DATE = '2026-08-15';
const PAST_DATE   = '2020-01-01';

(async () => {
  const results = [];

  // ── a: GET all tests ──────────────────────────────────────────────────────
  {
    const r = await request('GET', '/api/lab-tests');
    const ok = check('a — GET /api/lab-tests (all 3 tests)', r, 200, true);
    results.push(ok);
    if (ok) console.log(`   Tests returned: ${r.body.data.length}`);
  }

  // ── b: GET single test by real ID ─────────────────────────────────────────
  {
    const r = await request('GET', `/api/lab-tests/${REAL_ID}`);
    const ok = check(`b — GET /api/lab-tests/${REAL_ID} (CBC)`, r, 200, true);
    results.push(ok);
  }

  // ── c: POST book — all valid ───────────────────────────────────────────────
  {
    const r = await request('POST', '/api/lab-tests/book', {
      patientName: 'Sara Ahmed',
      email: 'sara@example.com',
      phone: '0300-1234567',
      testId: REAL_ID,
      preferredDate: FUTURE_DATE,
    });
    const ok = check('c — POST /api/lab-tests/book (valid)', r, 201, true);
    results.push(ok);
    if (ok) console.log(`   bookingId: ${r.body.data.bookingId}`);
  }

  // ── d: POST book — missing phone ───────────────────────────────────────────
  {
    const r = await request('POST', '/api/lab-tests/book', {
      patientName: 'Sara Ahmed',
      email: 'sara@example.com',
      // phone intentionally omitted
      testId: REAL_ID,
      preferredDate: FUTURE_DATE,
    });
    const ok = check('d — POST /api/lab-tests/book (missing phone)', r, 400, false);
    results.push(ok);
  }

  // ── e: POST book — past date ───────────────────────────────────────────────
  {
    const r = await request('POST', '/api/lab-tests/book', {
      patientName: 'Sara Ahmed',
      email: 'sara@example.com',
      phone: '0300-1234567',
      testId: REAL_ID,
      preferredDate: PAST_DATE,
    });
    const ok = check('e — POST /api/lab-tests/book (past date)', r, 400, false);
    results.push(ok);
  }

  // ── f: POST book — invalid ObjectId format ─────────────────────────────────
  {
    const r = await request('POST', '/api/lab-tests/book', {
      patientName: 'Sara Ahmed',
      email: 'sara@example.com',
      phone: '0300-1234567',
      testId: INVALID_ID,
      preferredDate: FUTURE_DATE,
    });
    const ok = check('f — POST /api/lab-tests/book (invalid ObjectId "abc123")', r, 400, false);
    results.push(ok);
  }

  // ── g: POST book — valid ObjectId but not in DB ────────────────────────────
  {
    const r = await request('POST', '/api/lab-tests/book', {
      patientName: 'Sara Ahmed',
      email: 'sara@example.com',
      phone: '0300-1234567',
      testId: FAKE_ID,
      preferredDate: FUTURE_DATE,
    });
    const ok = check('g — POST /api/lab-tests/book (non-existent ID)', r, 404, false);
    results.push(ok);
  }

  // ── summary ────────────────────────────────────────────────────────────────
  const passed = results.filter(Boolean).length;
  console.log(`\n${'─'.repeat(56)}`);
  console.log(`\x1b[1mResults: ${passed}/${results.length} tests passed\x1b[0m`);
  if (passed === results.length) {
    console.log('\x1b[32m🎉  All endpoint tests passed!\x1b[0m');
  } else {
    console.log('\x1b[31m⚠️   Some tests failed — see details above.\x1b[0m');
  }
  process.exit(passed === results.length ? 0 : 1);
})();
