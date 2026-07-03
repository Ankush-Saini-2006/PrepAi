const ApiError = require("../utils/ApiError");

const fetchCodeforces = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new ApiError(response.status, "Unable to fetch Codeforces profile data");
  const data = await response.json();
  if (data.status !== "OK") throw new ApiError(400, data.comment || "Codeforces profile fetch failed");
  return data.result;
};

const fetchCodeforcesProfile = async (handle) => {
  if (!handle) return null;

  const encoded = encodeURIComponent(handle);
  const [users, ratingHistory, submissions] = await Promise.all([
    fetchCodeforces(`https://codeforces.com/api/user.info?handles=${encoded}`),
    fetchCodeforces(`https://codeforces.com/api/user.rating?handle=${encoded}`).catch(() => []),
    fetchCodeforces(`https://codeforces.com/api/user.status?handle=${encoded}&from=1&count=1000`).catch(() => []),
  ]);

  const user = users[0] || {};
  const accepted = submissions.filter((submission) => submission.verdict === "OK");
  const solvedKeys = new Set();
  const tagCounts = {};

  accepted.forEach((submission) => {
    const problem = submission.problem || {};
    solvedKeys.add(`${problem.contestId}-${problem.index}`);
    (problem.tags || []).forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return {
    contestRating: user.rating || 0,
    highestRating: user.maxRating || 0,
    currentRank: user.rank || "",
    bestRank: user.maxRank || "",
    solvedProblems: solvedKeys.size,
    problemTags: Object.entries(tagCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 12),
    contestHistory: ratingHistory.map((contest) => ({
      contestName: contest.contestName,
      rating: contest.newRating,
      rank: contest.rank,
      date: new Date(contest.ratingUpdateTimeSeconds * 1000).toISOString().slice(0, 10),
    })),
    raw: { user, ratingHistory, submissions: submissions.slice(0, 100) },
  };
};

module.exports = { fetchCodeforcesProfile };
