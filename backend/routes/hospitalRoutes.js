const express = require('express');
const router = express.Router();
const { getNearbyHospitalsHandler } = require('../controllers/hospitalController');

// GET /api/hospitals/nearby?lat=&lng=&radius=
router.get('/nearby', getNearbyHospitalsHandler);

module.exports = router;
