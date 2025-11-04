import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }, // <-- new field
    profileImage: { type: String, default: "" },

    // --- Membership Info ---
    membershipDueDate: { type: Date, default: null },
    outstandingBalance: { type: Number, default: 0 },
    memberSince: {
      type: String, // or Number if you prefer
      default: () => new Date().getFullYear().toString(), // e.g. "2025"
    },
    // --- Check-in Summary ---
    totalVisits: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    lastCheckIn: { type: Date, default: null },
    visitsByYear: { type: Map, of: Number, default: {} },
    membershipActive: { type: Boolean, default: false },
    membershipExpiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
