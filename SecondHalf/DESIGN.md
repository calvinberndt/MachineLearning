# Second Half Study Lab — Design System

## Product Goal

Build a Canvas-first machine learning study tool for COMP SCI 465 that supports two study
modes at once: a cram track (definitions, contrasts, formulas, exam traps) and a deep track
(visual intuition, parameter effects, why the algorithm behaves as it does). The professor's
Canvas material is the source of truth. Outside sources supplement it; they never replace it.

## Source Policy

- Canvas-first: every module preserves the professor's topics, examples, wording emphasis, and
  exam style.
- Outside sources supplement, never replace, Canvas.
- If an outside source shapes an explanation or diagram, the page exposes it in a visible source
  trail.
- Source trails are short, curated, and clickable — for students who want to verify or go deeper.
- Do not copy long text from outside sources. Summarize the idea and link to the source.

---

## Visual Direction — Studio Notebook

The interface is a professor's personal teaching site: scholarly but approachable. Think a
well-annotated textbook printed on warm cream paper, not an O'Reilly product page and not a
startup landing page.

### Palette (CSS custom properties, `globals.css`)

| Token | Value | Role |
|---|---|---|
| `--paper` | `#fbf7ee` | Warm cream page background |
| `--paper-strong` | `#fffdf7` | Elevated surfaces, figure backgrounds |
| `--paper-sunken` | `#f5efe0` | Hover fills, recessed wells |
| `--ink` | `#1b1b1b` | Primary text |
| `--muted` | `#5a564e` | Secondary text |
| `--muted-2` | `#8a857a` | Tertiary text, metadata |
| `--line` | `rgba(27,27,27,0.10)` | Hairline dividers |
| `--line-strong` | `rgba(27,27,27,0.18)` | Bolder rule lines |
| `--primary` | `#2d5a6b` | Scholar blue — links, active nav, primary diagrams |
| `--primary-tint` | `rgba(45,90,107,0.08)` | Subtle fills (also Module 3 tone) |
| `--correction` | `#b8583a` | Warm clay — pitfalls, errata, correction marks only |
| `--focus-ring` | `rgba(45,90,107,0.75)` | WCAG 2.2 SC 1.4.11, ≥3:1 on `--paper` |

**Module tints** classify content, not decorate it:

| Module | Token value |
|---|---|
| Module 3 | `rgba(45,90,107,0.08)` (scholar blue) |
| Module 4 | `rgba(96,122,85,0.08)` (muted green) |
| Module 5 | `rgba(99,89,130,0.08)` (muted indigo) |

### Typography (`next/font/google`)

| Role | Family | Weights / Axes |
|---|---|---|
| Display (`--font-display`) | Fraunces (variable) | 300–600, axes: `SOFT 50` + `opsz` |
| Body (`--font-body`) | IBM Plex Sans | 300–600 |
| Mono (`--font-mono`) | JetBrains Mono | 400, 500 |

- **Fraunces** on all headings h1–h6, section numbers, and display emphasis.
- **IBM Plex Sans** as the default body font.
- **JetBrains Mono** for inline code, kickers, section tags (`§`), and small-caps labels.
- **KaTeX** for math — rendered via ref-mutation API (`InlineMath` / `BlockMath`). The ref-based
  approach avoids any direct DOM injection of untrusted strings.

### Spacing and Motion

Spacing scale: `--space-1` (4 px) through `--space-16` (80 px).
Radius scale: `--radius-sm` (6 px) through `--radius-xl` (24 px).

Motion is `opacity` + `transform` only. Never `transition: all`. Easing:
`--ease: cubic-bezier(0.2, 0.9, 0.2, 1)` at three durations `--dur-fast / --dur-med / --dur-slow`.
`prefers-reduced-motion` is honored globally (1 ms override).

### Accessibility

- `focus-visible` rings on every interactive element (using `--focus-ring`).
- `tabular-nums` on all numeric readouts.
- `text-wrap: balance` on headings; `text-wrap: pretty` on paragraphs.
- Semantic HTML throughout: `article`, `section`, `aside`, `nav`, `figure`, `figcaption`.
- Skip-to-main link at the top of `<body>`.

---

## Shell Primitives (`app/(shell)/`)

| File | What it does |
|---|---|
| `header.tsx` | Sticky top nav. Left: wordmark button that opens the drawer. Right: pill group of module links. |
| `site-nav-drawer.tsx` | Global left-slide drawer, triggered by the "COMP SCI 465 / ML Study Lab" wordmark. Lists all modules with their §-section anchors. Closes on Escape, route change, or backdrop click. |
| `sidebar.tsx` | Per-page sticky table of contents driven by `IntersectionObserver`. Active state follows scroll. Hidden on the home page. |
| `scroll-progress.tsx` | 3 px progress bar directly under the header. Uses `transform: scaleX()` only; rAF-batched to avoid layout thrash. |
| `page-shell.tsx` | Composes `ScrollProgress` + `Sidebar` + main content column for every module page. Accepts `moduleTone` to apply the correct background tint. |
| `margin-note.tsx` | Tufte-style sidenote with three variants: `citation`, `correction`, `aside`. Rendered in the right margin column of a concept. |
| `concept.tsx` + `concept-helpers.ts` | Compound component with six named slots (see Concept Template below). |
| `katex.tsx` | `InlineMath` and `BlockMath` wrappers that render math via ref-mutation so the render path is fully controlled. |

---

## Concept Template

