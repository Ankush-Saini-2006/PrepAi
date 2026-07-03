import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  clearChatHistory as clearChatHistoryApi,
  deleteChat as deleteChatApi,
  getChatById,
  getChatHistory,
  sendChatMessage as sendChatMessageApi,
} from "../../services/chatApi";

export const sendChatMessage = createAsyncThunk(
  "chat/sendMessage",
  async (payload, { rejectWithValue }) => {
    try {
      return await sendChatMessageApi(payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to generate chat response");
    }
  }
);

export const fetchChatHistory = createAsyncThunk(
  "chat/fetchHistory",
  async (_, { rejectWithValue }) => {
    try {
      return await getChatHistory();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch chat history");
    }
  }
);

export const fetchChatById = createAsyncThunk(
  "chat/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await getChatById(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch chat");
    }
  }
);

export const deleteChat = createAsyncThunk(
  "chat/delete",
  async (id, { rejectWithValue }) => {
    try {
      return await deleteChatApi(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete chat");
    }
  }
);

export const clearChatHistory = createAsyncThunk(
  "chat/clearHistory",
  async (_, { rejectWithValue }) => {
    try {
      return await clearChatHistoryApi();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to clear chat history");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    activeChat: null,
    loading: false,
    sending: false,
    deleting: false,
    error: null,
  },
  reducers: {
    startNewChat: (state) => {
      state.activeChat = null;
      state.error = null;
    },
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    clearChatError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.sending = false;
        state.activeChat = action.payload;
        state.chats = [
          action.payload,
          ...state.chats.filter((chat) => chat._id !== action.payload._id),
        ];
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload;
      })
      .addCase(fetchChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
        if (!state.activeChat && action.payload.length > 0) {
          state.activeChat = action.payload[0];
        }
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchChatById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChatById.fulfilled, (state, action) => {
        state.loading = false;
        state.activeChat = action.payload;
        state.chats = state.chats.map((chat) =>
          chat._id === action.payload._id ? action.payload : chat
        );
      })
      .addCase(fetchChatById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteChat.pending, (state) => {
        state.deleting = true;
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.deleting = false;
        state.chats = state.chats.filter((chat) => chat._id !== action.payload);
        if (state.activeChat?._id === action.payload) {
          state.activeChat = state.chats[0] || null;
        }
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      })
      .addCase(clearChatHistory.pending, (state) => {
        state.deleting = true;
      })
      .addCase(clearChatHistory.fulfilled, (state) => {
        state.deleting = false;
        state.chats = [];
        state.activeChat = null;
      })
      .addCase(clearChatHistory.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

export const { clearChatError, setActiveChat, startNewChat } = chatSlice.actions;

export default chatSlice.reducer;
