const asyncHandler = require("express-async-handler");
const CodingProfile = require("../models/CodingProfile");
const CodingAnalysis = require("../models/CodingAnalysis");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { fetchGitHubProfile } = require("../services/github.service");
const { fetchLeetCodeProfile } = require("../services/leetcode.service");
const { fetchCodeforcesProfile } = require("../services/codeforces.service");
const { generateCodingAnalysis } = require("../services/aiCodingAnalysis.service");

const normalizeScore = (value) => Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
const list = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);

const scoreProfile = ({ leetcode = {}, github = {}, codeforces = {} }) => {
  const problemSolvingScore = normalizeScore(((leetcode.totalSolved || 0) / 500) * 60 + ((codeforces.solvedProblems || 0) / 400) * 40);
  const contestScore = normalizeScore(((leetcode.contestRating || 0) / 2500) * 45 + ((codeforces.contestRating || 0) / 2200) * 55);
  const consistencyScore = normalizeScore((leetcode.dailyStreak || 0) * 6 + (github.commitFrequency?.length || 0) * 4);
  const githubActivityScore = normalizeScore((github.repositories || 0) * 3 + (github.followers || 0) * 1.5 + (github.stars || 0) * 2);
  const projectScore = normalizeScore((github.pinnedProjects?.length || 0) * 12 + (github.languagesUsed?.length || 0) * 8);
  const overallCodingScore = normalizeScore((problemSolvingScore + contestScore + consistencyScore + githubActivityScore + projectScore) / 5);
  const careerReadinessScore = normalizeScore(overallCodingScore * 0.7 + projectScore * 0.3);

  return {
    overallCodingScore,
    problemSolvingScore,
    contestScore,
    consistencyScore,
    githubActivityScore,
    projectScore,
    careerReadinessScore,
  };
};

const fetchProfiles = async ({ leetcodeUsername, githubUsername, codeforcesHandle }) => {
  const [leetcode, github, codeforces] = await Promise.all([
    fetchLeetCodeProfile(leetcodeUsername).catch((error) => ({ error: error.message })),
    fetchGitHubProfile(githubUsername).catch((error) => ({ error: error.message })),
    fetchCodeforcesProfile(codeforcesHandle).catch((error) => ({ error: error.message })),
  ]);

  return {
    leetcode: leetcode?.error ? null : leetcode,
    github: github?.error ? null : github,
    codeforces: codeforces?.error ? null : codeforces,
    errors: {
      leetcode: leetcode?.error || null,
      github: github?.error || null,
      codeforces: codeforces?.error || null,
    },
  };
};

const saveProfileAndAnalysis = async (req, payload) => {
  const { leetcodeUsername, githubUsername, codeforcesHandle } = payload;
  if (!leetcodeUsername && !githubUsername && !codeforcesHandle) {
    throw new ApiError(400, "Enter at least one coding platform username");
  }

  const fetched = await fetchProfiles(payload);
  const profilePayload = {
    user: req.user._id,
    usernames: {
      leetcode: leetcodeUsername || "",
      github: githubUsername || "",
      codeforces: codeforcesHandle || "",
    },
    leetcode: fetched.leetcode || {},
    github: fetched.github || {},
    codeforces: fetched.codeforces || {},
    lastSyncedAt: new Date(),
  };

  profilePayload.scores = scoreProfile(profilePayload);

  const profile = await CodingProfile.create(profilePayload);
  const ai = await generateCodingAnalysis(profile.toObject());
  const analysis = await CodingAnalysis.create({
    user: req.user._id,
    codingProfile: profile._id,
    strongTopics: list(ai.strongTopics),
    weakTopics: list(ai.weakTopics),
    difficultyDistributionAnalysis: ai.difficultyDistributionAnalysis || "",
    codingPattern: ai.codingPattern || "",
    consistencyAnalysis: ai.consistencyAnalysis || "",
    recommendedTopics: list(ai.recommendedTopics),
    learningSuggestions: list(ai.learningSuggestions),
    projectSuggestions: list(ai.projectSuggestions),
    companyReadiness: ai.companyReadiness || "",
    interviewReadiness: ai.interviewReadiness || "",
    placementReadinessScore: normalizeScore(ai.placementReadinessScore),
    personalizedWeeklyRoadmap: list(ai.personalizedWeeklyRoadmap),
    monthlyRoadmap: list(ai.monthlyRoadmap),
    analyzedAt: new Date(),
  });

  return { profile, analysis, errors: fetched.errors };
};

const connectCodingProfiles = asyncHandler(async (req, res) => {
  const result = await saveProfileAndAnalysis(req, req.body);
  res.status(201).json(new ApiResponse(201, result, "Coding profiles connected and analyzed"));
});

const refreshCodingProfiles = asyncHandler(async (req, res) => {
  const latest = await CodingProfile.findOne({ user: req.user._id }).sort("-createdAt");
  if (!latest) throw new ApiError(404, "No coding profile found to refresh");

  const result = await saveProfileAndAnalysis(req, {
    leetcodeUsername: latest.usernames.leetcode,
    githubUsername: latest.usernames.github,
    codeforcesHandle: latest.usernames.codeforces,
  });
  res.status(201).json(new ApiResponse(201, result, "Coding profiles refreshed"));
});

const getCurrentCodingProfile = asyncHandler(async (req, res) => {
  const profile = await CodingProfile.findOne({ user: req.user._id }).sort("-createdAt");
  const analysis = profile
    ? await CodingAnalysis.findOne({ user: req.user._id, codingProfile: profile._id }).sort("-createdAt")
    : null;
  res.status(200).json(new ApiResponse(200, { profile, analysis }));
});

const getCodingHistory = asyncHandler(async (req, res) => {
  const analyses = await CodingAnalysis.find({ user: req.user._id }).populate("codingProfile").sort("-createdAt");
  res.status(200).json(new ApiResponse(200, { analyses }));
});

const getCodingAnalysisById = asyncHandler(async (req, res) => {
  const analysis = await CodingAnalysis.findOne({ _id: req.params.id, user: req.user._id }).populate("codingProfile");
  if (!analysis) throw new ApiError(404, "Coding analysis not found");
  res.status(200).json(new ApiResponse(200, { analysis }));
});

const compareCodingAnalyses = asyncHandler(async (req, res) => {
  const analyses = await CodingAnalysis.find({ user: req.user._id }).populate("codingProfile").sort("-createdAt").limit(2);
  res.status(200).json(new ApiResponse(200, { current: analyses[0] || null, previous: analyses[1] || null }));
});

const exportCodingReport = asyncHandler(async (req, res) => {
  const analysis = await CodingAnalysis.findOne({ _id: req.params.id, user: req.user._id }).populate("codingProfile");
  if (!analysis) throw new ApiError(404, "Coding analysis not found");

  const report = {
    generatedAt: new Date(),
    usernames: analysis.codingProfile.usernames,
    scores: analysis.codingProfile.scores,
    analysis,
  };

  res.status(200).json(new ApiResponse(200, { report }, "Coding analysis export prepared"));
});

module.exports = {
  connectCodingProfiles,
  refreshCodingProfiles,
  getCurrentCodingProfile,
  getCodingHistory,
  getCodingAnalysisById,
  compareCodingAnalyses,
  exportCodingReport,
};
