import { BookOpenCheck, Building2, FileText, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

const icons = {
  BookOpenCheck,
  Building2,
  FileText,
  LayoutDashboard,
};

const SkeletonLine = ({ className = "" }) => (
  <span className={`block h-2.5 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700 ${className}`} />
);

const PreviewCard = ({ preview, index = 0 }) => {
  const Icon = icons[preview.icon] || FileText;
  const isLoading = preview.state === "loading";

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: index * 0.06 }}
      className="theme-surface overflow-hidden rounded-2xl shadow-[0_20px_60px_-40px_rgba(15,23,42,0.38)]"
    >
      <div className="border-b border-[color:var(--page-border)] px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-primary-700 dark:bg-slate-800">
            <Icon size={18} />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-[color:var(--page-text)]">{preview.title}</h3>
            <p className="mt-1 truncate text-xs theme-text-muted">{preview.description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="rounded-xl border border-[color:var(--page-border)] bg-[var(--page-surface-soft)] p-4">
          <div className="flex items-center justify-between gap-3">
            <SkeletonLine className="w-28" />
            <SkeletonLine className="w-16" />
          </div>
          <div className="mt-5 space-y-3">
            {preview.rows.map((row) => (
              <div key={row} className="flex items-center justify-between gap-4">
                <span className="text-xs font-medium theme-text-muted">{row}</span>
                <SkeletonLine className="w-20" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-[color:var(--page-border)] bg-[var(--page-surface-solid)] p-4">
          <div className="flex items-start gap-3">
            <span className={`mt-1 h-2.5 w-2.5 rounded-full ${isLoading ? "animate-pulse bg-primary-500" : "bg-slate-300 dark:bg-slate-600"}`} />
            <div>
              <p className="text-sm font-semibold text-[color:var(--page-text)]">{preview.placeholderTitle}</p>
              <p className="mt-1 text-xs leading-5 theme-text-muted">{preview.placeholderDescription}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default PreviewCard;
