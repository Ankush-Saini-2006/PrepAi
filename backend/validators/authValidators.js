const { body, param } = require("express-validator");

const registerValidator = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 60 }),
  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Provide a valid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain at least one number"),
  body("role").optional().isIn(["student", "professional"]).withMessage("Invalid role"),
];

const loginValidator = [
  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  body("rememberMe").optional().isBoolean().toBoolean(),
];

const forgotPasswordValidator = [
  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Provide a valid email"),
];

const resetPasswordValidator = [
  param("token").notEmpty().withMessage("Reset token is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const verifyEmailValidator = [param("token").notEmpty().withMessage("Verification token is required")];

const resendVerificationValidator = [
  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Provide a valid email"),
];

const updateProfileValidator = [
  body("name").optional().trim().isLength({ min: 1, max: 60 }).withMessage("Name must be 1-60 characters"),
  body("targetRole").optional().trim().isLength({ max: 100 }),
  body("role").optional().isIn(["student", "professional"]).withMessage("Invalid role"),
  body("skills").optional(),
  body("careerGoals").optional().isArray().withMessage("Career goals must be an array"),
  body("projects").optional().isArray().withMessage("Projects must be an array"),
  body("certificates").optional().isArray().withMessage("Certificates must be an array"),
  body("achievements").optional().isArray().withMessage("Achievements must be an array"),
  body("codingProfiles").optional().isObject().withMessage("Coding profiles must be an object"),
];

const changePasswordValidator = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

module.exports = {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  verifyEmailValidator,
  resendVerificationValidator,
  updateProfileValidator,
  changePasswordValidator,
};
