const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const hashToken = require("../utils/hashToken");
const sendEmail = require("../utils/sendEmail");
const {
  verificationEmailTemplate,
  resetPasswordEmailTemplate,
} = require("../utils/emailTemplates");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  expiresInToDate,
} = require("../utils/generateToken");

const REFRESH_COOKIE_NAME = "refreshToken";

const isProd = process.env.NODE_ENV === "production";

const baseCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/api/auth", // only sent back to auth endpoints (refresh/logout)
};

/**
 * Issues a new access + refresh token pair, persists the refresh token
 * (hashed) in the database, and sets it as an httpOnly cookie.
 */
const issueTokens = async (user, req, res, rememberMe = false) => {
  const accessToken = generateAccessToken(user._id, user.tokenVersion);
  const { token: refreshToken, expiresIn } = generateRefreshToken(
    user._id,
    user.tokenVersion,
    rememberMe
  );

  const expiresAt = expiresInToDate(expiresIn);

  await RefreshToken.create({
    user: user._id,
    tokenHash: hashToken(refreshToken),
    userAgent: req.headers["user-agent"] || "",
    ip: req.ip,
    rememberMe,
    expiresAt,
  });

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    ...baseCookieOptions,
    expires: expiresAt,
  });

  return accessToken;
};

const revokeRefreshTokenRecord = async (rawToken, replacedByTokenHash = null) => {
  if (!rawToken) return;
  await RefreshToken.findOneAndUpdate(
    { tokenHash: hashToken(rawToken) },
    { revoked: true, replacedByTokenHash }
  );
};

// @desc    Register a new user & send verification email
// @route   POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, targetRole } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists with this email");
  }

  const user = await User.create({ name, email, password, role, targetRole });

  const rawVerificationToken = user.generateVerificationToken();
  await user.save({ validateBeforeSave: false });

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${rawVerificationToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Verify your PrepAI account",
      html: verificationEmailTemplate({ name: user.name, verifyUrl }),
    });
  } catch (error) {
    console.error("Verification email failed to send:", error.message);
  }

  const accessToken = await issueTokens(user, req, res, false);

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: user.toSafeObject(), accessToken },
        "Registration successful. Please check your email to verify your account."
      )
    );
});

// @desc    Login user
// @route   POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password, rememberMe } = req.body;

  const user = await User.findOne({ email }).select("+password +tokenVersion");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const accessToken = await issueTokens(user, req, res, !!rememberMe);

  res
    .status(200)
    .json(
      new ApiResponse(200, { user: user.toSafeObject(), accessToken }, "Login successful")
    );
});

// @desc    Issue a new access token using the refresh token cookie (with rotation)
// @route   POST /api/auth/refresh-token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.[REFRESH_COOKIE_NAME];

  if (!incomingToken) {
    throw new ApiError(401, "No refresh token provided");
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(incomingToken);
  } catch (error) {
    res.clearCookie(REFRESH_COOKIE_NAME, baseCookieOptions);
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  if (decoded.type !== "refresh") {
    throw new ApiError(401, "Invalid token type");
  }

  const tokenRecord = await RefreshToken.findOne({ tokenHash: hashToken(incomingToken) });

  if (!tokenRecord || tokenRecord.revoked || tokenRecord.expiresAt < new Date()) {
    // Possible token reuse/theft - revoke for safety
    if (tokenRecord) {
      await RefreshToken.updateMany(
        { user: tokenRecord.user, revoked: false },
        { revoked: true }
      );
    }
    res.clearCookie(REFRESH_COOKIE_NAME, baseCookieOptions);
    throw new ApiError(401, "Refresh token is no longer valid, please log in again");
  }

  const user = await User.findById(decoded.id).select("+tokenVersion");
  if (!user || user.tokenVersion !== decoded.tokenVersion) {
    throw new ApiError(401, "Session expired, please log in again");
  }

  // Rotate: revoke the old refresh token and issue a brand new pair
  const newAccessToken = generateAccessToken(user._id, user.tokenVersion);
  const { token: newRefreshToken, expiresIn } = generateRefreshToken(
    user._id,
    user.tokenVersion,
    tokenRecord.rememberMe
  );
  const newExpiresAt = expiresInToDate(expiresIn);
  const newTokenHash = hashToken(newRefreshToken);

  tokenRecord.revoked = true;
  tokenRecord.replacedByTokenHash = newTokenHash;
  await tokenRecord.save();

  await RefreshToken.create({
    user: user._id,
    tokenHash: newTokenHash,
    userAgent: req.headers["user-agent"] || "",
    ip: req.ip,
    rememberMe: tokenRecord.rememberMe,
    expiresAt: newExpiresAt,
  });

  res.cookie(REFRESH_COOKIE_NAME, newRefreshToken, {
    ...baseCookieOptions,
    expires: newExpiresAt,
  });

  res
    .status(200)
    .json(new ApiResponse(200, { accessToken: newAccessToken }, "Token refreshed"));
});

