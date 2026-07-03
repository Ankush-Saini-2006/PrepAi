const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-[var(--page-surface-soft)] px-4 py-3">
      {[0, 1, 2].map((item) => (
        <span
          key={item}
          className="h-2 w-2 animate-bounce rounded-full bg-primary-500"
          style={{ animationDelay: `${item * 120}ms` }}
        />
      ))}
      <span className="ml-1 text-xs font-medium theme-text-muted">PrepAI is typing</span>
    </div>
  );
};

export default TypingIndicator;
