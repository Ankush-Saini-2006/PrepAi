import { CheckCircle2, Search, XCircle } from "lucide-react";

const SkillList = ({ title, icon: Icon, items, empty }) => (
  <div className="theme-surface rounded-2xl p-5">
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-violet-300">
        <Icon size={18} />
      </span>
      <h3 className="text-base font-semibold text-[color:var(--page-text)]">{title}</h3>
    </div>
    {Array.isArray(items) && items.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="rounded-full bg-[var(--page-surface-soft)] px-3 py-1.5 text-xs font-medium theme-text-muted"
          >
            {item}
          </span>
        ))}
      </div>
    ) : (
      <p className="text-sm theme-text-muted">{empty}</p>
    )}
  </div>
);

const SkillsCard = ({ matchingSkills, missingSkills, missingKeywords }) => {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <SkillList
        title="Matching skills"
        icon={CheckCircle2}
        items={matchingSkills}
        empty="No matching skills available yet."
      />
      <SkillList
        title="Missing skills"
        icon={XCircle}
        items={missingSkills}
        empty="No missing skills available yet."
      />
      <SkillList
        title="Missing keywords"
        icon={Search}
        items={missingKeywords}
        empty="No missing keywords available yet."
      />
    </section>
  );
};

export default SkillsCard;
