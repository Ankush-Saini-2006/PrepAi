const rateLimit = require("express-rate-limit");

/**
 * Stricter limiter applied to sensitive auth endpoints (login, register,
 * forgot-password) to slow down brute-force / credential-stuffing attempts.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts from this IP, please try again after 15 minutes",
  },
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many password reset requests, please try again later",
  },
});

module.exports = { authLimiter, passwordResetLimiter };
