import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const { name, value, payload: data } = payload[0];

  return (
    <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] rounded-xl p-3 shadow-[var(--shadow-elevated)]">
      <p className="text-sm font-semibold text-[var(--color-text-primary)]">{name}</p>
      <p className="text-xs font-mono text-[var(--color-text-secondary)] mt-0.5">
        {value.toLocaleString()} XAF ({data.percentage}%)
      </p>
    </div>
  );
}

function CustomLegend({ payload }) {
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-2 justify-center mt-3">
      {payload?.map((entry, index) => (
        <li key={index} className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block shadow-sm"
            style={{ backgroundColor: entry.color }}
          />
          {entry.value}
        </li>
      ))}
    </ul>
  );
}

export default function DonutChart({ data, height = 300 }) {
  // Add percentage to each entry
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const enrichedData = data.map((d) => ({
    ...d,
    percentage: total > 0 ? Math.round((d.value / total) * 100) : 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={enrichedData}
          cx="50%"
          cy="45%"
          innerRadius="45%"
          outerRadius="75%"
          paddingAngle={3}
          dataKey="value"
          nameKey="name"
          stroke="var(--color-bg-primary)"
          strokeWidth={2}
        >
          {enrichedData.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
