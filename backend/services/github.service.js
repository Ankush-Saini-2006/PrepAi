const ApiError = require("../utils/ApiError");

const githubHeaders = () => ({
  Accept: "application/vnd.github+json",
  "User-Agent": "PrepAI-Coding-Profile-Analyzer",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
});

const fetchGitHub = async (url) => {
  const response = await fetch(url, { headers: githubHeaders() });
  if (!response.ok) {
    throw new ApiError(response.status, "Unable to fetch GitHub profile data");
  }
  return response.json();
};

const fetchGitHubProfile = async (username) => {
  if (!username) return null;

  const user = await fetchGitHub(`https://api.github.com/users/${encodeURIComponent(username)}`);
  const repos = await fetchGitHub(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`);

  const languageCounts = {};
  const commitFrequency = {};
  let stars = 0;
  let forks = 0;

  repos.forEach((repo) => {
    stars += repo.stargazers_count || 0;
    forks += repo.forks_count || 0;
    if (repo.language) languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    const month = repo.updated_at?.slice(0, 7);
    if (month) commitFrequency[month] = (commitFrequency[month] || 0) + 1;
  });

  return {
    repositories: user.public_repos || repos.length,
    stars,
    forks,
    followers: user.followers || 0,
    following: user.following || 0,
    contributionGraph: Object.entries(commitFrequency).map(([date, count]) => ({ date, count })),
    languagesUsed: Object.entries(languageCounts).map(([name, value]) => ({ name, value })),
    mostActiveRepositories: repos.slice(0, 6).map((repo) => ({
      name: repo.name,
      value: repo.stargazers_count + repo.forks_count,
      url: repo.html_url,
    })),
    commitFrequency: Object.entries(commitFrequency).map(([date, count]) => ({ date, count })),
    openSourceContributions: repos.filter((repo) => !repo.fork).length,
    pinnedProjects: repos.slice(0, 6).map((repo) => ({
      name: repo.name,
      description: repo.description || "",
      url: repo.html_url,
      stars: repo.stargazers_count || 0,
    })),
    raw: { user, repos },
  };
};

module.exports = { fetchGitHubProfile };
