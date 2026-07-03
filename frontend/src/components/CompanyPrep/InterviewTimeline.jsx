import DashboardCard from "../dashboard/DashboardCard";

const InterviewTimeline = ({ rounds = [], experiences = [] }) => (
  <DashboardCard subtitle="Interview Timeline" title="Rounds and experiences">
    <div className="space-y-4">
      {rounds.map((round, index) => (
        <div key={`${round}-${index}`} className="flex gap-3">
          <div className="mt-1 h-6 w-6 rounded-full bg-primary-100 text-center text-xs font-bold leading-6 text-primary-700 dark:bg-slate-700 dark:text-violet-300">
            {index + 1}
          </div>
          <p className="text-sm leading-6 theme-text-muted">{round}</p>
        </div>
      ))}
      {experiences.slice(0, 3).map((experience) => (
        <div key={experience._id || experience.experience} className="rounded-2xl border border-[color:var(--page-border)] bg-[var(--page-surface-soft)] p-4">
          <p className="text-sm font-semibold text-[color:var(--page-text)]">{experience.role}</p>
          <p className="mt-2 text-sm leading-6 theme-text-muted">{experience.experience}</p>
        </div>
      ))}
    </div>
  </DashboardCard>
);

export default InterviewTimeline;
