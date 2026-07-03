import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardCard from "../../components/dashboard/DashboardCard";
import MetricCard from "../../components/dashboard/MetricCard";
import ProfileCard from "../../components/CodingProfiles/ProfileCard";
import ContestCard from "../../components/CodingProfiles/ContestCard";
import { fetchCurrentCodingProfile } from "../../redux/slices/codingProfileSlice";

const ProfileOverview = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.codingProfiles);

  useEffect(() => {
    dispatch(fetchCurrentCodingProfile());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600 dark:text-violet-300">Profile Overview</p>
        <h1 className="mt-2 text-2xl font-bold text-[color:var(--page-text)]">Coding performance snapshot</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Overall Coding Score" value={profile?.scores?.overallCodingScore} loading={loading} emptyLabel="0" />
        <MetricCard title="GitHub Activity" value={profile?.scores?.githubActivityScore} loading={loading} emptyLabel="0" />
        <MetricCard title="Project Score" value={profile?.scores?.projectScore} loading={loading} emptyLabel="0" />
        <MetricCard title="Career Readiness" value={profile?.scores?.careerReadinessScore} loading={loading} emptyLabel="0" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <ContestCard title="LeetCode Contest" rating={profile?.leetcode?.contestRating} rank={profile?.leetcode?.contestRanking} />
        <ContestCard title="Codeforces Contest" rating={profile?.codeforces?.contestRating} rank={profile?.codeforces?.currentRank} best={profile?.codeforces?.bestRank} />
        <DashboardCard subtitle="Repository Activity" title={`${profile?.github?.repositories || 0} repositories`}>
          <p className="text-sm theme-text-muted">{profile?.github?.stars || 0} stars, {profile?.github?.forks || 0} forks, {profile?.github?.followers || 0} followers.</p>
        </DashboardCard>
      </div>
      <ProfileCard platform="leetcode" username={profile?.usernames?.leetcode} stats={[
        { label: "Easy", value: profile?.leetcode?.easySolved },
        { label: "Medium", value: profile?.leetcode?.mediumSolved },
        { label: "Hard", value: profile?.leetcode?.hardSolved },
        { label: "Acceptance", value: `${profile?.leetcode?.acceptanceRate || 0}%` },
      ]} />
    </div>
  );
};

export default ProfileOverview;
