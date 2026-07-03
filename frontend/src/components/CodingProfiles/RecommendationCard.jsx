const RecommendationCard = ({ title, items = [] }) => (
  <section className="theme-surface rounded-2xl p-5">
    <h3 className="text-base font-semibold text-[color:var(--page-text)]">{title}</h3>
    <ul className="mt-4 space-y-2 text-sm theme-text-muted">
      {items.length ? items.map((item, index) => (
        <li key={`${item}-${index}`} className="rounded-xl bg-[var(--page-surface-soft)] px-3 py-2">{item}</li>
      )) : <li>No recommendations yet.</li>}
    </ul>
  </section>
);

export default RecommendationCard;
