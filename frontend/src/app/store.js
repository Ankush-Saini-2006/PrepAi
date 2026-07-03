import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import resumeReducer from "../features/resume/resumeSlice";
import interviewReducer from "../features/interview/interviewSlice";
import jobReducer from "../features/jobs/jobSlice";
import roadmapReducer from "../features/roadmap/roadmapSlice";
import resumeJobMatchReducer from "../redux/slices/resumeJobMatchSlice";
import chatReducer from "../redux/slices/chatSlice";
import taskReducer from "../redux/slices/taskSlice";
import codingProfileReducer from "../redux/slices/codingProfileSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resume: resumeReducer,
    interview: interviewReducer,
    jobs: jobReducer,
    roadmap: roadmapReducer,
    resumeJobMatch: resumeJobMatchReducer,
    chat: chatReducer,
    tasks: taskReducer,
    codingProfiles: codingProfileReducer,
  },
  devTools: import.meta.env.MODE !== "production",
});

export default store;
