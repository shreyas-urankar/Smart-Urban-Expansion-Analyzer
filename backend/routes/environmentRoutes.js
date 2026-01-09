import express from "express";
import { 
  getEnvironmentData, 
  getAQIPrediction,
  getHistoricalTrends 
} from "../controllers/environmentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected (require authentication)
router.get("/", verifyToken, getEnvironmentData);
router.get("/predict", verifyToken, getAQIPrediction);
router.get("/history", verifyToken, getHistoricalTrends);

export default router;