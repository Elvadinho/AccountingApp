import { useState } from 'react';
import { Save, AlertTriangle } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';
import { getCategoryByName, getCategoryColor } from '../utils/categories';

function BudgetCard({ budget, onUpdate }) {
  const { category, limit, spent, percentage } = budget;
  const catInfo = getCategoryByName(category);
  const color = getCategoryColor(category);
  const Icon = catInfo?.icon;
  const [editLimit, setEditLimit] = useState(limit);
  const isOverBudget = percentage >= 100;
  const isWarning = percentage >= 70 && percentage < 100;

  const barColor = isOverBudget
    ? 'var(--color-accent-red)'
    : isWarning
      ? 'var(--color-accent-yellow)'
      : 'var(--color-accent-green)';

  return (
    <Card className="hover:border-[var(--color-border-hover)] transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}15` }}
          >
            {Icon && <Icon className="w-5 h-5" style={{ color }} />}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{category}</h3>
            <p className="text-xs text-[var(--color-text-muted)]">Monthly budget</p>
          </div>
        </div>
        {isOverBudget && (
          <div className="flex items-center gap-1 text-[var(--color-accent-red)]">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-medium">Over budget</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="h-2.5 rounded-full bg-[var(--color-bg-tertiary)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: barColor,
            }}
          />
        </div>
      </div>

      {/* Spent / Limit */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-mono" style={{ color: barColor }}>
          {formatCurrency(spent)}
        </span>
        <span className="text-xs text-[var(--color-text-muted)]">of</span>
        <span className="text-sm font-mono text-[var(--color-text-secondary)]">
          {formatCurrency(limit)}
        </span>
      </div>

      {/* Edit Limit */}
      <div className="flex items-center gap-2 pt-3 border-t border-[var(--color-border-default)]">
        <input
          type="number"
          value={editLimit}
          onChange={(e) => setEditLimit(Number(e.target.value))}
          className="flex-1 px-3 py-2 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] text-sm font-mono focus:outline-none focus:border-[var(--color-accent-green)] transition-colors"
          min="0"
          step="1000"
        />
        <Button
          variant="ghost"
          onClick={() => onUpdate(category, editLimit)}
          className="px-3"
        >
          <Save className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

export default function Budget() {
  const { budgetStatus, updateBudget } = useFinance();

  const totalBudget = budgetStatus.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgetStatus.reduce((sum, b) => sum + b.spent, 0);
  const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <PageWrapper title="Budget">
      {/* Summary Card */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
              Monthly Budget Summary
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              Track your spending against budget limits for the current month
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs text-[var(--color-text-muted)]">Total Budget</p>
              <p className="text-lg font-bold font-mono text-[var(--color-text-primary)]">
                {formatCurrency(totalBudget)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[var(--color-text-muted)]">Total Spent</p>
              <p className="text-lg font-bold font-mono text-[var(--color-accent-yellow)]">
                {formatCurrency(totalSpent)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[var(--color-text-muted)]">Remaining</p>
              <p
                className={`text-lg font-bold font-mono ${
                  totalBudget - totalSpent >= 0
                    ? 'text-[var(--color-accent-green)]'
                    : 'text-[var(--color-accent-red)]'
                }`}
              >
                {formatCurrency(totalBudget - totalSpent)}
              </p>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mt-4">
          <div className="h-3 rounded-full bg-[var(--color-bg-tertiary)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(overallPercentage, 100)}%`,
                backgroundColor:
                  overallPercentage >= 100
                    ? 'var(--color-accent-red)'
                    : overallPercentage >= 70
                      ? 'var(--color-accent-yellow)'
                      : 'var(--color-accent-green)',
              }}
            />
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-1.5">
            {Math.round(overallPercentage)}% of total budget used
          </p>
        </div>
      </Card>

      {/* Budget Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {budgetStatus.map((b) => (
          <BudgetCard key={b.category} budget={b} onUpdate={updateBudget} />
        ))}
      </div>
    </PageWrapper>
  );
}
