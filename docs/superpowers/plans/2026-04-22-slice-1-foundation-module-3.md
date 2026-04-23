# Slice 1 — Foundation + Module 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Study Lab's design foundation (tokens, shell, compound-concept component, KaTeX wrapper) and ship a fully revised Module 3 (K-means, KNN, SVM) as a vertical proof of the Studio Notebook direction.

**Architecture:** New CSS-variable design system in `globals.css`. Compound components for shell (`<PageShell>`, `<Sidebar>`, `<ScrollProgress>`) and for concept content (`<Concept>` with slot children). Module 3 labs refactored into a React-19 `use()`-based provider + per-algorithm client components. KaTeX rendered via its `katex.render()` DOM-mutation API through a React ref — no `dangerouslySetInnerHTML`.

**Tech Stack:** Next.js 16, React 19, TypeScript 6, KaTeX ^0.16, Node `--test` runner for logic units.

**Related spec:** `docs/superpowers/specs/2026-04-22-ml-study-lab-redesign-design.md` (§3, §4, §5, §6.1, §7, §8).

**Working directory for all commands:** `SecondHalf/` (the Next.js app) unless otherwise noted. The worktree root is one level above.

---

## File Structure (Slice 1)

**Created**

```
SecondHalf/app/(shell)/header.tsx
SecondHalf/app/(shell)/sidebar.tsx
SecondHalf/app/(shell)/scroll-progress.tsx
SecondHalf/app/(shell)/scroll-progress-math.ts       // pure logic, unit-tested
SecondHalf/app/(shell)/page-shell.tsx
SecondHalf/app/(shell)/margin-note.tsx
SecondHalf/app/(shell)/concept.tsx                    // compound: Concept, Concept.Definition, .Formula, .Intuition, .WorkedExample, .Pitfall, .FurtherReading
SecondHalf/app/(shell)/concept.ts                     // pure helpers, unit-tested
SecondHalf/app/(shell)/katex.tsx                      // client: KaTeX ref-render wrapper
SecondHalf/app/module-3/concept-kmeans.tsx
SecondHalf/app/module-3/concept-knn.tsx
SecondHalf/app/module-3/concept-svm.tsx
SecondHalf/app/module-3/labs/lab-context.tsx         // React 19 context, read via use()
SecondHalf/app/module-3/labs/kmeans-lab.tsx
SecondHalf/app/module-3/labs/knn-lab.tsx
SecondHalf/app/module-3/labs/svm-lab.tsx
SecondHalf/tests/scroll-progress-math.test.ts
SecondHalf/tests/concept-context.test.ts
```

**Modified**

```
SecondHalf/package.json                               // +katex, +@types/katex
SecondHalf/app/layout.tsx                             // fonts: swap to IBM Plex Sans + JetBrains Mono
SecondHalf/app/globals.css                            // tokens + typography + shell styles
SecondHalf/app/module-3/page.tsx                      // consumes shell + concepts
SecondHalf/app/module-3/study-lab.tsx                 // refactored: compound Lab wrapping per-algorithm labs
```

**Deleted**

```
SecondHalf/app/site-header.tsx                        // replaced by (shell)/header.tsx
```

**Untouched in Slice 1** (handled by Slice 2 / 3)

```
module-4/*   module-6/*   quiz/*   app/page.tsx   app/source-trail.tsx
```

---

## Task 1: Install KaTeX

**Files:**
- Modify: `SecondHalf/package.json`

- [ ] **Step 1: Install runtime + types**

Run from `SecondHalf/`:

```bash
npm install katex@^0.16 --save
npm install @types/katex@^0.16 --save-dev
```

Expected: `package.json` `dependencies` has `"katex": "^0.16.x"`; `devDependencies` has `"@types/katex": "^0.16.x"`. `package-lock.json` updated.

- [ ] **Step 2: Verify typecheck still passes**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add SecondHalf/package.json SecondHalf/package-lock.json
git commit -m "chore(study-lab): add katex for math rendering"
```

---

## Task 2: Scroll progress — pure math function (TDD)

Isolate the scroll math from the DOM listener so it can be unit-tested.

**Files:**
- Create: `SecondHalf/app/(shell)/scroll-progress-math.ts`
- Create: `SecondHalf/tests/scroll-progress-math.test.ts`

- [ ] **Step 1: Write the failing test**

Create `SecondHalf/tests/scroll-progress-math.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { computeScrollProgress } from "../app/(shell)/scroll-progress-math.ts";

test("returns 0 at top of page", () => {
  assert.equal(computeScrollProgress({ scrollTop: 0, scrollHeight: 2000, clientHeight: 800 }), 0);
});

test("returns 1 when fully scrolled", () => {
  assert.equal(computeScrollProgress({ scrollTop: 1200, scrollHeight: 2000, clientHeight: 800 }), 1);
});

test("returns 0.5 at half scroll", () => {
  assert.equal(computeScrollProgress({ scrollTop: 600, scrollHeight: 2000, clientHeight: 800 }), 0.5);
});

test("clamps to [0, 1] when overscrolling", () => {
  assert.equal(computeScrollProgress({ scrollTop: -50, scrollHeight: 2000, clientHeight: 800 }), 0);
  assert.equal(computeScrollProgress({ scrollTop: 9999, scrollHeight: 2000, clientHeight: 800 }), 1);
});

test("returns 0 when page fits viewport (no scroll possible)", () => {
  assert.equal(computeScrollProgress({ scrollTop: 0, scrollHeight: 800, clientHeight: 800 }), 0);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run from `SecondHalf/`:

```bash
npm run test
```

Expected: FAIL — "Cannot find module '../app/(shell)/scroll-progress-math.ts'".

- [ ] **Step 3: Write minimal implementation**

Create `SecondHalf/app/(shell)/scroll-progress-math.ts`:

```ts
export type ScrollInput = {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
};

export function computeScrollProgress(input: ScrollInput): number {
  const max = input.scrollHeight - input.clientHeight;
  if (max <= 0) return 0;
  const raw = input.scrollTop / max;
  if (raw < 0) return 0;
  if (raw > 1) return 1;
  return raw;
}
```

- [ ] **Step 4: Run tests to verify pass**

```bash
npm run test
```

Expected: all 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add SecondHalf/app/\(shell\)/scroll-progress-math.ts SecondHalf/tests/scroll-progress-math.test.ts
git commit -m "feat(study-lab): add pure scroll-progress math helper with tests"
```

---

## Task 3: Design tokens + base typography in globals.css

Replace the current `:root` token block and base element styles. Keep existing lab-specific selectors (they'll be refined in later tasks).

**Files:**
- Modify: `SecondHalf/app/globals.css` (replace lines 1–67, keep everything below)

- [ ] **Step 1: Replace the `:root`, `html`, `body`, and base element blocks**

Open `SecondHalf/app/globals.css`. Replace lines 1–67 with:

```css
:root {
  /* Paper + ink */
  --paper: #fbf7ee;
  --paper-strong: #fffdf7;
  --paper-sunken: #f5efe0;
  --ink: #1b1b1b;
  --muted: #5a564e;
  --muted-2: #8a857a;

  /* Hairlines */
  --line: rgba(27, 27, 27, 0.1);
  --line-strong: rgba(27, 27, 27, 0.18);

  /* Accents */
  --primary: #2d5a6b;
  --primary-tint: rgba(45, 90, 107, 0.08);
  --primary-hover: #24485a;
  --correction: #b8583a;
  --correction-tint: rgba(184, 88, 58, 0.1);
  --focus-ring: rgba(45, 90, 107, 0.45);

  /* Module tints (desaturated — classification, not decoration) */
  --module-3-tint: rgba(45, 90, 107, 0.08);
  --module-3-line: rgba(45, 90, 107, 0.28);
  --module-4-tint: rgba(96, 122, 85, 0.08);
  --module-4-line: rgba(96, 122, 85, 0.28);
  --module-6-tint: rgba(99, 89, 130, 0.08);
  --module-6-line: rgba(99, 89, 130, 0.28);

  /* Type scale */
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 22px;
  --text-2xl: 28px;
  --text-3xl: 36px;
  --text-4xl: 52px;
  --text-5xl: clamp(3rem, 6vw, 5.5rem);

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 56px;
  --space-16: 80px;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  /* Motion */
  --ease: cubic-bezier(0.2, 0.9, 0.2, 1);
  --dur-fast: 160ms;
  --dur-med: 280ms;
  --dur-slow: 520ms;

  color-scheme: light;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  background: var(--paper);
}

body {
  margin: 0;
  min-height: 100vh;
  color: var(--ink);
  background: var(--paper);
  font-family: var(--font-body), "IBM Plex Sans", system-ui, sans-serif;
  font-size: var(--text-base);
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  font-variant-ligatures: common-ligatures;
}

h1, h2, h3, h4, h5, h6 {
  margin: 0;
  font-family: var(--font-display), "Fraunces", Georgia, serif;
  font-weight: 500;
  font-variation-settings: "SOFT" 50, "opsz" 96;
  letter-spacing: -0.01em;
  line-height: 1.12;
  text-wrap: balance;
  color: var(--ink);
}

p {
  margin: 0;
  text-wrap: pretty;
}

a {
  color: var(--primary);
  text-decoration: underline;
  text-decoration-thickness: 1.5px;
  text-underline-offset: 3px;
  transition: color var(--dur-fast) var(--ease);
}

a:hover {
  color: var(--primary-hover);
}

:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 3px;
  border-radius: 4px;
}

button {
  font: inherit;
  color: inherit;
  background: none;
  border: 0;
  cursor: pointer;
}

code, kbd, samp {
  font-family: var(--font-mono), "JetBrains Mono", ui-monospace, monospace;
  font-size: 0.92em;
  padding: 0.08em 0.3em;
  background: var(--primary-tint);
  color: var(--primary);
  border-radius: var(--radius-sm);
}

.tabular {
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Verify typecheck and build**

```bash
npm run typecheck
npm run build
```

Expected: both succeed. Some leftover home-page selectors render less polished — that's expected; Slice 3 updates the home page.

- [ ] **Step 3: Commit**

```bash
git add SecondHalf/app/globals.css
git commit -m "feat(study-lab): introduce Studio Notebook design tokens and base typography"
```

---

## Task 4: Swap fonts in layout.tsx

**Files:**
- Modify: `SecondHalf/app/layout.tsx`

- [ ] **Step 1: Replace the entire file**

```tsx
import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteHeader } from "./(shell)/header";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600"],
  axes: ["SOFT", "opsz"],
  display: "swap",
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ML Second Half Study Lab",
  description:
    "A whiteboard-style study lab for machine learning — Module 3 (clustering, KNN, SVM), Module 4 (ensembles), Module 6 (deep learning, NLP, CNNs) — grounded in COMP SCI 465 Canvas notes.",
};

export const viewport: Viewport = {
  themeColor: "#fbf7ee",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <div className="site-shell">
          <SiteHeader />
          <main id="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run typecheck
```

Expected: error on `./(shell)/header` import — that's fine; we create it next. Do not commit yet.

---

## Task 5: Header component

**Files:**
- Create: `SecondHalf/app/(shell)/header.tsx`
- Delete: `SecondHalf/app/site-header.tsx`

- [ ] **Step 1: Create the new header**

Create `SecondHalf/app/(shell)/header.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/module-3", label: "Module 3" },
  { href: "/module-4", label: "Module 4" },
  { href: "/module-6", label: "Module 6" },
  { href: "/quiz", label: "Quiz" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header" aria-label="Primary">
      <Link className="site-mark" href="/">
        <span className="site-mark__kicker">COMP&nbsp;SCI&nbsp;465</span>
        <span className="site-mark__title">ML Study Lab</span>
      </Link>
      <nav className="site-nav" aria-label="Main navigation">
        {NAV.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="site-link"
              data-active={active}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Delete the old header file**

```bash
rm SecondHalf/app/site-header.tsx
```

- [ ] **Step 3: Append site-shell + header styles to globals.css**

Append to the end of `SecondHalf/app/globals.css`:

```css
/* ---------- Site shell ---------- */

.site-shell {
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-4) clamp(var(--space-4), 4vw, var(--space-8));
  background: color-mix(in srgb, var(--paper) 88%, transparent);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--line);
}

