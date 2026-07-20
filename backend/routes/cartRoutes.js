import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';

const router = express.Router();

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update/:medicineId', updateCartItem);
router.delete('/remove/:medicineId', removeFromCart);
router.delete('/clear', clearCart);

export default router;