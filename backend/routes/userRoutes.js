const express = require("express");
const {
  changePassword,
  deleteProfileResume,
  downloadProfileResume,
  updateAvatar,
  updateProfile,
  updateProfileResume,
} = require("../controllers/userController");
const { protect, requireVerified } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const validate = require("../middleware/validateMiddleware");
const { updateProfileValidator, changePasswordValidator } = require("../validators/authValidators");

const router = express.Router();

router.use(protect);

router.put("/profile", updateProfileValidator, validate, updateProfile);
router.put("/avatar", requireVerified, upload.single("avatar"), updateAvatar);
router.put("/resume", requireVerified, upload.single("resume"), updateProfileResume);
router.get("/resume/download", downloadProfileResume);
router.delete("/resume", deleteProfileResume);
router.put("/change-password", changePasswordValidator, validate, changePassword);

module.exports = router;
