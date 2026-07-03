const RepositoryCard = ({ repo }) => (
  <a href={repo.url} target="_blank" rel="noreferrer" className="theme-surface block rounded-2xl p-4 transition hover:-translate-y-0.5">
    <p className="truncate text-sm font-semibold text-[color:var(--page-text)]">{repo.name}</p>
    <p className="mt-1 line-clamp-2 text-xs theme-text-muted">{repo.description || "No description provided."}</p>
    <p className="mt-3 text-xs font-semibold text-primary-600 dark:text-violet-300">{repo.stars || repo.value || 0} activity</p>
  </a>
);

export default RepositoryCard;
