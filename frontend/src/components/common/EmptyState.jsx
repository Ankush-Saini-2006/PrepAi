const EmptyState = ({ title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[color:var(--page-border)] bg-[var(--page-surface-solid)] p-12 text-center shadow-sm">
      <h3 className="text-lg font-semibold text-[color:var(--page-text)]">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm theme-text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
