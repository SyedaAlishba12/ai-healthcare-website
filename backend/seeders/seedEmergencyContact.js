import mongoose from "mongoose";
import dotenv from "dotenv";

import connectDB from "../config/db.js";
import EmergencyContact from "../models/EmergencyContact.js";

dotenv.config();

// Connect Database
connectDB();

const emergencyContacts = [
  {
    type: "ambulance",
    name: "Edhi Ambulance",
    phone: "115",
    address: "Hyderabad",
    description: "24/7 Emergency Ambulance Service",
    available24Hours: true,
  },
  {
    type: "hospital",
    name: "Liaquat University Hospital",
    phone: "0229213300",
    address: "Hyderabad",
    description: "Government Teaching Hospital",
    available24Hours: true,
  },
  {
    type: "bloodbank",
    name: "Fatimid Blood Center",
    phone: "021111112222",
    address: "Hyderabad",
    description: "Blood Donation & Blood Bank",
    available24Hours: false,
  },
  {
    type: "police",
    name: "Rescue Police",
    phone: "15",
    address: "Hyderabad",
    description: "Emergency Police Service",
    available24Hours: true,
  },
];

const importData = async () => {
  try {
    // Remove existing records
    await EmergencyContact.deleteMany();

    // Insert fresh records
    await EmergencyContact.insertMany(emergencyContacts);

    console.log(" Emergency contacts seeded successfully.");

    process.exit();
  } catch (error) {
    console.error("❌ Seeder Error:", error);
    process.exit(1);
  }
};

importData();