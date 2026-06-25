import { useState, useMemo } from 'react';
import { Plus, Search, Trash2, Filter } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { categories, expenseCategories, incomeCategories } from '../utils/categories';

function TransactionForm({ onSubmit, onClose }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const availableCategories = type === 'income' ? incomeCategories : expenseCategories;

  function handleSubmit(e) {
    e.preventDefault();
    if (!amount || !category || !description) return;

    onSubmit({
      type,
      amount: parseFloat(amount),
      category,
      description,
      date: new Date(date).toISOString(),
    });

    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type Toggle */}
      <div className="flex gap-2 p-1 bg-[var(--color-bg-tertiary)] rounded-lg">
        <button
          type="button"
          onClick={() => { setType('expense'); setCategory(''); }}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
            type === 'expense'
              ? 'bg-[var(--color-finance-expense)] text-white'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => { setType('income'); setCategory(''); }}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
            type === 'income'
              ? 'bg-[var(--color-finance-income)] text-white'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          Income
        </button>
      </div>

      {/* Amount */}
      <Input
        label="Amount (XAF)"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="e.g., 25000"
        min="1"
        required
      />

      {/* Category */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--color-text-secondary)]">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="px-3 py-2.5 rounded-[var(--radius-lg)] bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-[var(--color-accent-blue)] focus:ring-2 focus:ring-[var(--color-accent-blue-glow)] transition-all shadow-inner"
        >
          <option value="">Select a category</option>
          {availableCategories.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <Input
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="e.g., Monthly groceries"
        required
      />

      {/* Date */}
      <Input
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="primary" className="flex-1">
          <Plus className="w-4 h-4" />
          Add {type === 'income' ? 'Income' : 'Expense'}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default function Transactions() {
  const { transactions, addTransaction, deleteTransaction } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filteredTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .filter((t) => {
        const matchesSearch =
          !searchQuery ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !categoryFilter || t.category === categoryFilter;
        const matchesType = !typeFilter || t.type === typeFilter;
        return matchesSearch && matchesCategory && matchesType;
      });
  }, [transactions, searchQuery, categoryFilter, typeFilter]);

  return (
    <PageWrapper title="Transactions">
      {/* Header Actions */}
      <div className="flex flex-col lg:flex-row gap-3 mb-6">
        <Button variant="primary" onClick={() => setIsModalOpen(true)} className="lg:w-auto w-full">
          <Plus className="w-4 h-4" />
          Add Transaction
        </Button>

        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2.5 rounded-[var(--radius-lg)] bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] text-[var(--color-text-secondary)] text-sm focus:outline-none focus:border-[var(--color-accent-blue)] focus:ring-2 focus:ring-[var(--color-accent-blue-glow)] transition-all shadow-inner"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2.5 rounded-[var(--radius-lg)] bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] text-[var(--color-text-secondary)] text-sm focus:outline-none focus:border-[var(--color-accent-blue)] focus:ring-2 focus:ring-[var(--color-accent-blue-glow)] transition-all shadow-inner"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <Card>
        {/* Table Header - Desktop Only */}
        <div className="hidden md:grid grid-cols-[1fr_120px_120px_100px_40px] gap-4 px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider border-b border-[var(--color-border-default)] bg-[var(--color-bg-tertiary)]/30">
          <span>Description</span>
          <span>Date</span>
          <span>Category</span>
          <span className="text-right">Amount</span>
          <span />
        </div>

        {/* Transaction Rows */}
        <div className="divide-y divide-[var(--color-border-default)]">
          {filteredTransactions.length === 0 ? (
            <div className="py-16 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-[var(--color-text-muted)]" />
              </div>
              <p className="text-base font-medium text-[var(--color-text-primary)]">No transactions found</p>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            filteredTransactions.map((t, index) => (
              <div
                key={t.id}
                className={`flex flex-col md:grid md:grid-cols-[1fr_120px_120px_100px_40px] gap-3 md:gap-4 md:items-center px-4 py-3.5 hover:bg-[var(--color-bg-tertiary)]/50 transition-colors group animate-fade-in stagger-${(index % 4) + 1}`}
              >
                {/* Mobile Top Row / Desktop Col 1 */}
                <div className="flex justify-between md:block">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)] line-clamp-1">
                    {t.description}
                  </p>
                  {/* Mobile Amount (hidden on desktop) */}
                  <span
                    className={`md:hidden text-sm font-mono font-bold ${
                      t.type === 'income'
                        ? 'text-[var(--color-finance-income)]'
                        : 'text-[var(--color-finance-expense)]'
                    }`}
                  >
                    {t.type === 'income' ? '+' : '-'}
                    {t.amount.toLocaleString()}
                  </span>
                </div>

                {/* Date */}
                <span className="text-xs md:text-sm text-[var(--color-text-secondary)] flex items-center gap-2">
                  <span className="md:hidden">Date:</span> {formatDate(t.date)}
                </span>

                {/* Category & Mobile Delete */}
                <div className="flex justify-between items-center md:block mt-1 md:mt-0">
                  <Badge category={t.category} />
                  
                  {/* Mobile Delete Button */}
                  <button
                    onClick={() => deleteTransaction(t.id)}
                    className="md:hidden p-1.5 rounded-lg border border-[var(--color-border-default)] hover:bg-[var(--color-finance-expense-glow)] hover:border-[var(--color-finance-expense)] transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 text-[var(--color-finance-expense)]" />
                  </button>
                </div>

                {/* Desktop Amount */}
                <span
                  className={`hidden md:block text-sm font-mono font-semibold text-right ${
                    t.type === 'income'
                      ? 'text-[var(--color-finance-income)]'
                      : 'text-[var(--color-finance-expense)]'
                  }`}
                >
                  {t.type === 'income' ? '+' : '-'}
                  {t.amount.toLocaleString()}
                </span>

                {/* Desktop Delete Button */}
                <button
                  onClick={() => deleteTransaction(t.id)}
                  className="hidden md:flex opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-[var(--color-finance-expense-glow)] transition-all cursor-pointer items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 text-[var(--color-finance-expense)]" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 mt-3 border-t border-[var(--color-border-default)] px-3">
          <span className="text-xs text-[var(--color-text-muted)]">
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
          </span>
        </div>
      </Card>

      {/* Add Transaction Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Transaction"
      >
        <TransactionForm
          onSubmit={addTransaction}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </PageWrapper>
  );
}
