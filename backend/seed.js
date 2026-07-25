/**
 * seed.js  –  Inserts sample lab tests into the `labtests` collection.
 *
 * Usage (from the backend/ directory):
 *   node seed.js
 *
 * Requires MONGODB_URI to be set in backend/.env
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LabTest from './models/LabTest.js';
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import LabTest from "./models/LabTest.js";

dotenv.config();

const SAMPLE_TESTS = [
  {
    name: "Complete Blood Count",
    category: "Blood Test",
    price: 800,
    description:
      "A comprehensive blood panel that evaluates overall health and detects disorders such as anaemia, infection, and many other diseases.",
  },
  {
    name: "Liver Function Test",
    category: "Blood Test",
    price: 1500,
    description:
      "Measures enzymes, proteins, and bilirubin in the blood to check how well the liver is functioning and to screen for liver disease.",
  },
  {
    name: "Kidney Function Test",
    category: "Blood Test",
    price: 1300,
    description:
      "Evaluates urea, creatinine, and electrolyte levels to assess how well the kidneys are filtering waste from the blood.",
  },
  {
    name: "Lipid Profile",
    category: "Blood Test",
    price: 1200,
    description:
      "Measures cholesterol and triglyceride levels in the blood to assess risk of heart disease and stroke.",
  },
  {
    name: "Blood Sugar (Fasting)",
    category: "Blood Test",
    price: 300,
    description:
      "Measures glucose levels after fasting to screen for or monitor diabetes and prediabetes.",
  },
  {
    name: "Chest X-Ray",
    category: "Imaging",
    price: 2000,
    description:
      "A standard radiographic image of the chest used to evaluate the lungs, heart, and chest wall for conditions such as pneumonia or heart failure.",
  },
  {
    name: "Abdominal Ultrasound",
    category: "Imaging",
    price: 3500,
    description:
      "Uses sound waves to create images of abdominal organs including the liver, gallbladder, kidneys, and pancreas.",
  },
  {
    name: "ECG (Electrocardiogram)",
    category: "Cardiac",
    price: 900,
    description:
      "Records the electrical activity of the heart to detect irregular heartbeats, heart attacks, and other cardiac conditions.",
  },
  {
    name: "Urine Routine Examination",
    category: "Urine Test",
    price: 400,
    description:
      "A basic screening test that checks the physical, chemical, and microscopic properties of urine to detect infections and other conditions.",
  },
  {
    name: "Thyroid Function Test",
    category: "Blood Test",
    price: 1400,
    description:
      "Measures TSH, T3, and T4 hormone levels to evaluate thyroid gland function and detect hypo/hyperthyroidism.",
  },
  {
    name: "HbA1c (Diabetes Screening)",
    category: "Blood Test",
    price: 1100,
    description:
      "Measures average blood sugar levels over the past 2-3 months, used to diagnose and monitor diabetes.",
  },
  {
    name: "Echocardiography",
    category: "Cardiac",
    price: 4000,
    description:
      "An ultrasound of the heart that evaluates heart structure, valve function, and pumping efficiency.",
  },
];

const seed = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌  MONGODB_URI is not set in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("✅  Connected to MongoDB");

    const deleted = await LabTest.deleteMany({});
    console.log(`🗑   Cleared ${deleted.deletedCount} existing lab test(s)`);

    const inserted = await LabTest.insertMany(SAMPLE_TESTS);
    console.log(`\n🌱  Seeded ${inserted.length} lab tests:\n`);
    inserted.forEach((t) => {
      console.log(`   ✔  [${t._id}]  ${t.name}  (${t.category})  –  Rs. ${t.price}`);
    });

    console.log("\n✅  Seeding complete.");
  } catch (err) {
    console.error("❌  Seeding failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌  Disconnected from MongoDB");
  }
};

seed();