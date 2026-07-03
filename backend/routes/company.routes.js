const express = require("express");
const {
  getCompanyDetails,
  listCompanies,
  setTargetCompany,
} = require("../controllers/company.controller");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/companies", listCompanies);
router.get("/companies/:slug", getCompanyDetails);
router.post("/companies/:slug/target", setTargetCompany);

module.exports = router;
