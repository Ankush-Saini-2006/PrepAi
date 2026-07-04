const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { uploadToCloudinary, deleteFromCloudinary } = require("../services/cloudinaryService");

const normalizeList = (value) => {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === "string") return value.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
};

const normalizeDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const normalizeProjects = (projects = []) =>
  (Array.isArray(projects) ? projects : []).map((project) => ({
    title: String(project.title || "").trim(),
    description: String(project.description || "").trim(),
    techStack: normalizeList(project.techStack),
    link: String(project.link || "").trim(),
    githubUrl: String(project.githubUrl || "").trim(),
  })).filter((project) => project.title);

const normalizeCertificates = (certificates = []) =>
  (Array.isArray(certificates) ? certificates : []).map((certificate) => ({
    title: String(certificate.title || "").trim(),
    issuer: String(certificate.issuer || "").trim(),
    credentialUrl: String(certificate.credentialUrl || "").trim(),
    issuedAt: normalizeDate(certificate.issuedAt),
  })).filter((certificate) => certificate.title);

const normalizeAchievements = (achievements = []) =>
  (Array.isArray(achievements) ? achievements : []).map((achievement) => ({
    title: String(achievement.title || "").trim(),
    description: String(achievement.description || "").trim(),
    date: normalizeDate(achievement.date),
  })).filter((achievement) => achievement.title);

const normalizeCodingProfiles = (profiles = {}) => ({
  leetcode: String(profiles.leetcode || "").trim(),
  github: String(profiles.github || "").trim(),
  codeforces: String(profiles.codeforces || "").trim(),
  codechef: String(profiles.codechef || "").trim(),
  geeksforgeeks: String(profiles.geeksforgeeks || "").trim(),
  hackerrank: String(profiles.hackerrank || "").trim(),
});

const normalizeYear = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const year = Number(value);
  if (!Number.isInteger(year) || year < 1900 || year > 2100) return null;
  return year;
};

// @desc    Update profile
// @route   PUT /api/users/profile
const updateProfile = asyncHandler(async (req, res) => {
  const {
    achievements,
    careerGoals,
    dreamCompany,
    certificates,
    codingProfiles,
    expectedPackage,
    graduationYear,
    name,
    preferredTechStack,
    projects,
    targetRole,
    skills,
    role,
  } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  if (name !== undefined) user.name = name;
  if (targetRole !== undefined) user.targetRole = targetRole;
  if (dreamCompany !== undefined) user.dreamCompany = String(dreamCompany || "").trim();
  if (expectedPackage !== undefined) user.expectedPackage = String(expectedPackage || "").trim();
  if (graduationYear !== undefined) user.graduationYear = normalizeYear(graduationYear);
  if (preferredTechStack !== undefined) {
    user.preferredTechStack = Array.isArray(preferredTechStack)
      ? preferredTechStack.map((item) => String(item).trim()).filter(Boolean)
      : String(preferredTechStack)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
  }
  if (role !== undefined) user.role = role;
  if (skills !== undefined) {
    user.skills = Array.isArray(skills)
      ? skills
      : skills.split(",").map((s) => s.trim()).filter(Boolean);
  }
  if (careerGoals !== undefined) user.careerGoals = normalizeList(careerGoals);
  if (projects !== undefined) user.projects = normalizeProjects(projects);
  if (certificates !== undefined) user.certificates = normalizeCertificates(certificates);
  if (codingProfiles !== undefined) user.codingProfiles = normalizeCodingProfiles(codingProfiles);
  if (achievements !== undefined) user.achievements = normalizeAchievements(achievements);

  await user.save();
  res.status(200).json(new ApiResponse(200, { user: user.toSafeObject() }, "Profile updated"));
});

// @desc    Upload / replace profile resume
// @route   PUT /api/users/resume
const updateProfileResume = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No resume file uploaded");

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  if (user.profileResume?.publicId) {
    await deleteFromCloudinary(user.profileResume.publicId);
  }

  const { url, publicId } = await uploadToCloudinary(req.file.path, "prepai/profile-resumes");
  user.profileResume = {
    url,
    publicId,
    originalName: req.file.originalname,
    uploadedAt: new Date(),
  };
  await user.save();

  res.status(200).json(new ApiResponse(200, { user: user.toSafeObject() }, "Resume uploaded"));
});

// @desc    Download profile resume
// @route   GET /api/users/resume/download
const downloadProfileResume = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user?.profileResume?.url) throw new ApiError(404, "No resume uploaded");
  res.redirect(user.profileResume.url);
});

// @desc    Delete profile resume
// @route   DELETE /api/users/resume
const deleteProfileResume = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  if (user.profileResume?.publicId) {
    await deleteFromCloudinary(user.profileResume.publicId);
  }

  user.profileResume = { url: "", publicId: "", originalName: "", uploadedAt: null };
  await user.save();
  res.status(200).json(new ApiResponse(200, { user: user.toSafeObject() }, "Resume removed"));
});

// @desc    Upload / update avatar
// @route   PUT /api/users/avatar
const updateAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No file uploaded");

  const user = await User.findById(req.user._id);

  if (user.avatar?.publicId) {
    await deleteFromCloudinary(user.avatar.publicId);
  }

  const { url, publicId } = await uploadToCloudinary(req.file.path, "prepai/avatars");
  user.avatar = { url, publicId };
  await user.save();

  res.status(200).json(new ApiResponse(200, { user: user.toSafeObject() }, "Avatar updated"));
});

// @desc    Change password (invalidates all other sessions for security)
// @route   PUT /api/users/change-password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password +tokenVersion");

  if (!(await user.comparePassword(currentPassword))) {
    throw new ApiError(401, "Current password is incorrect");
  }

  user.password = newPassword;
  user.tokenVersion += 1; // invalidate all existing access/refresh tokens
  await user.save();

  await RefreshToken.updateMany({ user: user._id, revoked: false }, { revoked: true });

  res
    .status(200)
    .json(new ApiResponse(200, null, "Password changed successfully. Please log in again."));
});

module.exports = {
  updateProfile,
  updateAvatar,
  updateProfileResume,
  downloadProfileResume,
  deleteProfileResume,
  changePassword,
};
