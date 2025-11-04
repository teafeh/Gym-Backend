import express from "express";
import { generateGymCheckInQR } from "../controllers/qr.controller.js";

const router = express.Router();

// Unprotected route (for gym to use at front desk)
router.get("/gym", generateGymCheckInQR);

export default router;