.site-mark {
  display: grid;
  gap: 2px;
  text-decoration: none;
  color: var(--ink);
}

.site-mark__kicker,
.site-link {
  font-family: var(--font-mono), "JetBrains Mono", monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
}

.site-mark__title {
  font-family: var(--font-display), Fraunces, serif;
  font-size: var(--text-lg);
  font-weight: 500;
}

.site-nav {
  display: flex;
  gap: var(--space-1);
  padding: 4px;
  background: var(--paper-strong);
  border: 1px solid var(--line);
  border-radius: 999px;
}

.site-link {
  padding: var(--space-2) var(--space-4);
  border-radius: 999px;
  text-decoration: none;
  transition: color var(--dur-fast) var(--ease), background-color var(--dur-fast) var(--ease);
}

.site-link:hover {
  color: var(--ink);
  background: var(--paper-sunken);
}

.site-link[data-active="true"] {
  color: var(--paper);
  background: var(--ink);
}

main {
  padding: 0 clamp(var(--space-4), 4vw, var(--space-10)) var(--space-16);
}
```

- [ ] **Step 4: Verify typecheck**

```bash
npm run typecheck
```

Expected: passes.

- [ ] **Step 5: Commit**

```bash
git add SecondHalf/app/layout.tsx SecondHalf/app/\(shell\)/header.tsx SecondHalf/app/globals.css
git rm SecondHalf/app/site-header.tsx
git commit -m "feat(study-lab): swap fonts to IBM Plex Sans + JetBrains Mono and restyle site header"
```

---

## Task 6: ScrollProgress client component

Uses the pure helper from Task 2.

**Files:**
- Create: `SecondHalf/app/(shell)/scroll-progress.tsx`

- [ ] **Step 1: Create the client component**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { computeScrollProgress } from "./scroll-progress-math";

export function ScrollProgress() {
  const fillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = fillRef.current;
    if (!el) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const progress = computeScrollProgress({ scrollTop, scrollHeight, clientHeight });
      el.style.transform = `scaleX(${progress})`;
    };

    const onScroll = () => {
      if (raf === 0) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="scroll-progress" role="presentation" aria-hidden="true">
      <div ref={fillRef} className="scroll-progress__fill" />
    </div>
  );
}
```

- [ ] **Step 2: Append styles**

```css
/* ---------- Scroll progress ---------- */

.scroll-progress {
  position: sticky;
  top: 60px;
  z-index: 29;
  height: 3px;
  background: transparent;
  pointer-events: none;
}

.scroll-progress__fill {
  height: 100%;
  background: var(--primary);
  transform: scaleX(0);
  transform-origin: left center;
  will-change: transform;
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add SecondHalf/app/\(shell\)/scroll-progress.tsx SecondHalf/app/globals.css
git commit -m "feat(study-lab): add scroll-progress bar client component"
```

---

## Task 7: Sidebar ToC (IntersectionObserver driven)

**Files:**
- Create: `SecondHalf/app/(shell)/sidebar.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type TocGroup = {
  label: string;
  items: Array<{ id: string; label: string; href?: string }>;
};

export function Sidebar({
  moduleLabel,
  groups,
  ariaLabel = "On this page",
}: {
  moduleLabel?: string;
  groups: TocGroup[];
  ariaLabel?: string;
}) {
  const allIds = groups.flatMap((g) => g.items.map((i) => i.id)).filter(Boolean);
  const [active, setActive] = useState<string | null>(allIds[0] ?? null);

  useEffect(() => {
    if (allIds.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 1] },
    );

    for (const id of allIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [allIds.join("|")]);

  return (
    <aside className="sidebar" aria-label={ariaLabel}>
      {moduleLabel ? <p className="sidebar__module">{moduleLabel}</p> : null}
      {groups.map((group) => (
        <div key={group.label} className="sidebar__group">
          <p className="sidebar__group-label">{group.label}</p>
          <ul className="sidebar__list">
            {group.items.map((item) => {
              const href = item.href ?? `#${item.id}`;
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <Link
                    href={href}
                    className="sidebar__link"
                    data-active={isActive}
                    aria-current={isActive ? "location" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </aside>
  );
}
```

- [ ] **Step 2: Append sidebar styles**

```css
/* ---------- Sidebar ToC ---------- */

.sidebar {
  position: sticky;
  top: calc(var(--space-12) + 4px);
  align-self: start;
  width: 230px;
  padding: var(--space-4) var(--space-5);
  border-right: 1px solid var(--line);
  font-family: var(--font-mono), "JetBrains Mono", monospace;
  font-size: var(--text-sm);
  color: var(--muted);
  display: grid;
  gap: var(--space-4);
  max-height: calc(100vh - var(--space-16));
  overflow-y: auto;
}

.sidebar__module {
  margin: 0;
  font-family: var(--font-display), Fraunces, serif;
  font-size: var(--text-lg);
  font-weight: 500;
  color: var(--ink);
  letter-spacing: -0.01em;
}

.sidebar__group-label {
  margin: 0 0 var(--space-2);
  font-size: var(--text-xs);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted-2);
}

.sidebar__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: var(--space-1);
}

.sidebar__link {
  display: block;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--muted);
  transition: color var(--dur-fast) var(--ease), background-color var(--dur-fast) var(--ease);
}

.sidebar__link:hover {
  color: var(--ink);
  background: var(--paper-sunken);
}

.sidebar__link[data-active="true"] {
  color: var(--ink);
  background: var(--primary-tint);
  box-shadow: inset 2px 0 0 var(--primary);
}

