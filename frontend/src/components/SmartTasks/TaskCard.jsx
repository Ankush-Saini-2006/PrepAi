import { CalendarClock, CheckCircle2, Clock3, Trash2 } from "lucide-react";
import PriorityBadge from "./PriorityBadge";

const formatDate = (value) =>
  value ? new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(value)) : "No deadline";

const TaskCard = ({ task, onSelect, onComplete, onDelete }) => {
  const completed = task.status === "Completed";

  return (
    <article className={`theme-surface rounded-2xl p-4 ${completed ? "opacity-75" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <button type="button" onClick={() => onSelect?.(task)} className="min-w-0 flex-1 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <PriorityBadge priority={task.priority} />
            <span className="rounded-full bg-[var(--page-surface-soft)] px-2.5 py-1 text-xs font-medium theme-text-muted">
              {task.category}
            </span>
            {task.source === "AI" ? (
              <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700 dark:bg-slate-800 dark:text-violet-300">AI</span>
            ) : null}
          </div>
          <h3 className={`mt-3 text-base font-semibold text-[color:var(--page-text)] ${completed ? "line-through" : ""}`}>{task.title}</h3>
          {task.description ? <p className="mt-1 line-clamp-2 text-sm leading-6 theme-text-muted">{task.description}</p> : null}
        </button>
        <button
          type="button"
          onClick={() => onComplete?.(task)}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${
            completed ? "border-emerald-200 text-emerald-600" : "border-[color:var(--page-border)] text-slate-400 hover:text-emerald-600"
          }`}
          aria-label="Toggle complete"
        >
          <CheckCircle2 size={18} />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--page-border)] pt-3 text-xs theme-text-muted">
        <span className="inline-flex items-center gap-1.5"><CalendarClock size={14} /> {formatDate(task.dueDate)}</span>
        <span className="inline-flex items-center gap-1.5"><Clock3 size={14} /> {task.estimatedStudyMinutes || 0} min</span>
        <button type="button" onClick={() => onDelete?.(task._id)} className="inline-flex items-center gap-1.5 text-slate-400 hover:text-red-500">
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </article>
  );
};

export default TaskCard;