Every concept section on every module page uses the `<Concept>` compound component with these
six slots, in order:

1. **`<Concept.Definition>`** — One precise, exam-ready sentence.
2. **`<Concept.Formula>`** — KaTeX `BlockMath` with a `caption` prop and a short derivation
   list below it.
3. **`<Concept.Intuition>`** — Two to four paragraphs aligned to Canvas language. No decorative
   images; prose only.
4. **`<Concept.WorkedExample>`** — An interactive lab component embedded inline. The
   corresponding lab file lives in `labs/` next to the concept file.
5. **`<Concept.Pitfall>`** — A correction-accent callout (`--correction` color) flagging the
   most likely wrong answer or exam trap.
6. **`<Concept.FurtherReading>`** — One to three curated links rendered as
   `<MarginNote variant="citation">` in the margin column.

`<Concept>` takes a `section` prop (e.g., `"3.1"`) and a `slug` for the anchor ID. The
`MarginNote` children are extracted from the body and rendered in the right column automatically.

---

## Page Templates

### Module page

Rendered via `<PageShell moduleTone="module-N" tocGroups={[…]}>`.

Structure:
- Module hero: section tag (JetBrains Mono), display title (Fraunces), one-sentence deck.
- One `<Concept>` per named concept, in §N.1, §N.2, … order.
- Source trail at the bottom (Canvas-first, then outside links).
- The sticky `<Sidebar>` shows the ToC on the right (desktop) / bottom-sheet (mobile).

File layout:

```
app/module-N/
  page.tsx             # PageShell + concept list + source trail
  concept-foo.tsx      # one file per concept
  concept-bar.tsx
  labs/
    lab-context.tsx    # shared React context for lab state
    foo-lab.tsx        # interactive lab component
    bar-lab.tsx
```

### Home page

Calm, editorial, approximately 60 % breathing room above the fold. No drifting colored blobs.

Structure:
1. **Hero** — JetBrains Mono kicker + short Fraunces display title (two lines max) + one-sentence
   deck + two CTAs (primary button `action--primary` + text-only `action`). Subtle warm gradient
   background (cream to pale beige).
2. **Chaptered module index** — left-aligned scholarly list, one row per module with a hairline
   divider between rows. No commerce-style cards. Each row: label (mono), title (Fraunces), brief
   note, and a three-bullet topic list.
3. **Approach note** — a single block explaining the 6-slot concept template and the two study
   modes (Cram / Deep).
4. **Source trail** — compact citation list at the bottom (same `<SourceTrail>` component used
   on module pages).

### Quiz page

Existing structure; no redesign required. Keep a compact source trail so students can see
whether a question set is Canvas-only, Canvas-first, or cross-module.

---

## Module Summaries

### Module 3 — Unsupervised ML and nearby classifiers

- Cram: K-means is unsupervised; KNN and SVM are supervised. Know the distinction.
- Deep: feature-space geometry — Euclidean distance, neighbor voting, margin width, kernels.
- Concepts: §3.1 K-means, §3.2 KNN, §3.3 SVM.
- Labs: K-means assignment/update stepper, KNN live-vote canvas, SVM margin and kernel switcher.
- Tone: `module-3` (scholar blue tint).

### Module 4 — Ensemble learning and random forests

- Cram: ensemble types, bagging vs boosting, Random Forest voting vs averaging.
- Deep: variance reduction, bootstrapped samples, feature subsampling, feature importance caveats.
- Concepts: §4.1 Ensemble methods, §4.2 Random Forest.
- Labs: bagging/boosting/stacking/voting flow diagram, forest simulator, tradeoff comparison.
- Tone: `module-4` (muted green tint).

### Module 5 — Deep learning, NLP, and CNNs

- Cram: neural-network parts, forward propagation, loss, backprop; NLP pipeline steps; CNN
  layer order.
- Deep: representations moving from raw input to vectors, tokens, embeddings, filters,
  feature maps, and class scores.
- Concepts: §5.1 Neural networks, §5.2 NLP pipeline, §5.3 CNNs.
- Labs: neural network signal-flow stepper, NLP preprocessing pipeline, CNN
  convolution/ReLU/pooling sandbox.
- Tone: `module-5` (muted indigo tint).

---

## Source Trail Starter Set

- GeeksforGeeks Machine Learning with Python overview.
- GeeksforGeeks pages for K-means, KNN, SVM, and Random Forest.
- scikit-learn docs for nearest neighbors, classifier comparison, K-means examples, silhouette
  analysis, and ensembles.
- Google Machine Learning Crash Course for interactive exercises and study structure.
- CNN Explainer paper for CNN teaching interaction patterns.
- Distill feature visualization for representation and interpretability language.
- TensorFlow Embedding Projector for embedding visualization ideas.

---

## Expansion Rules

- New modules go under `app/module-N/` following the file layout above.
- Every concept uses `<Concept>` with all six slots. Do not create one-off section layouts.
- Every module page uses `<PageShell>` with the correct `moduleTone`.
- Add a module tint CSS custom property in `globals.css` for each new module.
- Keep source trails visible but compact — three to seven links maximum per page.
- Prefer one strong interactive lab over multiple small decorative widgets.
- Add at least one exam-style practice question to the Quiz page whenever a new concept ships.
- If a new outside source influences an explanation, add it to the source trail on that page and
  update the starter set in this file.
- Do not reintroduce the "bright classroom whiteboard" aesthetic (yellow/teal/coral marker
  palette). The Studio Notebook direction is the settled design.
