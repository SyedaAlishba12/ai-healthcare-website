import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const check = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to:", conn.connection.name);

    const admin = conn.connection.getClient().db().admin();
    const { databases } = await admin.listDatabases();

    console.log("\nDatabases visible on this cluster:");
    for (const db of databases) {
      console.log(`- ${db.name} (${(db.sizeOnDisk / 1024).toFixed(1)} KB)`);
    }

    console.log(`\nCollections inside "${conn.connection.name}":`);
    const collections = await conn.connection.db.listCollections().toArray();
    for (const col of collections) {
      const count = await conn.connection.db.collection(col.name).countDocuments();
      console.log(`- ${col.name}: ${count} documents`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Check failed:", error.message);
    process.exit(1);
  }
};

check();
