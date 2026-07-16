const https = require('https');

const query = `[out:json][timeout:20];(node["amenity"="hospital"](around:5000,31.5497,74.3436););out center tags;`;
const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query);

console.log('Querying Overpass API...');
console.log('URL length:', url.length);

const req = https.get(url, (res) => {
  let raw = '';
  res.on('data', (c) => (raw += c));
  res.on('end', () => {
    console.log('\nHTTP Status:', res.statusCode);
    console.log('Content-Type:', res.headers['content-type']);
    console.log('Response length:', raw.length);
    console.log('First 800 chars:\n', raw.slice(0, 800));
    try {
      const parsed = JSON.parse(raw);
      console.log('\nParsed OK. elements count:', parsed.elements?.length ?? 'N/A');
    } catch (e) {
      console.log('\nJSON parse failed:', e.message);
    }
  });
});

req.on('error', (e) => console.error('Network error:', e.message, e.code));
req.setTimeout(20000, () => {
  req.destroy();
  console.error('Request timed out');
});
