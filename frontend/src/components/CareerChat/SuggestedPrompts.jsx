const prompts = [
  "Review my resume",
  "How should I prepare for Google?",
  "Create a DSA roadmap",
  "Suggest MERN projects",
  "Explain Dynamic Programming",
  "Difference between BFS and DFS",
  "Interview questions for Amazon",
  "How do I improve ATS score?",
];

const SuggestedPrompts = ({ onSelect, disabled = false }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(prompt)}
          className="rounded-full border border-[color:var(--page-border)] bg-[var(--page-surface-solid)] px-3 py-1.5 text-xs font-medium theme-text-muted transition hover:border-primary-300 hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-violet-300"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
};

export default SuggestedPrompts;
