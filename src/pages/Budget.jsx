import { useState } from 'react';
import { Save, AlertTriangle, Trash2, Wallet, TrendingDown, TrendingUp, ShieldAlert, Target, Plus, Pencil } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';
import { getCategoryByName, getCategoryColor, expenseCategories } from '../utils/categories';

function BudgetCard({ budget, onUpdate, onDelete }) {
  const { category, limit, spent, percentage } = budget;
  const catInfo = getCategoryByName(category);
  const color = getCategoryColor(category);
  const Icon = catInfo?.icon;
  const [editValue, setEditValue] = useState(limit);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const barColor = percentage >= 100
    ? 'var(--color-finance-expense)'
    : percentage >= 80
      ? 'var(--color-accent-yellow)'
      : 'var(--color-finance-income)';

  const badgeColor = percentage >= 100
    ? 'bg-[var(--color-finance-expense-glow)] text-[var(--color-finance-expense)]'
    : percentage >= 80
      ? 'bg-[var(--color-accent-yellow-glow)] text-[var(--color-accent-yellow)]'
      : 'bg-[var(--color-finance-income-glow)] text-[var(--color-finance-income)]';

  return (
    <>
      <Card className="hover:border-[var(--color-border-hover)] transition-all group relative">
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
          {/* Percentage Badge */}
          <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded-full ${badgeColor}`}>
            {Math.round(percentage)}%
          </span>
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

        {/* Spent / Limit — two-column layout */}
        <div className="flex items-center justify-between mb-4 gap-2">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">Spent</p>
            <p className="text-sm font-mono font-semibold text-[var(--color-finance-expense)]">
              {formatCurrency(spent)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">Limit</p>
            <p className="text-sm font-mono font-semibold text-[var(--color-text-primary)]">
              {formatCurrency(limit)}
            </p>
          </div>
        </div>

        {/* Over budget warning */}
        {percentage >= 100 && (
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--color-finance-expense-glow)] mb-3">
            <AlertTriangle className="w-3.5 h-3.5 text-[var(--color-finance-expense)]" />
            <span className="text-xs font-medium text-[var(--color-finance-expense)]">
              Over budget by {formatCurrency(spent - limit)}
            </span>
          </div>
        )}

        {/* Edit / Delete actions toolbar */}
        <div className="flex items-center gap-2 pt-3 border-t border-[var(--color-border-default)]">
          {isEditing ? (
            <>
              <input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] text-sm font-mono focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
                min="0"
                step="1000"
                autoFocus
              />
              <Button
                variant="primary"
                onClick={() => {
                  onUpdate(category, Number(editValue));
                  setIsEditing(false);
                }}
                className="px-3 py-2"
                title="Save"
              >
                <Save className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setEditValue(limit);
                  setIsEditing(false);
                }}
                className="px-2.5 py-2"
                title="Cancel"
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="flex-1 text-xs gap-1.5"
                title="Edit Limit"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit Limit
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-2.5 text-[var(--color-finance-expense)] hover:text-[var(--color-finance-expense)] hover:bg-[var(--color-finance-expense-glow)]"
                title="Delete Budget"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Budget"
      >
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[var(--color-finance-expense-glow)] flex items-center justify-center">
            <Trash2 className="w-7 h-7 text-[var(--color-finance-expense)]" />
          </div>
          <p className="text-[var(--color-text-primary)] font-medium mb-1">
            Delete "{category}" budget?
          </p>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            This will remove the {formatCurrency(limit)} monthly limit for {category}. Your transactions will not be affected.
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                onDelete(category);
                setShowDeleteConfirm(false);
              }}
              className="flex-1"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default function Budget() {
  const { budgetStatus, updateBudget, deleteBudget } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newLimit, setAmount] = useState('');

  const totalBudget = budgetStatus.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgetStatus.reduce((sum, b) => sum + b.spent, 0);
  const totalOverBudget = budgetStatus.filter(b => b.spent > b.limit).reduce((sum, b) => sum + (b.spent - b.limit), 0);
  const totalLeft = Math.max(0, totalBudget - totalSpent);
  const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const p = Math.min(overallPercentage, 100);
  const categoriesOverBudget = budgetStatus.filter(b => b.spent > b.limit).length;

  // Filter out categories that already have a budget
  const availableCategories = expenseCategories.filter(
    (c) => !budgetStatus.find((b) => b.category === c.name)
  );

  function handleAddBudget(e) {
    e.preventDefault();
    if (!newCategory || !newLimit) return;
    updateBudget(newCategory, parseFloat(newLimit));
    setIsModalOpen(false);
    setNewCategory('');
    setAmount('');
  }

  return (
    <PageWrapper title="Budget">
      {/* Page Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Track your spending against budget limits for the current month.
        </p>
        {availableCategories.length > 0 && (
          <Button variant="primary" onClick={() => setIsModalOpen(true)} className="shrink-0">
            <Plus className="w-4 h-4" />
            Add Budget
          </Button>
        )}
      </div>

      {/* 4 Stat Mini-Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-blue-glow)] flex items-center justify-center shrink-0">
            <Target className="w-5 h-5 text-[var(--color-accent-blue)]" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Total Budget</p>
            <p className="text-base font-bold font-mono text-[var(--color-text-primary)] truncate">
              {formatCurrency(totalBudget)}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-finance-expense-glow)] flex items-center justify-center shrink-0">
            <TrendingDown className="w-5 h-5 text-[var(--color-finance-expense)]" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Total Spent</p>
            <p className="text-base font-bold font-mono text-[var(--color-finance-expense)] truncate">
              {formatCurrency(totalSpent)}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-finance-income-glow)] flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5 text-[var(--color-finance-income)]" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Remaining</p>
            <p className="text-base font-bold font-mono text-[var(--color-finance-income)] truncate">
              {formatCurrency(totalLeft)}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-red-glow)] flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 text-[var(--color-accent-red)]" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Over Budget</p>
            <p className="text-base font-bold font-mono text-[var(--color-accent-red)] truncate">
              {formatCurrency(totalOverBudget)}
            </p>
            {categoriesOverBudget > 0 && (
              <p className="text-[10px] text-[var(--color-text-muted)]">
                {categoriesOverBudget} categor{categoriesOverBudget === 1 ? 'y' : 'ies'}
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Overall Progress Bar */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
            Overall Budget Usage
          </h2>
          <span className="text-sm font-mono font-bold text-[var(--color-text-primary)]">
            {Math.round(overallPercentage)}%
          </span>
        </div>
        <div className="h-3 rounded-full bg-[var(--color-bg-tertiary)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${p}%`,
              backgroundColor:
                p >= 100
                  ? 'var(--color-finance-expense)'
                  : p >= 80
                    ? 'var(--color-accent-yellow)'
                    : 'var(--color-finance-income)',
            }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs font-mono text-[var(--color-text-muted)]">
            {formatCurrency(totalSpent)}
          </span>
          <span className="text-xs font-mono text-[var(--color-text-muted)]">
            {formatCurrency(totalBudget)}
          </span>
        </div>
      </Card>

      {/* Budget Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {budgetStatus.length > 0 ? (
          budgetStatus.map((b) => (
            <BudgetCard key={b.category} budget={b} onUpdate={updateBudget} onDelete={deleteBudget} />
          ))
        ) : (
          <div className="col-span-full py-16 text-center border border-dashed border-[var(--color-border-default)] rounded-xl flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-[var(--color-text-muted)]" />
            </div>
            <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-1">No budgets yet</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-5 max-w-sm">
              Set spending limits for your expense categories to keep your finances on track.
            </p>
            {availableCategories.length > 0 && (
              <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4" />
                Add Your First Budget
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Add Budget Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Budget"
      >
        <form onSubmit={handleAddBudget} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              Category
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
              required
            >
              <option value="">Select a category</option>
              {availableCategories.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              Monthly Limit (XAF)
            </label>
            <input
              type="number"
              value={newLimit}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 50000"
              className="w-full px-3 py-2.5 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors font-mono"
              min="0"
              required
            />
          </div>
          <div className="flex gap-3 pt-4 border-t border-[var(--color-border-default)] mt-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Save Budget
            </Button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
