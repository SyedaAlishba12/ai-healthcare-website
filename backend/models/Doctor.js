const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
    },
    experience: {
      type: Number, // years of experience
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    profileImage: {
      type: String, // image URL
    },
    bio: {
      type: String,
    },
    availableDays: {
      type: [String], // e.g. ["Monday", "Wednesday", "Friday"]
      default: [],
    },
    availableTimeSlots: {
      type: [String], // e.g. ["10:00 AM", "2:00 PM"]
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);