const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 60,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    avatar: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    role: {
      type: String,
      enum: ["student", "professional"],
      default: "student",
    },
    targetRole: { type: String, default: "" },
    skills: [{ type: String }],

    // Email verification
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, select: false },
    verificationTokenExpire: { type: Date, select: false },

    // Password reset
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },

    // Refresh token rotation / invalidation support.
    // Incrementing this invalidates all previously issued refresh tokens (e.g. on password change/logout-all).
    tokenVersion: { type: Number, default: 0, select: false },

    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generates a plain token, stores only its SHA-256 hash, returns the plain token for emailing.
userSchema.methods.generateVerificationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.verificationToken = crypto.createHash("sha256").update(token).digest("hex");
  this.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return token;
};

userSchema.methods.generatePasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
  return token;
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpire;
  delete obj.verificationToken;
  delete obj.verificationTokenExpire;
  delete obj.tokenVersion;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
