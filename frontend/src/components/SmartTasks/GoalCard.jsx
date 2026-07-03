import { Target } from "lucide-react";

const GoalCard = ({ title, value }) => (
  <section className="theme-surface rounded-2xl p-5">
    <div className="mb-3 flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-violet-300">
        <Target size={18} />
      </span>
      <h3 className="text-sm font-semibold text-[color:var(--page-text)]">{title}</h3>
    </div>
    <p className="text-sm leading-6 theme-text-muted">{value || "No goal set yet."}</p>
  </section>
);

export default GoalCard;
