import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Download, RefreshCw, Share2, Sparkles } from "lucide-react";
import Button from "../../components/common/Button";
import DashboardCard from "../../components/dashboard/DashboardCard";
import MetricCard from "../../components/dashboard/MetricCard";
import ProfileCard from "../../components/CodingProfiles/ProfileCard";
import {
  connectCodingProfiles,
  exportCodingAnalysis,
  fetchCodingHistory,
  fetchCurrentCodingProfile,
  refreshCodingProfiles,
} from "../../redux/slices/codingProfileSlice";

const CodingProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, analysis, history, loading, syncing } = useSelector((state) => state.codingProfiles);
  const [form, setForm] = useState({ leetcodeUsername: "", githubUsername: "", codeforcesHandle: "" });

  useEffect(() => {
    dispatch(fetchCurrentCodingProfile());
    dispatch(fetchCodingHistory());
  }, [dispatch]);

  useEffect(() => {
    if (profile?.usernames) {
      setForm({
        leetcodeUsername: profile.usernames.leetcode || "",
        githubUsername: profile.usernames.github || "",
        codeforcesHandle: profile.usernames.codeforces || "",
      });
    }
  }, [profile]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(connectCodingProfiles(form));
    if (connectCodingProfiles.fulfilled.match(result)) toast.success("Coding profiles analyzed");
    else toast.error(result.payload || "Analysis failed");
  };

  const handleRefresh = async () => {
    const result = await dispatch(refreshCodingProfiles());
    if (refreshCodingProfiles.fulfilled.match(result)) toast.success("Coding profiles refreshed");
    else toast.error(result.payload || "Refresh failed");
  };

  const escapeHtml = (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const buildReportHtml = (report) => `
    <html>
      <head>
        <title>PrepAI Coding Analysis Report</title>
        <style>
          body { font-family: Inter, Arial, sans-serif; color: #0f172a; padding: 32px; line-height: 1.6; }
          h1, h2 { margin-bottom: 8px; }
          section { border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px; margin: 16px 0; }
          pre { white-space: pre-wrap; background: #f8fafc; padding: 14px; border-radius: 10px; overflow-wrap: anywhere; }
          @media print { body { padding: 12px; } section { break-inside: avoid; } }
        </style>
      </head>
      <body>
        <h1>PrepAI Coding Analysis Report</h1>
        <p>Generated at ${escapeHtml(new Date(report.generatedAt).toLocaleString())}</p>
        <section><h2>Usernames</h2><pre>${escapeHtml(JSON.stringify(report.usernames, null, 2))}</pre></section>
        <section><h2>Scores</h2><pre>${escapeHtml(JSON.stringify(report.scores, null, 2))}</pre></section>
        <section><h2>AI Analysis</h2><pre>${escapeHtml(JSON.stringify(report.analysis, null, 2))}</pre></section>
      </body>
    </html>
  `;

  const handleExport = async () => {
    if (!analysis?._id) {
      return toast.error("Run an analysis before exporting");
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      return toast.error("Enable popups to export the report");
    }

    printWindow.document.write("<p style=\"font-family: Inter, Arial, sans-serif; padding: 24px;\">Preparing PrepAI coding report...</p>");
    printWindow.document.close();

    const result = await dispatch(exportCodingAnalysis(analysis._id));
    if (exportCodingAnalysis.fulfilled.match(result)) {
      const report = result.payload;
      printWindow.document.open();
      printWindow.document.write(buildReportHtml(report));
      printWindow.document.close();
      printWindow.focus();
      printWindow.setTimeout(() => printWindow.print(), 250);
      toast.success("PDF export opened");
    } else {
      printWindow.close();
      toast.error(result.payload || "Export failed");
    }
  };

  const handleShare = async () => {
    const text = `PrepAI Coding Score: ${profile?.scores?.overallCodingScore || 0}, Placement Readiness: ${analysis?.placementReadinessScore || 0}`;
    if (navigator.share) await navigator.share({ title: "PrepAI Coding Report", text });
    else {
      await navigator.clipboard.writeText(text);
      toast.success("Share text copied");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600 dark:text-violet-300">AI Coding Profile Analyzer</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--page-text)]">Connect your coding profiles</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 theme-text-muted">Analyze LeetCode, GitHub, and Codeforces together with Gemini-powered placement insights.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" loading={syncing} onClick={handleRefresh}><RefreshCw size={16} /> Refresh</Button>
          <Button type="button" variant="secondary" onClick={handleExport}><Download size={16} /> Export</Button>
          <Button type="button" variant="secondary" onClick={handleShare}><Share2 size={16} /> Share</Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card grid gap-3 md:grid-cols-3">
        <input className="input-field" placeholder="LeetCode username" value={form.leetcodeUsername} onChange={(event) => setForm({ ...form, leetcodeUsername: event.target.value })} />
        <input className="input-field" placeholder="GitHub username" value={form.githubUsername} onChange={(event) => setForm({ ...form, githubUsername: event.target.value })} />
        <input className="input-field" placeholder="Codeforces handle" value={form.codeforcesHandle} onChange={(event) => setForm({ ...form, codeforcesHandle: event.target.value })} />
        <div className="md:col-span-3">
          <Button type="submit" loading={syncing} className="w-full"><Sparkles size={16} /> Analyze profiles</Button>
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Coding Score" value={profile?.scores?.overallCodingScore} loading={loading} emptyLabel="0" />
        <MetricCard title="Problem Solving" value={profile?.scores?.problemSolvingScore} loading={loading} emptyLabel="0" />
        <MetricCard title="Contest Score" value={profile?.scores?.contestScore} loading={loading} emptyLabel="0" />
        <MetricCard title="Placement Readiness" value={analysis?.placementReadinessScore} loading={loading} emptyLabel="0" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ProfileCard platform="leetcode" username={profile?.usernames?.leetcode} stats={[
          { label: "Solved", value: profile?.leetcode?.totalSolved },
          { label: "Rating", value: profile?.leetcode?.contestRating },
          { label: "Ranking", value: profile?.leetcode?.globalRanking },
          { label: "Streak", value: profile?.leetcode?.dailyStreak },
        ]} />
        <ProfileCard platform="github" username={profile?.usernames?.github} stats={[
          { label: "Repos", value: profile?.github?.repositories },
          { label: "Stars", value: profile?.github?.stars },
          { label: "Followers", value: profile?.github?.followers },
          { label: "Languages", value: profile?.github?.languagesUsed?.length },
        ]} />
        <ProfileCard platform="codeforces" username={profile?.usernames?.codeforces} stats={[
          { label: "Rating", value: profile?.codeforces?.contestRating },
          { label: "Max", value: profile?.codeforces?.highestRating },
          { label: "Solved", value: profile?.codeforces?.solvedProblems },
          { label: "Rank", value: profile?.codeforces?.currentRank || "NA" },
        ]} />
      </div>

      <DashboardCard subtitle="History" title="Previous analyses">
        <div className="grid gap-3">
          {history.length ? history.map((item) => (
            <button key={item._id} type="button" onClick={() => navigate(`/dashboard/coding-profiles/insights?id=${item._id}`)} className="theme-surface rounded-2xl p-4 text-left">
              <p className="text-sm font-semibold text-[color:var(--page-text)]">{new Date(item.createdAt).toLocaleString()}</p>
              <p className="mt-1 text-sm theme-text-muted">Placement readiness: {item.placementReadinessScore}%</p>
            </button>
          )) : <p className="text-sm theme-text-muted">No history yet.</p>}
        </div>
      </DashboardCard>
    </div>
  );
};

export default CodingProfile;
