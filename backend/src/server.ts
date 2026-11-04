
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import { prisma } from "./lib/prisma";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to SafeDeal X Backend!",
    status: "Server is running"
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "SafeDeal X API is healthy",
    timestamp: new Date().toISOString()
  });
});

// Database check
app.get("/api/db-check", async (req, res) => {
  try {
    const userCount = await prisma.user.count();

    res.json({
      success: true,
      message: "Database connected successfully!",
      totalUsers: userCount
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Database connection failed"
    });
  }
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`SafeDeal X backend running on http://localhost:${PORT}`);
});
