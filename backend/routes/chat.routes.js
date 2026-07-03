const express = require("express");
const {
  sendMessage,
  getChatHistory,
  getChatById,
  deleteChat,
  clearChatHistory,
} = require("../controllers/chat.controller");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", sendMessage);
router.get("/history", getChatHistory);
router.delete("/history", clearChatHistory);
router.get("/:id", getChatById);
router.delete("/:id", deleteChat);

module.exports = router;
