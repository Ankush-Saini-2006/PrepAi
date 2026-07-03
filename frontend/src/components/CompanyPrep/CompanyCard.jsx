import { ArrowRight, Building2, Sparkles, Target } from "lucide-react";
import { Link } from "react-router-dom";

const CompanyCard = ({ company }) => (
  <Link to={`/dashboard/company-prep/${company.slug}`} className="theme-surface block rounded-[1.75rem] p-5 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.2)] transition hover:-translate-y-1">
    <div className="flex items-start justify-between gap-4">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-violet-600 text-white shadow-lg shadow-primary-500/20">
        <Building2 size={20} />
      </div>
      <ArrowRight size={18} className="theme-text-muted" />
    </div>
    <h3 className="mt-4 text-lg font-semibold text-[color:var(--page-text)]">{company.name}</h3>
    <p className="mt-2 line-clamp-2 text-sm leading-6 theme-text-muted">
      {company.overview || "Open the company hub to generate and cache AI preparation content."}
    </p>
    <div className="mt-4 flex flex-wrap gap-2">
      <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-slate-800 dark:text-violet-300">
        <Sparkles size={12} /> {company.generatedByAI ? "Info ready" : "Generate info"}
      </span>
      {company.isTarget ? (
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-slate-800 dark:text-emerald-300">
          <Target size={12} /> Target
        </span>
      ) : null}
    </div>
  </Link>
);

export default CompanyCard;
