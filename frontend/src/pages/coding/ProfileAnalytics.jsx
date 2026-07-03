import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import DashboardCard from "../../components/dashboard/DashboardCard";
import DifficultyChart from "../../components/CodingProfiles/DifficultyChart";
import TopicChart from "../../components/CodingProfiles/TopicChart";
import ConsistencyHeatmap from "../../components/CodingProfiles/ConsistencyHeatmap";
import LanguageCard from "../../components/CodingProfiles/LanguageCard";
import { fetchCurrentCodingProfile } from "../../redux/slices/codingProfileSlice";

const ProfileAnalytics = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.codingProfiles);

  useEffect(() => {
    dispatch(fetchCurrentCodingProfile());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600 dark:text-violet-300">Analytics</p>
        <h1 className="mt-2 text-2xl font-bold text-[color:var(--page-text)]">Charts and activity trends</h1>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardCard subtitle="LeetCode" title="Difficulty distribution"><DifficultyChart leetcode={profile?.leetcode} /></DashboardCard>
        <DashboardCard subtitle="Topics" title="Problem topics"><TopicChart data={profile?.leetcode?.solvedByTopic || profile?.codeforces?.problemTags || []} /></DashboardCard>
        <DashboardCard subtitle="Contest Rating" title="Codeforces trend">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={profile?.codeforces?.contestHistory || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--page-border)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "var(--page-text-soft)", fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "var(--page-text-soft)", fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--page-surface-solid)", border: "1px solid var(--page-border)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="rating" stroke="#6366f1" fill="#6366f133" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
        <DashboardCard subtitle="GitHub" title="Language distribution">
          <div className="grid gap-3 sm:grid-cols-2">
            {(profile?.github?.languagesUsed || []).map((item) => <LanguageCard key={item.name} item={item} />)}
          </div>
        </DashboardCard>
        <DashboardCard subtitle="Consistency" title="Activity heatmap"><ConsistencyHeatmap data={[...(profile?.leetcode?.recentActivity || []), ...(profile?.github?.contributionGraph || [])]} /></DashboardCard>
        <DashboardCard subtitle="Codeforces" title="Problem tags"><TopicChart data={profile?.codeforces?.problemTags || []} /></DashboardCard>
      </div>
    </div>
  );
};

export default ProfileAnalytics;
