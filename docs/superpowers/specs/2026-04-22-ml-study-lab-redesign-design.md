# ML Second Half Study Lab — Redesign Spec

**Date:** 2026-04-22
**Project:** `SecondHalf/` (Next.js 16 / React 19)
**Direction:** Studio Notebook — a professor's well-crafted personal teaching site. Scholarly but approachable, textbook-structured but less formal than an O'Reilly product page.

## 1. Context & Goals

The current Study Lab covers the right Canvas material (Modules 3, 4, 6 + quiz) and has strong interactive labs, but it reads as a friendly study zine. The professor-grade revamp has two aims:

1. **Visual credibility** — look like a professor built it, not a bootcamp. Restrained palette, scholarly typography, real math notation, Tufte-style margin notes.
2. **Content rigor** — every concept grounded in primary-source accuracy (scikit-learn docs, Google MLCC, CNN Explainer research), with precise definitions, formulas, worked examples, and documented misconceptions.

**Non-goals**

- Removing Canvas-first framing. Canvas remains source of truth.
- Dark mode (defer — single light theme for v1).
- Adding new modules beyond 3/4/6.
- Replacing existing interactive labs — we restyle and refine them.

## 2. Direction: Studio Notebook

| Axis | Choice |
|------|--------|
| Aesthetic family | Refined editorial × graph-paper lab notebook |
| Energy | Calm, considered, dense-but-readable |
| Voice | Professor-who-cares — first-person plural, precise, occasionally dry |
| Color discipline | One primary accent, one correction accent, everything else is ink/muted on paper |
| Typography discipline | Strong serif/sans pairing, tabular numerals, real math |

## 3. Design System

### 3.1 Typography

| Role | Font | Notes |
|------|------|-------|
| Display (titles, section numbers, math) | **Fraunces** (variable, OPSZ + SOFT 50) | Use high OPSZ for `h1`/`h2`, lower for `h3`. SOFT 50 gives warmth. |
| Body | **IBM Plex Sans** (300/400/500/600) | Humanist, legible, scholarly. |
| Mono / code / micro-labels | **JetBrains Mono** (400/500) | Used for section tags, axis labels, code fragments. |
| Math | **KaTeX** with `KaTeX_Main` | Dynamic import to avoid bundling. |

Base size **16 px**. Modular scale 1.2.

```
--text-xs:  12px   /* labels */
--text-sm:  14px   /* side notes */
--text-base:16px   /* body */
--text-lg:  18px
--text-xl:  22px
--text-2xl: 28px
--text-3xl: 36px   /* section title */
--text-4xl: 52px   /* module title */
--text-5xl: clamp(3rem, 6vw, 5.5rem) /* hero */
```

Headings use `text-wrap: balance`. Body uses `text-wrap: pretty`. Numerics use `font-variant-numeric: tabular-nums`.

### 3.2 Palette

| Token | Hex | Role |
|-------|-----|------|
| `--paper` | `#fbf7ee` | Page background (warm cream) |
| `--paper-strong` | `#fffdf7` | Elevated surfaces (cards, figures) |
| `--ink` | `#1b1b1b` | Primary text |
| `--muted` | `#5a564e` | Secondary text, captions |
| `--muted-2` | `#8a857a` | Tertiary (axis labels, timestamps) |
| `--line` | `rgba(27,27,27,0.10)` | Hairline rules, card borders |
| `--line-strong` | `rgba(27,27,27,0.18)` | Emphasised divisions |
| `--primary` | `#2d5a6b` | Links, active nav, primary diagrams |
| `--primary-tint` | `rgba(45,90,107,0.08)` | Subtle fills, module tints |
| `--correction` | `#b8583a` | Pitfalls, errata, correction marks — nowhere else |
| `--focus-ring` | `rgba(45,90,107,0.75)` | `focus-visible` outline (≥3:1 WCAG 2.2 SC 1.4.11 on `--paper`) |

**Module tints** (desaturated — classification, not decoration):

- Module 3 (unsupervised + nearby classifiers): `--module-3-tint: rgba(45,90,107,0.08)` + border `rgba(45,90,107,0.22)`
- Module 4 (ensembles): `--module-4-tint: rgba(96,122,85,0.08)` + border `rgba(96,122,85,0.22)`
- Module 6 (deep learning): `--module-6-tint: rgba(99,89,130,0.08)` + border `rgba(99,89,130,0.22)`

