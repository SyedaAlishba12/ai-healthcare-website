import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Import all route modules
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import emergencyRoutes from "./routes/emergencyRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import medicineRoutes from "./routes/medicineRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import labRoutes from "./routes/labRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

// Connect Database
connectDB();

const app = express();

// ==========================================
// 1. GLOBAL MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// 2. HEALTH ROUTES
// ==========================================

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

// ==========================================
// 3. API ROUTES
// ==========================================

app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/lab-tests", labRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/chat", chatRoutes);

// ==========================================
// 4. 404 HANDLER
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ==========================================
// 5. START SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Healthcare server is running on http://localhost:${PORT}`);
});