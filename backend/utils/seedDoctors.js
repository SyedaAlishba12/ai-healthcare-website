// One-time script to populate the shared database with sample doctors.
// Run with: node utils/seedDoctors.js
// Safe to run once — running it again will add duplicate entries,
// so check the DB first if unsure.

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Doctor = require("../models/Doctor");

dotenv.config();

const sampleDoctors = [
  {
    name: "Dr. Ayesha Khan",
    specialization: "Cardiologist",
    qualification: "MBBS, FCPS (Cardiology)",
    experience: 8,
    rating: 4.8,
    profileImage: "https://randomuser.me/api/portraits/women/68.jpg",
    bio: "Specialist in heart health with 8 years of clinical experience.",
    availableDays: ["Monday", "Wednesday", "Friday"],
    availableTimeSlots: ["10:00 AM", "11:00 AM", "2:00 PM"],
  },
  {
    name: "Dr. Bilal Ahmed",
    specialization: "Dermatologist",
    qualification: "MBBS, MD (Dermatology)",
    experience: 5,
    rating: 4.6,
    profileImage: "https://randomuser.me/api/portraits/men/45.jpg",
    bio: "Focused on skin health and cosmetic dermatology.",
    availableDays: ["Tuesday", "Thursday"],
    availableTimeSlots: ["9:00 AM", "12:00 PM", "3:00 PM"],
  },
  {
    name: "Dr. Sana Malik",
    specialization: "Pediatrician",
    qualification: "MBBS, FCPS (Pediatrics)",
    experience: 10,
    rating: 4.9,
    profileImage: "https://randomuser.me/api/portraits/women/22.jpg",
    bio: "Dedicated pediatric care for infants, children, and adolescents.",
    availableDays: ["Monday", "Tuesday", "Thursday"],
    availableTimeSlots: ["10:00 AM", "1:00 PM"],
  },
  {
    name: "Dr. Usman Tariq",
    specialization: "Orthopedic Surgeon",
    qualification: "MBBS, MS (Orthopedics)",
    experience: 12,
    rating: 4.7,
    profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Expert in joint replacement and sports injury treatment.",
    availableDays: ["Wednesday", "Friday"],
    availableTimeSlots: ["11:00 AM", "2:00 PM", "4:00 PM"],
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected for seeding");

    await Doctor.insertMany(sampleDoctors);
    console.log(`Inserted ${sampleDoctors.length} sample doctors`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seed();
