const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    resources: [{ type: String }],
    isCompleted: { type: Boolean, default: false },
    durationWeeks: { type: Number, default: 1 },
  },
  { _id: false }
);

const roadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetRole: { type: String, required: true },
    targetCompany: { type: String, default: "", trim: true },
    currentLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    milestones: [milestoneSchema],
    estimatedWeeks: { type: Number, default: 12 },
    progress: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Roadmap", roadmapSchema);
