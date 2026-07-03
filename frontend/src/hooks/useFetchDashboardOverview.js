import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobStats, fetchJobs } from "../features/jobs/jobSlice";
import { fetchResumes } from "../features/resume/resumeSlice";
import { fetchRoadmaps } from "../features/roadmap/roadmapSlice";
import { fetchInterviews } from "../features/interview/interviewSlice";
import { fetchTaskStats, fetchTasks } from "../redux/slices/taskSlice";
import { fetchCurrentCodingProfile } from "../redux/slices/codingProfileSlice";

const toDateKey = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
};

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const formatWeekLabel = (date) =>
  new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(date);

const useFetchDashboardOverview = () => {
  const dispatch = useDispatch();
  const jobsState = useSelector((state) => state.jobs);
  const resumeState = useSelector((state) => state.resume);
  const roadmapState = useSelector((state) => state.roadmap);
  const interviewState = useSelector((state) => state.interview);
  const taskState = useSelector((state) => state.tasks);
  const codingState = useSelector((state) => state.codingProfiles);

  useEffect(() => {
    dispatch(fetchJobStats());
    dispatch(fetchJobs());
    dispatch(fetchResumes());
    dispatch(fetchRoadmaps());
    dispatch(fetchInterviews());
    dispatch(fetchTasks({ view: "today" }));
    dispatch(fetchTaskStats());
    dispatch(fetchCurrentCodingProfile());
  }, [dispatch]);

  const loading =
    jobsState.loading || resumeState.loading || roadmapState.loading || interviewState.loading || taskState.loading || codingState.loading;

  const latestResume = resumeState.resumes[0] || null;
  const latestRoadmap = roadmapState.roadmaps[0] || null;
  const latestInterview = interviewState.interviews.find((interview) => interview.status === "completed") ||
    interviewState.interviews[0] || null;
  const latestJob = jobsState.jobs[0] || null;

  const resumeScore = latestResume?.atsScore ?? null;
  const atsScore = latestResume?.atsScore ?? null;
  const codingScore = codingState.profile?.scores?.overallCodingScore ?? latestInterview?.overallScore ?? null;
  const roadmapProgress = latestRoadmap?.progress ?? null;

  const scoreValues = [resumeScore, atsScore, codingScore, roadmapProgress].filter(
    (value) => typeof value === "number"
  );
  const careerReadinessScore = scoreValues.length
    ? Math.round(scoreValues.reduce((sum, value) => sum + value, 0) / scoreValues.length)
    : null;

  const activityEvents = useMemo(() => {
    const items = [];

    jobsState.jobs.forEach((job) => {
      if (job.createdAt || job.appliedDate) {
        items.push({
          date: new Date(job.createdAt || job.appliedDate),
          type: "job",
        });
      }
    });

    resumeState.resumes.forEach((resume) => {
      if (resume.analyzedAt || resume.updatedAt || resume.createdAt) {
        items.push({
          date: new Date(resume.analyzedAt || resume.updatedAt || resume.createdAt),
          type: "resume",
        });
      }
    });

    roadmapState.roadmaps.forEach((roadmap) => {
      if (roadmap.updatedAt || roadmap.createdAt) {
        items.push({
          date: new Date(roadmap.updatedAt || roadmap.createdAt),
          type: "roadmap",
        });
      }
    });

    interviewState.interviews.forEach((interview) => {
      if (interview.updatedAt || interview.createdAt) {
        items.push({
          date: new Date(interview.updatedAt || interview.createdAt),
          type: "interview",
        });
      }
    });

    return items
      .filter((item) => !Number.isNaN(item.date.getTime()))
      .sort((left, right) => right.date.getTime() - left.date.getTime());
  }, [jobsState.jobs, resumeState.resumes, roadmapState.roadmaps, interviewState.interviews]);

  const dailyStreak = useMemo(() => {
    if (activityEvents.length === 0) return null;

    const uniqueDays = new Set(activityEvents.map((item) => toDateKey(item.date)).filter(Boolean));
    const cursor = startOfToday();
    let streak = 0;

    while (uniqueDays.has(toDateKey(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    return streak || null;
  }, [activityEvents]);

  const weeklyProgressData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));
      return date;
    });

    const countsByDay = new Map(days.map((date) => [toDateKey(date), 0]));

    activityEvents.forEach((event) => {
      const key = toDateKey(event.date);
      if (countsByDay.has(key)) {
        countsByDay.set(key, countsByDay.get(key) + 1);
      }
    });

    return days.map((date) => ({
      day: formatWeekLabel(date),
      value: countsByDay.get(toDateKey(date)) || 0,
    }));
  }, [activityEvents]);

  const skillGrowthData = useMemo(() => {
    const consistency = dailyStreak ?? 0;

    return [
      { name: "Resume", value: resumeScore },
      { name: "ATS", value: atsScore },
      { name: "Coding", value: codingScore },
      { name: "Roadmap", value: roadmapProgress },
      { name: "Consistency", value: consistency ? Math.min(consistency * 10, 100) : null },
    ].filter((item) => typeof item.value === "number");
  }, [resumeScore, atsScore, codingScore, roadmapProgress, dailyStreak]);

  const scoreBreakdown = useMemo(
    () =>
      [
        { name: "Resume", value: resumeScore },
        { name: "ATS", value: atsScore },
        { name: "Coding", value: codingScore },
        { name: "Roadmap", value: roadmapProgress },
      ].filter((item) => typeof item.value === "number"),
    [resumeScore, atsScore, codingScore, roadmapProgress]
  );

  const recentActivities = useMemo(() => {
    const list = activityEvents.slice(0, 3).map((event) => {
      if (event.type === "job") {
        const job = jobsState.jobs.find(
          (item) => new Date(item.createdAt || item.appliedDate).getTime() === event.date.getTime()
        );
        return {
          title: job ? `Tracked ${job.role} at ${job.company}` : "Tracked a job application",
          detail: job ? `${job.status} · ${event.date.toLocaleDateString()}` : event.date.toLocaleDateString(),
        };
      }

      if (event.type === "resume") {
        return {
          title: `Resume updated${latestResume?.targetRole ? ` for ${latestResume.targetRole}` : ""}`,
          detail: `${resumeScore ?? "No score"} ATS score · ${event.date.toLocaleDateString()}`,
        };
      }

      if (event.type === "roadmap") {
        return {
          title: `Roadmap refreshed${latestRoadmap?.targetRole ? ` for ${latestRoadmap.targetRole}` : ""}`,
          detail: `${roadmapProgress ?? "No progress"}% progress · ${event.date.toLocaleDateString()}`,
        };
      }

      return {
        title: `Interview ${latestInterview?.status === "completed" ? "completed" : "updated"}`,
        detail: `${codingScore ?? "No score"} score · ${event.date.toLocaleDateString()}`,
      };
    });

    return list.length > 0
      ? list
      : [
          {
            title: "No recent activity",
            detail: "Complete a prep task, upload a resume, or track your first application to populate this section.",
          },
        ];
  }, [activityEvents, jobsState.jobs, latestInterview, latestRoadmap, latestResume, resumeScore, roadmapProgress, codingScore]);

  const upcomingGoals = useMemo(() => {
    const pendingMilestones = latestRoadmap?.milestones?.filter((milestone) => !milestone.isCompleted) || [];

    if (pendingMilestones.length === 0) {
      return [];
    }

    return pendingMilestones.slice(0, 3).map((milestone, index) => ({
      title: milestone.title,
      detail: milestone.description || "Complete this milestone to keep moving forward.",
      tag: `Goal ${index + 1}`,
    }));
  }, [latestRoadmap]);

  const todaysTasks = useMemo(() => {
    const tasks = (taskState.stats?.todaysTasks || taskState.tasks || []).map((task) => ({
      title: task.title,
      detail: `${task.category || "Task"} - ${task.status || "Pending"} - ${task.estimatedStudyMinutes || 0} min`,
    }));

    if (latestResume?.suggestions?.length) {
      tasks.push({
        title: "Review resume suggestions",
        detail: `${latestResume.suggestions.length} improvements ready to review.`,
      });
    }

    if (latestInterview?.status !== "completed") {
      tasks.push({
        title: "Practice one interview",
        detail: "Use your latest interview session to keep the coding score moving.",
      });
    }

    if (latestRoadmap?.milestones?.some((milestone) => !milestone.isCompleted)) {
      tasks.push({
        title: "Complete the next milestone",
        detail: "Focus on the first unfinished roadmap milestone for today.",
      });
    }

    if (jobsState.jobs.length > 0) {
      tasks.push({
        title: "Review active applications",
        detail: "Follow up on recent applications and move one more forward today.",
      });
    }

    return tasks;
  }, [jobsState.jobs.length, latestInterview, latestRoadmap, latestResume, taskState.stats, taskState.tasks]);

  const applicationChartData = useMemo(
    () =>
      Object.entries(jobsState.stats?.stats || {}).map(([status, count]) => ({
        name: status,
        value: count,
      })),
    [jobsState.stats]
  );

  return {
    loading,
    stats: jobsState.stats,
    latestResume,
    latestRoadmap,
    latestInterview,
    latestJob,
    metrics: {
      careerReadinessScore,
      resumeScore,
      atsScore,
      codingScore,
      roadmapProgress,
      dailyStreak,
      totalApplications: jobsState.stats?.total ?? jobsState.jobs.length,
      pendingTasks: taskState.stats?.pendingTasks ?? null,
      taskProgress: taskState.stats?.progress ?? null,
      studyHours: taskState.stats?.studyHours ?? null,
      leetcodeSolved: codingState.profile?.leetcode?.totalSolved ?? null,
      githubActivityScore: codingState.profile?.scores?.githubActivityScore ?? null,
      contestRating: codingState.profile?.codeforces?.contestRating || codingState.profile?.leetcode?.contestRating || null,
      codingRecommendation: codingState.analysis?.recommendedTopics?.[0] || "",
      upcomingTaskDeadline: taskState.stats?.upcomingDeadline ?? null,
      todaysTaskGoal: taskState.stats?.todaysGoal ?? "",
      completedMilestones: latestRoadmap?.milestones?.filter((milestone) => milestone.isCompleted).length || 0,
      totalMilestones: latestRoadmap?.milestones?.length || 0,
    },
    charts: {
      weeklyProgressData,
      skillGrowthData,
      scoreBreakdown,
      applicationChartData,
    },
    sections: {
      recentActivities,
      upcomingGoals,
      todaysTasks,
    },
  };
};

export default useFetchDashboardOverview;
