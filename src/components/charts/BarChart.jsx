import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] rounded-xl p-3 shadow-[var(--shadow-elevated)]">
      <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-xs font-mono" style={{ color: entry.color }}>
          {entry.name}: {Math.abs(entry.value).toLocaleString()} XAF
        </p>
      ))}
    </div>
  );
}

export default function BarChartComponent({ data, height = 300 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-default)" opacity={0.2} vertical={false} />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          width={50}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Legend
          wrapperStyle={{ fontSize: '11px', color: 'var(--color-text-secondary)', paddingTop: '8px' }}
        />
        <Bar dataKey="income" name="Income" fill="var(--color-accent-green)" radius={[6, 6, 0, 0]} maxBarSize={60} />
        <Bar dataKey="expenses" name="Expenses" fill="var(--color-accent-red)" radius={[6, 6, 0, 0]} opacity={0.8} maxBarSize={60} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
