import User from "../models/user.model.js";
import CheckIn from "../models/checkIn.model.js";

export const verifyCheckIn = async (req, res) => {
  try {
    const { user } = req;
    const { gym_id } = req.query;

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check membership validity
    const isExpired =
      !user.membershipExpiresAt ||
      new Date(user.membershipExpiresAt) < new Date();
    const isInactive = !user.membershipActive;

    // Log all attempts
    await CheckIn.create({
      userId: user._id,
      gymId: gym_id || "DEFAULT_GYM",
      date: new Date(),
      status: isExpired || isInactive ? "failed" : "success",
      reason: isExpired
        ? "Membership expired"
        : isInactive
        ? "Membership inactive"
        : "Active",
    });

    if (isExpired || isInactive) {
      return res.status(200).json({
        success: false,
        message: "Membership expired or inactive",
        status: "red",
      });
    }

    // --- If active, handle streaks and visits ---
    const now = new Date();
    const today = now.toDateString();
    const lastCheckInDate = user.lastCheckIn
      ? new Date(user.lastCheckIn).toDateString()
      : null;

    let currentStreak = user.currentStreak || 0;
    let bestStreak = user.bestStreak || 0;

    if (lastCheckInDate !== today) {
      // Calculate streak
      if (lastCheckInDate) {
        const diffDays = Math.floor(
          (now - new Date(user.lastCheckIn)) / (1000 * 60 * 60 * 24)
        );
        if (diffDays === 1) {
          currentStreak += 1;
        } else {
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }

      if (currentStreak > bestStreak) bestStreak = currentStreak;

      // Update user stats
      user.totalVisits = (user.totalVisits || 0) + 1;
      user.currentStreak = currentStreak;
      user.bestStreak = bestStreak;
      user.lastCheckIn = now;
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      stats: {
        totalVisits: user.totalVisits,
        bestStreak: user.bestStreak,
        currentStreak: user.currentStreak,
        lastCheckIn: user.lastCheckIn,
      },
      status: "green",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
