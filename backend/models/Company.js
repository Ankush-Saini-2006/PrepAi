const mongoose = require("mongoose");

const dsaTopicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    difficulty: { type: String, default: "Medium" },
    recommendedQuestions: [{ type: String }],
  },
  { _id: false }
);

const resourceSchema = new mongoose.Schema(
  {
    type: { type: String, default: "Article" },
    title: { type: String, required: true },
    url: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: true }
);

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    overview: { type: String, default: "" },
    hiringProcess: [{ type: String }],
    eligibility: [{ type: String }],
    interviewPattern: { type: String, default: "" },
    oaPattern: { type: String, default: "" },
    interviewRounds: [{ type: String }],
    frequentlyAskedQuestions: [{ type: String }],
    mostAskedDsaTopics: [dsaTopicSchema],
    coreCsSubjects: [{ type: String }],
    resumeTips: [{ type: String }],
    projectsExpected: [{ type: String }],
    behavioralQuestions: [{ type: String }],
    hrQuestions: [{ type: String }],
    systemDesign: [{ type: String }],
    codingLanguagesPreferred: [{ type: String }],
    resources: [resourceSchema],
    generatedByAI: { type: Boolean, default: false },
    generatedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
