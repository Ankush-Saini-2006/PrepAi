const LanguageCard = ({ item }) => (
  <div className="rounded-xl bg-[var(--page-surface-soft)] p-3">
    <p className="text-sm font-semibold text-[color:var(--page-text)]">{item.name}</p>
    <p className="mt-1 text-xs theme-text-muted">{item.value} repositories</p>
  </div>
);

export default LanguageCard;
