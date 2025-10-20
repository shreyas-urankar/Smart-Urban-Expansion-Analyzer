import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import dataRoutes from "./routes/dataRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
connectDB();

// Default route
app.get("/", (req, res) => {
  res.send("🚀 Urban Growth Backend is running successfully!");
});

// API Routes
app.use("/api/data", dataRoutes);

// Sample data endpoint for frontend testing
app.get("/api/sample-data", (req, res) => {
  const sampleCities = [
    { city: "Metropolis", population: "2,300,000", density: "4,500/km²", growth: "12.5%", pollutionLevel: "Medium" },
    { city: "Tech Valley", population: "1,800,000", density: "3,200/km²", growth: "18.2%", pollutionLevel: "Low" },
    { city: "Green Haven", population: "950,000", density: "2,100/km²", growth: "8.7%", pollutionLevel: "Low" },
    { city: "Industrial City", population: "3,100,000", density: "5,800/km²", growth: "5.3%", pollutionLevel: "High" },
    { city: "Coastal Bay", population: "1,200,000", density: "1,800/km²", growth: "15.8%", pollutionLevel: "Medium" },
    { city: "Mountain View", population: "680,000", density: "1,200/km²", growth: "22.1%", pollutionLevel: "Low" }
  ];
  res.json(sampleCities);
});

// AI prediction simulation
app.post("/api/predict", (req, res) => {
  const { username } = req.body;
  const predictionResult = Math.random() > 0.5 ? "Secure" : "Not Secure";

  res.json({
    message: "Prediction successful",
    username,
    output: predictionResult,
  });
});

app.listen(PORT, () => {
  console.log(`🌍 Server running on http://localhost:${PORT}`);
});
