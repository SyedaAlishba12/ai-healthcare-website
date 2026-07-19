import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import cors from 'cors';
import connectDB from './config/db.js'; 
import medicineRoutes from './routes/medicineRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

dotenv.config();

// Connect to Cloud Database
connectDB(); 

const app = express();

// ==========================================
// 1. GLOBAL MIDDLEWARES 
// ==========================================
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
app.use(express.json()); 

// ==========================================
// 2. API ROUTES
// ==========================================
app.use('/api/medicines', medicineRoutes); 
app.use('/api/cart', cartRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Healthcare API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Healthcare server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });
