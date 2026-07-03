import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  compareCodingAnalyses,
  connectCodingProfiles as connectCodingProfilesApi,
  exportCodingReport,
  getCodingAnalysisById,
  getCodingHistory,
  getCurrentCodingProfile,
  refreshCodingProfiles as refreshCodingProfilesApi,
} from "../../services/codingProfileApi";

export const connectCodingProfiles = createAsyncThunk("codingProfiles/connect", async (payload, { rejectWithValue }) => {
  try {
    return await connectCodingProfilesApi(payload);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to connect coding profiles");
  }
});

export const refreshCodingProfiles = createAsyncThunk("codingProfiles/refresh", async (_, { rejectWithValue }) => {
  try {
    return await refreshCodingProfilesApi();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to refresh coding profiles");
  }
});

export const fetchCurrentCodingProfile = createAsyncThunk("codingProfiles/current", async (_, { rejectWithValue }) => {
  try {
    return await getCurrentCodingProfile();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch coding profile");
  }
});

export const fetchCodingHistory = createAsyncThunk("codingProfiles/history", async (_, { rejectWithValue }) => {
  try {
    return await getCodingHistory();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch coding analysis history");
  }
});

export const fetchCodingAnalysisById = createAsyncThunk("codingProfiles/analysis", async (id, { rejectWithValue }) => {
  try {
    return await getCodingAnalysisById(id);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch coding analysis");
  }
});

export const fetchCodingComparison = createAsyncThunk("codingProfiles/compare", async (_, { rejectWithValue }) => {
  try {
    return await compareCodingAnalyses();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to compare analyses");
  }
});

export const exportCodingAnalysis = createAsyncThunk("codingProfiles/export", async (id, { rejectWithValue }) => {
  try {
    return await exportCodingReport(id);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to export analysis");
  }
});

const codingProfileSlice = createSlice({
  name: "codingProfiles",
  initialState: {
    profile: null,
    analysis: null,
    history: [],
    comparison: null,
    exportReport: null,
    loading: false,
    syncing: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(connectCodingProfiles.pending, (state) => {
        state.syncing = true;
        state.error = null;
      })
      .addCase(connectCodingProfiles.fulfilled, (state, action) => {
        state.syncing = false;
        state.profile = action.payload.profile;
        state.analysis = action.payload.analysis;
        state.history = [action.payload.analysis, ...state.history.filter((item) => item._id !== action.payload.analysis._id)];
      })
      .addCase(connectCodingProfiles.rejected, (state, action) => {
        state.syncing = false;
        state.error = action.payload;
      })
      .addCase(refreshCodingProfiles.pending, (state) => {
        state.syncing = true;
      })
      .addCase(refreshCodingProfiles.fulfilled, (state, action) => {
        state.syncing = false;
        state.profile = action.payload.profile;
        state.analysis = action.payload.analysis;
        state.history = [action.payload.analysis, ...state.history.filter((item) => item._id !== action.payload.analysis._id)];
      })
      .addCase(refreshCodingProfiles.rejected, (state, action) => {
        state.syncing = false;
        state.error = action.payload;
      })
      .addCase(fetchCurrentCodingProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentCodingProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.profile;
        state.analysis = action.payload.analysis;
      })
      .addCase(fetchCurrentCodingProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCodingHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      .addCase(fetchCodingAnalysisById.fulfilled, (state, action) => {
        state.analysis = action.payload;
        state.profile = action.payload.codingProfile;
      })
      .addCase(fetchCodingComparison.fulfilled, (state, action) => {
        state.comparison = action.payload;
      })
      .addCase(exportCodingAnalysis.fulfilled, (state, action) => {
        state.exportReport = action.payload;
      });
  },
});

export default codingProfileSlice.reducer;
