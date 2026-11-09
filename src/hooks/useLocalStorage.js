import { useEffect, useState } from 'react';

/**
 * Persist state to localStorage. Falls back gracefully when storage is unavailable.
 */
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) return JSON.parse(raw);
    } catch (err) {
      console.warn(`[useLocalStorage] read failed for "${key}"`, err);
    }
    return initialValue;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`[useLocalStorage] write failed for "${key}"`, err);
    }
  }, [key, value]);

  return [value, setValue];
}
