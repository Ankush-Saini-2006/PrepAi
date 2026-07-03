import { Trophy } from "lucide-react";

const ContestCard = ({ title, rating, rank, best }) => (
  <section className="theme-surface rounded-2xl p-5">
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-violet-300">
        <Trophy size={18} />
      </span>
      <div>
        <p className="text-sm font-semibold text-[color:var(--page-text)]">{title}</p>
        <p className="text-xs theme-text-muted">{rank || "No rank yet"}</p>
      </div>
    </div>
    <p className="mt-4 text-3xl font-bold text-[color:var(--page-text)]">{rating || 0}</p>
    {best ? <p className="mt-1 text-sm theme-text-muted">Best: {best}</p> : null}
  </section>
);

export default ContestCard;
