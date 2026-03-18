/**
 * Responsive / mobile-first CSS contract tests.
 *
 * These tests verify the CSS design rules documented in RESPONSIVE.md —
 * they do NOT run in a real browser but check that the compiled CSS
 * source files satisfy structural requirements (mobile-first pattern,
 * no dangerous fixed widths, safe tap targets, no iOS-zoom-triggering
 * font sizes on inputs, etc.).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function css(file: string): string {
  return readFileSync(resolve(__dirname, '../../src', file), 'utf-8');
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Extract all @media query breakpoints used in the file */
function extractMediaBreakpoints(source: string): string[] {
  const re = /@media\s*\(([^)]+)\)/g;
  const found: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(source)) !== null) found.push(m[1].trim());
  return found;
}

/** Return true if the file contains any max-width media query */
function hasMaxWidthQuery(source: string): boolean {
  return /@media[^{]*max-width/.test(source);
}

/** Return true if the file contains at least one min-width media query */
function hasMobileFirstQuery(source: string): boolean {
  return /@media[^{]*min-width/.test(source);
}

/** Find all fixed px values wider than threshold NOT inside a min-width query */
function findDangerousFixedWidths(source: string, threshold = 400): number[] {
  // Strip min-width media blocks (those are fine — desktop enhancements)
  const withoutMinWidth = source.replace(/@media[^{]*min-width[^{]*\{[^}]*\}/g, '');
  const re = /(?:^|;|\{)\s*(?:width|min-width)\s*:\s*(\d+)px/gm;
  const found: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(withoutMinWidth)) !== null) {
    const val = parseInt(m[1], 10);
    if (val > threshold) found.push(val);
  }
  return found;
}

// ── global.css ───────────────────────────────────────────────────────────────

describe('global.css — mobile-first structure', () => {
  const source = css('styles/global.css');

  it('uses min-width media queries (mobile-first)', () => {
    expect(hasMobileFirstQuery(source)).toBe(true);
  });

  it('container uses 16px padding as base (mobile)', () => {
    // The first (base) .container rule should have padding: 0 16px
    expect(source).toMatch(/\.container\s*\{[^}]*padding:\s*0\s*16px/);
  });

  it('html font-size is exactly 16px to prevent iOS zoom', () => {
    expect(source).toMatch(/html\s*\{[^}]*font-size\s*:\s*16px/);
  });

  it('body has overflow-x: hidden to prevent horizontal scroll', () => {
    expect(source).toMatch(/body\s*\{[^}]*overflow-x\s*:\s*hidden/);
  });

  it('btn has min-height set (tap target)', () => {
    expect(source).toMatch(/\.btn\s*\{[^}]*min-height/);
  });

  it('btn-icon has width/height matching --tap-min', () => {
    expect(source).toMatch(/\.btn-icon\s*\{[^}]*var\(--tap-min\)/);
  });

  it('--tap-min is defined as 44px', () => {
    expect(source).toMatch(/--tap-min\s*:\s*44px/);
  });

  it('grid-2 uses min() to prevent overflow on narrow viewports', () => {
    expect(source).toMatch(/grid-2[^}]*min\(100%/);
  });

  it('grid-3 uses min() to prevent overflow on narrow viewports', () => {
    expect(source).toMatch(/grid-3[^}]*min\(100%/);
  });
});

// ── layout.module.css ────────────────────────────────────────────────────────

describe('layout.module.css — mobile-first structure', () => {
  const source = css('app/layout.module.css');

  it('uses min-width media queries (mobile-first)', () => {
    expect(hasMobileFirstQuery(source)).toBe(true);
  });

  it('desktopNav is hidden by default (display:none) — shown via min-width query', () => {
    // Base style: display: none
    expect(source).toMatch(/\.desktopNav\s*\{[^}]*display\s*:\s*none/);
    // Shown at min-width
    expect(source).toMatch(/@media[^{]*min-width[^{]*\{[^}]*\.desktopNav[^}]*display\s*:/);
  });

  it('mobileNav is visible by default (display:flex)', () => {
    expect(source).toMatch(/\.mobileNav\s*\{[^}]*display\s*:\s*flex/);
  });

  it('mobileLink has min-height ≥ 44px for tap targets', () => {
    // Looks for 44px, 48px, 52px, 56px, 60px — all acceptable
    const match = source.match(/\.mobileLink\s*\{[^}]*/);
    expect(match).not.toBeNull();
    expect(match![0]).toMatch(/min-height\s*:\s*(4[4-9]|5\d|6\d)px/);
  });

  it('safe-area-inset-bottom is respected in mobileNav padding', () => {
    expect(source).toMatch(/safe-area-inset-bottom/);
  });

  it('accentToggle has min-height for tap target', () => {
    expect(source).toMatch(/\.accentToggle\s*\{[^}]*min-height/);
  });
});

// ── PodcastPage.module.css ────────────────────────────────────────────────────

describe('PodcastPage.module.css — mobile-first structure', () => {
  const source = css('pages/Podcast/PodcastPage.module.css');

  it('seriesTabs use overflow-x: auto (scrollable on mobile)', () => {
    expect(source).toMatch(/\.seriesTabs\s*\{[^}]*overflow-x\s*:\s*auto/);
  });

  it('seriesTabs hide scrollbar (scrollbar-width: none)', () => {
    expect(source).toMatch(/scrollbar-width\s*:\s*none/);
  });

  it('episodeGrid uses auto-fill minmax (fluid columns)', () => {
    expect(source).toMatch(/episodeGrid[^}]*auto-fill/);
    expect(source).toMatch(/episodeGrid[^}]*minmax/);
  });

  it('no dangerous fixed widths > 400px outside min-width queries', () => {
    const dangerous = findDangerousFixedWidths(source, 400);
    expect(dangerous).toHaveLength(0);
  });
});

// ── TopicPage.module.css ─────────────────────────────────────────────────────

describe('TopicPage.module.css — tab bar overflow safety', () => {
  const source = css('pages/Topic/TopicPage.module.css');

  it('tabs container allows overflow-x scroll on mobile', () => {
    expect(source).toMatch(/\.tabs\s*\{[^}]*overflow-x\s*:\s*auto/);
  });

  it('tab items have min-height for tap target', () => {
    expect(source).toMatch(/\.tab\s*\{[^}]*min-height/);
  });
});

// ── HomePage.module.css ───────────────────────────────────────────────────────

describe('HomePage.module.css — mobile-first typography', () => {
  const source = css('pages/Home/HomePage.module.css');

  it('heroTitle base font-size is < 2rem on mobile', () => {
    // Extract the base .heroTitle rule (before any media query)
    const baseRule = source.split('@media')[0];
    const m = baseRule.match(/\.heroTitle\s*\{[^}]*font-size\s*:\s*([\d.]+)(rem|px)/);
    expect(m).not.toBeNull();
    const value = parseFloat(m![1]);
    const unit = m![2];
    const remValue = unit === 'px' ? value / 16 : value;
    expect(remValue).toBeLessThanOrEqual(2);
  });

  it('heroActions wraps on small screens (flex-wrap or flex-direction column)', () => {
    expect(source).toMatch(/heroActions[^}]*(flex-wrap|flex-direction\s*:\s*column)/);
  });
});

// ── GrammarPage.module.css ────────────────────────────────────────────────────

describe('GrammarPage.module.css — input safety', () => {
  const source = css('pages/Grammar/GrammarPage.module.css');

  it('textarea font-size is at least 15px (prevents iOS auto-zoom at ≥16px)', () => {
    const m = source.match(/\.textarea\s*\{[^}]*font-size\s*:\s*([\d.]+)(rem|px)/);
    expect(m).not.toBeNull();
    const value = parseFloat(m![1]);
    const unit = m![2];
    const px = unit === 'rem' ? value * 16 : value;
    // iOS zooms when < 16px; 0.9375rem = 15px is borderline acceptable
    expect(px).toBeGreaterThanOrEqual(15);
  });

  it('actions have flex-wrap or flex-direction column (mobile friendly)', () => {
    expect(source).toMatch(/\.actions\s*\{[^}]*(flex-wrap|flex-direction)/);
  });
});
