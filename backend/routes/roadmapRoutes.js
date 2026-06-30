const express = require("express");
const {
  generateRoadmap,
  getRoadmaps,
  getRoadmapById,
  toggleMilestone,
  deleteRoadmap,
} = require("../controllers/roadmapController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/generate", generateRoadmap);
router.get("/", getRoadmaps);
router.get("/:id", getRoadmapById);
router.put("/:id/milestones/:index", toggleMilestone);
router.delete("/:id", deleteRoadmap);

module.exports = router;
