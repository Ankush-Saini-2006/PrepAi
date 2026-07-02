const express = require("express");
const {
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
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const { authLimiter, passwordResetLimiter } = require("../middleware/rateLimitMiddleware");
const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  verifyEmailValidator,
  resendVerificationValidator,
} = require("../validators/authValidators");

const router = express.Router();

// Public
router.post("/register", authLimiter, registerValidator, validate, registerUser);
router.post("/login", authLimiter, loginValidator, validate, loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logoutUser);

router.get("/verify-email/:token", verifyEmailValidator, validate, verifyEmail);
router.post(
  "/resend-verification",
  authLimiter,
  resendVerificationValidator,
  validate,
  resendVerificationEmail
);

router.post(
  "/forgot-password",
  passwordResetLimiter,
  forgotPasswordValidator,
  validate,
  forgotPassword
);
router.put(
  "/reset-password/:token",
  passwordResetLimiter,
  resetPasswordValidator,
  validate,
  resetPassword
);

// Protected
router.get("/me", protect, getMe);
router.post("/logout-all", protect, logoutAllDevices);

module.exports = router;