### 3.3 Spacing, Radius, Elevation

```
--space-1:  4px    --space-2:  8px    --space-3: 12px    --space-4: 16px
--space-5: 20px    --space-6: 24px    --space-8: 32px    --space-10: 40px
--space-12: 56px   --space-16: 80px

--radius-sm:  6px   /* inline pills */
--radius-md: 12px   /* buttons, tokens */
--radius-lg: 16px   /* cards, figures */
--radius-xl: 24px   /* hero, major surfaces */

--shadow-none:  none
--shadow-hairline: inset 0 0 0 1px var(--line)
```

No drop shadows on cards in this direction — we use hairlines. Elevation conveyed by paper tone (`--paper-strong`) and border weight.

### 3.4 Motion

```
--ease: cubic-bezier(0.2, 0.9, 0.2, 1)
--dur-fast: 160ms    --dur-med: 280ms    --dur-slow: 520ms
```

- Page-shell entrance: one staggered fade-up (hero → tracks → labs → trail) at `--dur-slow`.
- Hover: 1px lift + border-color shift, `--dur-fast`.
- Tab/lab switches: `useTransition` for non-urgent updates, opacity only.
- **Rules:** animate only `opacity` and `transform`. Never `transition: all`. Always honor `prefers-reduced-motion`.

## 4. Page Shell & Navigation

### 4.1 Structure (all module pages)

```
+-----------------------------------------------------------+
|  HEADER · breadcrumb crumb · nav (Home / M3 / M4 / M6 / Q) |
+-----------------------------------------------------------+
|  SCROLL PROGRESS BAR (3px, --primary fill)                 |
+-------------------+---------------------------------------+
|  STICKY SIDEBAR   |   MAIN CONTENT                        |
|                   |                                       |
|  Module 3         |   Hero                                |
|  ▸ §3.1 K-means   |   Learning tracks (cram / deep)       |
|    §3.2 KNN       |   Tab nav                             |
|    §3.3 SVM       |   Figure + margin notes               |
|                   |   Formula                             |
|  On this page     |   Worked example                      |
|  · Objective      |   Pitfall                             |
|  · Algorithm      |   Further reading                     |
|  · Worked         |                                       |
|  · Pitfalls       |                                       |
+-------------------+---------------------------------------+
|                   SOURCE TRAIL                            |
+-----------------------------------------------------------+
```

- **Sidebar**: sticky, 230px, JetBrains Mono, section-scoped `IntersectionObserver` drives active state. Keyboard navigable; all items real `<a>` with `scroll-margin-top` set.
- **Scroll progress**: 3px bar sticky under header, width = `scrollTop / (docHeight - viewportHeight)`. Implemented as a client component that subscribes to `scroll` with a passive listener and writes `transform: scaleX()` on the fill element (no re-renders).
- **Header**: site mark on left, nav pills on right, `backdrop-filter: blur(16px)` on the sticky bar.

### 4.2 Home page

Same shell without the per-page sidebar (sidebar shows the four modules as cards instead). Hero keeps asymmetric layout but drops the drifting colored blobs — replace with a static "ML map" graphic (a lightweight SVG of the three module territories connected by labelled edges).

### 4.3 Quiz page

Retains current logic. Reskin only — quiz cards become bordered hairline cards, feedback uses `--primary-tint` for correct, `--correction` with 8% fill for incorrect.

## 5. Concept Template

Every concept section (`§3.1 K-means`, `§3.2 KNN`, `§3.3 SVM`, `§4.1 Ensembles`, `§4.2 Random Forest`, `§6.1 Neural Networks`, `§6.2 NLP Pipeline`, `§6.3 CNNs`) follows the same six-block pattern:

```
┌─────────────────────────────────────────────────────────┐
│ § x.y  Concept Name                                     │
│ ───────────────────────────────────────────────────────│
│ 1. DEFINITION          one precise sentence             │
│                                                         │
│ 2. FORMULA             KaTeX block, named symbols       │
│                                                         │
│ 3. INTUITION           Canvas-emphasis plain language   │
│                        (2–3 short paragraphs)           │
│                                                         │
│ 4. WORKED EXAMPLE      links to interactive lab          │
│                        same data shown step-by-step     │
│                                                         │
│ 5. PITFALL             correction-accent callout        │
│                                                         │
│ 6. FURTHER READING     2 links in margin notes          │
└─────────────────────────────────────────────────────────┘
```

