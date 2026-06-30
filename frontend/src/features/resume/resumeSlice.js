import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const uploadResume = createAsyncThunk(
  "resume/upload",
  async ({ file, targetRole }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("resume", file);
      if (targetRole) formData.append("targetRole", targetRole);

      const { data } = await axiosInstance.post("/resumes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data.resume;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Upload failed");
    }
  }
);

export const analyzeResume = createAsyncThunk(
  "resume/analyze",
  async (resumeId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(`/resumes/${resumeId}/analyze`);
      return data.data.resume;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Analysis failed");
    }
  }
);

export const fetchResumes = createAsyncThunk(
  "resume/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/resumes");
      return data.data.resumes;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch resumes");
    }
  }
);

export const deleteResume = createAsyncThunk(
  "resume/delete",
  async (resumeId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/resumes/${resumeId}`);
      return resumeId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);

const resumeSlice = createSlice({
  name: "resume",
  initialState: {
    resumes: [],
    activeResume: null,
    loading: false,
    analyzing: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes.unshift(action.payload);
        state.activeResume = action.payload;
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(analyzeResume.pending, (state) => {
        state.analyzing = true;
      })
      .addCase(analyzeResume.fulfilled, (state, action) => {
        state.analyzing = false;
        state.activeResume = action.payload;
        state.resumes = state.resumes.map((r) =>
          r._id === action.payload._id ? action.payload : r
        );
      })
      .addCase(analyzeResume.rejected, (state, action) => {
        state.analyzing = false;
        state.error = action.payload;
      })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.resumes = action.payload;
      })
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.resumes = state.resumes.filter((r) => r._id !== action.payload);
      });
  },
});

export default resumeSlice.reducer;
