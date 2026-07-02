const express = require("express");
const { updateProfile, updateAvatar, changePassword } = require("../controllers/userController");
const { protect, requireVerified } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const validate = require("../middleware/validateMiddleware");
const { updateProfileValidator, changePasswordValidator } = require("../validators/authValidators");

const router = express.Router();

router.use(protect);

router.put("/profile", updateProfileValidator, validate, updateProfile);
router.put("/avatar", requireVerified, upload.single("avatar"), updateAvatar);
router.put("/change-password", changePasswordValidator, validate, changePassword);

module.exports = router;
