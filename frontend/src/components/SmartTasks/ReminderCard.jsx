import { Bell } from "lucide-react";

const ReminderCard = ({ task }) => (
  <section className="theme-surface rounded-2xl p-5">
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-violet-300">
        <Bell size={18} />
      </span>
      <div>
        <p className="text-sm font-semibold text-[color:var(--page-text)]">Task reminder</p>
        <p className="text-xs theme-text-muted">{task?.reminderAt ? new Date(task.reminderAt).toLocaleString() : "No reminder scheduled"}</p>
      </div>
    </div>
  </section>
);

export default ReminderCard;
