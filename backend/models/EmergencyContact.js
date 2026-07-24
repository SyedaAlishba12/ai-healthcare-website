import mongoose from "mongoose";
const emergencyContactSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["ambulance", "bloodbank", "hospital", "police"],
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    available24Hours: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model(
  "EmergencyContact",
  emergencyContactSchema
);