import { useState, useCallback } from 'react';

const STORAGE_KEY = 'dailyenglish_progress';
const DAILY_GOAL_KEY = 'dailyenglish_daily_goal';
const GOAL_OPTIONS = [10, 20, 50, 100] as const;
const DEFAULT_GOAL = 20;

export interface SavedWord {
  word: string;
  ipa: string;
  meaning: string;
  example: string;
  source: string; // e.g. "airport" or "core-vocab"
}

interface Progress {
  flashcards: Record<string, number[]>;
  topics: Record<string, { vocabStudied: number; quizScore?: number }>;
  conversations: Record<string, string[]>;
  lastStudied: Record<string, string>;
  dailyActivity: Record<string, number>; // "YYYY-MM-DD" -> XP earned
  longestStreak: number;
  savedWords: SavedWord[];
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptyProgress(): Progress {
  return { flashcards: {}, topics: {}, conversations: {}, lastStudied: {}, dailyActivity: {}, longestStreak: 0, savedWords: [] };
}

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const p = JSON.parse(raw);
    // Backfill fields missing from older stored data
    return {
      ...emptyProgress(),
      ...p,
      savedWords: p.savedWords ?? [],
      dailyActivity: p.dailyActivity ?? {},
      longestStreak: p.longestStreak ?? 0,
    };
  } catch {
    return emptyProgress();
  }
}

function saveProgress(p: Progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // Storage quota exceeded — silently fail
  }
}

function addXP(prev: Progress, xp: number): Partial<Progress> {
  const key = todayKey();
  const current = prev.dailyActivity[key] ?? 0;
  const newDaily = { ...prev.dailyActivity, [key]: current + xp };

  // Recalculate longest streak
  const streak = calcStreak(newDaily);
  const longestStreak = Math.max(prev.longestStreak, streak);

  return { dailyActivity: newDaily, longestStreak };
}

