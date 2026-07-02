import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// ─── Async Thunks ──────────────────────────────────────────────────────────

export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/auth/register", payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/auth/login", payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await axiosInstance.post("/auth/logout");
  } catch (err) {
    // logout should succeed locally even if API fails
  }
});

export const logoutAllDevices = createAsyncThunk(
  "auth/logoutAll",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/logout-all");
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/auth/me");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Session expired");
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/auth/refresh-token");
      return data.data; // { accessToken }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Session expired");
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/auth/verify-email/${token}`);
      return data.data; // { user }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Verification failed");
    }
  }
);

export const resendVerification = createAsyncThunk(
  "auth/resendVerification",
  async (email, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/resend-verification", { email });
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to resend email");
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      await axiosInstance.put(`/auth/reset-password/${token}`, { password });
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Reset failed");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put("/users/profile", payload);
      return data.data; // { user }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Profile update failed");
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (payload, { rejectWithValue }) => {
    try {
      await axiosInstance.put("/users/change-password", payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Password change failed");
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  "auth/uploadAvatar",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const { data } = await axiosInstance.put("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data; // { user }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Avatar upload failed");
    }
  }
);

// ─── Helpers ───────────────────────────────────────────────────────────────

const setAuthState = (state, user, accessToken) => {
  state.user = user;
  state.accessToken = accessToken;
  state.isAuthenticated = true;
  state.loading = false;
  state.error = null;
  if (accessToken) {
    localStorage.setItem("prepai_token", accessToken);
  }
};

const clearAuthState = (state) => {
  state.user = null;
  state.accessToken = null;
  state.isAuthenticated = false;
  state.loading = false;
  localStorage.removeItem("prepai_token");
};

const pendingCase = (state) => {
  state.loading = true;
  state.error = null;
};

const rejectedCase = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

// ─── Slice ─────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: localStorage.getItem("prepai_token") || null,
    isAuthenticated: !!localStorage.getItem("prepai_token"),
    loading: false,
    error: null,
    emailSent: false,
    verificationStatus: null, // 'success' | 'error'
    resetStatus: null,        // 'success' | 'error'
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    clearEmailSent: (state) => { state.emailSent = false; },
    clearStatus: (state) => {
      state.verificationStatus = null;
      state.resetStatus = null;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      if (action.payload) localStorage.setItem("prepai_token", action.payload);
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, pendingCase)
      .addCase(registerUser.fulfilled, (state, action) => {
        setAuthState(state, action.payload.user, action.payload.accessToken);
      })
      .addCase(registerUser.rejected, rejectedCase);

    // Login
    builder
      .addCase(loginUser.pending, pendingCase)
      .addCase(loginUser.fulfilled, (state, action) => {
        setAuthState(state, action.payload.user, action.payload.accessToken);
      })
      .addCase(loginUser.rejected, rejectedCase);

    // Logout
    builder
      .addCase(logoutUser.fulfilled, clearAuthState)
      .addCase(logoutAllDevices.fulfilled, clearAuthState);

    // Me
    builder
      .addCase(fetchCurrentUser.pending, (state) => { state.loading = true; })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        clearAuthState(state);
      });

    // Refresh
    builder
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        localStorage.setItem("prepai_token", action.payload.accessToken);
      })
      .addCase(refreshAccessToken.rejected, clearAuthState);

    // Verify Email
    builder
      .addCase(verifyEmail.pending, pendingCase)
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.verificationStatus = "success";
        if (state.user) state.user.isVerified = true;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.verificationStatus = "error";
        state.error = action.payload;
      });

    // Resend Verification
    builder
      .addCase(resendVerification.pending, pendingCase)
      .addCase(resendVerification.fulfilled, (state) => {
        state.loading = false;
        state.emailSent = true;
      })
      .addCase(resendVerification.rejected, rejectedCase);

    // Forgot Password
    builder
      .addCase(forgotPassword.pending, pendingCase)
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.emailSent = true;
      })
      .addCase(forgotPassword.rejected, rejectedCase);

    // Reset Password
    builder
      .addCase(resetPassword.pending, pendingCase)
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.resetStatus = "success";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.resetStatus = "error";
        state.error = action.payload;
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, pendingCase)
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(updateProfile.rejected, rejectedCase);

    // Change Password
    builder
      .addCase(changePassword.pending, pendingCase)
      .addCase(changePassword.fulfilled, clearAuthState)
      .addCase(changePassword.rejected, rejectedCase);

    // Upload Avatar
    builder
      .addCase(uploadAvatar.pending, (state) => { state.loading = true; })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(uploadAvatar.rejected, rejectedCase);
  },
});

export const { clearError, clearEmailSent, clearStatus, setAccessToken } = authSlice.actions;
export default authSlice.reducer;