@media (max-width: 1040px) {
  .sidebar {
    position: static;
    width: 100%;
    border-right: 0;
    border-bottom: 1px solid var(--line);
    max-height: none;
  }
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add SecondHalf/app/\(shell\)/sidebar.tsx SecondHalf/app/globals.css
git commit -m "feat(study-lab): add sticky sidebar ToC with IntersectionObserver active state"
```

---

## Task 8: PageShell wrapper

Composes sidebar + scroll progress + main content area for module pages.

**Files:**
- Create: `SecondHalf/app/(shell)/page-shell.tsx`

- [ ] **Step 1: Create the component**

```tsx
import type { ReactNode } from "react";
import { Sidebar, type TocGroup } from "./sidebar";
import { ScrollProgress } from "./scroll-progress";

export function PageShell({
  moduleLabel,
  tocGroups,
  moduleTone,
  children,
}: {
  moduleLabel?: string;
  tocGroups?: TocGroup[];
  moduleTone?: "module-3" | "module-4" | "module-6";
  children: ReactNode;
}) {
  return (
    <article className="module-page" data-tone={moduleTone}>
      <ScrollProgress />
      <div className="module-page__body">
        {tocGroups && tocGroups.length > 0 ? (
          <Sidebar moduleLabel={moduleLabel} groups={tocGroups} />
        ) : null}
        <div className="module-page__main">{children}</div>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Append page-shell styles**

```css
/* ---------- Page shell ---------- */

.module-page {
  max-width: 1320px;
  margin: 0 auto;
}

.module-page__body {
  display: grid;
  grid-template-columns: 230px minmax(0, 1fr);
  gap: var(--space-8);
  padding-top: var(--space-6);
}

.module-page__main {
  display: grid;
  gap: var(--space-10);
  padding-bottom: var(--space-10);
}

.module-page__main > section {
  scroll-margin-top: 120px;
}

@media (max-width: 1040px) {
  .module-page__body {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }
}
```

- [ ] **Step 3: Verify typecheck**

```bash
npm run typecheck
```

Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add SecondHalf/app/\(shell\)/page-shell.tsx SecondHalf/app/globals.css
git commit -m "feat(study-lab): add PageShell composing sidebar, scroll progress, and main column"
```

---

## Task 9: MarginNote component

**Files:**
- Create: `SecondHalf/app/(shell)/margin-note.tsx`

- [ ] **Step 1: Create the component with explicit variants (no boolean props)**

```tsx
import type { ReactNode } from "react";

type MarginNoteVariant = "citation" | "correction" | "aside";

const LABELS: Record<MarginNoteVariant, string> = {
  citation: "Citation",
  correction: "Watch out",
  aside: "Aside",
};

export function MarginNote({
  variant = "aside",
  label,
  children,
}: {
  variant?: MarginNoteVariant;
  label?: string;
  children: ReactNode;
}) {
  return (
    <aside className="margin-note" data-variant={variant}>
      <span className="margin-note__label">{label ?? LABELS[variant]}</span>
      <div className="margin-note__body">{children}</div>
    </aside>
  );
}
```

- [ ] **Step 2: Append margin-note styles**

```css
/* ---------- Margin notes ---------- */

.margin-note {
  border-left: 2px solid var(--primary);
  padding: var(--space-1) var(--space-4);
  font-size: var(--text-sm);
  color: var(--muted);
  line-height: 1.55;
}

.margin-note[data-variant="correction"] {
  border-left-color: var(--correction);
}

.margin-note[data-variant="aside"] {
  border-left-color: var(--line-strong);
}

.margin-note__label {
  display: block;
  font-family: var(--font-mono), "JetBrains Mono", monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--primary);
  margin-bottom: var(--space-1);
}

.margin-note[data-variant="correction"] .margin-note__label {
  color: var(--correction);
}

.margin-note[data-variant="aside"] .margin-note__label {
  color: var(--muted-2);
}

.margin-note__body p {
  margin: 0 0 var(--space-2);
}

.margin-note__body > :last-child {
  margin-bottom: 0;
}
```

- [ ] **Step 3: Commit**

```bash
git add SecondHalf/app/\(shell\)/margin-note.tsx SecondHalf/app/globals.css
git commit -m "feat(study-lab): add MarginNote with citation/correction/aside variants"
```

---

## Task 10: KaTeX wrapper (ref-based render, no innerHTML injection)

KaTeX exposes two APIs: `renderToString` (returns HTML) and `render(latex, element, options)` (mutates a DOM node). We use `render()` through a React ref so we never hand HTML to React directly. On failure we populate the same element with an escaped fallback span using `textContent` + `appendChild` — still no HTML injection.

**Files:**
- Create: `SecondHalf/app/(shell)/katex.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

function renderIntoElement(
  el: HTMLElement,
  latex: string,
  displayMode: boolean,
): void {
  try {
    katex.render(latex, el, {
      displayMode,
      throwOnError: false,
      output: "html",
    });
  } catch {
    el.replaceChildren();
    const fallback = document.createElement("code");
    fallback.className = "katex-fallback";
    fallback.textContent = latex;
    el.appendChild(fallback);
  }
}

export function InlineMath({ children }: { children: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    if (ref.current) renderIntoElement(ref.current, children, false);
  }, [children]);
  return <span ref={ref} className="math-inline" />;
}

export function BlockMath({
  children,
  ariaLabel,
}: {
  children: string;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (ref.current) renderIntoElement(ref.current, children, true);
  }, [children]);
  return <div ref={ref} className="math-block" role="math" aria-label={ariaLabel} />;
}
```

- [ ] **Step 2: Append math styles**

```css
/* ---------- Math ---------- */

.math-block {
  padding: var(--space-5) var(--space-6);
  background: var(--paper-strong);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  overflow-x: auto;
  font-size: 1.1em;
}

.math-inline .katex-fallback,
.math-block .katex-fallback {
  font-family: var(--font-mono), "JetBrains Mono", monospace;
  background: var(--correction-tint);
  color: var(--correction);
  padding: 0.1em 0.35em;
  border-radius: var(--radius-sm);
}

.math-inline .katex,
.math-block .katex {
  font-size: 1em;
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: succeeds. KaTeX CSS bundles with any page that imports this component.

- [ ] **Step 4: Commit**

```bash
git add SecondHalf/app/\(shell\)/katex.tsx SecondHalf/app/globals.css
git commit -m "feat(study-lab): add KaTeX inline/block renderers using ref-mutation API"
```

---

## Task 11: Concept compound component (TDD on heading id helper)

Provides `<Concept>`, `<Concept.Definition>`, `<Concept.Formula>`, `<Concept.Intuition>`, `<Concept.WorkedExample>`, `<Concept.Pitfall>`, `<Concept.FurtherReading>`.

**Files:**
- Create: `SecondHalf/app/(shell)/concept.ts` (pure helpers)
- Create: `SecondHalf/app/(shell)/concept.tsx` (component)
- Create: `SecondHalf/tests/concept-context.test.ts`

- [ ] **Step 1: Write the failing test**

Create `SecondHalf/tests/concept-context.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildConceptHeadingId } from "../app/(shell)/concept.ts";

test("builds stable id from section + slug", () => {
  assert.equal(buildConceptHeadingId("3.1", "k-means"), "s-3-1-k-means");
});

test("slugs lowercase and replace spaces", () => {
  assert.equal(buildConceptHeadingId("4.2", "Random Forest"), "s-4-2-random-forest");
});

test("strips punctuation", () => {
  assert.equal(buildConceptHeadingId("6.1", "Neural Networks!"), "s-6-1-neural-networks");
});
```

- [ ] **Step 2: Run test to verify failure**

```bash
npm run test
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement the helper**

Create `SecondHalf/app/(shell)/concept.ts`:

```ts
export function buildConceptHeadingId(section: string, slug: string): string {
  const normalisedSection = section.replace(/\./g, "-");
  const normalisedSlug = slug
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return `s-${normalisedSection}-${normalisedSlug}`;
}
```

- [ ] **Step 4: Run tests**

```bash
npm run test
```

Expected: tests PASS.

- [ ] **Step 5: Create the compound component**

Create `SecondHalf/app/(shell)/concept.tsx`:

```tsx
import type { ReactNode } from "react";
import { buildConceptHeadingId } from "./concept";

export function Concept({
  section,
  title,
  slug,
  children,
}: {
  section: string;
  title: string;
  slug: string;
  children: ReactNode;
}) {
  const id = buildConceptHeadingId(section, slug);
  return (
    <section id={id} className="concept" aria-labelledby={`${id}-title`}>
      <header className="concept__head">
        <span className="concept__section-number tabular">§&nbsp;{section}</span>
        <h2 id={`${id}-title`} className="concept__title">{title}</h2>
      </header>
      <div className="concept__body">{children}</div>
    </section>
  );
}

function Definition({ children }: { children: ReactNode }) {
  return (
    <p className="concept__definition">
      <span className="concept__slot-tag">Definition</span>
      {children}
    </p>
  );
}

function Formula({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <figure className="concept__formula">
      {caption ? <figcaption className="concept__slot-tag">{caption}</figcaption> : null}
      {children}
    </figure>
  );
}

function Intuition({ children }: { children: ReactNode }) {
  return (
    <div className="concept__intuition">
      <span className="concept__slot-tag">Intuition</span>
      {children}
    </div>
  );
}

function WorkedExample({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="concept__worked">
      <span className="concept__slot-tag">Worked example{title ? ` · ${title}` : ""}</span>
      {children}
    </div>
  );
}

function Pitfall({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="concept__pitfall" role="note">
      <span className="concept__slot-tag concept__slot-tag--correction">Pitfall</span>
      <h3 className="concept__pitfall-title">{title}</h3>
      <div className="concept__pitfall-body">{children}</div>
    </aside>
  );
}

function FurtherReading({ children }: { children: ReactNode }) {
  return (
    <div className="concept__further">
      <span className="concept__slot-tag">Further reading</span>
      {children}
    </div>
  );
}

Concept.Definition = Definition;
Concept.Formula = Formula;
Concept.Intuition = Intuition;
Concept.WorkedExample = WorkedExample;
Concept.Pitfall = Pitfall;
Concept.FurtherReading = FurtherReading;
```

- [ ] **Step 6: Append concept styles**

```css
/* ---------- Concept ---------- */

.concept {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 240px;
  gap: var(--space-6);
  padding-top: var(--space-8);
  border-top: 1px solid var(--line);
}

.concept:first-of-type {
  border-top: 0;
  padding-top: 0;
}

.concept__head {
  grid-column: 1 / -1;
  display: grid;
  gap: var(--space-2);
}

.concept__section-number {
  font-family: var(--font-display), Fraunces, serif;
  font-weight: 300;
  color: var(--muted);
  font-size: var(--text-lg);
}

.concept__title {
  font-size: var(--text-3xl);
}

.concept__body {
  grid-column: 1 / 2;
  display: grid;
  gap: var(--space-5);
}

.concept__definition {
  font-size: var(--text-lg);
  color: var(--ink);
  max-width: 60ch;
}

.concept__slot-tag {
  display: block;
  font-family: var(--font-mono), "JetBrains Mono", monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted-2);
  margin-bottom: var(--space-1);
}

