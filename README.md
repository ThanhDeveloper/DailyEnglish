# DailyEnglish

A modern English learning web app built with React 19, TypeScript, and Vite. Designed mobile-first and fully responsive — no pinch-to-zoom required.

## Features

| Feature | Description |
|---------|-------------|
| **Topics** | 22 topic modules with 100 vocabulary words each, YouTube videos, and 15-question quizzes |
| **Flashcards** | 10 card sets (100 cards each) spanning A1 → C1 levels |
| **Podcasts** | 4 podcast series (BBC 6 Minute English, BBC Conversations, BBC News English, REACH English) — 8 episodes each, with transcripts |
| **Conversations** | 10 real-life dialogue sets with 5 scenes each |
| **Speaking Practice** | Speak a word or sentence → speech-to-text scoring (1–10), word-level highlighting of errors |
| **Grammar Checker** | Paste text → 50+ rule-based corrections (subject-verb, irregular verbs, confused words, a/an, etc.) |
| **Daily Goal** | Set a daily XP target (10/20/50/100), track progress with a circular SVG ring |
| **Streak Tracker** | Daily streak counter with compact progress bar |
| **US / UK Accent** | Toggle between American and British English voices for TTS and speech recognition |
| **Saved Words** | Bookmark vocabulary words for later review |
| **Search** | Full-text search across all topics and vocabulary |

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build**: Vite 6 (ES2020 target, manual vendor chunking)
- **Routing**: React Router v7 with `React.lazy()` code splitting
- **Styling**: CSS Modules — mobile-first, no CSS framework
- **Speech**: Web Speech API (SpeechSynthesis + SpeechRecognition)
- **Persistence**: localStorage only — no backend
- **Analytics**: Vercel Speed Insights + Analytics
- **Testing**: Vitest + jsdom + Testing Library (52 tests)
- **Deploy**: Vercel (auto-deploy on push to `master`)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Header, mobile bottom nav, footer
│   ├── layout.module.css
│   └── router.tsx          # All routes (lazy-loaded)
├── components/
│   ├── DailyGoal.tsx       # SVG circular progress ring + goal selector
│   ├── FlashCard.tsx       # Flip card component
│   ├── Icons.tsx           # All SVG icon components
│   ├── PodcastPlayer.tsx   # YouTube embed + transcript toggle
│   ├── SpeakingPractice.tsx # Speech scoring with word highlighting
│   ├── StreakWidget.tsx    # Streak + mini daily goal progress
│   ├── VideoPlayer.tsx     # YouTube iframe embed
│   └── WordCard.tsx        # Vocabulary word card with TTS
├── hooks/
│   ├── useAccent.ts        # US/UK accent toggle + cross-tab sync
│   ├── useProgress.ts      # XP, streak, daily goal logic
│   ├── useSearch.ts        # Full-text search
│   ├── useSpeech.ts        # Web Speech API React interface
│   └── useTopic.ts         # Topic data loading
├── pages/
│   ├── Flashcards/         # Flashcard study mode
│   ├── Grammar/            # Grammar correction tool
│   ├── Home/               # Dashboard with streak + daily goal
│   ├── Podcast/            # Series tabs + episode grid + player
│   ├── Conversation/       # Dialogue reader
│   ├── SavedWords/         # Bookmarked vocabulary
│   ├── Search/             # Search results
│   └── Topic/              # Vocabulary, videos, quizzes, speaking
├── styles/
│   └── global.css          # Mobile-first base styles, utility classes
├── tests/
│   ├── setup.ts            # Vitest + jsdom setup, Web Speech API mocks
│   ├── grammar.test.ts     # 23 grammar rule tests
│   ├── responsive.test.ts  # 26 CSS contract tests
│   └── speech.test.ts      # 4 accent persistence tests
├── types/
│   └── index.ts            # All TypeScript interfaces
└── utils/
    ├── content.ts          # JSON content fetching
    ├── grammar.ts          # 50+ rule-based grammar checker
    ├── search.ts           # Search index + query logic
    └── speech.ts           # TTS/STT helpers, accent persistence

public/content/
├── index.json              # Content catalog (topics, podcasts, conversations, flashcards)
├── topics/                 # 22 topic JSON files (100 words + 15 quiz questions each)
├── podcasts/               # 6 podcast series JSON files (8 episodes each)
├── conversations/          # 10 conversation JSON files (5 dialogues each)
└── flashcards/             # 10 flashcard set JSON files (100 cards each)
```

## Responsive Design

The app is **mobile-first** — base CSS targets 320px+ phones, desktop enhancements are added with `min-width` media queries. Key rules:

- All tap targets ≥ 44px (`--tap-min` CSS variable)
- `html { font-size: 16px }` prevents iOS auto-zoom on inputs
- `body { overflow-x: hidden }` prevents horizontal scroll
- `safe-area-inset-bottom` respected for iPhone Home Indicator

See [RESPONSIVE.md](RESPONSIVE.md) for the full design guide and breakpoint table.

## Content Scale

| Content type | Sets | Items per set |
|---|---|---|
| Topics | 22 | 100 vocabulary words + 15 quiz questions |
| Flashcard sets | 10 | 100 cards |
| Podcast series | 6 | 8 episodes |
| Conversation sets | 10 | 5 dialogues |

## Deployment

Deployed on **Vercel**. Every push to `master` triggers an automatic production deploy. No configuration needed — Vite output in `dist/` is served as a static site.
