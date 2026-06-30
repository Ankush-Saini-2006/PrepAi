const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    originalName: { type: String, required: true },
    extractedText: { type: String, default: "" },
    targetRole: { type: String, default: "" },
    atsScore: { type: Number, default: 0 },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    suggestions: [{ type: String }],
    missingKeywords: [{ type: String }],
    aiSummary: { type: String, default: "" },
    analyzedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
