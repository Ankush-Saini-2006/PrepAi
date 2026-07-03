const mongoose = require("mongoose");

const taskProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
    tasksCompleted: { type: Number, min: 0, default: 0 },
    tasksMissed: { type: Number, min: 0, default: 0 },
    hoursStudied: { type: Number, min: 0, default: 0 },
    completionPercentage: { type: Number, min: 0, max: 100, default: 0 },
    averageCompletionMinutes: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true }
);

taskProgressSchema.index({ user: 1, date: -1 }, { unique: true });

module.exports = mongoose.model("TaskProgress", taskProgressSchema);
