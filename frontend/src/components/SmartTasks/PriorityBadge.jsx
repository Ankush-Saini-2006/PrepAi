const styles = {
  Low: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  Medium: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  High: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  Critical: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300",
};

const PriorityBadge = ({ priority = "Medium" }) => (
  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[priority] || styles.Medium}`}>
    {priority}
  </span>
);

export default PriorityBadge;
