import { Eye, FileText, Trash2 } from "lucide-react";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";

const formatDate = (value) => {
  if (!value) return "Not analyzed";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

const HistoryCard = ({ matches, activeId, loading, deleting, onSelect, onDelete }) => {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-[color:var(--page-text)]">Analysis history</h2>
        <p className="mt-1 text-sm theme-text-muted">View or delete previous resume-job matches.</p>
      </div>

      {matches.length === 0 ? (
        <EmptyState title="No match history yet" description="Run your first match analysis above." />
      ) : (
        <div className="grid gap-3">
          {matches.map((match) => {
            const isActive = activeId === match._id;
            return (
              <div
                key={match._id}
                className={`theme-surface flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between ${
                  isActive ? "ring-2 ring-primary-500/30" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelect(match)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-violet-300">
                    <FileText size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-[color:var(--page-text)]">
                      {match.originalName}
                    </span>
                    <span className="mt-1 block text-xs theme-text-muted">
                      {formatDate(match.analyzedAt || match.createdAt)} - {match.matchScore || 0}% match
                    </span>
                  </span>
                </button>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="secondary" disabled={loading} onClick={() => onSelect(match)}>
                    <Eye size={15} /> View
                  </Button>
                  <button
                    type="button"
                    onClick={() => onDelete(match._id)}
                    disabled={deleting}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--page-border)] text-slate-400 transition hover:border-red-200 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Delete match analysis"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default HistoryCard;
