const express = require("express");
const {
  generateStudyPlan,
  getStudyPlans,
  getStudyPlanById,
  deleteStudyPlan,
} = require("../controllers/studyPlan.controller");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/generate", generateStudyPlan);
router.get("/", getStudyPlans);
router.get("/:id", getStudyPlanById);
router.delete("/:id", deleteStudyPlan);

module.exports = router;
