import { ExternalLink } from "lucide-react";

const ResourceCard = ({ resource }) => (
  <div className="theme-surface rounded-[1.5rem] p-5">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600 dark:text-violet-300">{resource.type || "Resource"}</p>
        <h3 className="mt-2 text-base font-semibold text-[color:var(--page-text)]">{resource.title}</h3>
      </div>
    </div>
    <p className="mt-3 text-sm leading-6 theme-text-muted">{resource.description}</p>
    {resource.url ? (
      <a href={resource.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-violet-300">
        Open resource <ExternalLink size={14} />
      </a>
    ) : null}
  </div>
);

export default ResourceCard;
