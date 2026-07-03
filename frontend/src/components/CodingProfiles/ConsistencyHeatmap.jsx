const ConsistencyHeatmap = ({ data = [] }) => (
  <div className="grid grid-cols-7 gap-1">
    {Array.from({ length: 35 }, (_, index) => {
      const item = data[index] || { count: 0 };
      const opacity = Math.min(1, 0.18 + (item.count || 0) * 0.18);
      return (
        <div
          key={index}
          title={item.date ? `${item.date}: ${item.count}` : "No activity"}
          className="aspect-square rounded-md bg-primary-600"
          style={{ opacity }}
        />
      );
    })}
  </div>
);

export default ConsistencyHeatmap;
