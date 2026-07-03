import { AlertTriangle } from "lucide-react";

const WeakAreasCard = ({ items }) => {
  return (
    <section className="theme-surface rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-violet-300">
          <AlertTriangle size={18} />
        </span>
        <h3 className="text-base font-semibold text-[color:var(--page-text)]">Weak areas</h3>
      </div>
      {Array.isArray(items) && items.length > 0 ? (
        <ul className="space-y-2 text-sm leading-6 theme-text-muted">
          {items.map((item, index) => (
            <li key={`${item}-${index}`} className="rounded-xl bg-[var(--page-surface-soft)] px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm theme-text-muted">No weak areas available yet.</p>
      )}
    </section>
  );
};

export default WeakAreasCard;
