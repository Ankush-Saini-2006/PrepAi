import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "./features/auth/authSlice";
import useSessionEvents from "./hooks/useSessionEvents";

import PublicLayout from "./components/layout/PublicLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

// Public pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ResendVerificationPage from "./pages/auth/ResendVerificationPage";
import NotFoundPage from "./pages/NotFoundPage";

// Protected pages
import DashboardPage from "./pages/dashboard/DashboardPage";
import ResumeAnalyzerPage from "./pages/resume/ResumeAnalyzerPage";
import ResumeJobMatch from "./pages/ResumeJobMatch";
import JobTrackerPage from "./pages/jobs/JobTrackerPage";
import RoadmapPage from "./pages/roadmap/RoadmapPage";
import ProfilePage from "./pages/profile/ProfilePage";
import CareerChatbot from "./pages/CareerChatbot";
import TaskDashboard from "./pages/tasks/TaskDashboard";
import TaskCalendar from "./pages/tasks/TaskCalendar";
import TaskDetails from "./pages/tasks/TaskDetails";
import AIPlanner from "./pages/tasks/AIPlanner";
import StudyPlan from "./pages/tasks/StudyPlan";
import CodingProfile from "./pages/coding/CodingProfile";
import ProfileOverview from "./pages/coding/ProfileOverview";
import ProfileAnalytics from "./pages/coding/ProfileAnalytics";
import CodingInsights from "./pages/coding/CodingInsights";
import LearningPlan from "./pages/coding/LearningPlan";

function App() {
  const dispatch = useDispatch();

  // Tie axios token-refresh/session-expired events → Redux
  useSessionEvents();

  useEffect(() => {
    const token = localStorage.getItem("prepai_token");
    if (token) {
      // Try to re-hydrate the user; if the access token is expired the
      // axios interceptor will silently refresh it via the cookie.
      dispatch(fetchCurrentUser()).unwrap().catch(() => {
        // If fetchCurrentUser fails even after refresh, the interceptor
        // will have dispatched "prepai:session-expired" → cleared state.
      });
    }
  }, [dispatch]);

  return (
    <Routes>
      {/* ── Public routes ────────────────────────────────────────────── */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        <Route path="/resend-verification" element={<ResendVerificationPage />} />
      </Route>

      {/* ── Protected dashboard routes ───────────────────────────────── */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="resume" element={<ResumeAnalyzerPage />} />
        <Route path="resume-job-match" element={<ResumeJobMatch />} />
        <Route path="jobs" element={<JobTrackerPage />} />
        <Route path="roadmap" element={<RoadmapPage />} />
        <Route path="career-chatbot" element={<CareerChatbot />} />
        <Route path="tasks" element={<TaskDashboard />} />
        <Route path="tasks/calendar" element={<TaskCalendar />} />
        <Route path="tasks/ai-planner" element={<AIPlanner />} />
        <Route path="tasks/study-plan" element={<StudyPlan />} />
        <Route path="tasks/:id" element={<TaskDetails />} />
        <Route path="coding-profiles" element={<CodingProfile />} />
        <Route path="coding-profiles/overview" element={<ProfileOverview />} />
        <Route path="coding-profiles/analytics" element={<ProfileAnalytics />} />
        <Route path="coding-profiles/insights" element={<CodingInsights />} />
        <Route path="coding-profiles/learning-plan" element={<LearningPlan />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route
        path="/resume-job-match"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ResumeJobMatch />} />
      </Route>

      <Route
        path="/career-chatbot"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CareerChatbot />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
