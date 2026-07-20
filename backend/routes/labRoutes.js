import express from 'express';
const router = express.Router();
import {
  getAllLabTests,
  getLabTestById,
  bookLabTest,
} from '../controllers/labController.js';

// NOTE: Order matters — the /book route must come before /:id
// so that Express does not treat the literal string "book" as a MongoDB ObjectId.
router.post('/book', bookLabTest);
router.get('/', getAllLabTests);
router.get('/:id', getLabTestById);

export default router;
