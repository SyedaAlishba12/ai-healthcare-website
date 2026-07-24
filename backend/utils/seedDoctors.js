import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import Doctor from "../models/Doctor.js";

dotenv.config();

const specializations = [
  {
    name: "Cardiologist",
    qualifications: ["MBBS, FCPS (Cardiology)", "MBBS, MD (Cardiology)"],
    bio: "Specialist in heart health, hypertension, and cardiovascular care.",
  },
  {
    name: "Dermatologist",
    qualifications: ["MBBS, MD (Dermatology)", "MBBS, FCPS (Dermatology)"],
    bio: "Focused on skin, hair, and nail health, including cosmetic treatments.",
  },
  {
    name: "Pediatrician",
    qualifications: ["MBBS, FCPS (Pediatrics)", "MBBS, MD (Pediatrics)"],
    bio: "Dedicated to the health and development of infants, children, and adolescents.",
  },
  {
    name: "Orthopedic Surgeon",
    qualifications: ["MBBS, MS (Orthopedics)", "MBBS, FCPS (Orthopedic Surgery)"],
    bio: "Expert in bone, joint, and sports injury treatment and surgery.",
  },
  {
    name: "Neurologist",
    qualifications: ["MBBS, FCPS (Neurology)", "MBBS, MD (Neurology)"],
    bio: "Specialist in disorders of the brain, spine, and nervous system.",
  },
];

const firstNamesFemale = ["Ayesha", "Sana", "Hina", "Mahnoor", "Zara", "Areeba", "Komal", "Nimra", "Rabia", "Iqra"];
const firstNamesMale = ["Bilal", "Usman", "Omar", "Hamza", "Tariq", "Faisal", "Adeel", "Zain", "Kashif", "Danish"];
const lastNames = ["Khan", "Malik", "Raza", "Farooq", "Ahmed", "Siddiqui", "Butt", "Sheikh", "Chaudhry", "Iqbal"];

let maleImgIndex = 10;
let femaleImgIndex = 10;

const makeDoctor = (spec, i) => {
  const isFemale = i % 2 === 0;
  const firstName = isFemale
    ? firstNamesFemale[i % firstNamesFemale.length]
    : firstNamesMale[i % firstNamesMale.length];
  const lastName = lastNames[(i + specializations.findIndex((s) => s.name === spec.name)) % lastNames.length];

  const experience = 3 + Math.floor(Math.random() * 15);
  const rating = parseFloat((4 + Math.random()).toFixed(1));

  return {
    name: `Dr. ${firstName} ${lastName}`,
    specialization: spec.name,
    qualification: spec.qualifications[i % spec.qualifications.length],
    experience,
    rating,
    profileImage: isFemale
      ? `https://randomuser.me/api/portraits/women/${femaleImgIndex++}.jpg`
      : `https://randomuser.me/api/portraits/men/${maleImgIndex++}.jpg`,
    bio: spec.bio,
    availableDays: ["Monday", "Wednesday", "Friday"].slice(0, 2 + (i % 2)),
    availableTimeSlots: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"].slice(0, 2 + (i % 3)),
  };
};

const buildDoctors = () => {
  const doctors = [];
  specializations.forEach((spec) => {
    for (let i = 0; i < 8; i++) {
      doctors.push(makeDoctor(spec, i));
    }
  });
  doctors.push(makeDoctor(specializations[0], 8));
  doctors.push(makeDoctor(specializations[0], 9));
  return doctors;
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected for seeding");

    const deleted = await Doctor.deleteMany({});
    console.log(`Removed ${deleted.deletedCount} existing doctor(s)`);

    const doctors = buildDoctors();
    await Doctor.insertMany(doctors);
    console.log(`Inserted ${doctors.length} sample doctors`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seed();
