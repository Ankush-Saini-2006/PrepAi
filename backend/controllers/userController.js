const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { uploadToCloudinary, deleteFromCloudinary } = require("../services/cloudinaryService");

// @desc    Update profile
// @route   PUT /api/users/profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, targetRole, skills, role } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  if (name !== undefined) user.name = name;
  if (targetRole !== undefined) user.targetRole = targetRole;
  if (role !== undefined) user.role = role;
  if (skills !== undefined) {
    user.skills = Array.isArray(skills)
      ? skills
      : skills.split(",").map((s) => s.trim()).filter(Boolean);
  }

  await user.save();
  res.status(200).json(new ApiResponse(200, { user: user.toSafeObject() }, "Profile updated"));
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

module.exports = { updateProfile, updateAvatar, changePassword };
