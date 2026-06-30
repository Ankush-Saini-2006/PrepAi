import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const generateRoadmap = createAsyncThunk(
  "roadmap/generate",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/roadmaps/generate", payload);
      return data.data.roadmap;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to generate roadmap");
    }
  }
);

export const fetchRoadmaps = createAsyncThunk(
  "roadmap/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/roadmaps");
      return data.data.roadmaps;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch roadmaps");
    }
  }
);

export const toggleMilestone = createAsyncThunk(
  "roadmap/toggleMilestone",
  async ({ roadmapId, index }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/roadmaps/${roadmapId}/milestones/${index}`);
      return data.data.roadmap;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update milestone");
    }
  }
);

export const deleteRoadmap = createAsyncThunk(
  "roadmap/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/roadmaps/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete roadmap");
    }
  }
);

const roadmapSlice = createSlice({
  name: "roadmap",
  initialState: {
    roadmaps: [],
    activeRoadmap: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(generateRoadmap.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateRoadmap.fulfilled, (state, action) => {
        state.loading = false;
        state.roadmaps.unshift(action.payload);
        state.activeRoadmap = action.payload;
      })
      .addCase(generateRoadmap.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRoadmaps.fulfilled, (state, action) => {
        state.roadmaps = action.payload;
      })
      .addCase(toggleMilestone.fulfilled, (state, action) => {
        state.activeRoadmap = action.payload;
        state.roadmaps = state.roadmaps.map((r) =>
          r._id === action.payload._id ? action.payload : r
        );
      })
      .addCase(deleteRoadmap.fulfilled, (state, action) => {
        state.roadmaps = state.roadmaps.filter((r) => r._id !== action.payload);
      });
  },
});

export default roadmapSlice.reducer;
