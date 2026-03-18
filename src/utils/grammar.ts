export interface GrammarCorrection {
  original: string;
  corrected: string;
  rule: string;
  explanation: string;
  position: { start: number; end: number };
}

export interface GrammarResult {
  original: string;
  corrected: string;
  corrections: GrammarCorrection[];
}

interface Rule {
  pattern: RegExp;
  replacement: string | ((match: string, ...groups: string[]) => string);
  rule: string;
  explanation: string;
}

// Vowel check helper
function startsWithVowelSound(word: string): boolean {
  const lower = word.toLowerCase();
  // Silent h words that take "an"
  const silentH = ['hour', 'hours', 'honest', 'honestly', 'honesty', 'honor', 'honour', 'heir', 'heirloom', 'herb'];
  if (silentH.some((h) => lower.startsWith(h))) return true;
  // "u" words that sound like "yoo" take "a"
  const uExceptions = ['uni', 'union', 'unique', 'unit', 'united', 'universal', 'university', 'uniform', 'usage', 'use', 'used', 'useful', 'user', 'usual', 'usually', 'utility', 'utensil'];
  if (uExceptions.some((u) => lower.startsWith(u))) return false;
  // "eu" and "ew" sound like "yoo"
  if (lower.startsWith('eu') || lower.startsWith('ew')) return false;
  // "one" and "once" start with "w" sound
  if (lower === 'one' || lower === 'once') return false;
  return /^[aeiou]/i.test(lower);
}

