const crypto = require("crypto");

/**
 * SHA-256 hash used for storing/looking up refresh tokens and reset/verification
 * tokens without ever persisting the raw secret value in the database.
 */
const hashToken = (rawToken) => crypto.createHash("sha256").update(rawToken).digest("hex");

module.exports = hashToken;
