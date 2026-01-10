import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getEnvironmentData,
  saveEnvironmentData,
  getEnvironmentAnalytics,
  getCityComparison
} from "../controllers/environmentController.js";

const router = express.Router();

// Protected routes
router.get("/", verifyToken, getEnvironmentData);
router.post("/", verifyToken, saveEnvironmentData);
router.get("/analytics", verifyToken, getEnvironmentAnalytics);
router.get("/compare", verifyToken, getCityComparison);

export default router;