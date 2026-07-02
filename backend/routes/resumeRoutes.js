const express = require("express");
const {
  uploadResume,
  analyzeResume,
  getResumes,
  getResumeById,
  deleteResume,
  downloadImprovedResume,
} = require("../controllers/resumeController");
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

router.post("/upload", handleResumeUpload, uploadResume);
router.post("/:id/analyze", analyzeResume);
router.get("/", getResumes);
router.get("/:id/download-improved", downloadImprovedResume);
router.get("/:id", getResumeById);
router.delete("/:id", deleteResume);

module.exports = router;
