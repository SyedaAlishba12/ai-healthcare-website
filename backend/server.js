import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Healthcare API is running",
  });
});

// API health-check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Healthcare server is running on http://localhost:${PORT}`);
});