// @desc    Logout - revoke current refresh token & clear cookie
// @route   POST /api/auth/logout
const logoutUser = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.[REFRESH_COOKIE_NAME];
  await revokeRefreshTokenRecord(incomingToken);
  res.clearCookie(REFRESH_COOKIE_NAME, baseCookieOptions);
  res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});

// @desc    Logout from all devices - revoke every refresh token via tokenVersion bump
// @route   POST /api/auth/logout-all
const logoutAllDevices = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("+tokenVersion");
  user.tokenVersion += 1;
  await user.save({ validateBeforeSave: false });

  await RefreshToken.updateMany({ user: user._id, revoked: false }, { revoked: true });

  res.clearCookie(REFRESH_COOKIE_NAME, baseCookieOptions);
  res.status(200).json(new ApiResponse(200, null, "Logged out from all devices"));
});

// @desc    Get current logged-in user
// @route   GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { user: req.user.toSafeObject() }));
});

// @desc    Verify email via token sent by email
// @route   GET /api/auth/verify-email/:token
const verifyEmail = asyncHandler(async (req, res) => {
  const hashedToken = hashToken(req.params.token);

  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpire: { $gt: Date.now() },
  }).select("+verificationToken +verificationTokenExpire");

  if (!user) {
    throw new ApiError(400, "Invalid or expired verification link");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpire = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, { user: user.toSafeObject() }, "Email verified successfully"));
});

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "No account found with this email");
  }
  if (user.isVerified) {
    throw new ApiError(400, "This account is already verified");
  }

  const rawVerificationToken = user.generateVerificationToken();
  await user.save({ validateBeforeSave: false });

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${rawVerificationToken}`;

  await sendEmail({
    to: user.email,
    subject: "Verify your PrepAI account",
    html: verificationEmailTemplate({ name: user.name, verifyUrl }),
  });

  res.status(200).json(new ApiResponse(200, null, "Verification email sent"));
});

// @desc    Forgot password - sends reset link
// @route   POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  console.log(`[auth:forgot-password] Request received for ${email || "<empty email>"}`);

  const user = await User.findOne({ email });
  console.log(`[auth:forgot-password] User ${user ? "found" : "not found"}`);

  // Always respond with success to avoid leaking which emails are registered
  if (!user) {
    return res
      .status(200)
      .json(new ApiResponse(200, null, "If an account exists, a reset link has been sent"));
  }

  const rawResetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawResetToken}`;
  console.log(`[auth:forgot-password] Reset token generated for ${email}`);

  try {
    await sendEmail({
      to: user.email,
      subject: "PrepAI - Password Reset Request",
      html: resetPasswordEmailTemplate({ name: user.name, resetUrl }),
    });
    console.log(`[auth:forgot-password] Reset email sent to ${user.email}`);
  } catch (error) {
    console.error(`[auth:forgot-password] Email send failed for ${user.email}: ${error.message}`);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(500, "Email could not be sent. Please check SMTP settings and try again later.");
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "If an account exists, a reset link has been sent"));
});

// @desc    Reset password using token from email
// @route   PUT /api/auth/reset-password/:token
const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = hashToken(req.params.token);

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select("+resetPasswordToken +resetPasswordExpire +tokenVersion");

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  // Invalidate all existing sessions/refresh tokens for security
  user.tokenVersion += 1;
  await user.save();

  await RefreshToken.updateMany({ user: user._id, revoked: false }, { revoked: true });

  res.status(200).json(new ApiResponse(200, null, "Password reset successful. Please log in again."));
});

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  logoutAllDevices,
  getMe,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
};
