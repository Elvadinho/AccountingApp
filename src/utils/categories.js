import {
  Utensils,
  Car,
  Home,
  Heart,
  GraduationCap,
  Gamepad2,
  ShoppingBag,
  Zap,
  Briefcase,
  Building2,
  MoreHorizontal,
} from 'lucide-react';

/**
 * Category definitions for transactions.
 * Each category has a name, icon component, and unique accent color.
 */
export const categories = [
  { name: 'Food', icon: Utensils, color: '#ff6b6b' },
  { name: 'Transport', icon: Car, color: '#4ecdc4' },
  { name: 'Housing', icon: Home, color: '#45b7d1' },
  { name: 'Health', icon: Heart, color: '#ff6b9d' },
  { name: 'Education', icon: GraduationCap, color: '#c44dff' },
  { name: 'Entertainment', icon: Gamepad2, color: '#ffd93d' },
  { name: 'Shopping', icon: ShoppingBag, color: '#ff8a5c' },
  { name: 'Utilities', icon: Zap, color: '#6bcb77' },
  { name: 'Salary', icon: Briefcase, color: '#00c896' },
  { name: 'Business', icon: Building2, color: '#4d94ff' },
  { name: 'Other', icon: MoreHorizontal, color: '#a0a0a0' },
];

/**
 * Expense-only categories (excludes income categories like Salary, Business).
 */
export const expenseCategories = categories.filter(
  (c) => !['Salary', 'Business'].includes(c.name)
);

/**
 * Income-only categories.
 */
export const incomeCategories = categories.filter((c) =>
  ['Salary', 'Business', 'Other'].includes(c.name)
);

/**
 * Get a category object by name.
 * @param {string} name
 * @returns {object|undefined}
 */
export function getCategoryByName(name) {
  return categories.find((c) => c.name === name);
}

/**
 * Get the color for a category by name.
 * @param {string} name
 * @returns {string} hex color
 */
export function getCategoryColor(name) {
  const cat = getCategoryByName(name);
  return cat ? cat.color : '#a0a0a0';
}
