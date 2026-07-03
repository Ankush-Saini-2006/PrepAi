import { Copy, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import MarkdownRenderer from "./MarkdownRenderer";

const MessageBubble = ({ message, disabled, onRegenerate }) => {
  const isAssistant = message.role === "assistant";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast.success("Response copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
      <article
        className={`max-w-[92%] rounded-2xl px-4 py-3 shadow-sm lg:max-w-[78%] ${
          isAssistant
            ? "theme-surface"
            : "bg-gradient-to-br from-primary-600 to-violet-600 text-white"
        }`}
      >
        {isAssistant ? (
          <MarkdownRenderer content={message.content} />
        ) : (
          <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
        )}

        {isAssistant ? (
          <div className="mt-3 flex items-center gap-2 border-t border-[color:var(--page-border)] pt-3">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium theme-text-muted transition hover:bg-[var(--page-surface-soft)] hover:text-primary-700 dark:hover:text-violet-300"
            >
              <Copy size={13} /> Copy
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onRegenerate(message)}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium theme-text-muted transition hover:bg-[var(--page-surface-soft)] hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-violet-300"
            >
              <RefreshCw size={13} /> Regenerate
            </button>
          </div>
        ) : null}
      </article>
    </div>
  );
};

export default MessageBubble;
