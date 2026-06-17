import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] rounded-lg p-3 shadow-lg">
      <p className="text-sm font-medium text-[var(--color-text-primary)] mb-1">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-xs" style={{ color: entry.color }}>
          Balance: {entry.value.toLocaleString()} XAF
        </p>
      ))}
    </div>
  );
}

export default function LineChartComponent({ data, height = 300 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <defs>
          <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent-green)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--color-accent-green)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-default)" opacity={0.3} />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="balance"
          stroke="var(--color-accent-green)"
          strokeWidth={2.5}
          dot={{ fill: 'var(--color-accent-green)', strokeWidth: 0, r: 4 }}
          activeDot={{ r: 6, fill: 'var(--color-accent-green)', stroke: 'var(--color-bg-primary)', strokeWidth: 2 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
