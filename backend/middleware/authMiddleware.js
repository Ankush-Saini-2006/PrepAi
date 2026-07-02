const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const User = require("../models/User");
const { verifyAccessToken } = require("../utils/generateToken");

const extractToken = (req) => {
  if (req.headers.authorization?.startsWith("Bearer")) {
    return req.headers.authorization.split(" ")[1];
  }
  if (req.cookies?.accessToken) {
    return req.cookies.accessToken;
  }
  return null;
};

/**
 * Requires a valid, non-expired access token. Attaches the full user
 * document (minus sensitive fields) to req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    throw new ApiError(401, "Not authorized, no token provided");
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Access token expired");
    }
    throw new ApiError(401, "Not authorized, token failed");
  }

  if (decoded.type !== "access") {
    throw new ApiError(401, "Invalid token type");
  }

  const user = await User.findById(decoded.id).select("+tokenVersion");
  if (!user) {
    throw new ApiError(401, "User no longer exists");
  }

  // If tokenVersion has been bumped (e.g. password change, logout-all),
  // previously issued access tokens become invalid immediately.
  if (user.tokenVersion !== decoded.tokenVersion) {
    throw new ApiError(401, "Session expired, please log in again");
  }

  req.user = user;
  next();
});

/**
 * Same as protect, but does not throw if no/invalid token is present.
 * Useful for routes that behave differently for guests vs logged-in users.
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);
  if (!token) return next();

  try {
    const decoded = verifyAccessToken(token);
    if (decoded.type === "access") {
      const user = await User.findById(decoded.id).select("+tokenVersion");
      if (user && user.tokenVersion === decoded.tokenVersion) {
        req.user = user;
      }
    }
  } catch (error) {
    // Silently ignore - request proceeds as unauthenticated
  }

  next();
});

/**
 * Restricts access to verified accounts only. Must run after `protect`.
 */
const requireVerified = (req, res, next) => {
  if (!req.user?.isVerified) {
    throw new ApiError(403, "Please verify your email to access this resource");
  }
  next();
};

module.exports = { protect, optionalAuth, requireVerified };
