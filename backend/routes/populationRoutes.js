import express from "express";
import {
  savePopulation,
  getPopulationByCity,
  predictPopulation,
  getPopulationStats,
  getAllCities,
  seedPopulationData
} from "../controllers/populationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/cities", getAllCities);
router.get("/:city", getPopulationByCity);
router.get("/:city/stats", getPopulationStats);
router.get("/:city/predict", predictPopulation);

// Protected routes (require authentication)
router.post("/", verifyToken, savePopulation);
router.post("/seed/pune", verifyToken, seedPopulationData);

export default router;