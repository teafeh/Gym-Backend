import express from "express";
import {
  getPendingUsers,
  approveUser,
  rejectUser,
  getAllUsers,
} from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();


// --------------------------
// Admin routes
// --------------------------

// Get all users (for dashboard)
router.get("/users", protect, getAllUsers);

// Get all pending membership requests
router.get("/users/pending", getPendingUsers);

// Approve a pending user
router.patch("/users/:userId/approve", approveUser);

// Reject a pending user
router.patch("/users/:userId/reject", rejectUser);
router.get("/users/expiries", getMembershipExpiries);


export default router;