function calcStreak(dailyActivity: Record<string, number>): number {
  let streak = 0;
  const d = new Date();
  // Check today first, then go backwards
  for (let i = 0; i < 365; i++) {
    const key = d.toISOString().slice(0, 10);
    if ((dailyActivity[key] ?? 0) > 0) {
      streak++;
    } else if (i === 0) {
      // Today has no activity yet — check if yesterday had activity (streak still alive)
      // streak stays 0 for now
      d.setDate(d.getDate() - 1);
      continue;
    } else {
      break;
    }
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(loadProgress);

  const markFlashcard = useCallback((setId: string, cardIndex: number) => {
    setProgress((prev) => {
      const existing = prev.flashcards[setId] ?? [];
      if (existing.includes(cardIndex)) return prev;
      const next: Progress = {
        ...prev,
        ...addXP(prev, 2),
        flashcards: { ...prev.flashcards, [setId]: [...existing, cardIndex] },
        lastStudied: { ...prev.lastStudied, [setId]: new Date().toISOString() },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const markTopicVocab = useCallback((topicId: string, count: number) => {
    setProgress((prev) => {
      const next: Progress = {
        ...prev,
        ...addXP(prev, 5),
        topics: { ...prev.topics, [topicId]: { ...prev.topics[topicId], vocabStudied: count } },
        lastStudied: { ...prev.lastStudied, [topicId]: new Date().toISOString() },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const markQuizScore = useCallback((topicId: string, score: number) => {
    setProgress((prev) => {
      const next: Progress = {
        ...prev,
        ...addXP(prev, 10),
        topics: {
          ...prev.topics,
          [topicId]: { ...prev.topics[topicId], vocabStudied: prev.topics[topicId]?.vocabStudied ?? 0, quizScore: score },
        },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const markConversationDone = useCallback((setId: string, dialogueId: string) => {
    setProgress((prev) => {
      const existing = prev.conversations[setId] ?? [];
      if (existing.includes(dialogueId)) return prev;
      const next: Progress = {
        ...prev,
        ...addXP(prev, 8),
        conversations: { ...prev.conversations, [setId]: [...existing, dialogueId] },
        lastStudied: { ...prev.lastStudied, [setId]: new Date().toISOString() },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const saveWord = useCallback((word: SavedWord) => {
    setProgress((prev) => {
      if (prev.savedWords.some((w) => w.word === word.word)) return prev;
      const next: Progress = { ...prev, savedWords: [...prev.savedWords, word] };
      saveProgress(next);
      return next;
    });
  }, []);

  const unsaveWord = useCallback((word: string) => {
    setProgress((prev) => {
      const next: Progress = { ...prev, savedWords: prev.savedWords.filter((w) => w.word !== word) };
      saveProgress(next);
      return next;
    });
  }, []);

  const isWordSaved = useCallback(
    (word: string) => progress.savedWords.some((w) => w.word === word),
    [progress]
  );

  const getFlashcardProgress = useCallback(
    (setId: string, totalCards: number) => {
      const studied = progress.flashcards[setId]?.length ?? 0;
      return { studied, total: totalCards, percent: totalCards > 0 ? Math.round((studied / totalCards) * 100) : 0 };
    },
    [progress]
  );

  const getTopicProgress = useCallback(
    (topicId: string) => progress.topics[topicId] ?? { vocabStudied: 0 },
    [progress]
  );

  const getConversationProgress = useCallback(
    (setId: string, totalDialogues: number) => {
      const done = progress.conversations[setId]?.length ?? 0;
      return { done, total: totalDialogues, percent: totalDialogues > 0 ? Math.round((done / totalDialogues) * 100) : 0 };
    },
    [progress]
  );

  const getStreak = useCallback(() => calcStreak(progress.dailyActivity), [progress]);

  const getLongestStreak = useCallback(() => progress.longestStreak, [progress]);

  const getTodayXP = useCallback(() => progress.dailyActivity[todayKey()] ?? 0, [progress]);

  const getTotalXP = useCallback(
    () => Object.values(progress.dailyActivity).reduce((s, v) => s + v, 0),
    [progress]
  );

  const getWeeklyActivity = useCallback(() => {
    const result: { day: string; label: string; xp: number; isToday: boolean }[] = [];
    const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      result.push({
        day: key,
        label: DAY_LABELS[d.getDay()],
        xp: progress.dailyActivity[key] ?? 0,
        isToday: i === 0,
      });
    }
    return result;
  }, [progress]);

  const getDailyGoal = useCallback((): number => {
    try {
      const stored = localStorage.getItem(DAILY_GOAL_KEY);
      if (stored) {
        const val = Number(stored);
        if (GOAL_OPTIONS.includes(val as typeof GOAL_OPTIONS[number])) return val;
      }
    } catch { /* ignore */ }
    return DEFAULT_GOAL;
  }, []);

  const setDailyGoal = useCallback((goal: number) => {
    try {
      localStorage.setItem(DAILY_GOAL_KEY, String(goal));
    } catch { /* ignore */ }
  }, []);

  const getDailyGoalProgress = useCallback(() => {
    const goal = getDailyGoal();
    const current = progress.dailyActivity[todayKey()] ?? 0;
    const percentage = Math.min(Math.round((current / goal) * 100), 100);
    return { goal, current, percentage, completed: current >= goal };
  }, [progress, getDailyGoal]);

  const resetProgress = useCallback(() => {
    const empty = emptyProgress();
    saveProgress(empty);
    setProgress(empty);
  }, []);

  return {
    progress,
    markFlashcard,
    markTopicVocab,
    markQuizScore,
    markConversationDone,
    saveWord,
    unsaveWord,
    isWordSaved,
    getFlashcardProgress,
    getTopicProgress,
    getConversationProgress,
    getStreak,
    getLongestStreak,
    getTodayXP,
    getTotalXP,
    getWeeklyActivity,
    resetProgress,
    getDailyGoal,
    setDailyGoal,
    getDailyGoalProgress,
    GOAL_OPTIONS,
  };
}
