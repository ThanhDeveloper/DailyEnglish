# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**DailyEnglish** is a React 19 + TypeScript + Vite English learning app. It provides topics with vocabulary/quizzes/videos, flashcards, podcasts with transcripts, conversational dialogues, speech scoring, grammar correction, daily goal tracking, and US/UK accent switching. Deployed on Vercel; no backend — all data is JSON files in `public/content/` and all persistence is localStorage.

## Development Commands

```bash
npm run dev          # Dev server → http://localhost:3000
npm run build        # TypeScript check + Vite production build → dist/
npm run preview      # Serve production build locally
npm run lint         # ESLint
npm test             # Vitest run (52 tests, jsdom)
npm run test:watch   # Vitest watch mode
npm run test:coverage # Coverage report (v8)
```

## Architecture

### Core Technology Stack
- **Build**: Vite 6 with React plugin, ES2020 target, manual vendor chunk
- **Framework**: React 19 with TypeScript (strict mode)
- **Routing**: React Router v7 — all pages lazy-loaded via `React.lazy()`
- **Styling**: CSS Modules (`.module.css`) — **mobile-first**, no CSS framework
- **Testing**: Vitest + jsdom + @testing-library/react
- **Deploy**: Vercel (auto-deploy on push to `master`)

### Project Structure

```
src/
├── app/              # Layout shell and route definitions
│   ├── layout.tsx    # Header (accent toggle + desktop nav) + mobile bottom nav + footer
│   ├── layout.module.css
│   └── router.tsx    # All routes with React.lazy() code splitting
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── pages/            # One directory per route
├── styles/
│   └── global.css    # Mobile-first base styles, utility classes, CSS variables
├── tests/            # Vitest test files + setup
├── types/
│   └── index.ts      # All TypeScript interfaces (Topic, Flashcard, Podcast, etc.)
└── utils/            # Pure utility functions (no React)
public/content/       # JSON data files — never bundled, fetched at runtime
```

### Data Architecture

Content loaded via `src/utils/content.ts` from `public/content/`:
- **Topics**: `topics/<id>.json` — 100 vocabulary words (word, ipa, meaning, translation, example) + videos + 15-question quizzes
- **Podcasts**: `podcasts/<id>.json` — series with 8 episodes each (youtubeId, transcript, level, duration)
- **Conversations**: `conversations/<id>.json` — sets with 5 dialogues each (speaker lines)
- **Flashcards**: `flashcards/<id>.json` — 100 cards each (front/back/level)
- **Index**: `index.json` — master catalog; **must be kept in sync** when adding new content files

All TypeScript interfaces are in `src/types/index.ts`.

### Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | HomePage | Dashboard — streak, daily goal, quick-access cards |
| `/topics` | TopicsListPage | Grid of all 22 topic cards |
| `/topics/:id` | TopicPage | Vocabulary, video, quiz, speaking practice tabs |
| `/flashcards` | FlashcardsListPage | Grid of all 10 flashcard sets |
| `/flashcards/:id` | FlashcardsPage | Flashcard study mode |
| `/podcasts` | PodcastPage | Series tab strip + episode grid + inline player |
| `/conversations` | ConversationsListPage | Grid of all 10 conversation sets |
| `/conversations/:id` | ConversationPage | Dialogue reader |
| `/search` | SearchPage | Full-text search |
| `/saved` | SavedWordsPage | Bookmarked vocabulary |
| `/grammar` | GrammarPage | Paste text → grammar corrections |

### Styling — Mobile-First

Base styles target 320px+ phones. Desktop enhancements use `@media (min-width: …)`. Key CSS variables in `:root`:
- `--tap-min: 44px` — minimum touch target, used on all buttons/nav links
- `--color-primary: #2563eb`
- `--max-width: 1200px`

**Never use `max-width` media queries for layout overrides** — always `min-width`. See [RESPONSIVE.md](RESPONSIVE.md) for full rules.

## Key Patterns

### Loading Content
`src/utils/content.ts` exports `getContentIndex()`, `getTopic()`, `getPodcast()`, `getConversation()`, `getFlashcardSet()`. Components load data via custom hooks (`useTopic`, `useSearch`) or directly in `useEffect`.

### Speech API (`src/utils/speech.ts`)
Wraps `SpeechSynthesis` and `SpeechRecognition`. Key exports:
- `speak(text, rate?)` — TTS using selected accent voice
- `startListening(onResult, onEnd)` — STT
- `getAccent() / setAccent(accent)` — persist `'us' | 'uk'` in localStorage

### Accent Toggle (`src/hooks/useAccent.ts`)
Returns `{ accent, toggleAccent }`. Dispatches a custom `accent-changed` window event so all components re-render on change. Also syncs via `storage` event for cross-tab consistency.

### Speech Scoring (`src/components/SpeakingPractice.tsx`)
Compares spoken text to target using Levenshtein distance word-by-word (LCS alignment). Exports a `compareSpeech(target, spoken, confidence)` function returning a `SpeechScore` with 1–10 score and per-word `correct | wrong | missing | extra` status.

### Grammar Checker (`src/utils/grammar.ts`)
Pure function `checkGrammar(text): GrammarResult`. Applies 50+ regex rules in order:
1. Subject-verb agreement (he/she/it)
2. Irregular past tense (goed → went, etc.)
3. Double negatives
4. Redundant phrases (could of, very unique, etc.)
5. Commonly confused words (your/you're, its/it's, their/there)
6. Article a/an (with vowel-sound detection)
7. Capitalization of "I"
8. Double spaces

### Progress / Daily Goal (`src/hooks/useProgress.ts`)
localStorage keys: `dailyenglish_xp`, `dailyenglish_streak`, `dailyenglish_last_date`, `dailyenglish_daily_goal`. Key exports: `addXP(amount)`, `getStreak()`, `getDailyGoal()`, `setDailyGoal(n)`, `getDailyGoalProgress()`. Goal options: 10, 20, 50, 100 XP.

### Component Pattern
- Functional components with TypeScript
- CSS Modules imported as `styles`
- Props minimal — data loading in hooks or `useEffect`
- All interactive elements must meet `--tap-min: 44px`

## Tests

Tests live in `src/tests/` and run with Vitest + jsdom. Web Speech API is mocked in `src/tests/setup.ts`.

| File | Coverage |
|------|---------|
| `grammar.test.ts` | 23 tests — all grammar rule categories |
| `responsive.test.ts` | 26 tests — CSS structural rules (mobile-first, tap targets, overflow) |
| `speech.test.ts` | 4 tests — accent localStorage persistence |

Run: `npm test` (52 tests, ~1.4s).

## Content Scale

| Type | Count | Size |
|------|-------|------|
| Topics | 22 | 100 words + 15 quiz questions each |
| Flashcard sets | 10 | 100 cards each |
| Podcast series | 6 | 8 episodes each |
| Conversation sets | 10 | 5 dialogues each |

## Notes

- **`public/content/index.json` must be updated** whenever a new content file is added
- No ESLint config file exists — `npm run lint` may fail until one is added
- Podcast episodes with `youtubeId` starting with `PLACEHOLDER_` need real YouTube IDs
- All grammar rules are pure regex — no external API, works fully offline
- `tsconfig.tsbuildinfo` and `.claude/` are gitignored (build cache / IDE state)
