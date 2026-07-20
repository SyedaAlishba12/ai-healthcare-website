import express from 'express';
const router = express.Router();
import { getNearbyHospitalsHandler } from '../controllers/hospitalController.js';

// GET /api/hospitals/nearby?lat=&lng=&radius=
router.get('/nearby', getNearbyHospitalsHandler);

export default router;
