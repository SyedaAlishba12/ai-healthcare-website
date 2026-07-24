import mongoose from 'mongoose';

const labBookingSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LabTest',
      required: [true, 'Test ID is required'],
    },
    preferredDate: {
      type: Date,
      required: [true, 'Preferred date is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('LabBooking', labBookingSchema);
