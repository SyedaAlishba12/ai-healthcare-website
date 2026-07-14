const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌  MONGODB_URI is not set in your .env file');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌  MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
