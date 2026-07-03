import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const TopicChart = ({ data = [], dataKey = "value" }) => (
  <div className="h-72">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data.slice(0, 10)} barSize={22}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--page-border)" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: "var(--page-text-soft)", fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fill: "var(--page-text-soft)", fontSize: 12 }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ background: "var(--page-surface-solid)", border: "1px solid var(--page-border)", borderRadius: 12 }} />
        <Bar dataKey={dataKey} fill="#6366f1" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default TopicChart;
