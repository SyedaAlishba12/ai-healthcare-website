// backend/models/Medicine.js
import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ['Tablets', 'Syrups', 'Inhalers', 'Vaccines'] },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  dosage: { type: String, required: true },
  warnings: { type: String },
  manufacturer: { type: String, default: 'Generic' },
  stock: { type: Boolean, default: true }
}, { timestamps: true });

const Medicine = mongoose.model('Medicine', medicineSchema);
export default Medicine;