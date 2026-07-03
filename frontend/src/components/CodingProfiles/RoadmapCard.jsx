const RoadmapCard = ({ title, steps = [] }) => (
  <section className="theme-surface rounded-2xl p-5">
    <h3 className="text-base font-semibold text-[color:var(--page-text)]">{title}</h3>
    <div className="mt-4 space-y-3">
      {steps.length ? steps.map((step, index) => (
        <div key={`${step}-${index}`} className="flex gap-3 rounded-xl bg-[var(--page-surface-soft)] p-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-700 dark:bg-slate-800 dark:text-violet-300">{index + 1}</span>
          <p className="text-sm leading-6 theme-text-muted">{step}</p>
        </div>
      )) : <p className="text-sm theme-text-muted">No roadmap available yet.</p>}
    </div>
  </section>
);

export default RoadmapCard;
