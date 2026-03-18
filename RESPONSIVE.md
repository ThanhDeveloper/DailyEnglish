# Responsive Design Guide

This document describes the mobile-first CSS architecture used in DailyEnglish and serves as the contract that automated tests in `src/tests/responsive.test.ts` verify.

## Core Principles

### 1. Mobile-First

All base styles are written for the **smallest screen first** (≥ 320px). Larger-screen enhancements are added with `@media (min-width: …)` queries — never `max-width` overrides.

```css
/* ✅ Mobile-first */
.title { font-size: 1.5rem; }
@media (min-width: 768px) { .title { font-size: 2rem; } }

/* ❌ Desktop-first (avoid) */
.title { font-size: 2rem; }
@media (max-width: 768px) { .title { font-size: 1.5rem; } }
```

### 2. No Horizontal Scroll

`body` has `overflow-x: hidden`. No element should have a fixed width wider than the viewport at any breakpoint. Grid columns use `minmax(min(100%, Xpx), 1fr)` to ensure they collapse safely on small screens.

### 3. Touch Targets ≥ 44px

All interactive elements (buttons, nav links, tab items) must meet Apple's and Google's minimum tap target of **44 × 44 px**. This is enforced with:

- `--tap-min: 44px` CSS variable in `:root`
- `.btn` has `min-height: var(--tap-min)`
- `.btn-icon` has `width` and `height` set to `var(--tap-min)`
- Mobile nav links have `min-height: 56px` (full height of nav bar)

### 4. No iOS Auto-Zoom

iOS Safari auto-zooms any input with `font-size < 16px`. All `<input>`, `<textarea>`, and `<select>` elements must use a font-size of **at least 16px** (or `1rem`). The base `html { font-size: 16px }` is set explicitly and `-webkit-text-size-adjust: 100%` prevents font scaling in landscape.

### 5. Safe-Area Insets

The mobile bottom navigation uses `env(safe-area-inset-bottom)` to avoid overlapping the iPhone Home Indicator. Page `main` content adds matching bottom padding when the mobile nav is visible.

---

## Breakpoint Scale

| Token        | Value    | Usage                                         |
|-------------|----------|-----------------------------------------------|
| xs          | 360px    | Minimum supported width (most Android phones) |
| sm          | 480px    | Large phones / small landscape               |
| md          | 768px    | Tablets (show desktop nav)                  |
| lg          | 1024px   | Small laptops                                |
| xl          | 1200px   | `--max-width` container cap                  |

---

## Component Notes

### Layout (`layout.module.css`)

- **Mobile**: bottom sticky nav (`mobileNav`), no footer, 56px header
- **Desktop (≥ 769px)**: top horizontal nav (`desktopNav`), footer shown, no bottom nav

### Podcast Page (`PodcastPage.module.css`)

- Series selector: horizontal scrollable tab strip (always visible, never hidden)
- Episode list: grid on tablet/desktop; single-column card list on mobile (thumbnail left + info right)
- Horizontal scroll containers use `scrollbar-width: none` + `-webkit-overflow-scrolling: touch`

### Topic Page (`TopicPage.module.css`)

- Tabs: horizontal scroll strip on mobile (`< 600px`), 6-column grid on wider screens
- Scroll strip hides the scrollbar chrome but remains swipeable

### Home Page (`HomePage.module.css`)

- Hero title: `1.875rem` on mobile → `2.25rem` at 480px → `2.5rem` at 768px
- CTA buttons stack vertically on screens `< 380px`

### Grammar Page (`GrammarPage.module.css`)

- Textarea `font-size` is ≥ 15px (0.9375rem) to prevent iOS zoom (16px threshold)
- Action buttons stack vertically on mobile via `flex-direction: column`

---

## Running the Tests

```bash
# Run all tests once
npm test

# Watch mode during development
npm run test:watch

# Coverage report
npm run test:coverage
```

Tests live in `src/tests/`:

| File | What it tests |
|------|---------------|
| `responsive.test.ts` | CSS structural rules (mobile-first, tap targets, overflow safety) |
| `grammar.test.ts` | Grammar correction engine rules and edge cases |
| `speech.test.ts` | Accent localStorage persistence |
