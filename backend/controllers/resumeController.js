const asyncHandler = require("express-async-handler");
const fs = require("fs");
const Resume = require("../models/Resume");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { uploadToCloudinary, deleteFromCloudinary } = require("../services/cloudinaryService");
const { extractTextFromPDF } = require("../services/pdfService");
const {
  generateJSON,
  analyzeResumePrompt,
} = require("../services/geminiService");

const normalizeList = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);
const normalizeObjectList = (value) =>
  Array.isArray(value) ? value.filter((item) => item && typeof item === "object") : [];

const cleanupLocalFile = (filePath) => {
  if (!filePath) return;
  fs.unlink(filePath, (error) => {
    if (error && error.code !== "ENOENT") {
      console.log(error.message);
    }
  });
};

// @desc    Upload resume & run AI analysis
// @route   POST /api/resumes/upload
const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No resume file uploaded");
  if (req.file.mimetype !== "application/pdf") {
    cleanupLocalFile(req.file.path);
    throw new ApiError(400, "Resume analyzer only supports PDF uploads");
  }

  const { targetRole } = req.body;
  const filePath = req.file.path;

  let extractedText = "";
  try {
    extractedText = await extractTextFromPDF(filePath);
  } catch (err) {
    console.log(err.message);
    cleanupLocalFile(filePath);
    throw new ApiError(400, "Unable to parse the uploaded PDF. Please upload a readable text-based PDF.", "PDF_PARSE_FAILED");
  }

  if (!extractedText.trim()) {
    cleanupLocalFile(filePath);
    throw new ApiError(400, "No extractable text found in this resume PDF.", "PDF_TEXT_EMPTY");
  }

  let uploadedResume;
  try {
    uploadedResume = await uploadToCloudinary(filePath, "prepai/resumes");
  } catch (err) {
    console.log(err.message);
    cleanupLocalFile(filePath);
    throw new ApiError(502, "Resume file upload service failed. Please check Cloudinary configuration.", "RESUME_STORAGE_FAILED");
  }

  const resume = await Resume.create({
    user: req.user._id,
    fileUrl: uploadedResume.url,
    publicId: uploadedResume.publicId,
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

  resume.atsScore = Number.isFinite(Number(analysis.atsScore)) ? Number(analysis.atsScore) : null;
  resume.strengths = normalizeList(analysis.strengths);
  resume.weaknesses = normalizeList(analysis.weaknesses);
  resume.suggestions = normalizeList(analysis.suggestions);
  resume.missingKeywords = normalizeList(analysis.missingKeywords);
  resume.aiSummary = analysis.summary || "";
  resume.grammarAnalysis = normalizeObjectList(analysis.grammarAnalysis);
  resume.keywordOptimization = normalizeObjectList(analysis.keywordOptimization);
  resume.skills = normalizeList(analysis.skills);
  resume.missingSkills = normalizeList(analysis.missingSkills);
  resume.rewriteSuggestions = normalizeObjectList(analysis.rewriteSuggestions);
  resume.projectSuggestions = normalizeObjectList(analysis.projectSuggestions);
  resume.improvedResumeText = analysis.improvedResumeText || "";
  resume.analyzedAt = new Date();

  await resume.save();

  res.status(200).json(new ApiResponse(200, { resume }, "Resume analyzed successfully"));
});

// @desc    Download AI-improved resume draft
// @route   GET /api/resumes/:id/download-improved
const downloadImprovedResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) throw new ApiError(404, "Resume not found");

  if (!resume.improvedResumeText) {
    throw new ApiError(400, "Improved resume draft is not available yet");
  }

  const safeName = resume.originalName.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9-_]+/gi, "-");
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${safeName || "resume"}-improved.txt"`);
  res.status(200).send(resume.improvedResumeText);
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
  downloadImprovedResume,
};
