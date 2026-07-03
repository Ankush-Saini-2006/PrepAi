const express = require("express");
const {
  connectCodingProfiles,
  refreshCodingProfiles,
  getCurrentCodingProfile,
  getCodingHistory,
  getCodingAnalysisById,
  compareCodingAnalyses,
  exportCodingReport,
} = require("../controllers/codingProfile.controller");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/connect", connectCodingProfiles);
router.post("/refresh", refreshCodingProfiles);
router.get("/", getCurrentCodingProfile);
router.get("/history", getCodingHistory);
router.get("/compare", compareCodingAnalyses);
router.get("/analysis/:id", getCodingAnalysisById);
router.get("/analysis/:id/export", exportCodingReport);

module.exports = router;
