const asyncHandler = require("express-async-handler");
const Roadmap = require("../models/Roadmap");
const CompanyTarget = require("../models/CompanyTarget");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { generateJSON, generateRoadmapPrompt } = require("../services/geminiService");

// @desc    Generate an AI-powered career roadmap
// @route   POST /api/roadmaps/generate
const generateRoadmap = asyncHandler(async (req, res) => {
  const { targetRole, currentLevel, skills } = req.body;
  const target = await CompanyTarget.findOne({ user: req.user._id }).lean();

  const roleContext = target?.companyName ? `${targetRole} at ${target.companyName}` : targetRole;
  const prompt = generateRoadmapPrompt(roleContext, currentLevel, skills || []);
  const result = await generateJSON(prompt);

  const roadmap = await Roadmap.create({
    user: req.user._id,
    targetRole,
    targetCompany: target?.companyName || "",
    currentLevel: currentLevel || "beginner",
    estimatedWeeks: result.estimatedWeeks || 12,
    milestones: (result.milestones || []).map((m) => ({
      title: m.title,
      description: m.description,
      resources: m.resources || [],
      durationWeeks: m.durationWeeks || 1,
      isCompleted: false,
    })),
  });

  res.status(201).json(new ApiResponse(201, { roadmap }, "Roadmap generated successfully"));
});

// @desc    Get all roadmaps for user
// @route   GET /api/roadmaps
const getRoadmaps = asyncHandler(async (req, res) => {
  const roadmaps = await Roadmap.find({ user: req.user._id }).sort("-createdAt");
  res.status(200).json(new ApiResponse(200, { roadmaps }));
});

// @desc    Get a single roadmap
// @route   GET /api/roadmaps/:id
const getRoadmapById = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findOne({ _id: req.params.id, user: req.user._id });
  if (!roadmap) throw new ApiError(404, "Roadmap not found");
  res.status(200).json(new ApiResponse(200, { roadmap }));
});

// @desc    Toggle milestone completion & update progress
// @route   PUT /api/roadmaps/:id/milestones/:index
const toggleMilestone = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findOne({ _id: req.params.id, user: req.user._id });
  if (!roadmap) throw new ApiError(404, "Roadmap not found");

  const milestone = roadmap.milestones[req.params.index];
  if (!milestone) throw new ApiError(400, "Invalid milestone index");

  milestone.isCompleted = !milestone.isCompleted;

  const completedCount = roadmap.milestones.filter((m) => m.isCompleted).length;
  roadmap.progress = Math.round((completedCount / roadmap.milestones.length) * 100);

  await roadmap.save();

  res.status(200).json(new ApiResponse(200, { roadmap }, "Milestone updated"));
});

// @desc    Delete roadmap
// @route   DELETE /api/roadmaps/:id
const deleteRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findOne({ _id: req.params.id, user: req.user._id });
  if (!roadmap) throw new ApiError(404, "Roadmap not found");

  await roadmap.deleteOne();
  res.status(200).json(new ApiResponse(200, null, "Roadmap deleted"));
});

module.exports = {
  generateRoadmap,
  getRoadmaps,
  getRoadmapById,
  toggleMilestone,
  deleteRoadmap,
};
