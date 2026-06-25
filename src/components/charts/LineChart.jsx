import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from 'recharts';
import { formatCompactNumber } from '../../utils/formatters';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] rounded-xl p-3 shadow-[var(--shadow-elevated)]">
      <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-xs font-mono" style={{ color: entry.color }}>
          Balance: {entry.value.toLocaleString()} XAF
        </p>
      ))}
    </div>
  );
}

export default function LineChartComponent({ data, height = 300 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-finance-balance)" stopOpacity={0.2} />
            <stop offset="100%" stopColor="var(--color-finance-balance)" stopOpacity={0} />
          </linearGradient>
        </defs>
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
          tickFormatter={formatCompactNumber}
          width={50}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="balance"
          fill="url(#colorBalance)"
          stroke="none"
        />
        <Line
          type="monotone"
          dataKey="balance"
          name="Balance"
          stroke="var(--color-finance-balance)"
          strokeWidth={3}
          dot={{ fill: 'var(--color-finance-balance)', strokeWidth: 0, r: 4 }}
          activeDot={{ r: 7, fill: 'var(--color-finance-balance)', stroke: 'var(--color-bg-primary)', strokeWidth: 3 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
