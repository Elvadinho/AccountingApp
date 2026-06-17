import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Award, Calendar } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';
import BarChartComponent from '../components/charts/BarChart';
import LineChartComponent from '../components/charts/LineChart';
import DonutChart from '../components/charts/DonutChart';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';
import { getCategoryColor } from '../utils/categories';

export default function Reports() {
  const { transactions, monthlyData, spendingByCategory } = useFinance();

  // Prepare donut chart data
  const donutData = useMemo(() => {
    return Object.entries(spendingByCategory)
      .map(([name, value]) => ({
        name,
        value,
        color: getCategoryColor(name),
      }))
      .sort((a, b) => b.value - a.value);
  }, [spendingByCategory]);

  // Prepare balance trend data (cumulative)
  const balanceTrendData = useMemo(() => {
    let cumulative = 0;
    return monthlyData.map((m) => {
      cumulative += m.balance;
      return {
        month: m.month,
        balance: cumulative,
      };
    });
  }, [monthlyData]);

  // Summary stats
  const stats = useMemo(() => {
    const highestCategory = donutData.length > 0 ? donutData[0] : null;

    const bestSavingMonth = [...monthlyData].sort((a, b) => b.balance - a.balance)[0];

    const totalExpenses = monthlyData.reduce((sum, m) => sum + m.expenses, 0);
    const avgMonthlyExpense = monthlyData.length > 0 ? totalExpenses / monthlyData.length : 0;

    const totalIncome = monthlyData.reduce((sum, m) => sum + m.income, 0);
    const avgMonthlyIncome = monthlyData.length > 0 ? totalIncome / monthlyData.length : 0;

    return { highestCategory, bestSavingMonth, avgMonthlyExpense, avgMonthlyIncome };
  }, [donutData, monthlyData]);

  return (
    <PageWrapper title="Reports">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-red-glow)] flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-[var(--color-accent-red)]" />
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Top Spending Category</p>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              {stats.highestCategory?.name || 'N/A'}
            </p>
            <p className="text-xs font-mono text-[var(--color-accent-red)]">
              {stats.highestCategory ? formatCurrency(stats.highestCategory.value) : '-'}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-green-glow)] flex items-center justify-center">
            <Award className="w-5 h-5 text-[var(--color-accent-green)]" />
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Best Saving Month</p>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              {stats.bestSavingMonth?.month || 'N/A'}
            </p>
            <p className="text-xs font-mono text-[var(--color-accent-green)]">
              {stats.bestSavingMonth ? formatCurrency(stats.bestSavingMonth.balance) : '-'}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: 'rgba(77, 148, 255, 0.15)' }}>
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[var(--color-accent-blue)]" />
            </div>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Avg Monthly Income</p>
            <p className="text-sm font-bold font-mono text-[var(--color-accent-green)]">
              {formatCurrency(stats.avgMonthlyIncome)}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: 'rgba(255, 184, 77, 0.15)' }}>
            <div className="w-full h-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[var(--color-accent-yellow)]" />
            </div>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Avg Monthly Expense</p>
            <p className="text-sm font-bold font-mono text-[var(--color-accent-red)]">
              {formatCurrency(stats.avgMonthlyExpense)}
            </p>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Expense Breakdown Donut */}
        <Card>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">
            Expense Breakdown (This Month)
          </h2>
          {donutData.length > 0 ? (
            <DonutChart data={donutData} height={300} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-sm text-[var(--color-text-muted)]">
              No expense data for this month
            </div>
          )}
        </Card>

        {/* Balance Trend */}
        <Card>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">
            Balance Trend (6 Months)
          </h2>
          <LineChartComponent data={balanceTrendData} height={300} />
        </Card>
      </div>

      {/* Income vs Expense Bar Chart */}
      <Card>
        <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">
          Income vs Expenses (6 Months)
        </h2>
        <BarChartComponent data={monthlyData} height={320} />
      </Card>
    </PageWrapper>
  );
}
