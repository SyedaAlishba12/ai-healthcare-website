const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

// Connect to MongoDB before anything else
connectDB();

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json());

// ── Health routes ───────────────────────────────────────────────────────────
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

// ── Feature routes ──────────────────────────────────────────────────────────
const labRoutes = require("./routes/labRoutes");
app.use("/api/lab-tests", labRoutes);

// ── Start listening ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀  Healthcare server is running on http://localhost:${PORT}`);
});