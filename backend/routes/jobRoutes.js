const express = require("express");
const {
  createJobApplication,
  getJobApplications,
  updateJobApplication,
  deleteJobApplication,
  getJobStats,
} = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createJobApplication);
router.get("/", getJobApplications);
router.get("/stats", getJobStats);
router.put("/:id", updateJobApplication);
router.delete("/:id", deleteJobApplication);

module.exports = router;
