// backend/models/Order.js
import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
  name: { type: String, required: true },
  category: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  quantity: { type: Number, required: true, min: 1 }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true, default: 'guest_user_123' },
  items: [orderItemSchema],
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  paymentMethod: { type: String, required: true, enum: ['cash_on_delivery', 'card_demo'] },
  subtotal: { type: Number, required: true },
  deliveryCharges: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;