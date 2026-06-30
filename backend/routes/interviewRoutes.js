const express = require("express");
const {
  startInterview,
  submitAnswer,
  completeInterview,
  getInterviews,
  getInterviewById,
} = require("../controllers/interviewController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/start", startInterview);
router.post("/:id/answer", submitAnswer);
router.put("/:id/complete", completeInterview);
router.get("/", getInterviews);
router.get("/:id", getInterviewById);

module.exports = router;
