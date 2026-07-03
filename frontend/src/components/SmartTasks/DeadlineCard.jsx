import { AlarmClock } from "lucide-react";

const DeadlineCard = ({ task }) => (
  <section className="theme-surface rounded-2xl p-5">
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-violet-300">
        <AlarmClock size={18} />
      </span>
      <div>
        <p className="text-sm font-semibold text-[color:var(--page-text)]">Upcoming deadline</p>
        <p className="text-xs theme-text-muted">{task?.title || "No upcoming deadline"}</p>
      </div>
    </div>
    {task?.dueDate ? <p className="mt-4 text-2xl font-bold text-[color:var(--page-text)]">{new Date(task.dueDate).toLocaleDateString()}</p> : null}
  </section>
);

export default DeadlineCard;
