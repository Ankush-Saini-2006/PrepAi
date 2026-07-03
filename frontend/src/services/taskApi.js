import axiosInstance from "../utils/axiosInstance";

export const getTasks = async (params = {}) => {
  const { data } = await axiosInstance.get("/tasks", { params });
  return data.data.tasks;
};

export const getTaskById = async (id) => {
  const { data } = await axiosInstance.get(`/tasks/${id}`);
  return data.data.task;
};

export const createTask = async (payload) => {
  const { data } = await axiosInstance.post("/tasks", payload);
  return data.data.task;
};

export const updateTask = async ({ id, ...payload }) => {
  const { data } = await axiosInstance.put(`/tasks/${id}`, payload);
  return data.data.task;
};

export const completeTask = async ({ id, actualStudyMinutes }) => {
  const { data } = await axiosInstance.patch(`/tasks/${id}/complete`, { actualStudyMinutes });
  return data.data.task;
};

export const deleteTask = async (id) => {
  await axiosInstance.delete(`/tasks/${id}`);
  return id;
};

export const getTaskStats = async () => {
  const { data } = await axiosInstance.get("/tasks/stats");
  return data.data.stats;
};

export const getTaskProgress = async () => {
  const { data } = await axiosInstance.get("/tasks/progress");
  return data.data;
};

export const generateStudyPlan = async (payload) => {
  const { data } = await axiosInstance.post("/study-plans/generate", payload);
  return data.data;
};

export const getStudyPlans = async () => {
  const { data } = await axiosInstance.get("/study-plans");
  return data.data.plans;
};

export const getStudyPlanById = async (id) => {
  const { data } = await axiosInstance.get(`/study-plans/${id}`);
  return data.data.plan;
};

export const deleteStudyPlan = async (id) => {
  await axiosInstance.delete(`/study-plans/${id}`);
  return id;
};
