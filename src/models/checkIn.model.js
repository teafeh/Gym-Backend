import mongoose from "mongoose";

const checkInSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gymId: {
      type: String,
      required: true,
    },
    checkInTime: {
      type: Date,
      default: Date.now,
    },
    status: {
        type: String,
        enum: ["success", "failed"], default: "success"
    },
    reason: {
        type: String
    },
  },
  { timestamps: true }
);

export default mongoose.model("CheckIn", checkInSchema);
