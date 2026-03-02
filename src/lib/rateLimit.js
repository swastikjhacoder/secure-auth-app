import { connectDB } from "@/lib/db";
import mongoose from "mongoose";

const rateLimitSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, index: true },
    count: { type: Number, default: 1 },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true },
);

rateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RateLimit =
  mongoose.models.RateLimit || mongoose.model("RateLimit", rateLimitSchema);

/**
 * Rate limiter
 * @param {Object} options
 * @param {string} options.key
 * @param {number} options.limit
 * @param {number} options.windowMs
 */

export async function rateLimit({ key, limit = 5, windowMs = 60000 }) {
  await connectDB();

  const now = new Date();
  const windowExpires = new Date(Date.now() + windowMs);

  let record = await RateLimit.findOne({ key });

  if (!record) {
    await RateLimit.create({
      key,
      count: 1,
      expiresAt: windowExpires,
    });
    return { success: true, remaining: limit - 1 };
  }

  if (record.expiresAt < now) {
    record.count = 1;
    record.expiresAt = windowExpires;
    await record.save();
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  record.count += 1;
  await record.save();

  return { success: true, remaining: limit - record.count };
}
