const asyncHandler = require("express-async-handler");
const Chat = require("../models/Chat");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { careerChatPrompt, generateContent } = require("../services/geminiService");

const createTitle = (message) => {
  const cleanMessage = message.replace(/\s+/g, " ").trim();
  if (!cleanMessage) return "New Career Chat";
  return cleanMessage.length > 72 ? `${cleanMessage.slice(0, 72)}...` : cleanMessage;
};

const getOwnedChat = async (chatId, userId) => {
  const chat = await Chat.findOne({ _id: chatId, user: userId });
  if (!chat) throw new ApiError(404, "Chat conversation not found");
  return chat;
};

const findMessageIndex = (messages, messageId) =>
  messages.findIndex((message) => message._id.toString() === messageId);

// @desc    Generate AI response and save conversation
// @route   POST /api/chat
const sendMessage = asyncHandler(async (req, res) => {
  const message = req.body.message?.trim();
  const chatId = req.body.chatId;
  const regenerate = Boolean(req.body.regenerate);
  const messageId = req.body.messageId;

  let chat;
  let userMessage = message;

  if (regenerate) {
    if (!chatId || !messageId) {
      throw new ApiError(400, "Chat ID and message ID are required to regenerate a response");
    }

    chat = await getOwnedChat(chatId, req.user._id);
    const assistantIndex = findMessageIndex(chat.messages, messageId);
    if (assistantIndex <= 0 || chat.messages[assistantIndex].role !== "assistant") {
      throw new ApiError(400, "Only assistant messages can be regenerated");
    }

    const previousUserMessage = chat.messages
      .slice(0, assistantIndex)
      .reverse()
      .find((item) => item.role === "user");

    if (!previousUserMessage) {
      throw new ApiError(400, "No user message found for this response");
    }

    userMessage = previousUserMessage.content;
    chat.messages = chat.messages.slice(0, assistantIndex);
  } else {
    if (!userMessage) throw new ApiError(400, "Message is required");

    chat = chatId
      ? await getOwnedChat(chatId, req.user._id)
      : await Chat.create({
          user: req.user._id,
          title: createTitle(userMessage),
          messages: [],
        });

    chat.messages.push({
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    });
  }

  const prompt = careerChatPrompt(chat.messages, userMessage);
  const aiResponse = await generateContent(prompt);

  chat.messages.push({
    role: "assistant",
    content: aiResponse.trim(),
    timestamp: new Date(),
  });

  await chat.save();

  const statusCode = regenerate ? 200 : 201;
  res.status(statusCode).json(new ApiResponse(statusCode, { chat }, "Chat response generated"));
});

// @desc    Get all chat conversations for logged-in user
// @route   GET /api/chat/history
const getChatHistory = asyncHandler(async (req, res) => {
  const chats = await Chat.find({ user: req.user._id })
    .select("title messages createdAt updatedAt")
    .sort("-updatedAt");

  res.status(200).json(new ApiResponse(200, { chats }));
});

// @desc    Get complete chat conversation
// @route   GET /api/chat/:id
const getChatById = asyncHandler(async (req, res) => {
  const chat = await getOwnedChat(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, { chat }));
});

// @desc    Delete a chat conversation
// @route   DELETE /api/chat/:id
const deleteChat = asyncHandler(async (req, res) => {
  const chat = await getOwnedChat(req.params.id, req.user._id);
  await chat.deleteOne();

  res.status(200).json(new ApiResponse(200, null, "Chat conversation deleted"));
});

// @desc    Clear all chat conversations
// @route   DELETE /api/chat/history
const clearChatHistory = asyncHandler(async (req, res) => {
  await Chat.deleteMany({ user: req.user._id });
  res.status(200).json(new ApiResponse(200, null, "Chat history cleared"));
});

module.exports = {
  sendMessage,
  getChatHistory,
  getChatById,
  deleteChat,
  clearChatHistory,
};
