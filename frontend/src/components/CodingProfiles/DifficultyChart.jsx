import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

const DifficultyChart = ({ leetcode }) => {
  const data = [
    { name: "Easy", value: leetcode?.easySolved || 0 },
    { name: "Medium", value: leetcode?.mediumSolved || 0 },
    { name: "Hard", value: leetcode?.hardSolved || 0 },
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88}>
            {data.map((entry, index) => <Cell key={entry.name} fill={COLORS[index]} />)}
          </Pie>
          <Tooltip contentStyle={{ background: "var(--page-surface-solid)", border: "1px solid var(--page-border)", borderRadius: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DifficultyChart;
