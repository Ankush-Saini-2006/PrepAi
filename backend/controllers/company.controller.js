const asyncHandler = require("express-async-handler");
const Company = require("../models/Company");
const CompanyTarget = require("../models/CompanyTarget");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { generateCompanyPreparationPrompt, generateJSON } = require("../services/geminiService");
const { SUPPORTED_COMPANIES, toSlug } = require("../services/companyPreparation.service");

const supportedCompanySlugs = SUPPORTED_COMPANIES.map(toSlug);
const toArray = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);

const findCompanyBySlug = async (slug) => {
  if (!supportedCompanySlugs.includes(slug)) throw new ApiError(404, "Company is not supported yet");
  const company = await Company.findOne({ slug });
  if (!company) throw new ApiError(404, "Company not found");
  return company;
};

const seedSupportedCompanies = async () => {
  const companies = await Promise.all(
    SUPPORTED_COMPANIES.map((name) =>
      Company.findOneAndUpdate(
        { slug: toSlug(name) },
        { $setOnInsert: { name, slug: toSlug(name) } },
        { new: true, upsert: true }
      )
    )
  );
  return companies.sort((left, right) => left.name.localeCompare(right.name));
};

const populateCompanyContent = async (company) => {
  if (company.generatedByAI && company.overview) return company;

  const content = await generateJSON(generateCompanyPreparationPrompt(company.name));
  Object.assign(company, {
    overview: content.overview || "",
    hiringProcess: toArray(content.hiringProcess),
    eligibility: toArray(content.eligibility),
    interviewPattern: content.interviewPattern || "",
    oaPattern: content.oaPattern || "",
    interviewRounds: toArray(content.interviewRounds),
    frequentlyAskedQuestions: toArray(content.frequentlyAskedQuestions),
    mostAskedDsaTopics: toArray(content.mostAskedDsaTopics),
    coreCsSubjects: toArray(content.coreCsSubjects),
    resumeTips: toArray(content.resumeTips),
    projectsExpected: toArray(content.projectsExpected),
    behavioralQuestions: toArray(content.behavioralQuestions),
    hrQuestions: toArray(content.hrQuestions),
    systemDesign: toArray(content.systemDesign),
    codingLanguagesPreferred: toArray(content.codingLanguagesPreferred),
    resources: toArray(content.resources),
    generatedByAI: true,
    generatedAt: new Date(),
  });
  await company.save();
  return company;
};

const getTargetCompany = async (userId) =>
  CompanyTarget.findOne({ user: userId }).populate("company").lean();

const listCompanies = asyncHandler(async (req, res) => {
  const companies = await seedSupportedCompanies();
  const target = await getTargetCompany(req.user._id);

  res.status(200).json(
    new ApiResponse(200, {
      companies: companies.map((company) => ({
        ...company.toObject(),
        isTarget: target?.companySlug === company.slug,
      })),
      target,
    })
  );
});

const getCompanyDetails = asyncHandler(async (req, res) => {
  await seedSupportedCompanies();
  const company = await populateCompanyContent(await findCompanyBySlug(req.params.slug));
  const target = await getTargetCompany(req.user._id);

  res.status(200).json(
    new ApiResponse(200, {
      company: {
        ...company.toObject(),
        isTarget: target?.companySlug === company.slug,
      },
      target,
    })
  );
});

const setTargetCompany = asyncHandler(async (req, res) => {
  const company = await populateCompanyContent(await findCompanyBySlug(req.params.slug));
  const target = await CompanyTarget.findOneAndUpdate(
    { user: req.user._id },
    {
      user: req.user._id,
      company: company._id,
      companyName: company.name,
      companySlug: company.slug,
    },
    { new: true, upsert: true }
  ).populate("company");

  res.status(200).json(
    new ApiResponse(
      200,
      { target },
      "Target company saved. Career Roadmap and Smart Task Manager will use this company when generating future plans."
    )
  );
});

module.exports = {
  getCompanyDetails,
  listCompanies,
  setTargetCompany,
};
