const express = require("express");
const {
  analyzeResumeJobMatch,
  getResumeJobMatchHistory,
  getResumeJobMatchById,
  deleteResumeJobMatch,
} = require("../controllers/resumeJobMatch.controller");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const ApiError = require("../utils/ApiError");

const router = express.Router();

const handleResumeUpload = (req, res, next) => {
  upload.single("resume")(req, res, (error) => {
    if (error) {
      console.log(error.message);
      return next(
        error.statusCode
          ? error
          : new ApiError(400, error.message || "Resume upload failed", "RESUME_UPLOAD_FAILED")
      );
    }
    next();
  });
};

router.use(protect);

router.post("/analyze", handleResumeUpload, analyzeResumeJobMatch);
router.get("/history", getResumeJobMatchHistory);
router.get("/:id", getResumeJobMatchById);
router.delete("/:id", deleteResumeJobMatch);

module.exports = router;
