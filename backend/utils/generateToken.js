const jwt = require("jsonwebtoken");

/**
 * Short-lived access token. Sent in the response body and stored
 * client-side (memory/localStorage) and attached via Authorization header.
 */
const generateAccessToken = (userId, tokenVersion = 0) => {
  return jwt.sign({ id: userId, tokenVersion, type: "access" }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  });
};

/**
 * Long-lived refresh token. Sent ONLY as an httpOnly cookie.
 * Its raw value is also hashed and stored in the RefreshToken collection
 * so it can be revoked / rotated server-side.
 */
const generateRefreshToken = (userId, tokenVersion = 0, rememberMe = false) => {
  const expiresIn = rememberMe
    ? process.env.JWT_REFRESH_EXPIRES_IN_LONG || "30d"
    : process.env.JWT_REFRESH_EXPIRES_IN_SHORT || "1d";

  const token = jwt.sign(
    { id: userId, tokenVersion, type: "refresh" },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn }
  );

  return { token, expiresIn };
};

const verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
const verifyRefreshToken = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET);

/**
 * Converts a jsonwebtoken "expiresIn" style string/number into a future Date.
 */
const expiresInToDate = (expiresIn) => {
  if (typeof expiresIn === "number") {
    return new Date(Date.now() + expiresIn * 1000);
  }
  const match = /^(\d+)([smhd])$/.exec(expiresIn);
  if (!match) return new Date(Date.now() + 24 * 60 * 60 * 1000);

  const value = Number(match[1]);
  const unit = match[2];
  const multipliers = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 };
  return new Date(Date.now() + value * multipliers[unit]);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  expiresInToDate,
};