Implementation: a compound-component `<Concept>` that accepts children `<Concept.Definition>`, `<Concept.Formula>`, `<Concept.Intuition>`, `<Concept.WorkedExample>`, `<Concept.Pitfall>`, `<Concept.FurtherReading>`. Shared context provides the concept id (for ToC/`scroll-margin-top`) and section number.

## 6. Content Rewrites (Research-Grounded)

Authoritative sources: scikit-learn documentation (clustering, neighbors, svm, ensemble), Google ML Crash Course, CNN Explainer / Poloclub, NLTK book. All new formulas and claims traceable to these.

### 6.1 Module 3

**§3.1 K-means**
- Definition: "An unsupervised algorithm that partitions *n* observations into *k* clusters by iteratively minimising within-cluster sum of squares (inertia)."
- Formula: `J(C, μ) = Σⱼ Σᵢ∈Sⱼ ‖xᵢ − μⱼ‖²`
- Add: k-means++ seeding rationale; elbow method + silhouette coefficient `s = (b − a) / max(a, b)` for K selection.
- Pitfall: local minima → why `n_init` restarts exist. Non-globular clusters break the inertia assumption.

**§3.2 KNN**
- Definition: "A non-parametric, instance-based classifier that predicts by majority vote of the *k* nearest labelled points under a chosen distance metric."
- Formula: `ŷ = argmaxc Σᵢ∈N_k(x) 𝟙[yᵢ = c]` (distance-weighted variant shown separately).
- Add: Minkowski / Manhattan / Euclidean; feature scaling rationale; curse of dimensionality (brute force becomes preferred past ~D>15); bias/variance as a function of *k*.
- Pitfall: forgetting to scale; `k` even (tie-vote) vs odd.

**§3.3 SVM**
- Definition: "A maximum-margin classifier that finds the hyperplane with the widest slab separating classes, optionally via kernel-induced feature spaces."
- Primal: `min (½‖w‖² + C Σζᵢ)` subject to `yᵢ(wᵀφ(xᵢ) + b) ≥ 1 − ζᵢ`, `ζᵢ ≥ 0`.
- Margin width: `2/‖w‖` — show one-line derivation.
- Kernels: linear, polynomial `(γ⟨x,x'⟩ + r)^d`, RBF `exp(−γ‖x−x'‖²)`.
- Add: **correct direction of C** (larger C = harder margin, *less* regularisation); one-vs-rest for multiclass in LinearSVC, one-vs-one in SVC.
- Pitfall: unscaled features destroy RBF gamma tuning.

### 6.2 Module 4

**§4.1 Ensembles**
- Definition: "Combining predictions from multiple base estimators to improve generalisation over any single estimator."
- Four families: bagging (parallel, bootstrap, variance ↓), boosting (sequential, reweighting, bias ↓), stacking (meta-learner over base predictions), voting (hard / soft).
- Formula: soft vote `ŷ = argmaxc Σᵢ wᵢ · Pᵢ(c | x)`.

**§4.2 Random Forest**
- Definition: "A bagging ensemble of decision trees with additional randomness from per-split feature subsampling."
- Add: default `max_features = sqrt(n_features)` for classification (`1.0` for regression); OOB samples ≈ 37% of training set (`lim (1 − 1/n)ⁿ = 1/e`); OOB score as built-in validation.
- Feature importance: **keep existing warning** about impurity bias toward high-cardinality features; add `sklearn.inspection.permutation_importance` as the recommended alternative.
- Pitfall: interpreting impurity importances as causal.

### 6.3 Module 6

