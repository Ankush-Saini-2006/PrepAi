const asyncHandler = require("express-async-handler");
const JobApplication = require("../models/JobApplication");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// @desc    Create job application entry
// @route   POST /api/jobs
const createJobApplication = asyncHandler(async (req, res) => {
  const { company, role, status, jobLink, notes, appliedDate } = req.body;

  const job = await JobApplication.create({
    user: req.user._id,
    company,
    role,
    status,
    jobLink,
    notes,
    appliedDate,
  });

  res.status(201).json(new ApiResponse(201, { job }, "Job application added"));
});

// @desc    Get all job applications for user
// @route   GET /api/jobs
const getJobApplications = asyncHandler(async (req, res) => {
  const jobs = await JobApplication.find({ user: req.user._id }).sort("-createdAt");
  res.status(200).json(new ApiResponse(200, { jobs }));
});

// @desc    Update job application
// @route   PUT /api/jobs/:id
const updateJobApplication = asyncHandler(async (req, res) => {
  const job = await JobApplication.findOne({ _id: req.params.id, user: req.user._id });
  if (!job) throw new ApiError(404, "Job application not found");

  Object.assign(job, req.body);
  await job.save();

  res.status(200).json(new ApiResponse(200, { job }, "Job application updated"));
});

// @desc    Delete job application
// @route   DELETE /api/jobs/:id
const deleteJobApplication = asyncHandler(async (req, res) => {
  const job = await JobApplication.findOne({ _id: req.params.id, user: req.user._id });
  if (!job) throw new ApiError(404, "Job application not found");

  await job.deleteOne();
  res.status(200).json(new ApiResponse(200, null, "Job application deleted"));
});

// @desc    Get job application stats (for dashboard charts)
// @route   GET /api/jobs/stats
const getJobStats = asyncHandler(async (req, res) => {
  const jobs = await JobApplication.find({ user: req.user._id });

  const stats = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});

  res.status(200).json(new ApiResponse(200, { stats, total: jobs.length }));
});

module.exports = {
  createJobApplication,
  getJobApplications,
  updateJobApplication,
  deleteJobApplication,
  getJobStats,
};
