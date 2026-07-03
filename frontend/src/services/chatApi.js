import axiosInstance from "../utils/axiosInstance";

export const sendChatMessage = async (payload) => {
  const { data } = await axiosInstance.post("/chat", payload);
  return data.data.chat;
};

export const getChatHistory = async () => {
  const { data } = await axiosInstance.get("/chat/history");
  return data.data.chats;
};

export const getChatById = async (id) => {
  const { data } = await axiosInstance.get(`/chat/${id}`);
  return data.data.chat;
};

export const deleteChat = async (id) => {
  await axiosInstance.delete(`/chat/${id}`);
  return id;
};

export const clearChatHistory = async () => {
  await axiosInstance.delete("/chat/history");
  return true;
};
