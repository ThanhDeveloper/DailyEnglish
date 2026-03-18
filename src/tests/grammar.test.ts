import { describe, it, expect } from 'vitest';
import { checkGrammar } from '../utils/grammar';

describe('checkGrammar', () => {
  // ── Subject-verb agreement ──────────────────────────────────────────────
  describe('subject-verb agreement', () => {
    it('corrects "he don\'t" → "he doesn\'t"', () => {
      const r = checkGrammar("he don't know");
      expect(r.corrected.toLowerCase()).toContain("he doesn't");
      expect(r.corrections.length).toBeGreaterThan(0);
    });

    it('corrects "she don\'t" → "she doesn\'t"', () => {
      const r = checkGrammar("she don't care");
      expect(r.corrected.toLowerCase()).toContain("doesn't");
    });

    it('corrects "he have" → "he has"', () => {
      const r = checkGrammar('he have a car');
      expect(r.corrected.toLowerCase()).toContain('he has');
    });

    it('corrects "she were" → "she was"', () => {
      const r = checkGrammar('she were happy');
      expect(r.corrected.toLowerCase()).toContain('she was');
    });

    it('corrects "he are" → "he is"', () => {
      const r = checkGrammar('he are a teacher');
      expect(r.corrected.toLowerCase()).toContain('he is');
    });
  });

  // ── Irregular past tense ────────────────────────────────────────────────
  describe('irregular past tense', () => {
    it('corrects "I goed" → "I went"', () => {
      const r = checkGrammar('I goed to the store');
      expect(r.corrected.toLowerCase()).toContain('went');
    });

    it('corrects "she runned" → "she ran"', () => {
      const r = checkGrammar('she runned away');
      expect(r.corrected.toLowerCase()).toContain('ran');
    });

    it('corrects "he taked" → "he took"', () => {
      const r = checkGrammar('he taked the book');
      expect(r.corrected.toLowerCase()).toContain('took');
    });

    it('corrects "they comed" → "they came"', () => {
      const r = checkGrammar('they comed late');
      expect(r.corrected.toLowerCase()).toContain('came');
    });
  });

  // ── Double negatives ─────────────────────────────────────────────────────
  describe('double negatives', () => {
    it('corrects "don\'t have no" → "don\'t have any"', () => {
      const r = checkGrammar("I don't have no money");
      expect(r.corrected.toLowerCase()).toContain('any');
    });

    it('corrects "can\'t do nothing" → "can\'t do anything"', () => {
      const r = checkGrammar("I can't do nothing");
      expect(r.corrected.toLowerCase()).toContain('anything');
    });
  });

  // ── Redundant phrases ────────────────────────────────────────────────────
  describe('redundant and incorrect phrases', () => {
    it('corrects "could of" → "could have"', () => {
      const r = checkGrammar('I could of done better');
      expect(r.corrected.toLowerCase()).toContain('could have');
    });

    it('corrects "should of" → "should have"', () => {
      const r = checkGrammar('you should of told me');
      expect(r.corrected.toLowerCase()).toContain('should have');
    });

    it('corrects "very unique" → "unique"', () => {
      const r = checkGrammar('it is very unique');
      expect(r.corrected.toLowerCase()).not.toContain('very unique');
    });
  });

  // ── Commonly confused words ──────────────────────────────────────────────
  describe('commonly confused words', () => {
    it('corrects "your welcome" → "you\'re welcome"', () => {
      const r = checkGrammar('your welcome');
      expect(r.corrected.toLowerCase()).toContain("you're");
    });

    it('corrects "its raining" → "it\'s raining"', () => {
      const r = checkGrammar("its raining outside");
      expect(r.corrected.toLowerCase()).toContain("it's");
    });

    it('corrects "their is" → "there is"', () => {
      const r = checkGrammar('their is a problem');
      expect(r.corrected.toLowerCase()).toContain('there is');
    });
  });

  // ── Article a/an ─────────────────────────────────────────────────────────
  describe('a / an article', () => {
    it('corrects "a apple" → "an apple"', () => {
      const r = checkGrammar('I ate a apple');
      expect(r.corrected.toLowerCase()).toContain('an apple');
    });

    it('corrects "an book" → "a book"', () => {
      const r = checkGrammar('I read an book');
      expect(r.corrected.toLowerCase()).toContain('a book');
    });

    it('handles silent h: "a hour" → "an hour"', () => {
      const r = checkGrammar('it took a hour');
      expect(r.corrected.toLowerCase()).toContain('an hour');
    });
  });

  // ── Clean text ───────────────────────────────────────────────────────────
  describe('clean text', () => {
    it('returns zero corrections for correct text', () => {
      const r = checkGrammar('She has a beautiful garden.');
      expect(r.corrections).toHaveLength(0);
      expect(r.corrected).toBe('She has a beautiful garden.');
    });

    it('preserves original in result', () => {
      const input = 'He go to school.';
      const r = checkGrammar(input);
      expect(r.original).toBe(input);
    });

    it('returns corrections array with required fields', () => {
      const r = checkGrammar("I could of gone");
      expect(r.corrections[0]).toMatchObject({
        rule: expect.any(String),
        explanation: expect.any(String),
        original: expect.any(String),
        corrected: expect.any(String),
      });
    });
  });
});
