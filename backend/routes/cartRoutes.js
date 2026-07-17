// backend/routes/cartRoutes.js
import express from 'express';
const router = express.Router();
import { getCart, addToCart, removeFromCart } from '../controllers/cartController.js';

// Retrieve current cart
router.get('/', getCart);

// Add item to cart
router.post('/add', addToCart);

// Remove specific item from cart by medicine ID
router.delete('/remove/:medicineId', removeFromCart);

export default router;