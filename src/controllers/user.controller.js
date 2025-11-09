import User from "../models/user.model.js";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      // token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      membershipActive,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      success: true,
      user: {
        name: user.name,
        photo: user.profileImage,
        email: user.email,
        memberSince: user.memberSince,
        membershipDueDate: user.membershipExpiresAt,
        outstandingBalance: user.outstandingBalance,
        checkins: {
          totalVisits: user.totalVisits,
          bestStreak: user.bestStreak,
          currentStreak: user.currentStreak,
          visitsByYear: user.visitsByYear,
          lastCheckIn: user.lastCheckIn,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch dashboard" });
  }
};

export const uploadProfilePhoto = async (req, res) => {
  try {
    const { profileImage } = req.body;
    console.log("req.body:", req.body);

    if (!profileImage) {
      return res
        .status(400)
        .json({ success: false, message: "No image provided" });
    }

    const userId = req.user?._id; // from auth middleware
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // decode Base64 image
    const base64Data = profileImage.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const fileName = `${userId}_${Date.now()}.jpg`;
    const uploadDir = path.join(process.cwd(), "uploads", "users");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    // update user profile image path
    const relativePath = `/uploads/users/${fileName}`;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: relativePath },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error uploading profile photo:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
