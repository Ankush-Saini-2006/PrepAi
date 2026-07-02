const DashboardCard = ({ title, subtitle, action, className = "", children }) => {
  return (
    <section className={`theme-surface rounded-[1.75rem] p-5 shadow-[0_20px_60px_-34px_rgba(15,23,42,0.2)] ${className}`.trim()}>
      {(title || subtitle || action) && (
        <header className="mb-5 flex items-start justify-between gap-4">
          <div>
            {subtitle ? <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600 dark:text-violet-300">{subtitle}</p> : null}
            {title ? <h3 className="mt-2 text-lg font-semibold tracking-tight text-[color:var(--page-text)]">{title}</h3> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </header>
      )}
      {children}
    </section>
  );
};

export default DashboardCard;