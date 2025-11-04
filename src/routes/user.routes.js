import express from "express";
import { protect } from "../middleware/auth.middleware.js";

import {
  registerUser,
  loginUser,
  getDashboard,
  uploadProfilePhoto,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/profile-photo", protect, uploadProfilePhoto);
router.get("/dashboard", protect, getDashboard);

export default router;
