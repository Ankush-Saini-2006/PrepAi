const express = require("express");
const {
  uploadResume,
  analyzeResume,
  getResumes,
  getResumeById,
  deleteResume,
} = require("../controllers/resumeController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.use(protect);

router.post("/upload", upload.single("resume"), uploadResume);
router.post("/:id/analyze", analyzeResume);
router.get("/", getResumes);
router.get("/:id", getResumeById);
router.delete("/:id", deleteResume);

module.exports = router;
