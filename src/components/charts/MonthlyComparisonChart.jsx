import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';
import { getCategoryColor } from '../../utils/categories';
import { formatCurrency } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-lg p-3 shadow-[var(--shadow-card)] min-w-[200px]">
        <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-3 pb-2 border-b border-[var(--color-border-default)]">
          {label}
        </p>
        <div className="space-y-2">
          {payload.map((entry, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-[var(--color-text-secondary)]">{entry.name}</span>
              </div>
              <span className="font-bold font-mono text-[var(--color-text-primary)]">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

/**
 * MonthlyComparisonChart — Compares spending per category 
 * between the current month and the previous month side by side.
 * Gives users an instant view of where they're spending more or less.
 */
export default function MonthlyComparisonChart({ transactions, height = 300 }) {
  const chartData = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const lastMonthDate = new Date(thisYear, thisMonth - 1, 1);
    const lastMonth = lastMonthDate.getMonth();
    const lastYear = lastMonthDate.getFullYear();

    const thisMonthLabel = now.toLocaleString('default', { month: 'short' });
    const lastMonthLabel = lastMonthDate.toLocaleString('default', { month: 'short' });

    // Aggregate expenses per category for both months
    const thisMonthSpending = {};
    const lastMonthSpending = {};

    transactions.forEach(t => {
      if (t.type !== 'expense') return;
      const d = new Date(t.date);
      const m = d.getMonth();
      const y = d.getFullYear();

      if (m === thisMonth && y === thisYear) {
        thisMonthSpending[t.category] = (thisMonthSpending[t.category] || 0) + t.amount;
      } else if (m === lastMonth && y === lastYear) {
        lastMonthSpending[t.category] = (lastMonthSpending[t.category] || 0) + t.amount;
      }
    });

    // Merge all categories
    const allCategories = new Set([
      ...Object.keys(thisMonthSpending),
      ...Object.keys(lastMonthSpending)
    ]);

    const data = Array.from(allCategories).map(category => ({
      category,
      [thisMonthLabel]: thisMonthSpending[category] || 0,
      [lastMonthLabel]: lastMonthSpending[category] || 0,
      color: getCategoryColor(category),
    }));

    // Sort by this month spending descending
    data.sort((a, b) => b[thisMonthLabel] - a[thisMonthLabel]);

    return { data, thisMonthLabel, lastMonthLabel };
  }, [transactions]);

  if (chartData.data.length === 0) {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center text-[var(--color-text-muted)] text-sm">
        Not enough expense data to compare.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={chartData.data}
        layout="vertical"
        margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-default)" opacity={0.2} horizontal={false} />
        <XAxis
          type="number"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
          tickFormatter={(val) => {
            if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
            if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
            return val;
          }}
        />
        <YAxis
          dataKey="category"
          type="category"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
          width={90}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-bg-tertiary)', opacity: 0.5 }} />
        <Legend wrapperStyle={{ fontSize: '11px', color: 'var(--color-text-secondary)', paddingTop: '10px' }} />
        <Bar
          dataKey={chartData.thisMonthLabel}
          name={`This Month (${chartData.thisMonthLabel})`}
          fill="var(--color-finance-expense)"
          radius={[0, 4, 4, 0]}
          maxBarSize={18}
        />
        <Bar
          dataKey={chartData.lastMonthLabel}
          name={`Last Month (${chartData.lastMonthLabel})`}
          fill="var(--color-accent-blue)"
          radius={[0, 4, 4, 0]}
          maxBarSize={18}
          fillOpacity={0.5}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