.concept__slot-tag--correction {
  color: var(--correction);
}

.concept__formula figcaption {
  margin-bottom: var(--space-2);
}

.concept__intuition {
  display: grid;
  gap: var(--space-3);
}

.concept__intuition p {
  color: var(--ink);
  max-width: 62ch;
}

.concept__worked {
  padding: var(--space-5);
  background: var(--paper-strong);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  display: grid;
  gap: var(--space-3);
}

.concept__pitfall {
  padding: var(--space-5);
  background: var(--correction-tint);
  border-left: 3px solid var(--correction);
  border-radius: var(--radius-sm) var(--radius-md) var(--radius-md) var(--radius-sm);
  display: grid;
  gap: var(--space-2);
}

.concept__pitfall-title {
  font-family: var(--font-display), Fraunces, serif;
  font-size: var(--text-xl);
  font-weight: 500;
  color: var(--ink);
  margin: 0;
}

.concept__further {
  display: grid;
  gap: var(--space-2);
  font-size: var(--text-sm);
}

.concept__derivation {
  margin: 0;
  padding-left: var(--space-5);
  color: var(--muted);
  font-size: var(--text-sm);
  display: grid;
  gap: var(--space-2);
}

.concept__derivation strong { color: var(--ink); font-weight: 600; }

/* Right column: margin notes stacked */
.concept > .margin-note {
  grid-column: 2 / 3;
  grid-row: span 2;
  align-self: start;
  position: sticky;
  top: 130px;
}

@media (max-width: 1040px) {
  .concept {
    grid-template-columns: 1fr;
  }
  .concept__body,
  .concept > .margin-note {
    grid-column: 1 / -1;
    grid-row: auto;
    position: static;
  }
}
```

- [ ] **Step 7: Verify build**

```bash
npm run build
```

Expected: succeeds.

- [ ] **Step 8: Commit**

```bash
git add SecondHalf/app/\(shell\)/concept.ts SecondHalf/app/\(shell\)/concept.tsx SecondHalf/app/globals.css SecondHalf/tests/concept-context.test.ts
git commit -m "feat(study-lab): add Concept compound component with 6-slot template"
```

---

## Task 12: Module 3 lab context (React 19 `use()`)

**Files:**
- Create: `SecondHalf/app/module-3/labs/lab-context.tsx`

- [ ] **Step 1: Create the context module**

```tsx
"use client";

import { createContext, use, useCallback, useMemo, useState, type ReactNode } from "react";

export type LabView = "kmeans" | "knn" | "svm";

export type Module3LabState = {
  view: LabView;
  setView: (view: LabView) => void;

  clusterStep: number;
  setClusterStep: (step: number) => void;

  testPoint: { x: number; y: number };
  setTestPoint: (point: { x: number; y: number }) => void;

  k: number;
  setK: (k: number) => void;

  kernel: "linear" | "rbf";
  setKernel: (kernel: "linear" | "rbf") => void;

  cValue: number;
  setCValue: (c: number) => void;
};

const Module3LabContext = createContext<Module3LabState | null>(null);

export function Module3LabProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<LabView>("kmeans");
  const [clusterStep, setClusterStep] = useState(0);
  const [testPoint, setTestPoint] = useState({ x: 5, y: 3 });
  const [k, setK] = useState(3);
  const [kernel, setKernel] = useState<"linear" | "rbf">("linear");
  const [cValue, setCValue] = useState(1.0);

  const setTestPointStable = useCallback(
    (point: { x: number; y: number }) => setTestPoint(point),
    [],
  );

  const value = useMemo<Module3LabState>(
    () => ({
      view, setView,
      clusterStep, setClusterStep,
      testPoint, setTestPoint: setTestPointStable,
      k, setK,
      kernel, setKernel,
      cValue, setCValue,
    }),
    [view, clusterStep, testPoint, k, kernel, cValue, setTestPointStable],
  );

  return <Module3LabContext value={value}>{children}</Module3LabContext>;
}

export function useModule3Lab(): Module3LabState {
  const ctx = use(Module3LabContext);
  if (!ctx) {
    throw new Error("useModule3Lab must be used within <Module3LabProvider>");
  }
  return ctx;
}
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run typecheck
```

Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add SecondHalf/app/module-3/labs/lab-context.tsx
git commit -m "feat(study-lab): add Module 3 lab provider using React 19 use()"
```

---

## Task 13: K-means lab extraction

**Files:**
- Create: `SecondHalf/app/module-3/labs/kmeans-lab.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";

import { useModule3Lab } from "./lab-context";

type ScorePoint = { id: string; math: number; science: number };

type ClusterStep = {
  label: string;
  description: string;
  centroids: Array<{ math: number; science: number; color: "amber" | "teal" }>;
  assignments: Partial<Record<string, "amber" | "teal">>;
};

const studentScores: ScorePoint[] = [
  { id: "A", math: 85, science: 70 },
  { id: "B", math: 90, science: 85 },
  { id: "C", math: 75, science: 60 },
  { id: "D", math: 40, science: 45 },
  { id: "E", math: 50, science: 50 },
  { id: "F", math: 55, science: 35 },
];

const clusterSteps: ClusterStep[] = [
  {
    label: "1. Seed",
    description: "Use the professor's example: pick A and D as starting centroids. No groupings yet.",
    centroids: [
      { math: 85, science: 70, color: "amber" },
      { math: 40, science: 45, color: "teal" },
    ],
    assignments: {},
  },
  {
    label: "2. Assign",
    description: "Every student joins the nearer centroid. A, B, C land with A's centroid. D, E, F with D's.",
    centroids: [
      { math: 85, science: 70, color: "amber" },
      { math: 40, science: 45, color: "teal" },
    ],
    assignments: { A: "amber", B: "amber", C: "amber", D: "teal", E: "teal", F: "teal" },
  },
  {
    label: "3. Update",
    description: "Recompute each centroid as the mean of its members. Amber moves to (83.3, 71.7). Teal moves to (48.3, 43.3).",
    centroids: [
      { math: 83.33, science: 71.67, color: "amber" },
      { math: 48.33, science: 43.33, color: "teal" },
    ],
    assignments: { A: "amber", B: "amber", C: "amber", D: "teal", E: "teal", F: "teal" },
  },
  {
    label: "4. Converge",
    description: "Assignments are stable; k-means halts. The fixed assignment is the final clustering.",
    centroids: [
      { math: 83.33, science: 71.67, color: "amber" },
      { math: 48.33, science: 43.33, color: "teal" },
    ],
    assignments: { A: "amber", B: "amber", C: "amber", D: "teal", E: "teal", F: "teal" },
  },
];

function plotX(value: number, max: number, width = 420, padding = 36) {
  return padding + (value / max) * (width - padding * 2);
}

function plotY(value: number, max: number, height = 280, padding = 28) {
  return height - padding - (value / max) * (height - padding * 2);
}

export function KMeansLab() {
  const { clusterStep, setClusterStep } = useModule3Lab();
  const current = clusterSteps[clusterStep];

  return (
    <div className="lab-surface">
      <div className="lab-surface__controls" role="tablist" aria-label="K-means step">
        {clusterSteps.map((step, index) => (
          <button
            key={step.label}
            className="mini-switch"
            data-active={clusterStep === index}
            onClick={() => setClusterStep(index)}
            type="button"
            role="tab"
            aria-selected={clusterStep === index}
          >
            {step.label}
          </button>
        ))}
      </div>

      <svg className="plot" viewBox="0 0 420 280" role="img" aria-label="K-means clustering progress">
        <line x1="36" y1="252" x2="392" y2="252" className="axis-line" />
        <line x1="36" y1="252" x2="36" y2="28" className="axis-line" />
        <text x="392" y="270" className="axis-label">Math</text>
        <text x="10" y="34" className="axis-label">Science</text>

        {studentScores.map((point) => {
          const color = current.assignments[point.id] ?? "neutral";
          return (
            <g key={point.id} transform={`translate(${plotX(point.math, 100)}, ${plotY(point.science, 100)})`}>
              <circle className={`plot-point plot-point--${color}`} r="11" />
              <text className="point-text" dy="4">{point.id}</text>
            </g>
          );
        })}

        {current.centroids.map((c) => (
          <g
            key={`${c.color}-${c.math}-${c.science}`}
            transform={`translate(${plotX(c.math, 100)}, ${plotY(c.science, 100)}) rotate(45)`}
          >
            <rect className={`plot-centroid plot-centroid--${c.color}`} x="-10" y="-10" width="20" height="20" rx="3" />
          </g>
        ))}
      </svg>

      <p className="lab-surface__caption tabular">
        <span className="kicker">Step {clusterStep + 1} / {clusterSteps.length} · {current.label}</span>
        {current.description}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Replace the existing `.plot` / `.axis-line` / `.plot-point` / `.plot-centroid` rules in globals.css**

Find the existing rules in `globals.css` and replace them with the harmonised block below. Also append the `.lab-surface` / `.mini-switch` block (new).

```css
/* ---------- Lab surfaces (Module 3 + future) ---------- */

