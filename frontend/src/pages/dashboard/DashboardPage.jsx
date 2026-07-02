import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, ArrowRight, BadgeCheck, BrainCircuit, CheckCircle2, Clock3, Flame, LayoutDashboard, Sparkles, Target, TrendingUp } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useFetchDashboardOverview from "../../hooks/useFetchDashboardOverview";
import DashboardCard from "../../components/dashboard/DashboardCard";
import MetricCard from "../../components/dashboard/MetricCard";
import EmptyState from "../../components/common/EmptyState";
import Spinner from "../../components/common/Spinner";

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#22c55e", "#f59e0b"];

const chartTooltipStyle = {
  backgroundColor: "var(--page-surface-solid)",
  border: "1px solid var(--page-border)",
  borderRadius: "16px",
  color: "var(--page-text)",
  boxShadow: "0 20px 60px -30px rgba(15, 23, 42, 0.35)",
};

const TaskItem = ({ title, detail, icon: Icon = Activity }) => (
  <div className="flex items-start gap-3 rounded-2xl border border-[color:var(--page-border)] bg-[var(--page-surface-soft)] p-4 dark:bg-slate-800/70">
    <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-inset ring-indigo-100 dark:bg-slate-700 dark:ring-slate-600">
      <Icon size={16} className="text-primary-600 dark:text-violet-300" />
    </div>
    <div className="min-w-0">
      <p className="text-sm font-semibold text-[color:var(--page-text)]">{title}</p>
      <p className="mt-1 text-sm leading-6 theme-text-muted">{detail}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const { loading, metrics, charts, sections } = useFetchDashboardOverview();

  if (loading && !metrics.totalApplications && !metrics.careerReadinessScore) {
    return <Spinner fullScreen />;
  }

  const hasWeeklyData = charts.weeklyProgressData.some((point) => point.value > 0);
  const hasSkillGrowth = charts.skillGrowthData.length > 0;
  const hasApplicationBreakdown = charts.applicationChartData.length > 0;
  const hasUpcomingGoals = sections.upcomingGoals.length > 0;
  const hasTasks = sections.todaysTasks.length > 0;

  return (
    <div className="space-y-8 pb-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--page-border)] bg-[var(--page-surface-solid)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary-600 shadow-sm">
          <Sparkles size={12} className="text-primary-600" />
          Dashboard
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--page-text)] sm:text-4xl">
          Welcome back, {user?.name?.split(" ")[0] || "there"}
        </h1>
        <p className="max-w-3xl text-base leading-7 theme-text-muted">
          Your career command center is tracking readiness, applications, learning momentum, and the next actions that move you closer to an offer.
        </p>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}>
          <DashboardCard subtitle="Career readiness score" title="Overall momentum this week" action={<div className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-slate-800 dark:text-violet-300">{metrics.totalApplications || 0} tracked applications</div>}>
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.08))] p-5 dark:bg-slate-800/70">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium theme-text-muted">Career Readiness Score</p>
                    <p className="mt-2 text-5xl font-semibold tracking-tight text-[color:var(--page-text)]">{metrics.careerReadinessScore ?? "—"}</p>
                  </div>
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-inset ring-indigo-100 dark:bg-slate-700 dark:ring-slate-600">
                    <TrendingUp size={24} className="text-primary-600 dark:text-violet-300" />
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 theme-text-muted">
                  {metrics.careerReadinessScore !== null
                    ? "Your resume, ATS fit, roadmap, and coding progress are aligned using real data."
                    : "No career readiness data available yet."}
                </p>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/70 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-600 via-violet-600 to-cyan-500"
                    style={{ width: `${metrics.careerReadinessScore ?? 0}%` }}
                  />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <MetricCard title="Resume Score" value={metrics.resumeScore} loading={loading} emptyLabel="No data" accent="from-primary-600 to-violet-600" />
                  <MetricCard title="ATS Score" value={metrics.atsScore} loading={loading} emptyLabel="No data" accent="from-cyan-500 to-blue-600" />
                  <MetricCard title="Coding Score" value={metrics.codingScore} loading={loading} emptyLabel="No data" accent="from-emerald-500 to-teal-500" />
                  <MetricCard title="Roadmap" value={metrics.roadmapProgress} loading={loading} emptyLabel="No data" accent="from-amber-500 to-orange-500" />
                </div>
              </div>

              <div className="grid gap-4">
                <MetricCard
                  icon={Flame}
                  title="Daily Streak"
                  value={metrics.dailyStreak ? `${metrics.dailyStreak} days` : null}
                  loading={loading}
                  emptyLabel="No streak yet"
                  description="Consistency is calculated from real prep activity over time."
                  accent="from-amber-500 to-orange-500"
                  footer="Consistency compounds"
                />

                <DashboardCard subtitle="Today's tasks" title="Focus list for today">
                  <div className="space-y-3">
                    {hasTasks ? (
                      sections.todaysTasks.map((task) => <TaskItem key={task.title} icon={task.icon} title={task.title} detail={task.detail} />)
                    ) : (
                      <EmptyState title="No tasks available" description="Tasks will appear here when the dashboard has live resume, roadmap, job, or interview data." />
                    )}
                  </div>
                </DashboardCard>
              </div>
            </div>
          </DashboardCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-1">
            <MetricCard
              icon={BrainCircuit}
              title="Resume Score"
              value={metrics.resumeScore}
              loading={loading}
              emptyLabel="No data"
              description={metrics.latestResume ? `Latest analysis for ${metrics.latestResume.targetRole || "your target role"}.` : "Upload a resume to generate your first score."}
              accent="from-primary-600 to-violet-600"
            />
            <MetricCard
              icon={BadgeCheck}
              title="ATS Score"
              value={metrics.atsScore}
              loading={loading}
              emptyLabel="No data"
              description="Track how well your resume matches the job description and keyword requirements."
              accent="from-cyan-500 to-blue-600"
            />
            <MetricCard
              icon={Activity}
              title="Coding Score"
              value={metrics.codingScore}
              loading={loading}
              emptyLabel="No data"
              description={metrics.latestInterview ? "Calculated from your interview performance." : "No interview score available yet."}
              accent="from-emerald-500 to-teal-500"
            />
          </div>
        </motion.div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={LayoutDashboard} title="Applications" value={metrics.totalApplications} loading={loading} emptyLabel="0" description="Tracked across all statuses" accent="from-primary-600 to-violet-600" />
        <MetricCard icon={TrendingUp} title="Roadmap Progress" value={metrics.roadmapProgress} loading={loading} emptyLabel="No data" description={metrics.latestRoadmap ? `Target role: ${metrics.latestRoadmap.targetRole}` : "No roadmap yet"} accent="from-sky-500 to-cyan-500" />
        <MetricCard icon={Clock3} title="Weekly Progress" value={charts.weeklyProgressData.at(-1)?.value ?? null} loading={loading} emptyLabel="No data" description="Current momentum compared to the start of the week" accent="from-amber-500 to-orange-500" />
        <MetricCard icon={CheckCircle2} title="Milestones Done" value={`${metrics.completedMilestones}/${metrics.totalMilestones || 0}`} loading={loading} emptyLabel="0/0" description="Completed roadmap milestones" accent="from-emerald-500 to-green-500" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}>
          <DashboardCard subtitle="Weekly progress" title="Prep momentum over the last 7 days">
            {hasWeeklyData ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={charts.weeklyProgressData}>
                    <defs>
                      <linearGradient id="weeklyProgressFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.28} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.03} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--page-border)" vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "var(--page-text-soft)", fontSize: 12 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--page-text-soft)", fontSize: 12 }} domain={[0, "dataMax + 1"]} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Area type="monotone" dataKey="value" stroke="#6366f1" fill="url(#weeklyProgressFill)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState title="No weekly progress data" description="Your weekly activity chart will appear after real activity is available." />
            )}
          </DashboardCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}>
          <DashboardCard subtitle="Skill growth" title="Where your prep is improving most">
            {hasSkillGrowth ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.skillGrowthData} barSize={26}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--page-border)" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "var(--page-text-soft)", fontSize: 12 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--page-text-soft)", fontSize: 12 }} domain={[0, 100]} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                      {charts.skillGrowthData.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState title="No skill growth data" description="Skill growth will appear once resume, roadmap, or interview scores are synced." />
            )}
          </DashboardCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}>
          <DashboardCard subtitle="Score breakdown" title="Readiness mix across key areas">
            {hasApplicationBreakdown ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.applicationChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={64}
                      outerRadius={92}
                      paddingAngle={4}
                    >
                      {charts.applicationChartData.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Legend verticalAlign="bottom" height={24} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState title="No application breakdown data" description="The chart will populate when job status counts are returned by the API." />
            )}
          </DashboardCard>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}>
          <DashboardCard subtitle="Recent activities" title="Latest progress on your career journey">
            <div className="space-y-3">
              {sections.recentActivities.length > 0 ? (
                sections.recentActivities.map((activity) => <TaskItem key={activity.title} icon={activity.icon || Activity} title={activity.title} detail={activity.detail} />)
              ) : (
                <EmptyState title="No recent activity" description="Recent activity will show up once you start using PrepAI with real data." />
              )}
            </div>
          </DashboardCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}>
          <DashboardCard subtitle="Upcoming goals" title="What to focus on next">
            <div className="space-y-3">
              {hasUpcomingGoals ? (
                sections.upcomingGoals.map((goal) => (
                  <div key={goal.title} className="rounded-2xl border border-[color:var(--page-border)] bg-[var(--page-surface-soft)] p-4 dark:bg-slate-800/70">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[color:var(--page-text)]">{goal.title}</p>
                      <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-slate-700 dark:text-violet-300">
                        {goal.tag}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 theme-text-muted">{goal.detail}</p>
                  </div>
                ))
              ) : (
                <EmptyState title="No upcoming goals" description="Roadmap milestones will show here once they are created in the backend." />
              )}
            </div>
          </DashboardCard>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
