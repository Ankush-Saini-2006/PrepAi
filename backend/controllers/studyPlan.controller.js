const asyncHandler = require("express-async-handler");
const StudyPlan = require("../models/StudyPlan");
const Task = require("../models/Task");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { generateJSON, generateStudyPlanPrompt } = require("../services/geminiService");

const normalizeList = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);
const validCategories = new Set([
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
]);
const validPriorities = new Set(["Low", "Medium", "High", "Critical"]);
const validRecurring = new Set(["None", "Daily", "Weekly", "Monthly"]);

const normalizeDate = (value, fallback) => {
  const date = value ? new Date(value) : new Date(fallback);
  return Number.isNaN(date.getTime()) ? fallback : date;
};

const normalizeNullableDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const daysBetween = (deadline) => {
  const end = new Date(deadline);
  const now = new Date();
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));
};

const generateStudyPlan = asyncHandler(async (req, res) => {
  const { targetCompany, targetRole, currentSkills, availableHoursPerDay, deadline, careerGoal } = req.body;
  if (!deadline) throw new ApiError(400, "Deadline is required");

  const prompt = generateStudyPlanPrompt({
    targetCompany,
    targetRole,
    currentSkills: normalizeList(currentSkills),
    availableHoursPerDay,
    deadline,
    careerGoal,
  });
  const result = await generateJSON(prompt);

  const plan = await StudyPlan.create({
    user: req.user._id,
    title: result.title || `${targetCompany || targetRole || "Placement"} Preparation Plan`,
    targetCompany,
    targetRole,
    currentSkills: normalizeList(currentSkills),
    availableHoursPerDay: Number(availableHoursPerDay) || 2,
    deadline,
    daysRemaining: daysBetween(deadline),
    summary: result.summary || "",
    dailyGoal: result.dailyGoal || "",
    weeklyGoal: result.weeklyGoal || "",
    monthlyGoal: result.monthlyGoal || "",
    revisionPlan: normalizeList(result.revisionPlan),
    milestones: normalizeList(result.weeklyMilestones).map((milestone) => ({
      title: milestone.title || "Milestone",
      description: milestone.description || "",
      dueDate: milestone.dueDate || null,
      tasks: [],
    })),
  });

  const tasks = await Task.insertMany(
    normalizeList(result.tasks).map((task) => ({
      user: req.user._id,
      studyPlan: plan._id,
      title: task.title || "Preparation task",
      description: task.description || "",
      category: validCategories.has(task.category) ? task.category : "Custom",
      priority: validPriorities.has(task.priority) ? task.priority : "Medium",
      status: "Pending",
      dueDate: normalizeDate(task.dueDate, deadline),
      estimatedStudyMinutes: Number(task.estimatedStudyMinutes) || 60,
      notes: task.notes || "",
      reminderAt: normalizeNullableDate(task.reminderAt),
      recurring: validRecurring.has(task.recurring) ? task.recurring : "None",
      company: targetCompany || "",
      careerGoal: careerGoal || targetRole || "",
      source: "AI",
    }))
  );

  plan.tasks = tasks.map((task) => task._id);
  await plan.save();

  res.status(201).json(new ApiResponse(201, { plan, tasks }, "AI study plan generated successfully"));
});

const getStudyPlans = asyncHandler(async (req, res) => {
  const plans = await StudyPlan.find({ user: req.user._id }).populate("tasks").sort("-createdAt");
  res.status(200).json(new ApiResponse(200, { plans }));
});

const getStudyPlanById = asyncHandler(async (req, res) => {
  const plan = await StudyPlan.findOne({ _id: req.params.id, user: req.user._id }).populate("tasks");
  if (!plan) throw new ApiError(404, "Study plan not found");
  res.status(200).json(new ApiResponse(200, { plan }));
});

const deleteStudyPlan = asyncHandler(async (req, res) => {
  const plan = await StudyPlan.findOne({ _id: req.params.id, user: req.user._id });
  if (!plan) throw new ApiError(404, "Study plan not found");
  await Task.deleteMany({ user: req.user._id, studyPlan: plan._id });
  await plan.deleteOne();
  res.status(200).json(new ApiResponse(200, null, "Study plan deleted successfully"));
});

module.exports = {
  generateStudyPlan,
  getStudyPlans,
  getStudyPlanById,
  deleteStudyPlan,
};