**§6.1 Neural Networks**
- Definition: "A composition of parameterised affine transformations and non-linear activations, trained end-to-end by gradient descent on a differentiable loss."
- Forward: `a⁽ˡ⁾ = σ(W⁽ˡ⁾a⁽ˡ⁻¹⁾ + b⁽ˡ⁾)`.
- Loss: cross-entropy `L = −Σc yc log ŷc` for classification; MSE for regression.
- Backprop: chain rule yields `∂L/∂W⁽ˡ⁾ = δ⁽ˡ⁾ (a⁽ˡ⁻¹⁾)ᵀ`; one-line intuition.
- Add: **why non-linearity matters** — without σ, composition collapses to a single linear map (algebraic proof in 2 lines).
- Pitfall: vanishing gradient with sigmoid in deep stacks → ReLU defaults.

**§6.2 NLP Pipeline**
- Keep the professor's 6-step classroom pipeline (Clean → Tokenise → Stopwords → Lemmatise → POS/NER → Output).
- **Add a margin note**: "Production NLP skips most of this — modern systems use subword tokenisation (BPE, WordPiece) and learned embeddings (Word2Vec, BERT) rather than hand-crafted steps. The classroom pipeline teaches the intuition."
- Pitfall: assuming lemmatisation always helps — over-reduction can erase discriminative morphology.

**§6.3 CNNs**
- Definition: "A neural network that exploits local spatial structure via learnable convolutional filters with weight sharing."
- Layer order: `Conv → ReLU → Pool → … → Flatten → Dense → Softmax`.
- **Output dimension formula**: `out = (H − F + 2P) / S + 1` for height; same for width.
- Add: parameter sharing reduces params from `(H·W·C) · (H'·W'·C')` to `(F·F·C) · C'`; pooling → translation tolerance + compute reduction; receptive field grows with depth.
- Pitfall: believing pooling is strictly necessary — modern arches (ResNet, ViT) often use strided convolutions or attention instead.

### 6.4 Quiz expansion

Add 10 new questions targeting the new content (k-means++, C direction, OOB, output-dim formula, permutation importance, cross-entropy). Keep existing 16. Tag by concept id so future accuracy updates stay traceable.

## 7. Component Architecture

### 7.1 Compound-component labs

Current labs use big `useState` blobs in one file. Refactor to compound components with a lab provider:

```tsx
// module-3/study-lab.tsx
<Module3LabProvider>
  <Lab>
    <Lab.TabNav />
    <Lab.Panel id="kmeans"><KMeansLab /></Lab.Panel>
    <Lab.Panel id="knn"><KnnLab /></Lab.Panel>
    <Lab.Panel id="svm"><SvmLab /></Lab.Panel>
  </Lab>
</Module3LabProvider>
```

- `Module3LabProvider` owns the state (current tab, K-means step, test point, k, kernel, C).
- Children read via `use()` on the context (React 19 — no `useContext`, no `forwardRef`).
- Each sub-lab (`KMeansLab`, etc.) is a client component with `"use client"` at the top.

### 7.2 Composition rules applied

- **No boolean-prop proliferation** — `<Card>`, `<Card.Deep>`, `<Card.Cram>` as explicit variants rather than `<Card deep cram>`.
- **Lift state to provider** — siblings in a lab share state via the provider, not prop-drilling.
- **Explicit variants over render-props** — pass JSX children, not `renderFooter`.

### 7.3 Shell components

```
app/
  (shell)/
    header.tsx              // top nav, backdrop blur
    sidebar.tsx             // sticky ToC, driven by IntersectionObserver
    scroll-progress.tsx     // 3px bar, scroll listener, transform only
    page-shell.tsx          // composes header + sidebar + main + footer
  module-3/
    page.tsx                // RSC wrapper
    study-lab.tsx           // "use client" compound lab
    concept-kmeans.tsx      // concept content + formula
    concept-knn.tsx
    concept-svm.tsx
```

## 8. Math Rendering (KaTeX)

- `katex` + `katex/dist/katex.min.css` installed.
- Wrap in a `<Katex>` client component, dynamically imported: `const Katex = dynamic(() => import("./katex"), { ssr: false })` — keeps KaTeX's ~280KB out of the initial bundle for pages that don't need it. Module pages preload it.
- Inline math via `<InlineMath>{"C(i) = argmin_j \\|x_i - \\mu_j\\|^2"}</InlineMath>`.
- Block math via `<BlockMath>`.
- Fallback: if dynamic import fails (offline), render the LaTeX source in a monospace code block — readable, just not typeset.

## 9. Performance & A11y

