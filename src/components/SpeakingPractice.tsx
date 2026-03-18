import { useState } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { MicIcon, VolumeIcon, RefreshIcon } from './Icons';
import styles from './SpeakingPractice.module.css';

interface SpeakingPracticeProps {
  words: { word: string; ipa: string; meaning: string }[];
}

interface WordComparison {
  word: string;
  status: 'correct' | 'wrong' | 'missing' | 'extra';
}

interface SpeechScore {
  score: number;
  targetComparison: WordComparison[];
  spokenComparison: WordComparison[];
}

function normalizeText(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9'\s-]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function isWordSimilar(a: string, b: string): boolean {
  if (a === b) return true;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen <= 2) return a === b;
  const dist = levenshteinDistance(a, b);
  return dist / maxLen <= 0.35;
}

function compareSpeech(target: string, spoken: string, confidence: number): SpeechScore {
  const targetWords = normalizeText(target);
  const spokenWords = normalizeText(spoken);

  if (spokenWords.length === 0) {
    return {
      score: 1,
      targetComparison: targetWords.map((w) => ({ word: w, status: 'missing' })),
      spokenComparison: [],
    };
  }

  // Use word-level LCS (longest common subsequence) alignment
  const m = targetWords.length;
  const n = spokenWords.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (isWordSimilar(targetWords[i - 1], spokenWords[j - 1])) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to find aligned words
  const targetStatuses: ('correct' | 'missing')[] = Array(m).fill('missing');
  const spokenStatuses: ('correct' | 'extra')[] = Array(n).fill('extra');

  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (isWordSimilar(targetWords[i - 1], spokenWords[j - 1])) {
      targetStatuses[i - 1] = 'correct';
      spokenStatuses[j - 1] = 'correct';
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  const matchedCount = dp[m][n];
  const accuracyRatio = m > 0 ? matchedCount / m : 0;

  // Penalize extra words
  const extraWords = spokenStatuses.filter((s) => s === 'extra').length;
  const extraPenalty = m > 0 ? Math.min(extraWords / m, 1) * 0.2 : 0;

  // Combine accuracy with confidence
  const rawScore = accuracyRatio * 0.75 + confidence * 0.25 - extraPenalty;
  const score = Math.max(1, Math.min(10, Math.round(rawScore * 10)));

  return {
    score,
    targetComparison: targetWords.map((word, idx) => ({
      word,
      status: targetStatuses[idx],
    })),
    spokenComparison: spokenWords.map((word, idx) => ({
      word,
      status: spokenStatuses[idx],
    })),
  };
}

function getEncouragement(score: number): string {
  if (score >= 9) return 'Excellent! Near perfect pronunciation!';
  if (score >= 7) return 'Great job! Keep practicing to perfect it!';
  if (score >= 5) return 'Good effort! Try listening again and repeat.';
  if (score >= 3) return 'Keep trying! Focus on each word carefully.';
  return 'Don\'t give up! Listen to the pronunciation and try again.';
}

function getScoreLabel(score: number): string {
  if (score >= 9) return 'Excellent';
  if (score >= 7) return 'Great';
  if (score >= 5) return 'Good';
  if (score >= 3) return 'Fair';
  return 'Try Again';
}

function renderStars(score: number): string {
  const filled = Math.round(score / 2);
  return '\u2605'.repeat(filled) + '\u2606'.repeat(5 - filled);
}

export function SpeakingPractice({ words }: SpeakingPracticeProps) {
  const { speakText, listen, isListening, canSpeak, canListen } = useSpeech();
  const [current, setCurrent] = useState(0);
  const [scoreResult, setScoreResult] = useState<SpeechScore | null>(null);
  const [spoken, setSpoken] = useState('');

  if (!canSpeak || !canListen) {
    return (
      <div className={styles.unsupported}>
        <p>Speech features are not supported in your browser.</p>
        <p>Please try Chrome or Edge for the best experience.</p>
      </div>
    );
  }

  const w = words[current];

  async function handleListen() {
    const res = await listen();
    if (res) {
      setSpoken(res.transcript);
      const result = compareSpeech(w.word, res.transcript, res.confidence);
      setScoreResult(result);
    }
  }

  function next() {
    setCurrent((c) => (c + 1) % words.length);
    setSpoken('');
    setScoreResult(null);
  }

  const scoreClass = scoreResult
    ? scoreResult.score >= 7
      ? styles.scoreHigh
      : scoreResult.score >= 4
        ? styles.scoreMid
        : styles.scoreLow
    : '';

  return (
    <div className={styles.container}>
      <div className={styles.wordDisplay}>
        <h3 className={styles.word}>{w.word}</h3>
        <p className={styles.ipa}>{w.ipa}</p>
        <p className={styles.meaning}>{w.meaning}</p>
      </div>

      <div className={styles.controls}>
        <button
          className={`btn btn-outline ${styles.listenBtn}`}
          onClick={() => speakText(w.word)}
        >
          <VolumeIcon size={18} /> Listen
        </button>
        <button
          className={`btn btn-primary ${styles.micBtn} ${isListening ? styles.listening : ''}`}
          onClick={handleListen}
          disabled={isListening}
        >
          <MicIcon size={18} /> {isListening ? 'Listening...' : 'Speak'}
        </button>
      </div>

      {scoreResult && spoken && (
        <div className={styles.resultPanel}>
          <div className={`${styles.scoreDisplay} ${scoreClass}`}>
            <span className={styles.scoreNumber}>{scoreResult.score}</span>
            <span className={styles.scoreOutOf}>/10</span>
          </div>
          <div className={styles.stars}>{renderStars(scoreResult.score)}</div>
          <span className={`${styles.scoreLabel} ${scoreClass}`}>
            {getScoreLabel(scoreResult.score)}
          </span>

          <div className={styles.comparisonSection}>
            <p className={styles.comparisonLabel}>Target:</p>
            <div className={styles.wordRow}>
              {scoreResult.targetComparison.map((item, idx) => (
                <span
                  key={`t-${idx}`}
                  className={`${styles.compWord} ${
                    item.status === 'correct'
                      ? styles.wordCorrect
                      : styles.wordMissing
                  }`}
                >
                  {item.word}
                </span>
              ))}
            </div>

            <p className={styles.comparisonLabel}>You said:</p>
            <div className={styles.wordRow}>
              {scoreResult.spokenComparison.map((item, idx) => (
                <span
                  key={`s-${idx}`}
                  className={`${styles.compWord} ${
                    item.status === 'correct'
                      ? styles.wordCorrect
                      : styles.wordExtra
                  }`}
                >
                  {item.word}
                </span>
              ))}
            </div>
          </div>

          <p className={styles.encouragement}>
            {getEncouragement(scoreResult.score)}
          </p>
        </div>
      )}

      <button className="btn btn-outline" onClick={next}>
        <RefreshIcon size={16} /> Next Word
      </button>
    </div>
  );
}
