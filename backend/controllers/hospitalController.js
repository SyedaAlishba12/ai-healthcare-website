const { getNearbyHospitals } = require('../services/mapService');

// GET /api/hospitals/nearby?lat=31.5&lng=74.3&radius=5000
const getNearbyHospitalsHandler = async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;

    // ── Presence validation ───────────────────────────────────────────────────
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Query params "lat" and "lng" are required.',
      });
    }

    // ── Type validation ───────────────────────────────────────────────────────
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      return res.status(400).json({
        success: false,
        message: '"lat" and "lng" must be valid numbers.',
      });
    }

    if (parsedLat < -90 || parsedLat > 90) {
      return res.status(400).json({
        success: false,
        message: '"lat" must be between -90 and 90.',
      });
    }

    if (parsedLng < -180 || parsedLng > 180) {
      return res.status(400).json({
        success: false,
        message: '"lng" must be between -180 and 180.',
      });
    }

    // ── Optional radius (default 5 km, cap at 25 km to avoid Overpass abuse) ─
    const parsedRadius = radius ? parseInt(radius, 10) : 5000;
    const safeRadius = isNaN(parsedRadius)
      ? 5000
      : Math.min(Math.max(parsedRadius, 500), 25000);

    // ── Call mapService ───────────────────────────────────────────────────────
    const hospitals = await getNearbyHospitals({
      lat: parsedLat,
      lng: parsedLng,
      radius: safeRadius,
    });

    return res.status(200).json({
      success: true,
      data: {
        count: hospitals.length,
        searchCenter: { lat: parsedLat, lng: parsedLng },
        radiusMeters: safeRadius,
        hospitals,
      },
    });
  } catch (error) {
    // Distinguish known error types for clearer client messages
    const isTimeout = error.message?.includes('timed out');
    const isNetworkErr = error.message?.includes('ENOTFOUND') || error.message?.includes('ECONNREFUSED');

    const message = isTimeout
      ? 'The map service timed out. Please try again in a moment.'
      : isNetworkErr
      ? 'Unable to reach the map service. Check your internet connection.'
      : 'Failed to fetch nearby hospitals. Please try again.';

    return res.status(502).json({
      success: false,
      message,
    });
  }
};

module.exports = { getNearbyHospitalsHandler };
