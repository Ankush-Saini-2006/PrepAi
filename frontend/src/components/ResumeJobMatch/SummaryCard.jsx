import { FileText } from "lucide-react";

const SummaryCard = ({ summary }) => {
  return (
    <section className="theme-surface rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-violet-300">
          <FileText size={18} />
        </span>
        <h3 className="text-base font-semibold text-[color:var(--page-text)]">Summary</h3>
      </div>
      {summary ? (
        <p className="text-sm leading-6 theme-text-muted">{summary}</p>
      ) : (
        <p className="text-sm theme-text-muted">No summary available yet.</p>
      )}
    </section>
  );
};

export default SummaryCard;