.lab-surface {
  padding: var(--space-5);
  background: var(--paper-strong);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  display: grid;
  gap: var(--space-4);
}

.lab-surface__controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.lab-surface__caption {
  color: var(--muted);
  font-size: var(--text-sm);
  line-height: 1.6;
  display: grid;
  gap: var(--space-1);
}

.lab-surface__caption .kicker {
  font-family: var(--font-mono), "JetBrains Mono", monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted-2);
}

.mini-switch {
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  color: var(--muted);
  background: var(--paper);
  font-family: var(--font-mono), "JetBrains Mono", monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: color var(--dur-fast) var(--ease),
              background-color var(--dur-fast) var(--ease),
              border-color var(--dur-fast) var(--ease);
}

.mini-switch:hover {
  color: var(--ink);
  border-color: var(--ink);
}

.mini-switch[data-active="true"] {
  color: var(--paper);
  background: var(--ink);
  border-color: var(--ink);
}

.plot {
  width: 100%;
  height: auto;
  background-image:
    linear-gradient(rgba(27, 27, 27, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(27, 27, 27, 0.05) 1px, transparent 1px);
  background-size: 28px 28px, 28px 28px;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
}

.axis-line { stroke: rgba(27, 27, 27, 0.35); stroke-width: 1.2; }
.axis-label, .point-text { fill: var(--muted); font-family: var(--font-mono), monospace; font-size: 11px; }
.point-text { text-anchor: middle; fill: var(--ink); font-weight: 600; }

.plot-point { stroke: rgba(27, 27, 27, 0.4); stroke-width: 1.5; }
.plot-point--amber { fill: rgba(45, 90, 107, 0.25); stroke: var(--primary); }
.plot-point--teal  { fill: rgba(184, 88, 58, 0.2); stroke: var(--correction); }
.plot-point--neutral { fill: rgba(27, 27, 27, 0.1); stroke: var(--muted-2); }

.plot-centroid { stroke: var(--ink); stroke-width: 2; }
.plot-centroid--amber { fill: rgba(45, 90, 107, 0.18); }
.plot-centroid--teal  { fill: rgba(184, 88, 58, 0.16); }
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add SecondHalf/app/module-3/labs/kmeans-lab.tsx SecondHalf/app/globals.css
git commit -m "feat(study-lab): extract K-means interactive into its own lab component"
```

---

## Task 14: KNN lab extraction

**Files:**
- Create: `SecondHalf/app/module-3/labs/knn-lab.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";

import { useDeferredValue, useMemo } from "react";
import { useModule3Lab } from "./lab-context";

type KnnSample = { x: number; y: number; label: "A" | "B" };

const training: KnnSample[] = [
  { x: 2, y: 4, label: "A" },
  { x: 4, y: 6, label: "A" },
  { x: 4, y: 4, label: "A" },
  { x: 6, y: 2, label: "B" },
  { x: 6, y: 4, label: "B" },
  { x: 8, y: 2, label: "B" },
];

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function plotX(value: number, max: number, width = 420, padding = 36) {
  return padding + (value / max) * (width - padding * 2);
}

function plotY(value: number, max: number, height = 280, padding = 28) {
  return height - padding - (value / max) * (height - padding * 2);
}

export function KnnLab() {
  const { testPoint, setTestPoint, k, setK } = useModule3Lab();
  const deferredPoint = useDeferredValue(testPoint);

  const ranked = useMemo(
    () =>
      training
        .map((sample, index) => ({ id: index, ...sample, dist: distance(sample, deferredPoint) }))
        .sort((a, b) => a.dist - b.dist),
    [deferredPoint],
  );

  const neighbors = ranked.slice(0, k);
  const votes = neighbors.reduce(
    (acc, n) => ({ ...acc, [n.label]: acc[n.label] + 1 }),
    { A: 0, B: 0 } as Record<"A" | "B", number>,
  );
  const predicted: "A" | "B" =
    votes.A === votes.B ? neighbors[0]?.label ?? "A" : votes.A > votes.B ? "A" : "B";

  return (
    <div className="lab-surface">
      <div className="lab-surface__controls">
        <label className="range-field">
          <span>Test X</span>
          <input
            type="range" min="0" max="10" step="0.5"
            value={testPoint.x}
            onChange={(e) => setTestPoint({ ...testPoint, x: Number(e.target.value) })}
            aria-label="Test point X coordinate"
          />
          <span className="tabular">{testPoint.x.toFixed(1)}</span>
        </label>
        <label className="range-field">
          <span>Test Y</span>
          <input
            type="range" min="0" max="10" step="0.5"
            value={testPoint.y}
            onChange={(e) => setTestPoint({ ...testPoint, y: Number(e.target.value) })}
            aria-label="Test point Y coordinate"
          />
          <span className="tabular">{testPoint.y.toFixed(1)}</span>
        </label>
        <label className="range-field">
          <span>k</span>
          <input
            type="range" min="1" max="5" step="1"
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            aria-label="Number of neighbors"
          />
          <span className="tabular">{k}</span>
        </label>
      </div>

      <svg className="plot" viewBox="0 0 420 280" role="img" aria-label="KNN classification">
        <line x1="36" y1="252" x2="392" y2="252" className="axis-line" />
        <line x1="36" y1="252" x2="36" y2="28" className="axis-line" />
        {neighbors.map((n) => (
          <line
            key={`line-${n.id}`}
            className="neighbor-line"
            x1={plotX(testPoint.x, 10)} y1={plotY(testPoint.y, 10)}
            x2={plotX(n.x, 10)} y2={plotY(n.y, 10)}
          />
        ))}
        {training.map((s, i) => {
          const isNeighbor = neighbors.some((n) => n.id === i);
          return (
            <g key={`${s.label}-${i}`} transform={`translate(${plotX(s.x, 10)}, ${plotY(s.y, 10)})`}>
              <circle className={`plot-point plot-point--${s.label === "A" ? "amber" : "teal"}`} r={isNeighbor ? 12 : 9} />
              <text className="point-text" dy="4">{s.label}</text>
            </g>
          );
        })}
        <g transform={`translate(${plotX(testPoint.x, 10)}, ${plotY(testPoint.y, 10)})`}>
          <polygon className="plot-star" points="0,-14 4,-4 14,-4 6,2 10,12 0,6 -10,12 -6,2 -14,-4 -4,-4" />
        </g>
      </svg>

      <p className="lab-surface__caption tabular">
        <span className="kicker">Prediction</span>
        {k} nearest neighbors vote {votes.A}–{votes.B} → class <strong>{predicted}</strong>.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Append range-field + KNN plot styles**

```css
/* ---------- Range fields ---------- */

.range-field {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--space-3);
  min-width: 14rem;
  padding: var(--space-2) var(--space-3);
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
}

.range-field span:first-child {
  font-family: var(--font-mono), monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}

.range-field input[type="range"] {
  accent-color: var(--primary);
  width: 100%;
}

.range-field .tabular {
  min-width: 2.2rem;
  text-align: right;
  color: var(--ink);
}

/* KNN plot additions */
.neighbor-line { stroke: var(--correction); stroke-width: 1.5; stroke-dasharray: 4 5; opacity: 0.6; }
.plot-star     { fill: var(--correction); stroke: var(--ink); stroke-width: 1.2; }
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add SecondHalf/app/module-3/labs/knn-lab.tsx SecondHalf/app/globals.css
git commit -m "feat(study-lab): extract KNN lab component, defer input-driven recompute"
```

---

## Task 15: SVM lab extraction

**Files:**
- Create: `SecondHalf/app/module-3/labs/svm-lab.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";

import { useModule3Lab } from "./lab-context";

type SvmSample = { id: string; x: number; y: number; label: "0" | "1" };

const samples: SvmSample[] = [
  { id: "p1", x: 2, y: 3, label: "0" },
  { id: "p2", x: 3, y: 4, label: "0" },
  { id: "p3", x: 4, y: 5, label: "0" },
  { id: "p4", x: 5, y: 6, label: "0" },
  { id: "p5", x: 6, y: 7, label: "0" },
  { id: "p6", x: 7, y: 8, label: "1" },
  { id: "p7", x: 8, y: 1, label: "1" },
  { id: "p8", x: 9, y: 2, label: "1" },
  { id: "p9", x: 10, y: 3, label: "1" },
  { id: "p10", x: 11, y: 4, label: "1" },
];

function plotX(value: number, max: number, width = 420, padding = 36) {
  return padding + (value / max) * (width - padding * 2);
}

function plotY(value: number, max: number, height = 280, padding = 28) {
  return height - padding - (value / max) * (height - padding * 2);
}

const RBF_CURVE = "M 154 34 C 236 68 258 132 244 198 C 228 250 188 262 134 244";

export function SvmLab() {
  const { kernel, setKernel, cValue, setCValue } = useModule3Lab();
  const linearBoundary = plotX(6.5, 12);
  const linearMargin = 52 - cValue * 18;
  const rbfHalo = 60 - cValue * 14;

  return (
    <div className="lab-surface">
      <div className="lab-surface__controls">
        <button
          className="mini-switch" type="button"
          data-active={kernel === "linear"}
          onClick={() => setKernel("linear")}
          aria-pressed={kernel === "linear"}
        >Linear kernel</button>
        <button
          className="mini-switch" type="button"
          data-active={kernel === "rbf"}
          onClick={() => setKernel("rbf")}
          aria-pressed={kernel === "rbf"}
        >RBF kernel</button>
        <label className="range-field">
          <span>C</span>
          <input
            type="range" min="0.4" max="2" step="0.1"
            value={cValue}
            onChange={(e) => setCValue(Number(e.target.value))}
            aria-label="Regularization parameter C"
          />
          <span className="tabular">{cValue.toFixed(1)}</span>
        </label>
      </div>

      <svg className="plot" viewBox="0 0 420 280" role="img" aria-label="SVM decision boundary">
        <line x1="36" y1="252" x2="392" y2="252" className="axis-line" />
        <line x1="36" y1="252" x2="36" y2="28" className="axis-line" />

        {kernel === "linear" ? (
          <>
            <rect className="margin-band" x={linearBoundary - linearMargin / 2} y="36" width={linearMargin} height="208" rx="24" />
            <line className="decision-line" x1={linearBoundary} x2={linearBoundary} y1="34" y2="246" />
          </>
        ) : (
          <>
            <path className="margin-path" d={RBF_CURVE} style={{ strokeWidth: rbfHalo }} />
            <path className="decision-curve" d={RBF_CURVE} />
          </>
        )}

        {samples.map((s) => {
          const isSupport = ["p5", "p6", "p7"].includes(s.id);
          return (
            <g key={s.id} transform={`translate(${plotX(s.x, 12)}, ${plotY(s.y, 8)})`}>
              <circle className={`plot-point plot-point--${s.label === "0" ? "amber" : "teal"}`} r={isSupport ? 11 : 8} />
              {isSupport ? <circle className="support-ring" r="16" /> : null}
            </g>
          );
        })}
      </svg>

      <p className="lab-surface__caption">
        <span className="kicker">C = {cValue.toFixed(1)}</span>
        {kernel === "linear"
          ? "Linear kernel with the widest safe margin. Larger C shrinks the margin (harder, less regularised)."
          : "RBF kernel bends the boundary. γ controls each training point's influence radius."}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Append SVM plot styles**

```css
/* SVM plot additions */
.margin-band { fill: var(--primary-tint); }
.decision-line, .decision-curve { stroke: var(--correction); stroke-width: 2.4; fill: none; }
.margin-path { stroke: rgba(184, 88, 58, 0.2); fill: none; stroke-linecap: round; }
.support-ring { fill: none; stroke: var(--ink); stroke-width: 1.3; stroke-dasharray: 4 5; }
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add SecondHalf/app/module-3/labs/svm-lab.tsx SecondHalf/app/globals.css
git commit -m "feat(study-lab): extract SVM lab component with linear/RBF modes"
```

---

## Task 16: Module 3 concept content — K-means

**Files:**
- Create: `SecondHalf/app/module-3/concept-kmeans.tsx`

- [ ] **Step 1: Create the file**

```tsx
import { Concept } from "../(shell)/concept";
import { BlockMath, InlineMath } from "../(shell)/katex";
import { MarginNote } from "../(shell)/margin-note";
import { KMeansLab } from "./labs/kmeans-lab";

export function ConceptKMeans() {
  return (
    <Concept section="3.1" slug="k-means" title="K-means clustering">
      <Concept.Definition>
        An unsupervised algorithm that partitions <em>n</em> observations into <em>k</em> clusters by iteratively
        minimising the within-cluster sum of squares.
      </Concept.Definition>

      <Concept.Formula caption="Objective · inertia / within-cluster sum of squares">
        <BlockMath ariaLabel="K-means objective">
          {`J(C,\\mu) = \\sum_{j=1}^{k}\\sum_{x_i \\in S_j} \\lVert x_i - \\mu_j \\rVert^2`}
        </BlockMath>
        <ul className="concept__derivation">
          <li>
            <strong>Assignment step.</strong>{" "}
            <InlineMath>{`C(i) = \\arg\\min_j \\lVert x_i - \\mu_j \\rVert^2`}</InlineMath>
          </li>
          <li>
            <strong>Update step.</strong>{" "}
            <InlineMath>{`\\mu_j = \\frac{1}{|S_j|} \\sum_{i \\in S_j} x_i`}</InlineMath>
          </li>
          <li>
            Each step weakly decreases <InlineMath>{`J`}</InlineMath>; with finite partitions, the procedure converges.
          </li>
        </ul>
      </Concept.Formula>

      <Concept.Intuition>
        <p>
          The algorithm is the Canvas four-step loop: seed centroids, assign every point to its nearest centroid,
          recompute centroids as cluster means, repeat until nobody switches sides. The geometric picture is simpler
          than the formula: each centroid &quot;claims&quot; a Voronoi region, and points in each region contribute
          their squared distances to the running total.
        </p>
        <p>
          Because inertia measures squared Euclidean distance, K-means tacitly assumes clusters are convex and
          roughly equal in spread. It will find clusters even when none exist — which is why <em>k</em> is a
          modelling choice, not a discovery.
        </p>
      </Concept.Intuition>

      <Concept.WorkedExample title="Professor's student-score example">
        <KMeansLab />
      </Concept.WorkedExample>

      <Concept.Pitfall title="K-means does not always find the best clusters.">
        <p>
          Lloyd&apos;s algorithm converges to a <em>local</em> minimum of inertia. Different random seeds can land
          in different solutions, which is why scikit-learn runs <code>n_init</code> restarts (default 10) and keeps
          the best. Production code uses <strong>k-means++ seeding</strong> to pick well-spread initial centroids.
        </p>
      </Concept.Pitfall>

      <Concept.FurtherReading>
        <ul>
          <li>
            <a href="https://scikit-learn.org/stable/modules/clustering.html#k-means" rel="noreferrer" target="_blank">
              scikit-learn · K-means
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/watch?v=4b5d3muPQmA" rel="noreferrer" target="_blank">
              StatQuest · K-means clustering
            </a>
          </li>
        </ul>
      </Concept.FurtherReading>

      <MarginNote variant="citation">
        <p>Lloyd, S. (1982). Least squares quantization in PCM. <em>IEEE TIT 28(2)</em>.</p>
        <p>Arthur &amp; Vassilvitskii (2007). k-means++: The advantages of careful seeding.</p>
      </MarginNote>
      <MarginNote variant="correction">
        Choose <em>k</em> with the <strong>elbow method</strong> (plot inertia vs <em>k</em>, pick the knee) or the{" "}
        <strong>silhouette coefficient</strong>{" "}
        <InlineMath>{`s = \\frac{b - a}{\\max(a, b)}`}</InlineMath> (higher is better; <em>a</em>: mean
        intra-cluster distance, <em>b</em>: mean distance to nearest other cluster).
      </MarginNote>
    </Concept>
  );
}
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run typecheck
```

Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add SecondHalf/app/module-3/concept-kmeans.tsx
git commit -m "feat(study-lab): write K-means concept content with KaTeX + margin notes"
```

---

## Task 17: Module 3 concept content — KNN

**Files:**
- Create: `SecondHalf/app/module-3/concept-knn.tsx`

- [ ] **Step 1: Create the file**

```tsx
import { Concept } from "../(shell)/concept";
import { BlockMath, InlineMath } from "../(shell)/katex";
import { MarginNote } from "../(shell)/margin-note";
import { KnnLab } from "./labs/knn-lab";

export function ConceptKnn() {
  return (
    <Concept section="3.2" slug="k-nearest-neighbors" title="K-Nearest Neighbors">
      <Concept.Definition>
        A non-parametric, instance-based classifier that predicts the label of a new point by majority vote of the{" "}
        <em>k</em> nearest training examples under a chosen distance metric.
      </Concept.Definition>

      <Concept.Formula caption="Decision rule (uniform vote)">
        <BlockMath ariaLabel="KNN uniform majority vote">
          {`\\hat{y}(x) = \\arg\\max_{c} \\sum_{i \\in N_k(x)} \\mathbb{1}[y_i = c]`}
        </BlockMath>
        <ul className="concept__derivation">
          <li>
            Distance-weighted variant:{" "}
            <InlineMath>{`\\hat{y}(x) = \\arg\\max_{c} \\sum_{i \\in N_k(x)} \\frac{1}{d(x, x_i)} \\cdot \\mathbb{1}[y_i = c]`}</InlineMath>
          </li>
          <li>
            Metric family (Minkowski):{" "}
            <InlineMath>{`d_p(x, x') = \\left( \\sum_m |x_m - x'_m|^p \\right)^{1/p}`}</InlineMath>{" "}
            — <em>p = 1</em> Manhattan, <em>p = 2</em> Euclidean.
          </li>
        </ul>
      </Concept.Formula>

      <Concept.Intuition>
        <p>
          KNN does not learn a formula. At prediction time it searches the training set for the <em>k</em> points
          closest to the new observation, then lets them vote. &quot;Closest&quot; is entirely defined by your
          distance metric — so <strong>feature scaling is not optional</strong>. A feature measured in thousands
          (salary) will drown out a feature measured on a 1–5 scale (rating).
        </p>
        <p>
          Small <em>k</em> lets noisy points dominate local decisions (low bias, high variance). Large <em>k</em>{" "}
          smooths the boundary but can wash out real local structure. Cross-validate.
        </p>
      </Concept.Intuition>

      <Concept.WorkedExample>
        <KnnLab />
      </Concept.WorkedExample>

      <Concept.Pitfall title="KNN collapses in high dimensions.">
        <p>
          Past roughly <strong>15 dimensions</strong>, the distances between all pairs of points approach each
          other — every training example is &quot;far&quot; from the test point in the same way. This is the curse
          of dimensionality. scikit-learn switches to brute-force search in high dimensions because tree-based
          indexes stop helping. Reduce dimensions (PCA, feature selection) or pick a different model.
        </p>
      </Concept.Pitfall>

      <Concept.FurtherReading>
        <ul>
          <li>
            <a href="https://scikit-learn.org/stable/modules/neighbors.html" rel="noreferrer" target="_blank">
              scikit-learn · Nearest neighbors
            </a>
          </li>
        </ul>
      </Concept.FurtherReading>

      <MarginNote variant="correction">
        KNN makes predictions in <InlineMath>{`\\mathcal{O}(nd)`}</InlineMath> per query with brute force; KD-trees
        amortise that for low <em>d</em> but lose their edge around <em>d &gt; 15</em>.
      </MarginNote>
      <MarginNote variant="aside" label="Exam trap">
        Even <em>k</em> allows a tied vote. Use odd <em>k</em> for binary problems and fall back to distance-weighted
        voting when ties matter.
      </MarginNote>
    </Concept>
  );
}
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run typecheck
```

Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add SecondHalf/app/module-3/concept-knn.tsx
git commit -m "feat(study-lab): write KNN concept content with scaling + curse-of-dimensionality rigor"
```

---

## Task 18: Module 3 concept content — SVM

**Files:**
- Create: `SecondHalf/app/module-3/concept-svm.tsx`

- [ ] **Step 1: Create the file**

```tsx
import { Concept } from "../(shell)/concept";
import { BlockMath, InlineMath } from "../(shell)/katex";
import { MarginNote } from "../(shell)/margin-note";
import { SvmLab } from "./labs/svm-lab";

export function ConceptSvm() {
  return (
    <Concept section="3.3" slug="support-vector-machines" title="Support Vector Machines">
      <Concept.Definition>
        A maximum-margin classifier that finds the hyperplane separating two classes by the widest safe slab, with
        optional non-linear boundaries via the kernel trick.
      </Concept.Definition>

      <Concept.Formula caption="Soft-margin primal">
        <BlockMath ariaLabel="SVM soft-margin primal">
          {`\\min_{w,b,\\zeta} \\; \\tfrac{1}{2}\\lVert w \\rVert^2 + C \\sum_i \\zeta_i \\quad \\text{s.t.} \\quad y_i(w^\\top \\phi(x_i) + b) \\ge 1 - \\zeta_i, \\; \\zeta_i \\ge 0`}
        </BlockMath>
        <ul className="concept__derivation">
          <li>
            Margin width = <InlineMath>{`2 / \\lVert w \\rVert`}</InlineMath>; maximising it is equivalent to
            minimising <InlineMath>{`\\lVert w \\rVert^2`}</InlineMath>.
          </li>
          <li>
            Slack <InlineMath>{`\\zeta_i`}</InlineMath> lets the model tolerate misclassified points;{" "}
            <strong>C</strong> is the penalty.
          </li>
          <li>
            RBF kernel: <InlineMath>{`K(x,x') = \\exp(-\\gamma \\lVert x - x' \\rVert^2)`}</InlineMath>. Polynomial:{" "}
            <InlineMath>{`(\\gamma \\langle x,x' \\rangle + r)^d`}</InlineMath>.
          </li>
        </ul>
      </Concept.Formula>

      <Concept.Intuition>
        <p>
          SVM does not try to match every point — it picks the <em>support vectors</em>, the handful of points that
          actually touch the margin, and places the boundary as far from each class as possible. For non-linear
          data, the kernel trick implicitly maps points into a higher-dimensional space where a linear separator
          exists, without ever computing those coordinates.
        </p>
        <p>
          <strong>C controls the trade-off between margin width and training error.</strong> Large C punishes every
          slack violation heavily — a harder margin, less regularisation, possibly overfitting. Small C accepts
          misclassifications in exchange for a wider, simpler margin.
        </p>
      </Concept.Intuition>

      <Concept.WorkedExample>
        <SvmLab />
      </Concept.WorkedExample>

      <Concept.Pitfall title="C points the opposite way from most regularisers.">
        <p>
          In SVM, <strong>larger C = harder margin = less regularisation</strong> — the opposite direction to the{" "}
          <InlineMath>{`\\lambda`}</InlineMath> of ridge regression. Remember it via the constraint:{" "}
          <em>&quot;C multiplies the penalty for crossing the margin.&quot;</em>
        </p>
      </Concept.Pitfall>

      <Concept.FurtherReading>
        <ul>
          <li>
            <a href="https://scikit-learn.org/stable/modules/svm.html" rel="noreferrer" target="_blank">
              scikit-learn · SVM
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/watch?v=efR1C6CvhmE" rel="noreferrer" target="_blank">
              StatQuest · SVM main ideas
            </a>
          </li>
        </ul>
      </Concept.FurtherReading>

      <MarginNote variant="aside">
        Multi-class: <code>SVC</code> uses one-vs-one (pairwise); <code>LinearSVC</code> uses one-vs-rest.
      </MarginNote>
      <MarginNote variant="correction">
        RBF γ and C interact. Always standardise features before tuning — otherwise γ has no meaningful scale.
      </MarginNote>
    </Concept>
  );
}
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run typecheck
```

Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add SecondHalf/app/module-3/concept-svm.tsx
git commit -m "feat(study-lab): write SVM concept content with correct C direction guidance"
```

---

## Task 19: Replace Module 3 page + study-lab with composed shell

**Files:**
- Modify: `SecondHalf/app/module-3/page.tsx`
- Modify: `SecondHalf/app/module-3/study-lab.tsx`

- [ ] **Step 1: Replace `study-lab.tsx` with a thin compound wrapper**

```tsx
import { Module3LabProvider } from "./labs/lab-context";
import { ConceptKMeans } from "./concept-kmeans";
import { ConceptKnn } from "./concept-knn";
import { ConceptSvm } from "./concept-svm";

export function Module3Content() {
  return (
    <Module3LabProvider>
      <ConceptKMeans />
      <ConceptKnn />
      <ConceptSvm />
    </Module3LabProvider>
  );
}
```

- [ ] **Step 2: Replace `page.tsx`**

```tsx
import type { Metadata } from "next";
import { PageShell } from "../(shell)/page-shell";
import { SourceTrail, sourceGroups } from "../source-trail";
import { Module3Content } from "./study-lab";

export const metadata: Metadata = {
  title: "Module 3 · ML Study Lab",
  description:
    "Unsupervised learning and nearby classifiers — K-means, K-Nearest Neighbors, and Support Vector Machines.",
};

const TOC = [
  {
    label: "Module 3",
    items: [
      { id: "s-3-1-k-means", label: "§3.1 K-means" },
      { id: "s-3-2-k-nearest-neighbors", label: "§3.2 KNN" },
      { id: "s-3-3-support-vector-machines", label: "§3.3 SVM" },
    ],
  },
];

export default function Module3Page() {
  return (
    <PageShell moduleLabel="Module 3" moduleTone="module-3" tocGroups={TOC}>
      <section className="module-hero">
        <p className="module-hero__kicker">Module 3 · Unsupervised learning</p>
        <h1 className="module-hero__title">Finding structure in data — with labels, and without.</h1>
        <p className="module-hero__deck">
          K-means groups unlabeled points by proximity. KNN and SVM are supervised classifiers that also
          organise points in space — but from labelled training examples. Your Canvas notes group all three
          together because the geometric intuition carries across them.
        </p>
      </section>

      <Module3Content />

      <SourceTrail title="Module 3 source trail" sources={sourceGroups.module3} />
    </PageShell>
  );
}
```

- [ ] **Step 3: Append module-hero styles**

```css
/* ---------- Module hero ---------- */

.module-hero {
  display: grid;
  gap: var(--space-3);
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--line);
}

.module-hero__kicker {
  font-family: var(--font-mono), "JetBrains Mono", monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0;
}

.module-hero__title {
  font-size: var(--text-4xl);
  max-width: 22ch;
}

.module-hero__deck {
  max-width: 62ch;
  color: var(--muted);
  font-size: var(--text-lg);
}

.module-page[data-tone="module-3"] { --module-tint: var(--module-3-tint); --module-line: var(--module-3-line); }
.module-page[data-tone="module-4"] { --module-tint: var(--module-4-tint); --module-line: var(--module-4-line); }
.module-page[data-tone="module-6"] { --module-tint: var(--module-6-tint); --module-line: var(--module-6-line); }
```

- [ ] **Step 4: Verify full build**

```bash
npm run typecheck
npm run build
```

Expected: both pass.

- [ ] **Step 5: Run existing tests**

```bash
npm run test
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add SecondHalf/app/module-3/page.tsx SecondHalf/app/module-3/study-lab.tsx SecondHalf/app/globals.css
git commit -m "feat(study-lab): compose Module 3 page from shell, concepts, and source trail"
```

---

## Task 20: Manual browser QA

Frontend code cannot prove itself via unit tests alone. Start the dev server and verify the golden path.

- [ ] **Step 1: Start dev server**

Run from `SecondHalf/`:

```bash
npm run dev
```

Expected: server starts on <http://localhost:3000>.

- [ ] **Step 2: Verify the home page still renders**

Open <http://localhost:3000>. Confirm:
- Site header shows "COMP SCI 465 / ML Study Lab" with the 5-pill nav.
- No console errors.
- Nav pills look correct (cream pill group, ink-on-paper active).

- [ ] **Step 3: Verify Module 3 page**

Navigate to <http://localhost:3000/module-3>. Confirm:
- **Scroll progress bar** appears under the header and fills as you scroll.
- **Sidebar** shows `§3.1 K-means`, `§3.2 KNN`, `§3.3 SVM`. Active row updates as you scroll. Clicking an item jumps to the section with correct `scroll-margin-top`.
- **Hero** shows the Module 3 kicker + Fraunces title.
- **§3.1 K-means** shows definition, KaTeX-rendered inertia formula, intuition, interactive K-means lab (click step buttons — diagram updates), pitfall card (correction accent), further-reading list, two margin notes (citation + correction).
- **§3.2 KNN** lab responds to X/Y/k sliders. Neighbors highlight and votes update.
- **§3.3 SVM** toggles linear/RBF and responds to C slider. Margin band and decision line redraw.
- **KaTeX fallback:** open DevTools → disable JavaScript → reload. The math spans should show the raw LaTeX source as monospace (our `textContent`-based fallback). Re-enable JS.
- **Reduced motion:** enable OS "Reduce motion" preference; confirm transitions drop to 1ms.
- **Focus-visible:** tab through the page; every interactive element gets the 3-px scholar-blue ring.

- [ ] **Step 4: Keyboard and a11y spot check**

- Tab from the top. Every slider, `mini-switch`, nav pill, and sidebar link must be reachable.
- Sliders respond to arrow keys.
- VoiceOver (`Cmd+F5` on macOS): the K-means plot announces "K-means clustering progress"; each section announces its `§3.1 K-means clustering` heading.

- [ ] **Step 5: Stop the dev server**

`Ctrl+C` in the terminal.

- [ ] **Step 6: Final commit (only if QA fixes were made; otherwise skip)**

```bash
git status
# If fixes needed, make them and commit:
# git commit -am "fix(study-lab): resolve QA findings from Module 3 browser pass"
```

---

## Task 21: Pre-handoff regression check

No code changes — verify Slice 2/3 surfaces still build.

- [ ] **Step 1: Build verify**

```bash
npm run build
```

Expected: succeeds. Module 4, Module 6, home, and quiz pages still render (visually rough, fixed in later slices). No runtime errors.

- [ ] **Step 2: Summarise the diff**

```bash
git log --oneline main..HEAD
```

Expected output: ~18 commits from `chore(study-lab): add katex...` through `feat(study-lab): compose Module 3 page...`.

- [ ] **Step 3: Hand off for review**

Surface the commit list + a one-paragraph summary to the user. Await the go-ahead before opening a PR or proceeding to Slice 2.

---

## Self-Review

**Spec coverage** (ticking off `2026-04-22-ml-study-lab-redesign-design.md`):

- §3.1 Typography (Fraunces + IBM Plex Sans + JetBrains Mono, scale, variable axis): Tasks 3, 4 ✓
- §3.2 Palette (all tokens): Task 3 ✓
- §3.3 Spacing, radius, elevation: Task 3 ✓
- §3.4 Motion + `prefers-reduced-motion`: Task 3 ✓
- §4.1 Header + sidebar + scroll progress + page shell: Tasks 5, 6, 7, 8 ✓
- §5 Concept template (6 slots): Task 11 ✓
- §6.1 Module 3 content rewrites (K-means++, scaling/curse-of-d, C direction): Tasks 16, 17, 18 ✓
- §7 Compound components + React 19 `use()`: Tasks 11, 12 ✓
- §8 KaTeX with fallback: Task 10 (ref-mutation API, no innerHTML) ✓
- §9.1 React best-practices (`useDeferredValue` in KNN, direct imports, memoised ranked list, `useCallback` for stable setter): Tasks 12, 14 ✓
- §9.2 A11y guidelines (aria-labels, focus-visible, tabular-nums, semantic HTML, role/aria on interactive elements): applied throughout + verified in Task 20 ✓

**Deferred to Slice 2 / 3** (by spec §11): Module 4, Module 6, home page, quiz expansion. Explicitly listed in the plan's "Untouched" section.

**Placeholder scan:** No "TBD", "TODO", "fill in", or "similar to task N" in any step. Every code step shows the exact code.

**Type consistency:**
- `computeScrollProgress({ scrollTop, scrollHeight, clientHeight })` — matches between Task 2 helper and Task 6 client.
- `Module3LabState` property names (`testPoint`, `clusterStep`, `cValue`, `kernel`, `k`, `view`) are consistent between Task 12 definition and Tasks 13–15 consumption.
- `<Concept>` slot names (`Definition`, `Formula`, `Intuition`, `WorkedExample`, `Pitfall`, `FurtherReading`) match between Task 11 definition and Tasks 16–18 usage.
- Heading ids emitted by `buildConceptHeadingId("3.1", "k-means")` = `s-3-1-k-means` and match the TOC entries in Task 19.
- `sourceGroups.module3` and `SourceTrail` imports in Task 19 match the existing `app/source-trail.tsx` (unchanged by this slice).

**Known deferred decisions** (per spec §13):
1. Mobile sidebar collapses via CSS at `<1040px` — implemented in Task 7.
2. KaTeX loads on any page that imports the wrapper — accepted; non-module pages never import it.
3. Fraunces SOFT=50 is a one-line swap in `globals.css` `h1–h6` if the feel needs dialling back.
