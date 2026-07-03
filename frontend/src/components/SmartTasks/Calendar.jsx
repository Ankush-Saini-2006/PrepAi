const toKey = (value) => new Date(value).toISOString().slice(0, 10);

const Calendar = ({ tasks = [], mode = "month", onSelectTask }) => {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), mode === "week" ? today.getDate() - today.getDay() : 1);
  const length = mode === "week" ? 7 : new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const days = Array.from({ length }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });

  return (
    <section className="theme-surface rounded-2xl p-4">
      <div className={mode === "agenda" ? "space-y-3" : "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7"}>
        {(mode === "agenda" ? tasks : days).map((item) => {
          const date = mode === "agenda" ? new Date(item.dueDate) : item;
          const dayTasks = mode === "agenda" ? [item] : tasks.filter((task) => toKey(task.dueDate) === toKey(date));
          return (
            <div key={mode === "agenda" ? item._id : toKey(date)} className="min-h-28 rounded-xl border border-[color:var(--page-border)] bg-[var(--page-surface-soft)] p-3">
              <p className="text-xs font-semibold uppercase tracking-wide theme-text-muted">{date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</p>
              <div className="mt-2 space-y-2">
                {dayTasks.map((task) => (
                  <button
                    type="button"
                    key={task._id}
                    onClick={() => onSelectTask?.(task)}
                    className="block w-full truncate rounded-lg bg-[var(--page-surface-solid)] px-2 py-1.5 text-left text-xs font-medium text-[color:var(--page-text)]"
                  >
                    {task.title}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Calendar;
