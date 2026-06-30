const express = require("express");
const { body } = require("express-validator");
const { updateProfile, updateAvatar, changePassword } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const validate = require("../middleware/validateMiddleware");

const router = express.Router();

router.use(protect);

router.put("/profile", updateProfile);
router.put("/avatar", upload.single("avatar"), updateAvatar);
router.put(
  "/change-password",
  [
    body("currentPassword").notEmpty(),
    body("newPassword").isLength({ min: 6 }),
  ],
  validate,
  changePassword
);

module.exports = router;
