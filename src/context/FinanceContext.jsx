import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { seedTransactions, seedBudgets } from '../utils/seedData';
import { v4 as uuidv4 } from 'uuid';

const FinanceContext = createContext(null);

/**
 * FinanceProvider — Central state management for the app.
 * Persists transactions and budgets in localStorage.
 * Provides computed values (totals, savings rate) and CRUD functions.
 */
export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useLocalStorage('geretonnkap_transactions', seedTransactions);
  const [budgets, setBudgets] = useLocalStorage('geretonnkap_budgets', seedBudgets);

  // --- CRUD Operations ---

  function addTransaction(transaction) {
    const newTransaction = {
      ...transaction,
      id: uuidv4(),
      date: transaction.date || new Date().toISOString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
    return newTransaction;
  }

  function deleteTransaction(id) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  function updateBudget(category, limit) {
    setBudgets((prev) => {
      const existing = prev.find((b) => b.category === category);
      if (existing) {
        return prev.map((b) => (b.category === category ? { ...b, limit } : b));
      }
      return [...prev, { category, limit }];
    });
  }

  function deleteBudget(category) {
    setBudgets((prev) => prev.filter((b) => b.category !== category));
  }

  function resetAllData() {
    setTransactions([]);
    setBudgets([]);
  }

  function restoreMockData() {
    setTransactions(seedTransactions);
    setBudgets(seedBudgets);
  }

  // --- Computed Values ---

  const computed = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (totalIncome - totalExpenses) / totalIncome : 0;

    // --- Monthly Aggregation (last 6 months) ---
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.getMonth();
      const year = date.getFullYear();
      const label = date.toLocaleDateString('en-US', { month: 'short' });

      const monthTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === month && tDate.getFullYear() === year;
      });

      const income = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      monthlyData.push({
        month: label,
        monthIndex: month,
        year,
        income,
        expenses,
        balance: income - expenses,
      });
    }

    // --- Spending by Category (current month) ---
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentMonthExpenses = transactions.filter((t) => {
      const tDate = new Date(t.date);
      return (
        t.type === 'expense' &&
        tDate.getMonth() === currentMonth &&
        tDate.getFullYear() === currentYear
      );
    });

    const spendingByCategory = {};
    currentMonthExpenses.forEach((t) => {
      spendingByCategory[t.category] = (spendingByCategory[t.category] || 0) + t.amount;
    });

    // --- Recent Transactions (last 5) ---
    const recentTransactions = [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // --- Budget with spending ---
    const budgetStatus = budgets.map((b) => ({
      ...b,
      spent: spendingByCategory[b.category] || 0,
      percentage: b.limit > 0 ? ((spendingByCategory[b.category] || 0) / b.limit) * 100 : 0,
    }));

    return {
      totalIncome,
      totalExpenses,
      balance,
      savingsRate,
      monthlyData,
      spendingByCategory,
      recentTransactions,
      budgetStatus,
    };
  }, [transactions, budgets]);

  const value = {
    transactions,
    budgets,
    addTransaction,
    deleteTransaction,
    updateBudget,
    deleteBudget,
    resetAllData,
    restoreMockData,
    setBudgets,
    ...computed,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

/**
 * Hook to access the Finance context.
 * Must be used within a FinanceProvider.
 */
export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
