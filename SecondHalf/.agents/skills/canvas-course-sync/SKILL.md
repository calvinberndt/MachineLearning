---
name: canvas-course-sync
description: Project-local skill for syncing Canvas course content into the SecondHalf course web app. Use whenever the user asks to scan Canvas, sync modules, ingest Canvas content, prepare a Canvas-derived PR, deploy a Vercel preview from Canvas changes, or schedule Canvas polling — even when they don't say "Canvas Course Sync" by name. App edits follow `DESIGN.md` (Studio Notebook system) and mirror the most recent `app/module-N/` pattern. Uses local Canvas credentials, Canvas MCP (REST fallback), subscription-auth Codex for headless edits, a gitignored hash manifest, GitHub PRs for review, and production deploy only after merge to `main`.
---

# Canvas Course Sync

Local to `SecondHalf/`. No global skills, no model API keys, no GitHub Actions agent. Layer this on top of the global git/secret rules in `~/.claude/CLAUDE.md` — don't restate them.

## Course
- API: `https://uwgby.instructure.com/api/v1`
- Course: `809921` · `Machine Learning` · `COMP SCI 465-0001`
- Env keys: `CANVAS_API_URL`, `CANVAS_API_TOKEN`, `CANVAS_COURSE_ID`

## Modes
Pick the smallest one that satisfies the request:
- `scan` — fetch Canvas, report new/changed items.
- `sync` — scan + update app + verify, leave a local diff.
- `pr` — sync + commit + push branch + open/update PR.
- `preview` — deploy current branch to a Vercel preview.
- `schedule` — local poller, only after the manual modes work end-to-end.

## Secrets
Read key *names* only, never values:

```bash
test -f .env && awk -F= '/^CANVAS_/ {print $1}' .env
```

Don't `cat .env`. Don't `source .env` — special chars in tokens mutate. Parse env in Node or the app. If a token is missing or expired, ask before regenerating — that creates persistent Canvas access.

## State (gitignored)
- `.canvas-sync/state.json` — normalized hashes + last-seen Canvas ids.
- `.canvas-sync/raw/<ts>.json` — raw payloads for debugging.

Hash *normalized* content (stable ids, titles, types, URLs, due dates, page text, attachment metadata) — not raw JSON. Strip signed download URLs and pagination noise so reruns are idempotent. Move to SQLite only when JSON hurts: multi-machine scan history, conflict resolution, or a dashboard.

Manifest item shape:
```json
{ "moduleName": "...", "title": "...", "type": "File",
  "htmlUrl": "...", "contentHash": "sha256:...", "updatedAt": "..." }
```

## Ingest
Prefer Canvas MCP. If unavailable, use Canvas REST from a deterministic local script that writes the same manifest. Fetch: course details, modules, *each module's items endpoint* (Canvas often omits `items` from the module list), plus linked pages, assignments, quizzes, discussions, files, announcements when relevant.

Files: store metadata + hash first, only download what the app actually renders, keep raw downloads under `.canvas-sync/raw/`. Commit Canvas-derived assets only when both repo and deploy target are private.

## Headless Codex
Find Codex without assuming a global install:

```bash
CODEX_BIN="$(command -v codex || true)"
[ -z "$CODEX_BIN" ] && [ -x /Applications/Codex.app/Contents/Resources/codex ] \
  && CODEX_BIN="/Applications/Codex.app/Contents/Resources/codex"
```

Run with subscription auth — no model API keys:

```bash
"$CODEX_BIN" exec "<prompt>" -C "$PWD" -s workspace-write -a never \
  -c 'model_reasoning_effort="high"' --json
```

Pass the *normalized diff*, not the token. Tell Codex: don't read or print `.env`, don't call model APIs directly, don't touch unrelated course folders, keep raw snapshots gitignored, follow the App update spec below, run `npm test && npm run typecheck && npm run build` before reporting ready, never deploy production.

