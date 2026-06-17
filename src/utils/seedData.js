import { v4 as uuidv4 } from 'uuid';

/**
 * Generate seed data for demo purposes.
 * Creates 6 months of realistic transactions and budget limits.
 * Called on first app launch when localStorage is empty.
 */

function getDateOffset(monthsAgo, day = 1) {
  const date = new Date();
  date.setMonth(date.getMonth() - monthsAgo);
  date.setDate(day);
  date.setHours(12, 0, 0, 0);
  return date.toISOString();
}

export const seedTransactions = [
  // --- Current Month ---
  { id: uuidv4(), type: 'income', amount: 350000, category: 'Salary', description: 'Monthly salary', date: getDateOffset(0, 1) },
  { id: uuidv4(), type: 'income', amount: 75000, category: 'Business', description: 'Freelance web design project', date: getDateOffset(0, 5) },
  { id: uuidv4(), type: 'expense', amount: 45000, category: 'Food', description: 'Monthly groceries', date: getDateOffset(0, 3) },
  { id: uuidv4(), type: 'expense', amount: 15000, category: 'Transport', description: 'Fuel for the month', date: getDateOffset(0, 4) },
  { id: uuidv4(), type: 'expense', amount: 80000, category: 'Housing', description: 'Rent payment', date: getDateOffset(0, 2) },
  { id: uuidv4(), type: 'expense', amount: 12000, category: 'Utilities', description: 'Electricity bill', date: getDateOffset(0, 6) },
  { id: uuidv4(), type: 'expense', amount: 8000, category: 'Entertainment', description: 'Netflix & Spotify subscriptions', date: getDateOffset(0, 7) },
  { id: uuidv4(), type: 'expense', amount: 25000, category: 'Shopping', description: 'New shoes', date: getDateOffset(0, 10) },

  // --- 1 Month Ago ---
  { id: uuidv4(), type: 'income', amount: 350000, category: 'Salary', description: 'Monthly salary', date: getDateOffset(1, 1) },
  { id: uuidv4(), type: 'income', amount: 50000, category: 'Business', description: 'Logo design commission', date: getDateOffset(1, 12) },
  { id: uuidv4(), type: 'expense', amount: 42000, category: 'Food', description: 'Monthly groceries', date: getDateOffset(1, 3) },
  { id: uuidv4(), type: 'expense', amount: 18000, category: 'Transport', description: 'Taxi and fuel', date: getDateOffset(1, 5) },
  { id: uuidv4(), type: 'expense', amount: 80000, category: 'Housing', description: 'Rent payment', date: getDateOffset(1, 2) },
  { id: uuidv4(), type: 'expense', amount: 35000, category: 'Health', description: 'Doctor visit and medication', date: getDateOffset(1, 15) },
  { id: uuidv4(), type: 'expense', amount: 10000, category: 'Utilities', description: 'Water and electricity', date: getDateOffset(1, 8) },
  { id: uuidv4(), type: 'expense', amount: 20000, category: 'Education', description: 'Online course subscription', date: getDateOffset(1, 20) },

  // --- 2 Months Ago ---
  { id: uuidv4(), type: 'income', amount: 350000, category: 'Salary', description: 'Monthly salary', date: getDateOffset(2, 1) },
  { id: uuidv4(), type: 'expense', amount: 48000, category: 'Food', description: 'Groceries and dining out', date: getDateOffset(2, 4) },
  { id: uuidv4(), type: 'expense', amount: 80000, category: 'Housing', description: 'Rent payment', date: getDateOffset(2, 2) },
  { id: uuidv4(), type: 'expense', amount: 14000, category: 'Transport', description: 'Bus pass and fuel', date: getDateOffset(2, 6) },
  { id: uuidv4(), type: 'expense', amount: 22000, category: 'Shopping', description: 'Clothes shopping', date: getDateOffset(2, 18) },
  { id: uuidv4(), type: 'expense', amount: 9000, category: 'Utilities', description: 'Phone and internet bill', date: getDateOffset(2, 10) },

  // --- 3 Months Ago ---
  { id: uuidv4(), type: 'income', amount: 350000, category: 'Salary', description: 'Monthly salary', date: getDateOffset(3, 1) },
  { id: uuidv4(), type: 'income', amount: 100000, category: 'Business', description: 'Mobile app development project', date: getDateOffset(3, 10) },
  { id: uuidv4(), type: 'expense', amount: 40000, category: 'Food', description: 'Monthly groceries', date: getDateOffset(3, 3) },
  { id: uuidv4(), type: 'expense', amount: 80000, category: 'Housing', description: 'Rent payment', date: getDateOffset(3, 2) },
  { id: uuidv4(), type: 'expense', amount: 60000, category: 'Education', description: 'Semester textbooks', date: getDateOffset(3, 8) },
  { id: uuidv4(), type: 'expense', amount: 16000, category: 'Transport', description: 'Fuel and maintenance', date: getDateOffset(3, 14) },
  { id: uuidv4(), type: 'expense', amount: 15000, category: 'Entertainment', description: 'Concert tickets', date: getDateOffset(3, 22) },

  // --- 4 Months Ago ---
  { id: uuidv4(), type: 'income', amount: 350000, category: 'Salary', description: 'Monthly salary', date: getDateOffset(4, 1) },
  { id: uuidv4(), type: 'expense', amount: 38000, category: 'Food', description: 'Groceries', date: getDateOffset(4, 5) },
  { id: uuidv4(), type: 'expense', amount: 80000, category: 'Housing', description: 'Rent payment', date: getDateOffset(4, 2) },
  { id: uuidv4(), type: 'expense', amount: 12000, category: 'Transport', description: 'Fuel', date: getDateOffset(4, 7) },
  { id: uuidv4(), type: 'expense', amount: 45000, category: 'Health', description: 'Annual checkup and lab work', date: getDateOffset(4, 16) },
  { id: uuidv4(), type: 'expense', amount: 11000, category: 'Utilities', description: 'Bills', date: getDateOffset(4, 9) },

  // --- 5 Months Ago ---
  { id: uuidv4(), type: 'income', amount: 350000, category: 'Salary', description: 'Monthly salary', date: getDateOffset(5, 1) },
  { id: uuidv4(), type: 'income', amount: 30000, category: 'Business', description: 'Tutoring income', date: getDateOffset(5, 15) },
  { id: uuidv4(), type: 'expense', amount: 44000, category: 'Food', description: 'Groceries and restaurants', date: getDateOffset(5, 4) },
  { id: uuidv4(), type: 'expense', amount: 80000, category: 'Housing', description: 'Rent payment', date: getDateOffset(5, 2) },
  { id: uuidv4(), type: 'expense', amount: 20000, category: 'Transport', description: 'Car repair', date: getDateOffset(5, 11) },
  { id: uuidv4(), type: 'expense', amount: 30000, category: 'Shopping', description: 'Electronics accessories', date: getDateOffset(5, 19) },
  { id: uuidv4(), type: 'expense', amount: 8000, category: 'Utilities', description: 'Internet bill', date: getDateOffset(5, 8) },
];

export const seedBudgets = [
  { category: 'Food', limit: 50000 },
  { category: 'Transport', limit: 20000 },
  { category: 'Housing', limit: 85000 },
  { category: 'Health', limit: 40000 },
  { category: 'Education', limit: 30000 },
  { category: 'Entertainment', limit: 15000 },
  { category: 'Shopping', limit: 30000 },
  { category: 'Utilities', limit: 15000 },
];
