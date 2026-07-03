const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    dueDate: { type: Date, default: null },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  },
  { _id: false }
);

const studyPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    targetCompany: { type: String, default: "", trim: true },
    targetRole: { type: String, default: "", trim: true },
    currentSkills: [{ type: String }],
    availableHoursPerDay: { type: Number, min: 0, default: 2 },
    deadline: { type: Date, required: true },
    daysRemaining: { type: Number, min: 0, default: 0 },
    summary: { type: String, default: "", trim: true },
    dailyGoal: { type: String, default: "", trim: true },
    weeklyGoal: { type: String, default: "", trim: true },
    monthlyGoal: { type: String, default: "", trim: true },
    revisionPlan: [{ type: String }],
    milestones: [milestoneSchema],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    generatedByAI: { type: Boolean, default: true },
  },
  { timestamps: true }
);

studyPlanSchema.index({ user: 1, createdAt: -1 });
studyPlanSchema.index({ user: 1, deadline: 1 });

module.exports = mongoose.model("StudyPlan", studyPlanSchema);
