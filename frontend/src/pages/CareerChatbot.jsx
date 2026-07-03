import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import ChatInput from "../components/CareerChat/ChatInput";
import ChatSidebar from "../components/CareerChat/ChatSidebar";
import ChatWindow from "../components/CareerChat/ChatWindow";
import SuggestedPrompts from "../components/CareerChat/SuggestedPrompts";
import {
  clearChatHistory,
  deleteChat,
  fetchChatById,
  fetchChatHistory,
  sendChatMessage,
  setActiveChat,
  startNewChat,
} from "../redux/slices/chatSlice";

const CareerChatbot = () => {
  const dispatch = useDispatch();
  const { chats, activeChat, loading, sending, deleting } = useSelector((state) => state.chat);
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(fetchChatHistory());
  }, [dispatch]);

  const submitMessage = async (content) => {
    const cleanMessage = content.trim();
    if (!cleanMessage) return;

    const result = await dispatch(
      sendChatMessage({
        chatId: activeChat?._id,
        message: cleanMessage,
      })
    );

    if (sendChatMessage.fulfilled.match(result)) {
      setMessage("");
    } else {
      toast.error(result.payload || "Chat failed");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitMessage(message);
  };

  const handlePromptSelect = (prompt) => {
    setMessage(prompt);
    submitMessage(prompt);
  };

  const handleSelectChat = (chat) => {
    dispatch(setActiveChat(chat));
    dispatch(fetchChatById(chat._id));
  };

  const handleDeleteChat = async (id) => {
    const result = await dispatch(deleteChat(id));
    if (deleteChat.fulfilled.match(result)) {
      toast.success("Chat deleted");
    } else {
      toast.error(result.payload || "Delete failed");
    }
  };

  const handleClearHistory = async () => {
    const result = await dispatch(clearChatHistory());
    if (clearChatHistory.fulfilled.match(result)) {
      toast.success("Chat history cleared");
    } else {
      toast.error(result.payload || "Clear history failed");
    }
  };

  const handleRegenerate = async (assistantMessage) => {
    if (!activeChat?._id || !assistantMessage?._id) return;

    const result = await dispatch(
      sendChatMessage({
        chatId: activeChat._id,
        messageId: assistantMessage._id,
        regenerate: true,
      })
    );

    if (!sendChatMessage.fulfilled.match(result)) {
      toast.error(result.payload || "Regenerate failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600 dark:text-violet-300">
            AI Career Chatbot
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--page-text)]">
            Ask PrepAI anything career-ready
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 theme-text-muted">
            Get Gemini-powered help for programming, DSA, resumes, interviews, roadmaps, projects, companies, and placements.
          </p>
        </div>
        <div className="hidden max-w-xl lg:block">
          <SuggestedPrompts onSelect={handlePromptSelect} disabled={sending} />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[19rem_1fr]">
        <ChatSidebar
          chats={chats}
          activeId={activeChat?._id}
          loading={loading}
          deleting={deleting}
          onNewChat={() => dispatch(startNewChat())}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          onClearHistory={handleClearHistory}
        />

        <section className="theme-surface flex h-[calc(100vh-15rem)] min-h-[34rem] flex-col overflow-hidden rounded-2xl">
          <ChatWindow
            chat={activeChat}
            sending={sending}
            onPromptSelect={handlePromptSelect}
            onRegenerate={handleRegenerate}
          />
          <ChatInput
            value={message}
            disabled={sending}
            onChange={setMessage}
            onSubmit={handleSubmit}
          />
        </section>
      </div>
    </div>
  );
};

export default CareerChatbot;