### 9.1 React/Next patterns (Vercel best practices)

- Interactive labs wrapped in `useDeferredValue` on text-input-driven ones (Module 6 NLP sentence input already uses this — preserve).
- Heavy SVG diagrams (K-means plot, CNN convolver) extracted into `React.memo`'d components that take primitive props.
- `startTransition` around tab-switch state updates.
- No barrel imports. Each study-lab file imports directly from its siblings.
- Module pages stay RSC where possible; `"use client"` only on labs and shell interactivity.
- `Promise.all` anywhere we fetch in parallel (currently none — note for future).
- Fonts loaded via `next/font` (already the case) with `display: "swap"` and preload.
- Every icon button has `aria-label`. All interactive elements are real `<a>` or `<button>`.

### 9.2 Web Interface Guidelines compliance

Applied at implementation time:

- `focus-visible:outline` replaces any `outline: none`.
- `tabular-nums` on every numeric readout in labs.
- Ellipses `…`, smart quotes `"` `"`, non-breaking spaces (`Module&nbsp;3`).
- Images: explicit width/height.
- Semantic HTML: `<article>` per module page, `<nav aria-label="On this page">` for sidebar, `<aside>` for margin notes.
- Forms (quiz): `autocomplete="off"` on short-answer blanks, `inputmode="text"`, labels linked.
- `prefers-reduced-motion` honored globally.
- `color-scheme: light` on `<html>`; `<meta name="theme-color" content="#fbf7ee">`.

## 10. File Structure Changes

```
SecondHalf/app/
  globals.css                 // rewritten design tokens, base typography
  layout.tsx                  // loads fonts (Fraunces, IBM Plex Sans, JetBrains Mono)
  page.tsx                    // home — new hero + module cards
  (shell)/                    // new shell primitives
    header.tsx
    sidebar.tsx
    scroll-progress.tsx
    margin-note.tsx
    concept.tsx               // compound concept component
    katex.tsx                 // dynamic-import wrapper
    source-trail.tsx          // moved from app/
  module-3/
    page.tsx
    study-lab.tsx             // refactored compound
    concept-kmeans.tsx
    concept-knn.tsx
    concept-svm.tsx
    labs/
      kmeans-lab.tsx
      knn-lab.tsx
      svm-lab.tsx
      lab-context.tsx
  module-4/ (same shape)
  module-6/ (same shape)
  quiz/
    page.tsx
    practice-quiz-lab.tsx     // restyled only
    exam-utils.ts             // +10 questions

docs/superpowers/specs/2026-04-22-ml-study-lab-redesign-design.md  (this file)
```

## 11. Implementation Decomposition

This spec is larger than a single implementation plan should attempt. Proposed slices:

- **Slice 1 — Foundation + Module 3 (vertical proof).** New design system, shell primitives, KaTeX wrapper, compound-concept component, Module 3 fully rebuilt. Validates the pattern before replicating. ~1 implementation plan.
- **Slice 2 — Module 4 + Module 6.** Apply the pattern to remaining module pages, including content upgrades per §6.2 and §6.3.
- **Slice 3 — Home + Quiz + Quiz expansion.** Redesign home hero and quiz surface, add 10 new quiz questions.

Each slice ends with: build passes, typecheck passes, manual browser QA of golden path, regression-check of interactive labs.

## 12. Out of Scope (Explicit)

- Dark mode.
- New modules beyond 3/4/6.
- Server-rendered math (we dynamic-import KaTeX client-side — intentional trade for bundle size on non-module pages).
- Replacing existing interactive lab logic. We restyle wrappers, refactor state ownership, but do not change what the labs compute.
- Additional content sources beyond the existing Canvas + scikit-learn + Google MLCC + CNN Explainer trail.
- i18n.

## 13. Open Questions

None blocking. Flagging for awareness:

1. Fraunces SOFT axis at 50 — if the final feel skews too casual at large sizes, drop to 30.
2. Sidebar ToC on mobile — collapse to a top dropdown on `<1040px`, or hide entirely and rely on anchor links in-content? **Default: collapse to dropdown.**
3. Do we want KaTeX CSS in the initial critical CSS for module pages, or always dynamic? **Default: always dynamic; acceptable ~40ms FOUC on first math-heavy page.**
