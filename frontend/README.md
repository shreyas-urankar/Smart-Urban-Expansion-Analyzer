# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

















config:db.js:
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;

controllers:
dataControllers.js
import Data from "../models/dataModel.js";

// ✅ Save data to MongoDB
export const saveData = async (req, res) => {
  try {
    const {
      username,
      analysisResult,
      pollutionLevel,
      city,
      population,
      density,
      growth,
      urbanData,
    } = req.body;

    const newData = new Data({
      username,
      analysisResult,
      pollutionLevel: pollutionLevel || "Medium",
      city: city || "Unknown City",
      population,
      density,
      growth,
      urbanData,
      createdAt: new Date(),
    });

    await newData.save();
    res.status(201).json({
      message: "✅ Data saved successfully!",
      data: newData,
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Error saving data",
      error: error.message,
    });
  }
};

// ✅ Retrieve all stored data
export const getData = async (req, res) => {
  try {
    const data = await Data.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "✅ Data fetched successfully!",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Error retrieving data",
      error: error.message,
    });
  }
};

// ✅ Get basic analytics (optional summary)
export const getUrbanAnalytics = async (req, res) => {
  try {
    const analytics = await Data.aggregate([
      {
        $group: {
          _id: "$city",
          totalRecords: { $sum: 1 },
          avgPollution: {
            $avg: {
              $switch: {
                branches: [
                  { case: { $eq: ["$pollutionLevel", "Low"] }, then: 1 },
                  { case: { $eq: ["$pollutionLevel", "Medium"] }, then: 2 },
                  { case: { $eq: ["$pollutionLevel", "High"] }, then: 3 },
                ],
                default: 2,
              },
            },
          },
        },
      },
    ]);

    res.status(200).json({
      message: "✅ Urban analytics generated!",
      analytics,
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Error generating analytics",
      error: error.message,
    });
  }
};

userControllers.js;
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Register User
export const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("📝 Registration attempt for username:", username);

    // Validation
    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required" 
      });
    }

    // Check for existing user (case-insensitive)
    const existingUser = await User.findOne({
      username: { $regex: new RegExp("^" + username + "$", "i") }
    });

    console.log("🔍 Existing user check result:", existingUser);

    if (existingUser) {
      console.log("❌ User already exists in database");
      return res.status(400).json({ 
        success: false,
        message: "Username already exists. Please choose a different username.",
        debug: {
          requestedUsername: username,
          existingUsername: existingUser.username
        }
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      username,
      password: hashedPassword
    });

    console.log("✅ New user created:", newUser.username);

    // Generate token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    res.status(201).json({
      success: true, // ✅ Added this
      message: "User registered successfully",
      user: { id: newUser._id, username: newUser.username },
      token
    });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error registering user", 
      error: error.message 
    });
  }
};

// ✅ Login User
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ 
        success: false,
        message: "All fields are required" 
      });

    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ 
        success: false,
        message: "User not found" 
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ 
        success: false,
        message: "Invalid credentials" 
      });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    res.json({
      success: true, // ✅ Added this
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username }
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Login error", 
      error: error.message 
    });
  }
};

middleware:authMiddleware.js:
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "❌ Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // ✅ continue to controller
  } catch (error) {
    res.status(403).json({ message: "❌ Invalid or expired token." });
  }
};

models:dataModel.js:import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  username: { type: String, required: true },
  analysisResult: { type: String, required: true },
  pollutionLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  city: { type: String, required: true },
  population: { type: String },
  density: { type: String },
  growth: { type: String },
  urbanData: {
    greenSpaces: { type: Number },
    trafficIndex: { type: Number },
    housingIndex: { type: Number },
    employmentRate: { type: Number }
  },
  createdAt: { type: Date, default: Date.now }
});

const Data = mongoose.model("Data", dataSchema);
export default Data;
userModels.js:
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.model("User", userSchema);


routes:
dataRoutes:
import express from "express";
import {
  saveData,
  getData,
  getUrbanAnalytics
} from "../controllers/dataController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Protected routes (accessible only with valid JWT token)
router.post("/", verifyToken, saveData);
router.get("/", verifyToken, getData);
router.get("/analytics", verifyToken, getUrbanAnalytics);

export default router;

userRoutes.js:
import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;

server.js:
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import dataRoutes from "./routes/dataRoutes.js";
import userRoutes from "./routes/userRoutes.js";

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
app.use("/api/users", userRoutes);

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
.env:
PORT=5000
MONGO_URI=mongodb+srv://shreyas:Shreyas%40123@cluster0.eqazw.mongodb.net/urban_growth_db
JWT_SECRET=mysecretkey
Would you like me to also show you the updated Node.js backend code for /api/register, /api/login, and JWT middleware (to ensure it matches perfectly with this frontend)?