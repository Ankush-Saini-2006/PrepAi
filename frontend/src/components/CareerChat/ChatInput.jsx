import { SendHorizontal } from "lucide-react";
import Button from "../common/Button";

const ChatInput = ({ value, disabled, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="border-t border-[color:var(--page-border)] bg-[var(--page-surface-solid)] p-4">
      <div className="flex items-end gap-3">
        <textarea
          className="input-field max-h-40 min-h-12 resize-y leading-6"
          placeholder="Ask PrepAI about DSA, resumes, interviews, projects, roadmaps..."
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSubmit(event);
            }
          }}
        />
        <Button type="submit" loading={disabled} disabled={!value.trim()} className="h-12 px-4">
          <SendHorizontal size={16} />
          <span className="hidden sm:inline">Send</span>
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
