import { CheckCircle2 } from "lucide-react";

const ProgressCard = ({ title, value = 0, detail }) => (
  <section className="theme-surface rounded-2xl p-5">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-[color:var(--page-text)]">{title}</p>
        {detail ? <p className="mt-1 text-xs theme-text-muted">{detail}</p> : null}
      </div>
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-violet-300">
        <CheckCircle2 size={18} />
      </span>
    </div>
    <p className="mt-4 text-3xl font-bold text-[color:var(--page-text)]">{value}%</p>
    <div className="mt-3 h-2 rounded-full bg-[var(--page-surface-soft)]">
      <div className="h-2 rounded-full bg-gradient-to-r from-primary-600 to-violet-600" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  </section>
);

export default ProgressCard;
