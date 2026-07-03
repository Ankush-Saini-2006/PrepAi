import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import DashboardCard from "../../components/dashboard/DashboardCard";
import RecommendationCard from "../../components/CodingProfiles/RecommendationCard";
import RepositoryCard from "../../components/CodingProfiles/RepositoryCard";
import { fetchCodingAnalysisById, fetchCodingComparison, fetchCurrentCodingProfile } from "../../redux/slices/codingProfileSlice";

const CodingInsights = () => {
  const dispatch = useDispatch();
  const [params] = useSearchParams();
  const { profile, analysis, comparison } = useSelector((state) => state.codingProfiles);

  useEffect(() => {
    const id = params.get("id");
    if (id) dispatch(fetchCodingAnalysisById(id));
    else dispatch(fetchCurrentCodingProfile());
    dispatch(fetchCodingComparison());
  }, [dispatch, params]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600 dark:text-violet-300">AI Insights</p>
        <h1 className="mt-2 text-2xl font-bold text-[color:var(--page-text)]">Gemini-powered coding analysis</h1>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <RecommendationCard title="Strong Topics" items={analysis?.strongTopics} />
        <RecommendationCard title="Weak Topics" items={analysis?.weakTopics} />
        <RecommendationCard title="Recommended Topics" items={analysis?.recommendedTopics} />
        <RecommendationCard title="Learning Suggestions" items={analysis?.learningSuggestions} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <DashboardCard subtitle="Patterns" title="Coding pattern"><p className="text-sm leading-6 theme-text-muted">{analysis?.codingPattern || "No analysis yet."}</p></DashboardCard>
        <DashboardCard subtitle="Consistency" title="Consistency analysis"><p className="text-sm leading-6 theme-text-muted">{analysis?.consistencyAnalysis || "No analysis yet."}</p></DashboardCard>
        <DashboardCard subtitle="Readiness" title="Interview readiness"><p className="text-sm leading-6 theme-text-muted">{analysis?.interviewReadiness || "No analysis yet."}</p></DashboardCard>
      </div>
      <DashboardCard subtitle="Compare" title="Previous analysis comparison">
        <p className="text-sm theme-text-muted">
          Current readiness: {comparison?.current?.placementReadinessScore ?? analysis?.placementReadinessScore ?? 0}%.
          Previous readiness: {comparison?.previous?.placementReadinessScore ?? "No previous analysis"}.
        </p>
      </DashboardCard>
      <DashboardCard subtitle="Projects" title="Pinned and suggested projects">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {(profile?.github?.pinnedProjects || []).map((repo) => <RepositoryCard key={repo.name} repo={repo} />)}
        </div>
      </DashboardCard>
    </div>
  );
};

export default CodingInsights;
