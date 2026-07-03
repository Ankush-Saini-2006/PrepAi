const mongoose = require("mongoose");

const resumeJobMatchSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    originalName: { type: String, required: true, trim: true },
    extractedText: { type: String, default: "" },
    jobDescription: { type: String, required: true, trim: true },
    matchScore: { type: Number, min: 0, max: 100, default: 0 },
    overallReadinessScore: { type: Number, min: 0, max: 100, default: 0 },
    atsCompatibilityScore: { type: Number, min: 0, max: 100, default: 0 },
    summary: { type: String, default: "" },
    matchingSkills: [{ type: String }],
    missingSkills: [{ type: String }],
    missingKeywords: [{ type: String }],
    weakAreas: [{ type: String }],
    improvementSuggestions: [{ type: String }],
    analyzedAt: { type: Date },
  },
  { timestamps: true }
);

resumeJobMatchSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("ResumeJobMatch", resumeJobMatchSchema);
