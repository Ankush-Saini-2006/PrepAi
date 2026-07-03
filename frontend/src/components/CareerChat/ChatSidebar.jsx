import { MessageSquarePlus, MessageSquareText, Trash2 } from "lucide-react";
import Button from "../common/Button";

const formatDate = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
};

const ChatSidebar = ({
  chats,
  activeId,
  loading,
  deleting,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onClearHistory,
}) => {
  return (
    <aside className="theme-surface flex min-h-[20rem] flex-col overflow-hidden rounded-2xl">
      <div className="space-y-3 border-b border-[color:var(--page-border)] p-4">
        <Button type="button" className="w-full" onClick={onNewChat}>
          <MessageSquarePlus size={16} /> New chat
        </Button>
        <button
          type="button"
          disabled={deleting || chats.length === 0}
          onClick={onClearHistory}
          className="w-full rounded-full border border-[color:var(--page-border)] px-4 py-2 text-sm font-semibold theme-text-muted transition hover:border-red-200 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear history
        </button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {loading ? (
          <p className="p-3 text-sm theme-text-muted">Loading chats...</p>
        ) : chats.length === 0 ? (
          <p className="p-3 text-sm theme-text-muted">No conversations yet.</p>
        ) : (
          chats.map((chat) => {
            const isActive = activeId === chat._id;
            return (
              <div
                key={chat._id}
                className={`group flex items-center gap-2 rounded-xl p-2 transition ${
                  isActive ? "bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-violet-300" : "hover:bg-[var(--page-surface-soft)]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectChat(chat)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <MessageSquareText size={16} className="shrink-0" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{chat.title || "Career Chat"}</span>
                    <span className="mt-0.5 block text-xs theme-text-muted">{formatDate(chat.updatedAt)}</span>
                  </span>
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => onDeleteChat(chat._id)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 opacity-100 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50 lg:opacity-0 lg:group-hover:opacity-100"
                  aria-label="Delete chat"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default ChatSidebar;
