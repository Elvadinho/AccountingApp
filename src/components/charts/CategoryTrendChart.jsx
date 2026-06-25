import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
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
            <div key={index} className="flex justify-between items-center text-sm font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-[var(--color-text-secondary)]">{entry.name}</span>
              </div>
              <span className="font-bold text-[var(--color-text-primary)]">
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

export default function CategoryTrendChartComponent({ transactions, height = 300 }) {
  // Process data: Top 3-4 categories over the last 6 months
  const { chartData, topCategories } = useMemo(() => {
    // 1. Group expenses by category
    const expenseTotals = {};
    const monthlyDataMap = {};
    
    // Initialize last 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthStr = d.toLocaleString('default', { month: 'short' });
      monthlyDataMap[monthStr] = { month: monthStr };
    }

    transactions.forEach(t => {
      if (t.type === 'expense') {
        expenseTotals[t.category] = (expenseTotals[t.category] || 0) + t.amount;
      }
    });

    // 2. Find top 3 categories
    const topCategories = Object.entries(expenseTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);

    if (topCategories.length === 0) return { chartData: [], topCategories: [] };

    // 3. Populate monthly data for top categories
    transactions.forEach(t => {
      if (t.type === 'expense' && topCategories.includes(t.category)) {
        const d = new Date(t.date);
        const monthStr = d.toLocaleString('default', { month: 'short' });
        
        if (monthlyDataMap[monthStr]) {
          monthlyDataMap[monthStr][t.category] = (monthlyDataMap[monthStr][t.category] || 0) + t.amount;
        }
      }
    });

    return { 
      chartData: Object.values(monthlyDataMap),
      topCategories
    };
  }, [transactions]);

  if (chartData.length === 0) {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center text-[var(--color-text-muted)] text-sm">
        Not enough expense data.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
          tickFormatter={(val) => {
            if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
            if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
            return val;
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '11px', color: 'var(--color-text-secondary)', paddingTop: '10px' }} />

        {topCategories.map((category, index) => {
          const color = getCategoryColor(category);
          return (
            <Area
              key={category}
              type="monotone"
              dataKey={category}
              stackId="1"
              stroke={color}
              fill={color}
              fillOpacity={0.6}
            />
          );
        })}
      </AreaChart>
    </ResponsiveContainer>
  );
}
