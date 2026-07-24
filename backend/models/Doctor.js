import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    qualification: { type: String },
    experience: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    profileImage: { type: String },
    bio: { type: String },
    availableDays: { type: [String], default: [] },
    availableTimeSlots: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);
