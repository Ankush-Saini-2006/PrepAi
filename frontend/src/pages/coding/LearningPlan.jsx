import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import RecommendationCard from "../../components/CodingProfiles/RecommendationCard";
import RoadmapCard from "../../components/CodingProfiles/RoadmapCard";
import DashboardCard from "../../components/dashboard/DashboardCard";
import { fetchCurrentCodingProfile } from "../../redux/slices/codingProfileSlice";

const LearningPlan = () => {
  const dispatch = useDispatch();
  const { analysis } = useSelector((state) => state.codingProfiles);

  useEffect(() => {
    dispatch(fetchCurrentCodingProfile());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600 dark:text-violet-300">Learning Plan</p>
        <h1 className="mt-2 text-2xl font-bold text-[color:var(--page-text)]">Personalized roadmap</h1>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <RoadmapCard title="Weekly Roadmap" steps={analysis?.personalizedWeeklyRoadmap} />
        <RoadmapCard title="Monthly Roadmap" steps={analysis?.monthlyRoadmap} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <RecommendationCard title="Project Suggestions" items={analysis?.projectSuggestions} />
        <RecommendationCard title="Recommended Topics" items={analysis?.recommendedTopics} />
      </div>
      <DashboardCard subtitle="Placement" title="Company and placement readiness">
        <p className="text-sm leading-6 theme-text-muted">{analysis?.companyReadiness || "Connect profiles to generate company readiness insights."}</p>
        <p className="mt-3 text-sm leading-6 theme-text-muted">{analysis?.placementReadinessScore ? `Placement readiness score: ${analysis.placementReadinessScore}%` : "No placement readiness score yet."}</p>
      </DashboardCard>
    </div>
  );
};

export default LearningPlan;
