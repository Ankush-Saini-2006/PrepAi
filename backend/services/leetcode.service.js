const ApiError = require("../utils/ApiError");

const leetcodeQuery = `
query userProfile($username: String!) {
  matchedUser(username: $username) {
    username
    profile { ranking }
    submitStatsGlobal {
      acSubmissionNum { difficulty count submissions }
    }
    tagProblemCounts {
      advanced { tagName problemsSolved }
      intermediate { tagName problemsSolved }
      fundamental { tagName problemsSolved }
    }
  }
  userContestRanking(username: $username) {
    attendedContestsCount
    rating
    globalRanking
  }
  recentAcSubmissionList(username: $username, limit: 20) {
    title
    timestamp
  }
}
`;

const fetchLeetCodeProfile = async (username) => {
  if (!username) return null;

  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: "https://leetcode.com",
      "User-Agent": "PrepAI-Coding-Profile-Analyzer",
    },
    body: JSON.stringify({ query: leetcodeQuery, variables: { username } }),
  });

  if (!response.ok) throw new ApiError(response.status, "Unable to fetch LeetCode profile data");
  const { data, errors } = await response.json();
  if (errors?.length || !data?.matchedUser) throw new ApiError(404, "LeetCode user not found");

  const stats = data.matchedUser.submitStatsGlobal?.acSubmissionNum || [];
  const getCount = (difficulty) => stats.find((item) => item.difficulty === difficulty)?.count || 0;
  const totalSolved = getCount("All");
  const totalSubmissions = stats.find((item) => item.difficulty === "All")?.submissions || 0;
  const topics = [
    ...(data.matchedUser.tagProblemCounts?.advanced || []),
    ...(data.matchedUser.tagProblemCounts?.intermediate || []),
    ...(data.matchedUser.tagProblemCounts?.fundamental || []),
  ];
  const activityByDay = {};
  (data.recentAcSubmissionList || []).forEach((item) => {
    const date = new Date(Number(item.timestamp) * 1000).toISOString().slice(0, 10);
    activityByDay[date] = (activityByDay[date] || 0) + 1;
  });

  return {
    totalSolved,
    easySolved: getCount("Easy"),
    mediumSolved: getCount("Medium"),
    hardSolved: getCount("Hard"),
    acceptanceRate: totalSubmissions ? Math.round((totalSolved / totalSubmissions) * 100) : 0,
    contestRating: Math.round(data.userContestRanking?.rating || 0),
    contestRanking: data.userContestRanking?.globalRanking || 0,
    globalRanking: data.matchedUser.profile?.ranking || 0,
    solvedByTopic: topics.map((topic) => ({ name: topic.tagName, value: topic.problemsSolved })).sort((a, b) => b.value - a.value).slice(0, 12),
    recentActivity: Object.entries(activityByDay).map(([date, count]) => ({ date, count })),
    dailyStreak: Object.keys(activityByDay).length,
    raw: data,
  };
};

module.exports = { fetchLeetCodeProfile };
