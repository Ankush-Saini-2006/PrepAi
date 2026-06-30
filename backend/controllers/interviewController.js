const asyncHandler = require("express-async-handler");
const Interview = require("../models/Interview");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const {
  generateJSON,
  generateInterviewQuestionsPrompt,
  evaluateAnswerPrompt,
} = require("../services/geminiService");

// @desc    Start a new mock interview (AI generates questions)
// @route   POST /api/interviews/start
const startInterview = asyncHandler(async (req, res) => {
  const { role, type, difficulty, count } = req.body;

  const prompt = generateInterviewQuestionsPrompt(role, type, difficulty, count || 5);
  const generated = await generateJSON(prompt);

  const questions = (Array.isArray(generated) ? generated : generated.questions || []).map(
    (q) => ({ question: q.question, answer: "", feedback: "", score: 0 })
  );

  const interview = await Interview.create({
    user: req.user._id,
    role,
    type: type || "mixed",
    difficulty: difficulty || "medium",
    questions,
  });

  res.status(201).json(new ApiResponse(201, { interview }, "Interview started"));
});

// @desc    Submit an answer for a question & get AI feedback
// @route   POST /api/interviews/:id/answer
const submitAnswer = asyncHandler(async (req, res) => {
  const { questionIndex, answer } = req.body;
  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!interview) throw new ApiError(404, "Interview not found");

  const q = interview.questions[questionIndex];
  if (!q) throw new ApiError(400, "Invalid question index");

  const prompt = evaluateAnswerPrompt(q.question, answer, interview.role);
  const evaluation = await generateJSON(prompt);

  q.answer = answer;
  q.feedback = evaluation.feedback || "";
  q.score = evaluation.score || 0;

  await interview.save();

  res.status(200).json(new ApiResponse(200, { question: q }, "Answer evaluated"));
});

// @desc    Complete interview & compute overall score
// @route   PUT /api/interviews/:id/complete
const completeInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!interview) throw new ApiError(404, "Interview not found");

  const scored = interview.questions.filter((q) => q.score > 0);
  const avgScore = scored.length
    ? scored.reduce((acc, q) => acc + q.score, 0) / scored.length
    : 0;

  interview.overallScore = Math.round(avgScore * 10) / 10;
  interview.overallFeedback =
    avgScore >= 7
      ? "Strong performance! You're well-prepared for real interviews."
      : avgScore >= 4
      ? "Good effort. Focus on structuring answers using the STAR method."
      : "Needs significant improvement. Practice fundamentals and mock interviews regularly.";
  interview.status = "completed";

  await interview.save();

  res.status(200).json(new ApiResponse(200, { interview }, "Interview completed"));
});

// @desc    Get all interviews
// @route   GET /api/interviews
const getInterviews = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({ user: req.user._id }).sort("-createdAt");
  res.status(200).json(new ApiResponse(200, { interviews }));
});

// @desc    Get single interview
// @route   GET /api/interviews/:id
const getInterviewById = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!interview) throw new ApiError(404, "Interview not found");
  res.status(200).json(new ApiResponse(200, { interview }));
});

module.exports = {
  startInterview,
  submitAnswer,
  completeInterview,
  getInterviews,
  getInterviewById,
};
