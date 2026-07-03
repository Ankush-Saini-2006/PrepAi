const mongoose = require("mongoose");

const codingAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    codingProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CodingProfile",
      required: true,
    },
    strongTopics: [{ type: String }],
    weakTopics: [{ type: String }],
    difficultyDistributionAnalysis: { type: String, default: "" },
    codingPattern: { type: String, default: "" },
    consistencyAnalysis: { type: String, default: "" },
    recommendedTopics: [{ type: String }],
    learningSuggestions: [{ type: String }],
    projectSuggestions: [{ type: String }],
    companyReadiness: { type: String, default: "" },
    interviewReadiness: { type: String, default: "" },
    placementReadinessScore: { type: Number, min: 0, max: 100, default: 0 },
    personalizedWeeklyRoadmap: [{ type: String }],
    monthlyRoadmap: [{ type: String }],
    analyzedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

codingAnalysisSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("CodingAnalysis", codingAnalysisSchema);