// Build the grammar rules
const rules: Rule[] = [
  // === Subject-verb agreement ===
  { pattern: /\b(he|she|it)\s+don't\b/gi, replacement: '$1 doesn\'t', rule: 'Subject-verb agreement', explanation: 'Third person singular subjects (he/she/it) use "doesn\'t" instead of "don\'t".' },
  { pattern: /\b(he|she|it)\s+have\b(?!\s+to\b)(?!\s+been\b)/gi, replacement: '$1 has', rule: 'Subject-verb agreement', explanation: 'Third person singular subjects (he/she/it) use "has" instead of "have".' },
  { pattern: /\b(he|she|it)\s+were\b/gi, replacement: '$1 was', rule: 'Subject-verb agreement', explanation: 'Third person singular subjects use "was" instead of "were" in indicative mood.' },
  { pattern: /\b(I|we|they|you)\s+was\b/gi, replacement: '$1 were', rule: 'Subject-verb agreement', explanation: 'Plural subjects and "I"/"you" use "were" instead of "was".' },
  { pattern: /\b(he|she|it)\s+are\b/gi, replacement: '$1 is', rule: 'Subject-verb agreement', explanation: 'Third person singular subjects use "is" instead of "are".' },
  { pattern: /\b(we|they)\s+is\b/gi, replacement: '$1 are', rule: 'Subject-verb agreement', explanation: 'Plural subjects use "are" instead of "is".' },
  { pattern: /\b(he|she|it)\s+go\b(?!es|ing|ne|t)/gi, replacement: '$1 goes', rule: 'Subject-verb agreement', explanation: 'Third person singular subjects require "goes" instead of "go".' },
  { pattern: /\b(he|she|it)\s+do\b(?!es|ing|ne|n't)/gi, replacement: '$1 does', rule: 'Subject-verb agreement', explanation: 'Third person singular subjects require "does" instead of "do".' },

  // === Common irregular past tense errors ===
  { pattern: /\bgoed\b/gi, replacement: 'went', rule: 'Irregular verb', explanation: '"Go" is an irregular verb. The past tense is "went", not "goed".' },
  { pattern: /\brunned\b/gi, replacement: 'ran', rule: 'Irregular verb', explanation: '"Run" is an irregular verb. The past tense is "ran", not "runned".' },
  { pattern: /\bcomed\b/gi, replacement: 'came', rule: 'Irregular verb', explanation: '"Come" is an irregular verb. The past tense is "came", not "comed".' },
  { pattern: /\bseed\b(?!\s*(pod|bank|bed|coat|ling))/gi, replacement: 'saw', rule: 'Irregular verb', explanation: '"See" is an irregular verb. The past tense is "saw", not "seed".' },
  { pattern: /\bteached\b/gi, replacement: 'taught', rule: 'Irregular verb', explanation: '"Teach" is an irregular verb. The past tense is "taught", not "teached".' },
  { pattern: /\bthinked\b/gi, replacement: 'thought', rule: 'Irregular verb', explanation: '"Think" is an irregular verb. The past tense is "thought", not "thinked".' },
  { pattern: /\bbuyed\b/gi, replacement: 'bought', rule: 'Irregular verb', explanation: '"Buy" is an irregular verb. The past tense is "bought", not "buyed".' },
  { pattern: /\bbringed\b/gi, replacement: 'brought', rule: 'Irregular verb', explanation: '"Bring" is an irregular verb. The past tense is "brought", not "bringed".' },
  { pattern: /\bcatched\b/gi, replacement: 'caught', rule: 'Irregular verb', explanation: '"Catch" is an irregular verb. The past tense is "caught", not "catched".' },
  { pattern: /\bfeeled\b/gi, replacement: 'felt', rule: 'Irregular verb', explanation: '"Feel" is an irregular verb. The past tense is "felt", not "feeled".' },
  { pattern: /\bfighted\b/gi, replacement: 'fought', rule: 'Irregular verb', explanation: '"Fight" is an irregular verb. The past tense is "fought", not "fighted".' },
  { pattern: /\bfinded\b/gi, replacement: 'found', rule: 'Irregular verb', explanation: '"Find" is an irregular verb. The past tense is "found", not "finded".' },
  { pattern: /\bknowed\b/gi, replacement: 'knew', rule: 'Irregular verb', explanation: '"Know" is an irregular verb. The past tense is "knew", not "knowed".' },
  { pattern: /\bleaved\b/gi, replacement: 'left', rule: 'Irregular verb', explanation: '"Leave" is an irregular verb. The past tense is "left", not "leaved".' },
  { pattern: /\bwrited\b/gi, replacement: 'wrote', rule: 'Irregular verb', explanation: '"Write" is an irregular verb. The past tense is "wrote", not "writed".' },
  { pattern: /\bdrived\b/gi, replacement: 'drove', rule: 'Irregular verb', explanation: '"Drive" is an irregular verb. The past tense is "drove", not "drived".' },
  { pattern: /\beated\b/gi, replacement: 'ate', rule: 'Irregular verb', explanation: '"Eat" is an irregular verb. The past tense is "ate", not "eated".' },
  { pattern: /\bspaked\b/gi, replacement: 'spoke', rule: 'Irregular verb', explanation: '"Speak" is an irregular verb. The past tense is "spoke", not "speaked".' },
  { pattern: /\bgived\b/gi, replacement: 'gave', rule: 'Irregular verb', explanation: '"Give" is an irregular verb. The past tense is "gave", not "gived".' },
  { pattern: /\btaked\b/gi, replacement: 'took', rule: 'Irregular verb', explanation: '"Take" is an irregular verb. The past tense is "took", not "taked".' },
  { pattern: /\bmaked\b/gi, replacement: 'made', rule: 'Irregular verb', explanation: '"Make" is an irregular verb. The past tense is "made", not "maked".' },
  { pattern: /\bsayed\b/gi, replacement: 'said', rule: 'Irregular verb', explanation: '"Say" is an irregular verb. The past tense is "said", not "sayed".' },
  { pattern: /\bputed\b/gi, replacement: 'put', rule: 'Irregular verb', explanation: '"Put" is an irregular verb. The past tense is "put", not "puted".' },

  // === Double negatives ===
  { pattern: /\bdon't have no\b/gi, replacement: 'don\'t have any', rule: 'Double negative', explanation: 'Avoid double negatives. Use "don\'t have any" instead of "don\'t have no".' },
  { pattern: /\bdoesn't have no\b/gi, replacement: 'doesn\'t have any', rule: 'Double negative', explanation: 'Avoid double negatives. Use "doesn\'t have any" instead of "doesn\'t have no".' },
  { pattern: /\bcan't find no\b/gi, replacement: 'can\'t find any', rule: 'Double negative', explanation: 'Avoid double negatives. Use "can\'t find any" instead of "can\'t find no".' },
  { pattern: /\bcan't see no\b/gi, replacement: 'can\'t see any', rule: 'Double negative', explanation: 'Avoid double negatives. Use "can\'t see any" instead of "can\'t see no".' },
  { pattern: /\bdon't know nothing\b/gi, replacement: 'don\'t know anything', rule: 'Double negative', explanation: 'Avoid double negatives. Use "don\'t know anything" instead of "don\'t know nothing".' },
  { pattern: /\bdon't want nothing\b/gi, replacement: 'don\'t want anything', rule: 'Double negative', explanation: 'Avoid double negatives. Use "don\'t want anything" instead of "don\'t want nothing".' },
  // Generic: (can't|won't|don't|didn't|couldn't) + verb + nothing → anything
  { pattern: /\b(can't|won't|don't|didn't|couldn't|wouldn't|shouldn't)\s+(\w+)\s+nothing\b/gi, replacement: '$1 $2 anything', rule: 'Double negative', explanation: 'Avoid double negatives. Replace "nothing" with "anything" after a negative auxiliary.' },

  // === Redundant words / common errors ===
  { pattern: /\bcould of\b/gi, replacement: 'could have', rule: 'Common error', explanation: '"Could of" is incorrect. The correct form is "could have" (often contracted to "could\'ve").' },
  { pattern: /\bshould of\b/gi, replacement: 'should have', rule: 'Common error', explanation: '"Should of" is incorrect. The correct form is "should have" (often contracted to "should\'ve").' },
  { pattern: /\bwould of\b/gi, replacement: 'would have', rule: 'Common error', explanation: '"Would of" is incorrect. The correct form is "would have" (often contracted to "would\'ve").' },
  { pattern: /\bmust of\b/gi, replacement: 'must have', rule: 'Common error', explanation: '"Must of" is incorrect. The correct form is "must have".' },
  { pattern: /\bmight of\b/gi, replacement: 'might have', rule: 'Common error', explanation: '"Might of" is incorrect. The correct form is "might have".' },
  { pattern: /\bvery unique\b/gi, replacement: 'unique', rule: 'Redundancy', explanation: '"Unique" already means one of a kind. Adding "very" is redundant.' },
  { pattern: /\bvery perfect\b/gi, replacement: 'perfect', rule: 'Redundancy', explanation: '"Perfect" is an absolute. Adding "very" is redundant.' },
  { pattern: /\bvery essential\b/gi, replacement: 'essential', rule: 'Redundancy', explanation: '"Essential" is an absolute. Adding "very" is redundant.' },
  { pattern: /\bvery impossible\b/gi, replacement: 'impossible', rule: 'Redundancy', explanation: '"Impossible" is an absolute. Adding "very" is redundant.' },
  { pattern: /\brevert back\b/gi, replacement: 'revert', rule: 'Redundancy', explanation: '"Revert" already means to go back. "Revert back" is redundant.' },
  { pattern: /\breturn back\b/gi, replacement: 'return', rule: 'Redundancy', explanation: '"Return" already means to go back. "Return back" is redundant.' },
  { pattern: /\beach and every\b/gi, replacement: 'each', rule: 'Redundancy', explanation: '"Each and every" is redundant. Use either "each" or "every".' },
  { pattern: /\bfree gift\b/gi, replacement: 'gift', rule: 'Redundancy', explanation: 'A gift is by definition free. "Free gift" is redundant.' },
  { pattern: /\bpast history\b/gi, replacement: 'history', rule: 'Redundancy', explanation: 'History is by definition in the past. "Past history" is redundant.' },
  { pattern: /\bclose proximity\b/gi, replacement: 'proximity', rule: 'Redundancy', explanation: 'Proximity already means closeness. "Close proximity" is redundant.' },

  // === Commonly confused words ===
  { pattern: /\byour welcome\b/gi, replacement: 'you\'re welcome', rule: 'Commonly confused words', explanation: '"You\'re" (you are) should be used, not the possessive "your".' },
  { pattern: /\byour right\b(?!\s+(hand|arm|leg|foot|eye|ear|side|turn))/gi, replacement: 'you\'re right', rule: 'Commonly confused words', explanation: '"You\'re" (you are) should be used when meaning "you are right", not the possessive "your".' },
  { pattern: /\byour wrong\b/gi, replacement: 'you\'re wrong', rule: 'Commonly confused words', explanation: '"You\'re" (you are) should be used when meaning "you are wrong", not the possessive "your".' },
  { pattern: /\bits a (good|great|nice|bad|long|short|big|small)\b/gi, replacement: 'it\'s a $1', rule: 'Commonly confused words', explanation: '"It\'s" (it is) should be used here, not the possessive "its".' },
  // "its" followed by a present-participle (-ing verb) — must be "it's"
  { pattern: /\bits\s+([a-z]+ing)\b/gi, replacement: "it's $1", rule: 'Commonly confused words', explanation: '"It\'s" (it is) should be used before a verb, not the possessive "its".' },
  // "its" + adjective at start of clause context
  { pattern: /\bits (really|very|so|quite|rather|extremely|already|always|never|not)\b/gi, replacement: "it's $1", rule: 'Commonly confused words', explanation: '"It\'s" (it is) should be used here, not the possessive "its".' },
  { pattern: /\btheir is\b/gi, replacement: 'there is', rule: 'Commonly confused words', explanation: '"There" should be used for existence/location, not "their" (possessive).' },
  { pattern: /\btheir are\b/gi, replacement: 'there are', rule: 'Commonly confused words', explanation: '"There" should be used for existence/location, not "their" (possessive).' },
  { pattern: /\bthen\b(?=\s+(I|you|he|she|it|we|they)\s+(expected|thought|imagined|anticipated))/gi, replacement: 'than', rule: 'Commonly confused words', explanation: '"Than" is used for comparisons, "then" is used for time.' },
  { pattern: /\b(more|less|better|worse|bigger|smaller|faster|slower|higher|lower|greater|fewer|harder|easier|longer|shorter|older|younger|taller)\s+then\b/gi, replacement: '$1 than', rule: 'Commonly confused words', explanation: '"Than" is used for comparisons, not "then".' },
  { pattern: /\balot\b/gi, replacement: 'a lot', rule: 'Spelling', explanation: '"A lot" is two words, not one.' },
  { pattern: /\bshould[- ]?'?ve went\b/gi, replacement: 'should have gone', rule: 'Grammar', explanation: 'After "should have", use the past participle "gone", not "went".' },

  // === Affect vs Effect ===
  { pattern: /\bthe (affect)\b/gi, replacement: 'the effect', rule: 'Commonly confused words', explanation: '"Effect" (noun) means a result. "Affect" (verb) means to influence. After "the", "effect" is usually correct.' },

  // === Comma / punctuation ===
  { pattern: /\bi\b(?=\s|'|$)/g, replacement: 'I', rule: 'Capitalization', explanation: 'The pronoun "I" should always be capitalized.' },

  // === Spacing ===
  { pattern: /  +/g, replacement: ' ', rule: 'Extra space', explanation: 'Remove extra spaces between words.' },
];

/**
 * Check for article usage (a/an) errors.
 * Done separately because we need word-level analysis.
 */
function checkArticles(text: string): GrammarCorrection[] {
  const corrections: GrammarCorrection[] = [];
  // "a" before vowel sound
  const aBeforeVowel = /\ba\s+([a-z]+)/gi;
  let match: RegExpExecArray | null;
  while ((match = aBeforeVowel.exec(text)) !== null) {
    const nextWord = match[1];
    if (startsWithVowelSound(nextWord)) {
      corrections.push({
        original: match[0],
        corrected: `an ${nextWord}`,
        rule: 'Article usage',
        explanation: `Use "an" before words that begin with a vowel sound ("${nextWord}").`,
        position: { start: match.index, end: match.index + match[0].length },
      });
    }
  }
  // "an" before consonant sound
  const anBeforeConsonant = /\ban\s+([a-z]+)/gi;
  while ((match = anBeforeConsonant.exec(text)) !== null) {
    const nextWord = match[1];
    if (!startsWithVowelSound(nextWord)) {
      corrections.push({
        original: match[0],
        corrected: `a ${nextWord}`,
        rule: 'Article usage',
        explanation: `Use "a" before words that begin with a consonant sound ("${nextWord}").`,
        position: { start: match.index, end: match.index + match[0].length },
      });
    }
  }
  return corrections;
}

/**
 * Check for sentence capitalization.
 */
function checkCapitalization(text: string): GrammarCorrection[] {
  const corrections: GrammarCorrection[] = [];
  // Sentences start after . ! ? followed by space
  const sentenceStart = /([.!?]\s+)([a-z])/g;
  let match: RegExpExecArray | null;
  while ((match = sentenceStart.exec(text)) !== null) {
    const charPos = match.index + match[1].length;
    corrections.push({
      original: match[2],
      corrected: match[2].toUpperCase(),
      rule: 'Capitalization',
      explanation: 'Sentences should begin with a capital letter.',
      position: { start: charPos, end: charPos + 1 },
    });
  }
  // First character of the text
  if (text.length > 0 && /^[a-z]/.test(text)) {
    corrections.push({
      original: text[0],
      corrected: text[0].toUpperCase(),
      rule: 'Capitalization',
      explanation: 'The first word of a sentence should be capitalized.',
      position: { start: 0, end: 1 },
    });
  }
  return corrections;
}

/**
 * Check for missing period at end.
 */
function checkEndPunctuation(text: string): GrammarCorrection[] {
  const trimmed = text.trimEnd();
  if (trimmed.length === 0) return [];
  const lastChar = trimmed[trimmed.length - 1];
  if (!['.', '!', '?', ':', ';', '"', "'", ')'].includes(lastChar)) {
    return [{
      original: '',
      corrected: '.',
      rule: 'Missing punctuation',
      explanation: 'Sentences should end with proper punctuation (period, exclamation mark, or question mark).',
      position: { start: trimmed.length, end: trimmed.length },
    }];
  }
  return [];
}

/**
 * Main grammar checking function
 */
export function checkGrammar(text: string): GrammarResult {
  if (!text.trim()) {
    return { original: text, corrected: text, corrections: [] };
  }

  const allCorrections: GrammarCorrection[] = [];

  // Apply regex-based rules
  // We need to track corrections carefully to compute positions on the original text
  for (const rule of rules) {
    // Reset lastIndex for global regexes
    rule.pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = rule.pattern.exec(text)) !== null) {
      let correctedText: string;
      if (typeof rule.replacement === 'function') {
        correctedText = rule.replacement(match[0], ...match.slice(1));
      } else {
        correctedText = match[0].replace(rule.pattern, rule.replacement);
        // Reset again since we used the same regex
        rule.pattern.lastIndex = match.index + match[0].length;
      }

      if (correctedText !== match[0]) {
        allCorrections.push({
          original: match[0],
          corrected: correctedText,
          rule: rule.rule,
          explanation: rule.explanation,
          position: { start: match.index, end: match.index + match[0].length },
        });
      }
    }
  }

  // Article checks
  allCorrections.push(...checkArticles(text));

  // Capitalization checks
  allCorrections.push(...checkCapitalization(text));

  // End punctuation
  allCorrections.push(...checkEndPunctuation(text));

  // Sort by position (earliest first) and remove overlapping corrections
  allCorrections.sort((a, b) => a.position.start - b.position.start);

  // Remove overlapping corrections (keep earliest)
  const filtered: GrammarCorrection[] = [];
  let lastEnd = -1;
  for (const c of allCorrections) {
    if (c.position.start >= lastEnd) {
      filtered.push(c);
      lastEnd = c.position.end;
    }
  }

  // Build corrected text by applying all non-overlapping corrections
  let corrected = '';
  let cursor = 0;
  for (const c of filtered) {
    corrected += text.slice(cursor, c.position.start);
    corrected += c.corrected;
    cursor = c.position.end;
  }
  corrected += text.slice(cursor);

  return {
    original: text,
    corrected,
    corrections: filtered,
  };
}
