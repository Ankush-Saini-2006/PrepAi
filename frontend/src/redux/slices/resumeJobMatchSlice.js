import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  analyzeResumeJobMatch as analyzeResumeJobMatchApi,
  deleteResumeJobMatch as deleteResumeJobMatchApi,
  getResumeJobMatchById,
  getResumeJobMatchHistory,
} from "../../services/resumeJobMatchApi";

export const analyzeResumeJobMatch = createAsyncThunk(
  "resumeJobMatch/analyze",
  async (payload, { rejectWithValue }) => {
    try {
      return await analyzeResumeJobMatchApi(payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Resume job match analysis failed");
    }
  }
);

export const fetchResumeJobMatchHistory = createAsyncThunk(
  "resumeJobMatch/fetchHistory",
  async (_, { rejectWithValue }) => {
    try {
      return await getResumeJobMatchHistory();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch match history");
    }
  }
);

export const fetchResumeJobMatchById = createAsyncThunk(
  "resumeJobMatch/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await getResumeJobMatchById(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch match analysis");
    }
  }
);

export const deleteResumeJobMatch = createAsyncThunk(
  "resumeJobMatch/delete",
  async (id, { rejectWithValue }) => {
    try {
      return await deleteResumeJobMatchApi(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete match analysis");
    }
  }
);

const resumeJobMatchSlice = createSlice({
  name: "resumeJobMatch",
  initialState: {
    matches: [],
    activeMatch: null,
    loading: false,
    analyzing: false,
    deleting: false,
    error: null,
  },
  reducers: {
    clearActiveMatch: (state) => {
      state.activeMatch = null;
    },
    setActiveMatch: (state, action) => {
      state.activeMatch = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeResumeJobMatch.pending, (state) => {
        state.analyzing = true;
        state.error = null;
      })
      .addCase(analyzeResumeJobMatch.fulfilled, (state, action) => {
        state.analyzing = false;
        state.activeMatch = action.payload;
        state.matches = [
          action.payload,
          ...state.matches.filter((match) => match._id !== action.payload._id),
        ];
      })
      .addCase(analyzeResumeJobMatch.rejected, (state, action) => {
        state.analyzing = false;
        state.error = action.payload;
      })
      .addCase(fetchResumeJobMatchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResumeJobMatchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload;
        if (!state.activeMatch && action.payload.length > 0) {
          state.activeMatch = action.payload[0];
        }
      })
      .addCase(fetchResumeJobMatchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchResumeJobMatchById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchResumeJobMatchById.fulfilled, (state, action) => {
        state.loading = false;
        state.activeMatch = action.payload;
        state.matches = state.matches.map((match) =>
          match._id === action.payload._id ? action.payload : match
        );
      })
      .addCase(fetchResumeJobMatchById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteResumeJobMatch.pending, (state) => {
        state.deleting = true;
      })
      .addCase(deleteResumeJobMatch.fulfilled, (state, action) => {
        state.deleting = false;
        state.matches = state.matches.filter((match) => match._id !== action.payload);
        if (state.activeMatch?._id === action.payload) {
          state.activeMatch = state.matches[0] || null;
        }
      })
      .addCase(deleteResumeJobMatch.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

export const { clearActiveMatch, setActiveMatch } = resumeJobMatchSlice.actions;

export default resumeJobMatchSlice.reducer;
