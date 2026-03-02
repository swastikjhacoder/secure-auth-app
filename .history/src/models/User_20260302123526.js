import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Number,
  },
  {
    strict: "throw", // Prevent unknown fields injection
    timestamps: true,
  },
);

export default mongoose.models.User || mongoose.model("User", userSchema);
