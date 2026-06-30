import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import { fetchJobStats } from "../../features/jobs/jobSlice";
import { fetchResumes } from "../../features/resume/resumeSlice";
import { fetchRoadmaps } from "../../features/roadmap/roadmapSlice";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4"];

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { stats } = useSelector((state) => state.jobs);
  const { resumes } = useSelector((state) => state.resume);
  const { roadmaps } = useSelector((state) => state.roadmap);

  useEffect(() => {
    dispatch(fetchJobStats());
    dispatch(fetchResumes());
    dispatch(fetchRoadmaps());
  }, [dispatch]);

  const chartData = Object.entries(stats.stats || {}).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  const latestResume = resumes[0];
  const latestRoadmap = roadmaps[0];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(" ")[0] || "there"} 👋
        </h1>
        <p className="text-sm text-gray-500">Here&apos;s your career prep overview.</p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="card">
          <p className="text-sm text-gray-500">Total Applications</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total || 0}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Latest ATS Score</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {latestResume?.atsScore ? `${latestResume.atsScore}%` : "—"}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Roadmap Progress</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {latestRoadmap?.progress ? `${latestRoadmap.progress}%` : "0%"}
          </p>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-4 font-semibold text-gray-900">Application Status Breakdown</h3>
        {chartData.length === 0 ? (
          <p className="text-sm text-gray-500">
            No job applications yet. Add some in the Job Tracker.
          </p>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
