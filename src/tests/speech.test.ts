import { describe, it, expect, beforeEach } from 'vitest';
import { getAccent, setAccent } from '../utils/speech';

describe('Accent persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to "us" when nothing stored', () => {
    expect(getAccent()).toBe('us');
  });

  it('returns "uk" after setAccent("uk")', () => {
    setAccent('uk');
    expect(getAccent()).toBe('uk');
  });

  it('returns "us" after setAccent("us")', () => {
    setAccent('uk');
    setAccent('us');
    expect(getAccent()).toBe('us');
  });

  it('ignores invalid values and falls back to "us"', () => {
    localStorage.setItem('dailyenglish_accent', 'fr');
    expect(getAccent()).toBe('us');
  });
});
