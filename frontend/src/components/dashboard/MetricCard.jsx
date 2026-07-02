const MetricCard = ({
  icon: Icon,
  title,
  value,
  description,
  footer,
  accent = "from-primary-600 to-violet-600",
  loading = false,
  emptyLabel = "No data available",
}) => {
  const hasValue = value !== null && value !== undefined && value !== "";

  return (
    <div className="theme-surface rounded-[1.75rem] p-5 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.2)] transition-transform duration-300 hover:-translate-y-1">
      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg shadow-primary-500/20`}>
        {Icon ? <Icon size={20} /> : null}
      </div>
      <p className="mt-4 text-sm font-medium theme-text-muted">{title}</p>
      {loading ? (
        <div className="mt-2 h-9 w-28 animate-pulse rounded-2xl bg-slate-200/80 dark:bg-slate-700/80" />
      ) : (
        <div className="mt-1 text-3xl font-semibold tracking-tight text-[color:var(--page-text)]">
          {hasValue ? value : <span className="text-2xl text-slate-400 dark:text-slate-500">{emptyLabel}</span>}
        </div>
      )}
      {description ? <p className="mt-2 text-sm leading-6 theme-text-muted">{description}</p> : null}
      {footer ? <div className="mt-4 text-xs font-medium text-primary-600 dark:text-violet-300">{footer}</div> : null}
    </div>
  );
};

export default MetricCard;