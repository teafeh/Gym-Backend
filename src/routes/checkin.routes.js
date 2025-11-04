import express from "express";
import { verifyCheckIn } from "../controllers/checkin.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Verify membership on scan
router.get("/verify", protect, verifyCheckIn);

export default router;
