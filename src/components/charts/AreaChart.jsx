import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

export default function AreaChartComponent({ data, height = 300 }) {
  if (!data || data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center text-sm text-[var(--color-text-muted)]" 
        style={{ height }}
      >
        No trend data available
      </div>
    );
  }

  // Custom tooltip to format currency and match the light theme
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-3 rounded-lg shadow-[var(--shadow-card)]">
          <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--color-accent-blue)]" />
            <p className="text-sm text-[var(--color-text-secondary)]">Net Balance:</p>
            <p className="text-sm font-bold font-mono text-[var(--color-text-primary)]">
              {formatCurrency(payload[0].value)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ height, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-accent-blue)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--color-accent-blue)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="var(--color-border-default)" 
            opacity={0.5}
          />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            tickFormatter={(value) => {
              if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
              return value;
            }}
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ stroke: 'var(--color-border-hover)', strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          <Area 
            type="monotone" 
            dataKey="balance" 
            stroke="var(--color-accent-blue)" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorBalance)" 
            activeDot={{ r: 6, fill: 'var(--color-accent-blue)', stroke: 'var(--color-bg-primary)', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
