import { GitBranch, Trophy, Code2 } from "lucide-react";

const icons = {
  github: GitBranch,
  leetcode: Code2,
  codeforces: Trophy,
};

const ProfileCard = ({ platform, username, stats = [] }) => {
  const Icon = icons[platform] || Code2;
  return (
    <section className="theme-surface rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-violet-300">
          <Icon size={18} />
        </span>
        <div>
          <p className="text-sm font-semibold capitalize text-[color:var(--page-text)]">{platform}</p>
          <p className="text-xs theme-text-muted">{username || "Not connected"}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((item) => (
          <div key={item.label} className="rounded-xl bg-[var(--page-surface-soft)] p-3">
            <p className="text-xs theme-text-muted">{item.label}</p>
            <p className="mt-1 text-lg font-semibold text-[color:var(--page-text)]">{item.value ?? 0}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProfileCard;
