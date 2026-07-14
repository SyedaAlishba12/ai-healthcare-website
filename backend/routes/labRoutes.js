const express = require('express');
const router = express.Router();
const {
  getAllLabTests,
  getLabTestById,
  bookLabTest,
} = require('../controllers/labController');

// NOTE: Order matters — the /book route must come before /:id
// so that Express does not treat the literal string "book" as a MongoDB ObjectId.
router.post('/book', bookLabTest);
router.get('/', getAllLabTests);
router.get('/:id', getLabTestById);

module.exports = router;
