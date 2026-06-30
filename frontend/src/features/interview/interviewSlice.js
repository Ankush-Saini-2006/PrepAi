import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const startInterview = createAsyncThunk(
  "interview/start",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/interviews/start", payload);
      return data.data.interview;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to start interview");
    }
  }
);

export const submitAnswer = createAsyncThunk(
  "interview/submitAnswer",
  async ({ interviewId, questionIndex, answer }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(`/interviews/${interviewId}/answer`, {
        questionIndex,
        answer,
      });
      return { questionIndex, question: data.data.question };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to submit answer");
    }
  }
);

export const completeInterview = createAsyncThunk(
  "interview/complete",
  async (interviewId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/interviews/${interviewId}/complete`);
      return data.data.interview;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to complete interview");
    }
  }
);

export const fetchInterviews = createAsyncThunk(
  "interview/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/interviews");
      return data.data.interviews;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch interviews");
    }
  }
);

const interviewSlice = createSlice({
  name: "interview",
  initialState: {
    interviews: [],
    activeInterview: null,
    loading: false,
    submitting: false,
    error: null,
  },
  reducers: {
    resetActiveInterview: (state) => {
      state.activeInterview = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startInterview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startInterview.fulfilled, (state, action) => {
        state.loading = false;
        state.activeInterview = action.payload;
      })
      .addCase(startInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitAnswer.pending, (state) => {
        state.submitting = true;
      })
      .addCase(submitAnswer.fulfilled, (state, action) => {
        state.submitting = false;
        if (state.activeInterview) {
          state.activeInterview.questions[action.payload.questionIndex] =
            action.payload.question;
        }
      })
      .addCase(submitAnswer.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })
      .addCase(completeInterview.fulfilled, (state, action) => {
        state.activeInterview = action.payload;
        state.interviews.unshift(action.payload);
      })
      .addCase(fetchInterviews.fulfilled, (state, action) => {
        state.interviews = action.payload;
      });
  },
});

export const { resetActiveInterview } = interviewSlice.actions;
export default interviewSlice.reducer;