## App update spec
Read these before editing:
- `DESIGN.md` — Studio Notebook design system: palette, module tone tokens, typography, accessibility, and the **Source Policy** (Canvas first; external sources supplement, never replace; summarize, don't quote long text).
- The most recent `app/module-N/` (highest N) — canonical pattern to mirror.

Module shape: `app/module-N/{page.tsx, concept-<slug>.tsx, labs/{lab-context.tsx, <slug>-lab.tsx, <slug>-utils.ts}}`. Each `concept-*.tsx` uses `<Concept>` from `(shell)/concept` with sub-components `Definition`, `Formula` (KaTeX from `(shell)/katex`), `Intuition`, `WorkedExample`, `Pitfall`, `FurtherReading`. Section numbers dotted (`5.3`), slugs kebab-case. Labs are pure-client TSX with deterministic fixtures — never live model API calls, never network calls in the preview.

Cross-cutting updates required for every new module:
- `app/page.tsx` — add a `CHAPTERS` entry (zero-padded `number`, `kicker`, `href`); renumber the `Practice` entry if inserting before it.
- `app/source-trail.tsx` — add `sourceGroups.moduleN`: Canvas notes link first, then 2–4 external supplements (scikit-learn, Distill, arxiv, GFG, official framework docs). Each gets a one-line `note` saying *why* it helps.
- `app/globals.css` — add `--module-N-tint` (`0.08` alpha) and `--module-N-line` (`0.28` alpha), plus a `.module-page[data-tone="module-N"]` rule mapping `--module-tint`/`--module-line`.
- `app/quiz/exam-utils.ts` — extend the `Question.module` union; add ~8–12 questions for the new module (mix multiple-choice and fill-blank, each with an `explanation`).

External sources live in two places: per-concept `<Concept.FurtherReading>` (1–3 links, summarize the idea) and module-level `sourceGroups.moduleN` (curated overview list). Never paste long external text into TSX — paraphrase and link.

**No duplicated content.** Before writing any concept, lab, source link, or quiz question, grep the existing modules and `sourceGroups.*`: cross-link to an existing concept (cite its section number, e.g., "see §5.3") rather than restate it; pick external sources not already in any `sourceGroups.*`; confirm new quiz prompts don't echo existing ones. Every addition must be fresh and load-bearing — if Canvas overlaps with prior coverage, link rather than copy.

**Voice rule for user-facing surfaces.** Anything a student reads — `concept-*.tsx` prose, lab UIs, module hero/lede, `<Concept.Formula caption=…>` labels, source-trail intro copy and badges, quiz prompts, page metadata — names the *concept* directly. Never write "Canvas", "Canvas notes", "the slides", "the professor", or any wording that signals the page is a paraphrase of an LMS. The rendered page should read like an authoritative textbook, not a relayed lecture. Source-trail entries internal to the course are titled `"Course notes: …"` (not `"Canvas notes: …"`) and the badge label is `Course notes`. Provenance is tracked in three internal places only: the gitignored `.canvas-sync/` manifest, commit messages, and this skill — never on the rendered page. Do **not** add `<MarginNote variant="citation">Canvas notes, slides X-Y…</MarginNote>` blocks; the source trail is sufficient attribution.

**Visuals are interactive by default.** Every diagram, graph, or chart inside `Concept.WorkedExample` is a stateful client component with sliders, toggles, dropdowns, or click targets — never a static SVG, a frozen heatmap, or a row of three explanatory cards. If a concept calls for a one-off interactive explorer (parameter sweep, tokenization split, attention heatmap, decision boundary, embedding projection, layer-classification game), prefer the `/playground` skill — it scaffolds an HTML playground with controls + live preview faster than hand-rolling — and inline the result as a deterministic React component. Determinism still holds: interactive does **not** mean live API. Static diagrams belong only in `Concept.Formula` (a labeled equation/figure pair) and `Concept.Intuition` (an explanatory image), and even there, prefer KaTeX rendering or in-file SVG over raster. If a `WorkedExample` has no interaction, it is not done.

**Mobile + desktop is a hard requirement, not a stretch goal.** Every UI surface — page hero, TOC, concept blocks, formula panels, lab UIs, source trail, quiz — must render correctly at desktop *and* at 390px wide (iPhone reading width). Build mobile-first: grids use `repeat(auto-fit, minmax(<col>, 1fr))` so they collapse gracefully; tap targets are ≥44px; hero/lede text stays readable without horizontal scroll; nothing gets cropped or overflows. Test both widths during the visual QA pass below — a layout that looks right on desktop but breaks on phone is a regression and blocks the PR.

## Verify
```bash
npm test && npm run typecheck && npm run build
```

Run the ingest twice — the second run should report no changes unless Canvas changed (idempotency check).

For page changes, before opening the PR:
- `npm run dev`, then use the `/browse` skill (not puppeteer MCP) to navigate `/module-N` and the most recent prior module — screenshot at desktop + 390px and confirm the new module matches the existing visual rhythm.
- Run `/design-review` against the diff — it catches spacing, hierarchy, AI-slop patterns, and DESIGN.md drift, and proposes fixes.
- Run `/dogfood` once at desktop and at 390px — its job here is **UI/UX correctness**, not just bug-finding. Dogfood verifies that every interactive visual actually responds to input (sliders move, toggles flip, click targets reveal answers), that sizing and spacing read well at both widths (no overflow, no cramped cards, no oversized hero, tap targets ≥44px), that hierarchy is preserved on small screens (TOC collapses or pins correctly), and that the labs feel as polished as the surrounding prose. Mobile parity is non-negotiable: if a `WorkedExample` looks static or sized wrong on phone, that's a fail — fix before the PR. Walk every route (`/`, `/module-3..6`, `/quiz`) at both widths, not just the new one.
- Do **not** invoke `/frontend-design` here. That skill is for distinctive new UI; this skill's job is to fit into the established Studio Notebook system, so it would push the diff away from DESIGN.md.

## PR & preview
Use a feature branch / worktree per the global git rules. Commit only intentional app, tests, sync scripts, safe docs. Never commit `.env`, `.canvas-sync/`, raw payloads, or agent auth. Push, open/update a GitHub PR, let Vercel's GitHub integration build the preview. Manual preview only when needed:

```bash
npx vercel deploy --yes
```

Never run `vercel --prod` from this skill — production is the normal Vercel deploy after the PR merges to `main`.

## Schedule mode
Only after `scan`, `sync`, `pr`, `preview` all work manually. Use a local LaunchAgent or cron — never GitHub Actions for Canvas polling or subscription-auth agents. The job runs scan, exits clean on no changes, notifies on changes. It must not merge PRs, deploy production, or store tokens outside `.env`/keychain.

## Stop and ask
- Canvas auth fails or a token must be generated/regenerated.
- New Canvas content includes grades, submissions, peer data, or PII.
- Repo or Vercel privacy is unclear before committing Canvas-derived content.
- GitHub, Vercel, or Codex login is needed, or a new CLI/package install.
- A scan finds a large ambiguous change needing editorial judgment.

## Done
Report: course id/name · new/changed item count · files changed · verification results · PR URL · preview URL · note that production deploy is pending merge to `main`.
