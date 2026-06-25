import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

export default function RadarChartComponent({ data, height = 300 }) {
  if (!data || data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center text-sm text-[var(--color-text-muted)]" 
        style={{ height }}
      >
        No spending footprint available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-3 rounded-lg shadow-[var(--shadow-card)]">
          <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
            {payload[0].payload.name}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].color }} />
            <p className="text-sm text-[var(--color-text-secondary)]">Spent:</p>
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
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="var(--color-border-default)" />
          <PolarAngleAxis 
            dataKey="name" 
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 'dataMax']} 
            tick={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Spending"
            dataKey="value"
            stroke="var(--color-accent-blue)"
            fill="var(--color-accent-blue)"
            fillOpacity={0.4}
            activeDot={{ r: 5, fill: 'var(--color-bg-primary)', stroke: 'var(--color-accent-blue)', strokeWidth: 2 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
