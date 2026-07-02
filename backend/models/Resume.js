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
    atsScore: { type: Number, default: null },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    suggestions: [{ type: String }],
    missingKeywords: [{ type: String }],
    aiSummary: { type: String, default: "" },
    grammarAnalysis: [
      {
        issue: { type: String, default: "" },
        suggestion: { type: String, default: "" },
      },
    ],
    keywordOptimization: [
      {
        keyword: { type: String, default: "" },
        reason: { type: String, default: "" },
      },
    ],
    skills: [{ type: String }],
    missingSkills: [{ type: String }],
    rewriteSuggestions: [
      {
        section: { type: String, default: "" },
        original: { type: String, default: "" },
        improved: { type: String, default: "" },
      },
    ],
    projectSuggestions: [
      {
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        skills: [{ type: String }],
      },
    ],
    improvedResumeText: { type: String, default: "" },
    analyzedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
