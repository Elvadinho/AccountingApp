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
import AreaChartComponent from '../components/charts/AreaChart';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { getCategoryByName, getCategoryColor } from '../utils/categories';

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
              trend >= 0 ? 'text-[var(--color-finance-income)]' : 'text-[var(--color-finance-expense)]'
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
  const catInfo = getCategoryByName(category);
  const CatIcon = catInfo?.icon;
  const catColor = getCategoryColor(category);
  const barColor =
    percentage >= 100
      ? 'var(--color-finance-expense)'
      : percentage >= 70
        ? 'var(--color-accent-yellow)'
        : 'var(--color-finance-income)';

  return (
    <div className="flex items-center gap-3">
      {CatIcon && (
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${catColor}15` }}
        >
          <CatIcon className="w-3.5 h-3.5" style={{ color: catColor }} />
        </div>
      )}
      <span className="text-sm text-[var(--color-text-secondary)] w-20 truncate">{category}</span>
      <div className="flex-1 h-2 rounded-full bg-[var(--color-bg-tertiary)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: barColor }}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Wallet}
          label="Net Balance"
          value={formatCurrency(balance)}
          color="var(--color-finance-balance)"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Income"
          value={formatCurrency(totalIncome)}
          color="var(--color-finance-income)"
        />
        <StatCard
          icon={TrendingDown}
          label="Total Expenses"
          value={formatCurrency(totalExpenses)}
          color="var(--color-finance-expense)"
        />
        <StatCard
          icon={PiggyBank}
          label="Savings Rate"
          value={`${Math.round(savingsRate * 100)}%`}
          color="var(--color-finance-savings)"
        />
      </div>

      {/* Charts & Lists Row — chart takes more space on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Monthly Bar Chart — bigger on large screens */}
        <Card className="lg:col-span-3 flex flex-col">
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-4 shrink-0">
            Income vs Expenses
          </h2>
          <div className="h-[360px] lg:h-[400px] w-full">
            <BarChartComponent data={monthlyData} height="100%" />
          </div>
        </Card>

        {/* Budget Overview */}
        <Card className="lg:col-span-2">
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

      {/* Net Worth Trend */}
      <Card className="mt-4">
        <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">
          Net Worth Trend (6 Months)
        </h2>
        <div className="h-[250px] w-full">
          <AreaChartComponent data={monthlyData} height="100%" />
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card className="mt-4">
        <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">
          Recent Transactions
        </h2>
        <div className="space-y-1">
          {recentTransactions.map((t) => {
            const catInfo = getCategoryByName(t.category);
            const CatIcon = catInfo?.icon;
            const catColor = getCategoryColor(t.category);

            return (
              <div
                key={t.id}
                className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-[var(--color-bg-tertiary)] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Category Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${catColor}15` }}
                  >
                    {CatIcon ? (
                      <CatIcon className="w-5 h-5" style={{ color: catColor }} />
                    ) : (
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: catColor }}
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                      {t.description}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{formatDate(t.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                  <div className="hidden sm:block">
                    <Badge category={t.category} />
                  </div>
                  <span
                    className={`text-sm md:text-base font-mono font-bold ${
                      t.type === 'income'
                        ? 'text-[var(--color-finance-income)]'
                        : 'text-[var(--color-finance-expense)]'
                    }`}
                  >
                    {t.type === 'income' ? '+' : '-'}
                    {formatCurrency(t.amount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </PageWrapper>
  );
}
