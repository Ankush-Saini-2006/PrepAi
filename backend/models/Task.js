const mongoose = require("mongoose");

const TASK_CATEGORIES = [
  "DSA",
  "Frontend",
  "Backend",
  "System Design",
  "Core Subjects",
  "SQL",
  "JavaScript",
  "Aptitude",
  "Resume",
  "Projects",
  "Company Preparation",
  "Revision",
  "Custom",
];

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studyPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudyPlan",
      default: null,
    },
    title: { type: String, required: true, trim: true, maxlength: 140 },
    description: { type: String, default: "", trim: true },
    category: {
      type: String,
      enum: TASK_CATEGORIES,
      default: "Custom",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Missed"],
      default: "Pending",
    },
    dueDate: { type: Date, required: true },
    completedAt: { type: Date, default: null },
    estimatedStudyMinutes: { type: Number, min: 0, default: 60 },
    actualStudyMinutes: { type: Number, min: 0, default: 0 },
    notes: { type: String, default: "", trim: true },
    reminderAt: { type: Date, default: null },
    recurring: {
      type: String,
      enum: ["None", "Daily", "Weekly", "Monthly"],
      default: "None",
    },
    company: { type: String, default: "", trim: true },
    careerGoal: { type: String, default: "", trim: true },
    source: {
      type: String,
      enum: ["Manual", "AI"],
      default: "Manual",
    },
  },
  { timestamps: true }
);

taskSchema.index({ user: 1, dueDate: 1, status: 1 });
taskSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model("Task", taskSchema);
module.exports.TASK_CATEGORIES = TASK_CATEGORIES;
