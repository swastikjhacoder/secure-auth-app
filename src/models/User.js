import mongoose from "mongoose";

const credentialSchema = new mongoose.Schema(
  {
    credentialID: {
      type: Buffer,
      required: true,
    },
    publicKey: {
      type: Buffer,
      required: true,
    },
    counter: {
      type: Number,
      required: true,
    },
    transports: {
      type: [String],
      default: [],
    },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    credentials: {
      type: [credentialSchema],
      default: [],
    },

    currentChallenge: {
      type: String,
    },
  },
  {
    strict: "throw",
    timestamps: true,
  },
);

export default mongoose.models.User || mongoose.model("User", userSchema);
