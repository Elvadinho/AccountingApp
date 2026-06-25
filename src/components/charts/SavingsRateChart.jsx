import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-lg p-3 shadow-[var(--shadow-card)]">
        <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">
          {label}
        </p>
        <p className="text-sm font-bold font-mono text-[var(--color-finance-savings)]">
          Savings Rate: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

export default function SavingsRateChartComponent({ data, height = 300 }) {
  // Compute savings rate for each month
  const chartData = useMemo(() => {
    return data.map(d => {
      let rate = 0;
      if (d.income > 0) {
        rate = Math.round(((d.income - d.expenses) / d.income) * 100);
      }
      return {
        ...d,
        rate
      };
    });
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-default)" opacity={0.2} vertical={false} />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
          tickFormatter={(val) => `${val}%`}
          dx={-10}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-border-hover)', strokeWidth: 1, strokeDasharray: '4 4' }} />
        
        {/* Baseline for 0% savings */}
        <ReferenceLine y={0} stroke="var(--color-border-default)" strokeDasharray="3 3" />

        <Line
          type="monotone"
          dataKey="rate"
          name="Savings Rate"
          stroke="var(--color-finance-savings)"
          strokeWidth={3}
          dot={{ fill: 'var(--color-finance-savings)', strokeWidth: 0, r: 4 }}
          activeDot={{ r: 7, fill: 'var(--color-finance-savings)', stroke: 'var(--color-bg-primary)', strokeWidth: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
