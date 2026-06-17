import { useState, useEffect } from 'react';

/**
 * Custom hook for persisting state in localStorage.
 * Reads from localStorage on mount, writes on every state change.
 * Handles JSON parse/stringify and error recovery gracefully.
 *
 * @param {string} key - The localStorage key
 * @param {*} defaultValue - The default value if key doesn't exist
 * @returns {[*, Function]} - [storedValue, setValue]
 */
export function useLocalStorage(key, defaultValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error writing localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
