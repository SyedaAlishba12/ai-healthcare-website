/**
 * seed.js  –  Inserts 3 sample lab tests into the `labtests` collection.
 *
 * Usage (from the backend/ directory):
 *   node seed.js
 *
 * Requires MONGODB_URI to be set in backend/.env
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const LabTest = require('./models/LabTest');

dotenv.config();

const SAMPLE_TESTS = [
  {
    name: 'Complete Blood Count',
    category: 'Blood Test',
    price: 800,
    description:
      'A comprehensive blood panel that evaluates overall health and detects disorders such as anaemia, infection, and many other diseases.',
  },
  {
    name: 'Liver Function Test',
    category: 'Blood Test',
    price: 1500,
    description:
      'Measures enzymes, proteins, and bilirubin in the blood to check how well the liver is functioning and to screen for liver disease.',
  },
  {
    name: 'Chest X-Ray',
    category: 'Imaging',
    price: 2000,
    description:
      'A standard radiographic image of the chest used to evaluate the lungs, heart, and chest wall for conditions such as pneumonia or heart failure.',
  },
];

const seed = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌  MONGODB_URI is not set in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('✅  Connected to MongoDB');

    // Clear existing lab tests to avoid duplicates on re-runs
    const deleted = await LabTest.deleteMany({});
    console.log(`🗑   Cleared ${deleted.deletedCount} existing lab test(s)`);

    // Insert sample data
    const inserted = await LabTest.insertMany(SAMPLE_TESTS);
    console.log(`\n🌱  Seeded ${inserted.length} lab tests:\n`);
    inserted.forEach((t) => {
      console.log(`   ✔  [${t._id}]  ${t.name}  (${t.category})  –  Rs. ${t.price}`);
    });

    console.log('\n✅  Seeding complete.');
  } catch (err) {
    console.error('❌  Seeding failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌  Disconnected from MongoDB');
  }
};

seed();
