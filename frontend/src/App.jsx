import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCurrentUser, refreshAccessToken } from "./features/auth/authSlice";
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
import MockInterviewPage from "./pages/interview/MockInterviewPage";
import JobTrackerPage from "./pages/jobs/JobTrackerPage";
import RoadmapPage from "./pages/roadmap/RoadmapPage";
import ProfilePage from "./pages/profile/ProfilePage";

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
        <Route path="interview" element={<MockInterviewPage />} />
        <Route path="jobs" element={<JobTrackerPage />} />
        <Route path="roadmap" element={<RoadmapPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
