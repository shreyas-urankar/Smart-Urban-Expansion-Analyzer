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
