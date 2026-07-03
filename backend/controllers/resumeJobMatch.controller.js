const asyncHandler = require("express-async-handler");
const fs = require("fs");
const ResumeJobMatch = require("../models/ResumeJobMatch");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { uploadToCloudinary, deleteFromCloudinary } = require("../services/cloudinaryService");
const { extractTextFromPDF } = require("../services/pdfService");
const {
  generateJSON,
  matchResumeToJobDescriptionPrompt,
} = require("../services/geminiService");

const normalizeList = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);

const normalizeScore = (value) => {
  const score = Number(value);
  if (!Number.isFinite(score)) return 0;
  return Math.min(100, Math.max(0, Math.round(score)));
};

const cleanupLocalFile = (filePath) => {
  if (!filePath) return;
  fs.unlink(filePath, (error) => {
    if (error && error.code !== "ENOENT") {
      console.log(error.message);
    }
  });
};

// @desc    Upload resume PDF, compare with job description, and save analysis
// @route   POST /api/resume-job-match/analyze
const analyzeResumeJobMatch = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No resume file uploaded");
  if (req.file.mimetype !== "application/pdf") {
    cleanupLocalFile(req.file.path);
    throw new ApiError(400, "Resume job matching only supports PDF uploads");
  }

  const jobDescription = req.body.jobDescription?.trim();
  if (!jobDescription) {
    cleanupLocalFile(req.file.path);
    throw new ApiError(400, "Job description is required");
  }

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
    uploadedResume = await uploadToCloudinary(filePath, "prepai/resume-job-matches");
  } catch (err) {
    console.log(err.message);
    cleanupLocalFile(filePath);
    throw new ApiError(502, "Resume file upload service failed. Please check Cloudinary configuration.", "RESUME_STORAGE_FAILED");
  }

  let match;
  try {
    const prompt = matchResumeToJobDescriptionPrompt(extractedText, jobDescription);
    const analysis = await generateJSON(prompt);

    match = await ResumeJobMatch.create({
      user: req.user._id,
      fileUrl: uploadedResume.url,
      publicId: uploadedResume.publicId,
      originalName: req.file.originalname,
      extractedText,
      jobDescription,
      matchScore: normalizeScore(analysis.matchScore),
      overallReadinessScore: normalizeScore(analysis.overallReadinessScore),
      atsCompatibilityScore: normalizeScore(analysis.atsCompatibilityScore),
      summary: analysis.summary || "",
      matchingSkills: normalizeList(analysis.matchingSkills),
      missingSkills: normalizeList(analysis.missingSkills),
      missingKeywords: normalizeList(analysis.missingKeywords),
      weakAreas: normalizeList(analysis.weakAreas),
      improvementSuggestions: normalizeList(analysis.improvementSuggestions),
      analyzedAt: new Date(),
    });
  } catch (err) {
    await deleteFromCloudinary(uploadedResume.publicId);
    throw err;
  }

  res.status(201).json(new ApiResponse(201, { match }, "Resume job match analyzed successfully"));
});

// @desc    Get resume job match history for logged-in user
// @route   GET /api/resume-job-match/history
const getResumeJobMatchHistory = asyncHandler(async (req, res) => {
  const matches = await ResumeJobMatch.find({ user: req.user._id }).sort("-createdAt");
  res.status(200).json(new ApiResponse(200, { matches }));
});

// @desc    Get a single resume job match analysis
// @route   GET /api/resume-job-match/:id
const getResumeJobMatchById = asyncHandler(async (req, res) => {
  const match = await ResumeJobMatch.findOne({ _id: req.params.id, user: req.user._id });
  if (!match) throw new ApiError(404, "Resume job match analysis not found");

  res.status(200).json(new ApiResponse(200, { match }));
});

// @desc    Delete a resume job match analysis
// @route   DELETE /api/resume-job-match/:id
const deleteResumeJobMatch = asyncHandler(async (req, res) => {
  const match = await ResumeJobMatch.findOne({ _id: req.params.id, user: req.user._id });
  if (!match) throw new ApiError(404, "Resume job match analysis not found");

  await deleteFromCloudinary(match.publicId);
  await match.deleteOne();

  res.status(200).json(new ApiResponse(200, null, "Resume job match analysis deleted"));
});

module.exports = {
  analyzeResumeJobMatch,
  getResumeJobMatchHistory,
  getResumeJobMatchById,
  deleteResumeJobMatch,
};
