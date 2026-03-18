import { useState, useCallback, useEffect } from 'react';
import { getAccent, setAccent, type Accent } from '../utils/speech';

/**
 * React hook for managing US/UK accent preference.
 * Listens for changes across components via a custom storage event.
 */
export function useAccent() {
  const [accent, setAccentState] = useState<Accent>(getAccent);

  const toggleAccent = useCallback(() => {
    const next: Accent = getAccent() === 'us' ? 'uk' : 'us';
    setAccent(next);
    setAccentState(next);
    // Notify other components in the same tab
    window.dispatchEvent(new Event('accent-changed'));
  }, []);

  useEffect(() => {
    const handler = () => setAccentState(getAccent());
    window.addEventListener('accent-changed', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('accent-changed', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  return { accent, toggleAccent };
}
