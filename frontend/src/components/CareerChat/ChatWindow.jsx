import { useEffect, useRef } from "react";
import EmptyState from "./EmptyState";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

const ChatWindow = ({ chat, sending, onPromptSelect, onRegenerate }) => {
  const bottomRef = useRef(null);
  const messages = chat?.messages || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, sending]);

  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
        <EmptyState onPromptSelect={onPromptSelect} disabled={sending} />
        {sending ? (
          <div className="flex justify-start">
            <TypingIndicator />
          </div>
        ) : null}
        <div ref={bottomRef} />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      {messages.map((message) => (
        <MessageBubble
          key={message._id || `${message.role}-${message.timestamp}`}
          message={message}
          disabled={sending}
          onRegenerate={onRegenerate}
        />
      ))}
      {sending ? (
        <div className="flex justify-start">
          <TypingIndicator />
        </div>
      ) : null}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
