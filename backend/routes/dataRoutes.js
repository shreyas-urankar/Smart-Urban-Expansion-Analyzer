import express from "express";
import { saveData, getData, getUrbanAnalytics } from "../controllers/dataController.js";

const router = express.Router();

router.post("/", saveData);
router.get("/", getData);
router.get("/analytics", getUrbanAnalytics);

export default router;
