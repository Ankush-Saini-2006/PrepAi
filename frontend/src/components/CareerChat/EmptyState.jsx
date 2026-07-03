import { MessageCircle } from "lucide-react";
import SuggestedPrompts from "./SuggestedPrompts";

const EmptyState = ({ onPromptSelect, disabled }) => {
  return (
    <div className="flex min-h-[28rem] flex-col items-center justify-center rounded-2xl border border-dashed border-[color:var(--page-border)] bg-[var(--page-surface-solid)] p-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-violet-300">
        <MessageCircle size={22} />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-[color:var(--page-text)]">Start a career chat</h3>
      <p className="mt-2 max-w-lg text-sm leading-6 theme-text-muted">
        Ask about programming, DSA, resumes, interviews, projects, company preparation, aptitude, or roadmaps.
      </p>
      <div className="mt-5 max-w-2xl">
        <SuggestedPrompts onSelect={onPromptSelect} disabled={disabled} />
      </div>
    </div>
  );
};

export default EmptyState;
