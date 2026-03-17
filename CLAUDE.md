# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**DailyEnglish** is a React-based English learning application built with Vite, TypeScript, and React Router. It provides multiple learning modalities including topics with vocabulary and videos, flashcards, podcasts with transcripts, and conversational dialogues.

## Development Commands

```bash
# Development server (opens on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm lint
```

## Architecture

### Core Technology Stack
- **Build Tool**: Vite with React plugin
- **Framework**: React 19 with TypeScript
- **Routing**: React Router v7
- **Styling**: CSS Modules (no CSS-in-JS framework)
- **Bundling**: Manual vendor chunk for React libs to optimize initial load

### Project Structure

```
src/
├── app/              # Application layout and routing
│   ├── layout.tsx    # Main layout with header/footer/mobile nav
│   └── router.tsx    # Route definitions with code splitting via lazy()
├── pages/            # Page components (one per route)
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks (useSpeech, useTopic, useSearch)
├── utils/            # Utility functions (search, speech API, content loading)
├── types/            # TypeScript interfaces
└── styles/           # Global CSS
public/content/       # JSON data files for content
```

### Data Architecture

Content is delivered via JSON files loaded from `public/content/`:
- **Topics**: `topics/` — vocabulary, videos (YouTube), and quizzes
- **Podcasts**: `podcasts/` — episodes with transcripts
- **Conversations**: `conversations/` — dialogue sets
- **Flashcards**: `flashcards/` — card sets
- **Index**: `index.json` — content catalog

All types are defined in [src/types/index.ts](src/types/index.ts).

### Routing

Routes are defined in [src/app/router.tsx](src/app/router.tsx). All page components use code splitting via `React.lazy()` with a `<Suspense>` wrapper showing a loading spinner. Navigation is in [src/app/layout.tsx](src/app/layout.tsx):
- Desktop nav in header
- Mobile bottom nav (sticky)

### Styling

- CSS Modules for component-scoped styles (`.module.css`)
- Global CSS in [src/styles/global.css](src/styles/global.css)
- No CSS framework; utility classes in global CSS (e.g., `container`)

### Configuration

- **TypeScript**: `tsconfig.json` with strict mode, `noUnusedLocals`, path alias `@/*` → `src/*`
- **Vite**: `vite.config.ts` with React plugin, ES2020 target, manual vendor chunking
- **Vercel Integration**: SpeedInsights and Analytics included in main entry point

## Key Patterns

### Loading Content
Utility functions in [src/utils/content.ts](src/utils/content.ts) fetch and parse JSON content files. Components use custom hooks (`useTopic`, `useSearch`) to load data.

### Speech API
[src/utils/speech.ts](src/utils/speech.ts) wraps the browser's Web Speech API. [src/hooks/useSpeech.ts](src/hooks/useSpeech.ts) provides a React interface for speech synthesis and recognition.

### Component Pattern
- Functional components with TypeScript
- CSS Modules imported as `styles` object
- Props typically minimal—data loading happens in hooks

## Notes

- No ESLint config in the repo (consider adding `.eslintrc.json` or `eslint.config.js`)
- README.md is outdated CRA template; consider updating with actual project info
- Public folder contains versioned JSON data; keep `index.json` in sync when adding new content files
