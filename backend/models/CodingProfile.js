const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    date: { type: String, default: "" },
    count: { type: Number, default: 0 },
  },
  { _id: false }
);

const codingProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    usernames: {
      leetcode: { type: String, default: "", trim: true },
      github: { type: String, default: "", trim: true },
      codeforces: { type: String, default: "", trim: true },
    },
    leetcode: {
      totalSolved: { type: Number, default: 0 },
      easySolved: { type: Number, default: 0 },
      mediumSolved: { type: Number, default: 0 },
      hardSolved: { type: Number, default: 0 },
      acceptanceRate: { type: Number, default: 0 },
      contestRating: { type: Number, default: 0 },
      contestRanking: { type: Number, default: 0 },
      globalRanking: { type: Number, default: 0 },
      solvedByTopic: [{ name: { type: String }, value: { type: Number, default: 0 } }],
      recentActivity: [activitySchema],
      dailyStreak: { type: Number, default: 0 },
      raw: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    github: {
      repositories: { type: Number, default: 0 },
      stars: { type: Number, default: 0 },
      forks: { type: Number, default: 0 },
      followers: { type: Number, default: 0 },
      following: { type: Number, default: 0 },
      contributionGraph: [activitySchema],
      languagesUsed: [{ name: { type: String }, value: { type: Number, default: 0 } }],
      mostActiveRepositories: [{ name: { type: String }, value: { type: Number, default: 0 }, url: { type: String, default: "" } }],
      commitFrequency: [activitySchema],
      openSourceContributions: { type: Number, default: 0 },
      pinnedProjects: [{ name: { type: String }, description: { type: String, default: "" }, url: { type: String, default: "" }, stars: { type: Number, default: 0 } }],
      raw: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    codeforces: {
      contestRating: { type: Number, default: 0 },
      highestRating: { type: Number, default: 0 },
      currentRank: { type: String, default: "" },
      bestRank: { type: String, default: "" },
      solvedProblems: { type: Number, default: 0 },
      problemTags: [{ name: { type: String }, value: { type: Number, default: 0 } }],
      contestHistory: [{ contestName: { type: String }, rating: { type: Number, default: 0 }, rank: { type: Number, default: 0 }, date: { type: String, default: "" } }],
      raw: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    scores: {
      overallCodingScore: { type: Number, default: 0 },
      problemSolvingScore: { type: Number, default: 0 },
      contestScore: { type: Number, default: 0 },
      consistencyScore: { type: Number, default: 0 },
      githubActivityScore: { type: Number, default: 0 },
      projectScore: { type: Number, default: 0 },
      careerReadinessScore: { type: Number, default: 0 },
    },
    lastSyncedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

codingProfileSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("CodingProfile", codingProfileSchema);
