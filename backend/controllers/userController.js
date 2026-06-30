const asyncHandler = require("express-async-handler");
const fs = require("fs");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { uploadToCloudinary, deleteFromCloudinary } = require("../services/cloudinaryService");

// @desc    Update profile
// @route   PUT /api/users/profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, targetRole, skills, role } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  if (name) user.name = name;
  if (targetRole !== undefined) user.targetRole = targetRole;
  if (role) user.role = role;
  if (skills) user.skills = Array.isArray(skills) ? skills : skills.split(",").map((s) => s.trim());

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

// @desc    Change password
// @route   PUT /api/users/change-password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.comparePassword(currentPassword))) {
    throw new ApiError(401, "Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json(new ApiResponse(200, null, "Password changed successfully"));
});

module.exports = { updateProfile, updateAvatar, changePassword };
