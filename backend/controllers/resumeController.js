const asyncHandler = require("express-async-handler");
const Resume = require("../models/Resume");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { uploadToCloudinary, deleteFromCloudinary } = require("../services/cloudinaryService");
const { extractTextFromPDF } = require("../services/pdfService");
const {
  generateJSON,
  analyzeResumePrompt,
} = require("../services/geminiService");

// @desc    Upload resume & run AI analysis
// @route   POST /api/resumes/upload
const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No resume file uploaded");

  const { targetRole } = req.body;
  const filePath = req.file.path;

  let extractedText = "";
  try {
    extractedText = await extractTextFromPDF(filePath);
  } catch (err) {
    extractedText = "";
  }

  const { url, publicId } = await uploadToCloudinary(filePath, "prepai/resumes");

  const resume = await Resume.create({
    user: req.user._id,
    fileUrl: url,
    publicId,
    originalName: req.file.originalname,
    extractedText,
    targetRole: targetRole || req.user.targetRole || "",
  });

  res.status(201).json(new ApiResponse(201, { resume }, "Resume uploaded successfully"));
});

// @desc    Analyze resume with AI (ATS score, strengths, etc.)
// @route   POST /api/resumes/:id/analyze
const analyzeResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) throw new ApiError(404, "Resume not found");

  if (!resume.extractedText) {
    throw new ApiError(400, "No extractable text found in this resume");
  }

  const prompt = analyzeResumePrompt(resume.extractedText, resume.targetRole);
  const analysis = await generateJSON(prompt);

  resume.atsScore = analysis.atsScore || 0;
  resume.strengths = analysis.strengths || [];
  resume.weaknesses = analysis.weaknesses || [];
  resume.suggestions = analysis.suggestions || [];
  resume.missingKeywords = analysis.missingKeywords || [];
  resume.aiSummary = analysis.summary || "";
  resume.analyzedAt = new Date();

  await resume.save();

  res.status(200).json(new ApiResponse(200, { resume }, "Resume analyzed successfully"));
});

// @desc    Get all resumes for logged-in user
// @route   GET /api/resumes
const getResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id }).sort("-createdAt");
  res.status(200).json(new ApiResponse(200, { resumes }));
});

// @desc    Get single resume
// @route   GET /api/resumes/:id
const getResumeById = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) throw new ApiError(404, "Resume not found");
  res.status(200).json(new ApiResponse(200, { resume }));
});

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) throw new ApiError(404, "Resume not found");

  await deleteFromCloudinary(resume.publicId);
  await resume.deleteOne();

  res.status(200).json(new ApiResponse(200, null, "Resume deleted successfully"));
});

module.exports = {
  uploadResume,
  analyzeResume,
  getResumes,
  getResumeById,
  deleteResume,
};
