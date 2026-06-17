import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import BarChartComponent from '../components/charts/BarChart';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { getCategoryColor } from '../utils/categories';

function StatCard({ icon: Icon, label, value, trend, trendLabel, color }) {
  return (
    <Card className="flex flex-col gap-3 hover:border-[var(--color-border-hover)] transition-colors">
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {trend !== undefined && (
          <span
            className={`flex items-center gap-0.5 text-xs font-medium ${
              trend >= 0 ? 'text-[var(--color-accent-green)]' : 'text-[var(--color-accent-red)]'
            }`}
          >
            {trend >= 0 ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            {trendLabel}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-[var(--color-text-secondary)]">{label}</p>
        <p className="text-2xl font-bold font-mono mt-1" style={{ color }}>
          {value}
        </p>
      </div>
    </Card>
  );
}

function BudgetProgressBar({ category, spent, limit }) {
  const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const color =
    percentage >= 100
      ? 'var(--color-accent-red)'
      : percentage >= 70
        ? 'var(--color-accent-yellow)'
        : 'var(--color-accent-green)';

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-[var(--color-text-secondary)] w-24 truncate">{category}</span>
      <div className="flex-1 h-2 rounded-full bg-[var(--color-bg-tertiary)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-mono text-[var(--color-text-muted)] w-12 text-right">
        {Math.round(percentage)}%
      </span>
    </div>
  );
}

export default function Dashboard() {
  const {
    balance,
    totalIncome,
    totalExpenses,
    savingsRate,
    monthlyData,
    recentTransactions,
    budgetStatus,
  } = useFinance();

  return (
    <PageWrapper title="Dashboard">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Wallet}
          label="Net Balance"
          value={formatCurrency(balance)}
          color={balance >= 0 ? 'var(--color-accent-green)' : 'var(--color-accent-red)'}
        />
        <StatCard
          icon={TrendingUp}
          label="Total Income"
          value={formatCurrency(totalIncome)}
          color="var(--color-accent-green)"
        />
        <StatCard
          icon={TrendingDown}
          label="Total Expenses"
          value={formatCurrency(totalExpenses)}
          color="var(--color-accent-red)"
        />
        <StatCard
          icon={PiggyBank}
          label="Savings Rate"
          value={`${Math.round(savingsRate * 100)}%`}
          color="var(--color-accent-blue)"
        />
      </div>

      {/* Charts & Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly Bar Chart */}
        <Card className="lg:col-span-2">
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">
            Income vs Expenses
          </h2>
          <BarChartComponent data={monthlyData} height={280} />
        </Card>

        {/* Budget Overview */}
        <Card>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">
            Budget Overview
          </h2>
          <div className="space-y-3">
            {budgetStatus.map((b) => (
              <BudgetProgressBar
                key={b.category}
                category={b.category}
                spent={b.spent}
                limit={b.limit}
              />
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="mt-4">
        <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">
          Recent Transactions
        </h2>
        <div className="space-y-2">
          {recentTransactions.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${getCategoryColor(t.category)}15` }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getCategoryColor(t.category) }}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    {t.description}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">{formatDate(t.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge category={t.category} />
                <span
                  className={`text-sm font-mono font-medium ${
                    t.type === 'income'
                      ? 'text-[var(--color-accent-green)]'
                      : 'text-[var(--color-accent-red)]'
                  }`}
                >
                  {t.type === 'income' ? '+' : '-'}
                  {formatCurrency(t.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </PageWrapper>
  );
}
