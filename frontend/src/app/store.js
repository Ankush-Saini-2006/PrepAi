import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import resumeReducer from "../features/resume/resumeSlice";
import interviewReducer from "../features/interview/interviewSlice";
import jobReducer from "../features/jobs/jobSlice";
import roadmapReducer from "../features/roadmap/roadmapSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resume: resumeReducer,
    interview: interviewReducer,
    jobs: jobReducer,
    roadmap: roadmapReducer,
  },
  devTools: import.meta.env.MODE !== "production",
});

export default store;
