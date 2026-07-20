import mongoose from 'mongoose';

const labTestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Test name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('LabTest', labTestSchema);
