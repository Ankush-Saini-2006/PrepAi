const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // SHA-256 hash of the actual refresh token (never store the raw token)
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },
    userAgent: { type: String, default: "" },
    ip: { type: String, default: "" },
    rememberMe: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
    revoked: { type: Boolean, default: false },
    replacedByTokenHash: { type: String, default: null },
  },
  { timestamps: true }
);

// Auto-purge expired documents at the DB level
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
