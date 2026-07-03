import axiosInstance from "../utils/axiosInstance";

export const connectCodingProfiles = async (payload) => {
  const { data } = await axiosInstance.post("/coding-profiles/connect", payload);
  return data.data;
};

export const refreshCodingProfiles = async () => {
  const { data } = await axiosInstance.post("/coding-profiles/refresh");
  return data.data;
};

export const getCurrentCodingProfile = async () => {
  const { data } = await axiosInstance.get("/coding-profiles");
  return data.data;
};

export const getCodingHistory = async () => {
  const { data } = await axiosInstance.get("/coding-profiles/history");
  return data.data.analyses;
};

export const getCodingAnalysisById = async (id) => {
  const { data } = await axiosInstance.get(`/coding-profiles/analysis/${id}`);
  return data.data.analysis;
};

export const compareCodingAnalyses = async () => {
  const { data } = await axiosInstance.get("/coding-profiles/compare");
  return data.data;
};

export const exportCodingReport = async (id) => {
  const { data } = await axiosInstance.get(`/coding-profiles/analysis/${id}/export`);
  return data.data.report;
};
