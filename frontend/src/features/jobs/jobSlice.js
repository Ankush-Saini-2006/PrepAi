import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const fetchJobs = createAsyncThunk("jobs/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get("/jobs");
    return data.data.jobs;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch jobs");
  }
});

export const createJob = createAsyncThunk(
  "jobs/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/jobs", payload);
      return data.data.job;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create job");
    }
  }
);

export const updateJob = createAsyncThunk(
  "jobs/update",
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/jobs/${id}`, payload);
      return data.data.job;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update job");
    }
  }
);

export const deleteJob = createAsyncThunk(
  "jobs/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/jobs/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete job");
    }
  }
);

export const fetchJobStats = createAsyncThunk(
  "jobs/stats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/jobs/stats");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch stats");
    }
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    stats: { stats: {}, total: 0 },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.jobs.unshift(action.payload);
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.map((j) => (j._id === action.payload._id ? action.payload : j));
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((j) => j._id !== action.payload);
      })
      .addCase(fetchJobStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export default jobSlice.reducer;
