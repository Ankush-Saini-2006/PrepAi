import { Gauge, ShieldCheck, Target } from "lucide-react";

const scoreItems = [
  { key: "matchScore", label: "Match Score", icon: Target },
  { key: "overallReadinessScore", label: "Overall Readiness", icon: Gauge },
  { key: "atsCompatibilityScore", label: "ATS Compatibility", icon: ShieldCheck },
];

const formatScore = (value) => {
  const score = Number(value);
  return Number.isFinite(score) ? `${score}%` : "0%";
};

const MatchScoreCard = ({ match }) => {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {scoreItems.map(({ key, label, icon: Icon }) => (
        <div key={key} className="theme-surface rounded-2xl p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-violet-300">
              <Icon size={18} />
            </span>
            <span className="text-2xl font-bold text-[color:var(--page-text)]">
              {formatScore(match?.[key])}
            </span>
          </div>
          <p className="mt-4 text-sm font-semibold text-[color:var(--page-text)]">{label}</p>
          <div className="mt-3 h-2 rounded-full bg-[var(--page-surface-soft)]">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-primary-600 to-violet-600"
              style={{ width: `${Math.min(100, Math.max(0, Number(match?.[key]) || 0))}%` }}
            />
          </div>
        </div>
      ))}
    </section>
  );
};

export default MatchScoreCard;
