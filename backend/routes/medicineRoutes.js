// backend/routes/medicineRoutes.js
import express from 'express';
const router = express.Router();
import { getAllMedicines, getMedicineById } from '../controllers/medicineController.js';

// http://localhost:5000/api/medicines
router.get('/', getAllMedicines);

// http://localhost:5000/api/medicines/:id
router.get('/:id', getMedicineById);

export default router;