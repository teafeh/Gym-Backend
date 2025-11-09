import User from "../models/user.model.js";

// =======================
// Get all pending users
// =======================
export const getPendingUsers = async (req, res) => {
  try {
    // Fetch users who are not active and not rejected
    const pendingUsers = await User.find({
      membershipActive: false,
      membershipRejected: false,
    }).select("-password"); // exclude password for safety

    res.status(200).json({ users: pendingUsers });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending users" });
  }
};

// =======================
// Approve a user
// =======================
export const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.membershipActive = true; // mark membership as active
    user.membershipRejected = false; // reset rejected if previously set
    user.membershipDueDate = new Date(); // set starting due date
    user.membershipExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // example: 30 days from now

    await user.save();

    res.status(200).json({ message: "User approved successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to approve user" });
  }
};

// =======================
// Reject a user
// =======================
export const rejectUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.membershipActive = false; // ensure not active
    user.membershipRejected = true; // mark as rejected
    user.membershipDueDate = null; // reset any dates if present
    user.membershipExpiresAt = null; // reset expiry

    await user.save();

    res.status(200).json({ message: "User rejected successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to reject user" });
  }
};

// =======================
// Optional: Get all users (for admin dashboard)
// =======================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude password
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};


// =======================
// Get all users' membership expiry dates
// =======================
export const getMembershipExpiries = async (req, res) => {
  try {
    // Fetch all users and select only the fields we care about
    const users = await User.find()
      .select("name email membershipExpiresAt membershipActive membershipRejected")
      .sort({ membershipExpiresAt: 1 }); // optional: sort by expiry date ascending

    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch membership expiries" });
  }
};


export const holdUserMembership = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.membershipActive = false;
    await user.save();

    res.status(200).json({ message: "User membership put on hold", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/admin/users/:userId/activate
export const activateUserMembership = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.membershipActive = true;
    await user.save();

    res.status(200).json({ message: "User membership activated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};