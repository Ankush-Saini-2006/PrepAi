import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // required to send/receive httpOnly refresh-token cookie
  headers: { "Content-Type": "application/json" },
});

// ─── Queue for requests that arrive while a token refresh is in flight ──────
let isRefreshing = false;
let failedQueue = [];

const shouldSkipRefresh = (url = "") => {
  const authRefreshBlockedPaths = [
    "/auth/login",
    "/auth/register",
    "/auth/refresh-token",
    "/auth/logout",
    "/auth/logout-all",
    "/auth/forgot-password",
    "/auth/reset-password",
  ];

  return authRefreshBlockedPaths.some((path) => url.includes(path));
};

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ─── Request interceptor: attach access token ───────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("prepai_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor: silent refresh on 401 ────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) {
      return Promise.reject(error);
    }

    const skipRefresh = shouldSkipRefresh(originalRequest.url);
    const is401 = error.response?.status === 401;

    // Don't retry auth-route 401s or already-retried requests
    if (!is401 || skipRefresh || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue the request until refresh resolves
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(
        `${BASE_URL}/auth/refresh-token`,
        {},
        { withCredentials: true }
      );
      const newToken = data?.data?.accessToken;
      if (!newToken) {
        throw new Error("Refresh response did not include an access token");
      }
      localStorage.setItem("prepai_token", newToken);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`;
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      // Also update Redux store token if available
      const event = new CustomEvent("prepai:token-refreshed", { detail: newToken });
      window.dispatchEvent(event);

      processQueue(null, newToken);
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      localStorage.removeItem("prepai_token");

      // Signal to the app that the session is gone
      window.dispatchEvent(new CustomEvent("prepai:session-expired"));

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
