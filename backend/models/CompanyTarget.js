const mongoose = require("mongoose");

const companyTargetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    companyName: { type: String, required: true, trim: true },
    companySlug: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CompanyTarget", companyTargetSchema);
