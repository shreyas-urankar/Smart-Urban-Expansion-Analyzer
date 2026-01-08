import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Import database connection
import connectDB from "./config/db.js";

// Import routes
import dataRoutes from "./routes/dataRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import populationRoutes from "./routes/populationRoutes.js";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8501', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Simple request logging
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
  next();
});

// Connect to database
connectDB();

// API Routes
app.use("/api/data", dataRoutes);
app.use("/api/users", userRoutes);
app.use("/api/population", populationRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Urban Growth Backend is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: "1.0.0"
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Urban Growth Backend API",
    version: "1.0.0",
    endpoints: {
      users: {
        register: "POST /api/users/register",
        login: "POST /api/users/login"
      },
      population: {
        get: "GET /api/population/:city",
        stats: "GET /api/population/:city/stats",
        predict: "GET /api/population/:city/predict?targetYear=YYYY",
        cities: "GET /api/population/cities"
      },
      data: {
        save: "POST /api/data",
        get: "GET /api/data"
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`
🌍 ==============================================
🚀 Urban Growth Backend Server Started!
📊 Port: ${PORT}
⏰ Time: ${new Date().toLocaleString()}
🔗 Local: http://localhost:${PORT}
🔗 Health: http://localhost:${PORT}/health
🌍 ==============================================
  `);
});

// Graceful shutdown
const shutdown = () => {
  console.log("\n🔴 Shutting down server...");
  server.close(() => {
    console.log("✅ Server closed successfully");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("❌ Force shutdown");
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default app;