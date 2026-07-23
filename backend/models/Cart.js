// backend/models/Cart.js
import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true, default: "guest_user_123" },
  items: [
    {
      medicineId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity should be 1 atleast'],
        default: 1
      }
    }
  ]
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;