import axiosInstance from "../utils/axiosInstance";

export const analyzeResumeJobMatch = async ({ file, jobDescription }) => {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("jobDescription", jobDescription);

  const { data } = await axiosInstance.post("/resume-job-match/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data.data.match;
};

export const getResumeJobMatchHistory = async () => {
  const { data } = await axiosInstance.get("/resume-job-match/history");
  return data.data.matches;
};

export const getResumeJobMatchById = async (id) => {
  const { data } = await axiosInstance.get(`/resume-job-match/${id}`);
  return data.data.match;
};

export const deleteResumeJobMatch = async (id) => {
  await axiosInstance.delete(`/resume-job-match/${id}`);
  return id;
};
