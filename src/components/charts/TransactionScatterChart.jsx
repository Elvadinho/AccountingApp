import React, { useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { getCategoryColor } from '../../utils/categories';
import { formatCurrency } from '../../utils/formatters';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-lg p-3 shadow-[var(--shadow-card)]">
        <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-1">
          {data.dateString}
        </p>
        <p className="text-sm font-bold text-[var(--color-text-primary)] mb-1">
          {data.description || data.category}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: `${data.color}20`, color: data.color }}>
            {data.category}
          </span>
          <span className="text-sm font-mono font-bold text-[var(--color-finance-expense)]">
            {formatCurrency(data.amount)}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function TransactionScatterChartComponent({ transactions, height = 300 }) {
  const chartData = useMemo(() => {
    // Only plot expenses for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return transactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= thirtyDaysAgo)
      .map(t => {
        const d = new Date(t.date);
        return {
          ...t,
          dayOfMonth: d.getDate(),
          amount: t.amount,
          dateString: d.toLocaleDateString(),
          color: getCategoryColor(t.category)
        };
      });
  }, [transactions]);

  if (chartData.length === 0) {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center text-[var(--color-text-muted)] text-sm">
        No recent expenses to display.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-default)" opacity={0.2} vertical={false} />
        <XAxis
          dataKey="dayOfMonth"
          type="number"
          domain={[1, 31]}
          name="Day"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
          label={{ value: 'Day of Month', position: 'insideBottom', offset: -5, fontSize: 10, fill: 'var(--color-text-muted)' }}
        />
        <YAxis
          dataKey="amount"
          type="number"
          name="Amount"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
          tickFormatter={(val) => {
            if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
            if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
            return val;
          }}
        />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
        <Scatter name="Expenses" data={chartData}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}
