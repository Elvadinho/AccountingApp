/**
 * Format a number as currency in XAF (Central African CFA Franc).
 * @param {number} amount
 * @returns {string} e.g., "25,000 XAF"
 */
export function formatCurrency(amount) {
  const formatted = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const sign = amount < 0 ? '-' : '';
  return `${sign}${formatted} XAF`;
}

/**
 * Format an ISO date string to a human-readable date.
 * @param {string} isoString
 * @returns {string} e.g., "Jun 15, 2025"
 */
export function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a decimal value as a percentage.
 * @param {number} value - e.g., 0.42
 * @returns {string} e.g., "42%"
 */
export function formatPercent(value) {
  return `${Math.round(value * 100)}%`;
}

/**
 * Format a short month label from a date string.
 * @param {string} isoString
 * @returns {string} e.g., "Jun"
 */
export function formatMonth(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { month: 'short' });
}

/**
 * Format a month-year label from a date string.
 * @param {string} isoString
 * @returns {string} e.g., "Jun 2025"
 */
export function formatMonthYear(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
