---
name: canvas-course-sync
description: Project-local skill for syncing Canvas course content into the SecondHalf course web app. Use whenever the user asks to scan Canvas, sync modules, ingest Canvas content, prepare a Canvas-derived PR, deploy a Vercel preview from Canvas changes, or schedule Canvas polling — even when they don't say "Canvas Course Sync" by name. App edits follow `DESIGN.md` (Studio Notebook system) and mirror the most recent `app/module-N/` pattern. Uses local Canvas credentials, Canvas MCP (REST fallback), subscription-auth Codex for headless edits, a gitignored hash manifest, GitHub PRs for review, and production deploy only after merge to `main`.
---

# Canvas Course Sync

Local to `SecondHalf/`. No global skills, no model API keys, no GitHub Actions agent.
Follow the repository `AGENTS.md`, this skill, and the current user request.

## Course
- API: `https://uwgby.instructure.com/api/v1`
- Course: `809921` · `Machine Learning` · `COMP SCI 465-0001`
- App scope: this is the second-half study lab, so Canvas Modules 3+ are in scope;
  Modules 0-2 are useful context but not app-missing work by default.
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

## Content policy

Canvas is the anchor, not a bulk-copy target. Use Canvas to decide topic order,
module boundaries, professor emphasis, examples to preserve, and exam style. Do
not mirror every Canvas artifact into the app.

The app output should be public-safe study content:
- Original/paraphrased explanations aligned to Canvas.
- Interactive diagrams, formulas, and deterministic labs where they improve learning.
- Supplemental public web sources when they sharpen the explanation.
- Visible citations in the same SourceTrail style documented by `DESIGN.md`.

Do not commit Canvas PPTX files, raw Canvas payloads, or long verbatim Canvas-only
text. If Canvas points to a public topic or public source, cite the public source
directly and keep Canvas listed first as the course source of truth.

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
Prefer Canvas MCP. If unavailable, use the tracked REST fallback. The shell
wrapper works even when automation cannot see `npm` on PATH:

```bash
bash scripts/canvas-scan.sh
```

When `npm` is available, this is equivalent:

```bash
npm run canvas:scan
```

For machine-readable output:

```bash
bash scripts/canvas-scan.sh --json
```

This writes the same manifest every run. Fetch: course details, modules, *each
module's items endpoint* (Canvas often omits `items` from the module list), plus
linked pages, assignments, quizzes, discussions, files, announcements when relevant.

Important: Canvas can be unchanged while the app is incomplete. If the scan reports
`App-missing modules`, that is actionable `sync` work even when Canvas changes are
`0 added, 0 changed, 0 removed`.

Files: store metadata + hash first, only download what the app actually renders,
keep raw downloads under `.canvas-sync/raw/`. Commit Canvas-derived assets only
when both repo and deploy target are private and the asset is intended to appear
in the public app.

## Headless Codex
Find Codex without assuming a global install:

```bash
CODEX_BIN="$(command -v codex || true)"
[ -z "$CODEX_BIN" ] && [ -x /Applications/Codex.app/Contents/Resources/codex ] \
  && CODEX_BIN="/Applications/Codex.app/Contents/Resources/codex"
```

Find GitHub CLI without assuming the automation PATH:

```bash
GH_BIN="$(command -v gh || true)"
[ -z "$GH_BIN" ] && [ -x /opt/homebrew/bin/gh ] && GH_BIN="/opt/homebrew/bin/gh"
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

External sources live in two places: per-concept `<Concept.FurtherReading>` (1–3 links, summarize the idea) and module-level `sourceGroups.moduleN` (curated overview list). Never paste long external text into TSX — paraphrase and link. Canvas source cards come first in `sourceGroups.moduleN`; supplemental public sources follow.

**No duplicated content.** Before writing any concept, lab, source link, or quiz question, grep the existing modules and `sourceGroups.*`: cross-link to an existing concept (cite its section number, e.g., "see §5.3") rather than restate it; pick external sources not already in any `sourceGroups.*`; confirm new quiz prompts don't echo existing ones. Every addition must be fresh and load-bearing — if Canvas overlaps with prior coverage, link rather than copy.

## Verify
```bash
npm test && npm run typecheck && npm run build
```

If automation cannot see `npm` on PATH, use the local wrapper:

```bash
bash scripts/verify-local.sh
```

Run the ingest twice — the second run should report no changes unless Canvas changed (idempotency check).

For page changes, before opening the PR:
- `npm run dev`, then use available browser automation or the Codex app browser to navigate `/module-N` and the most recent prior module.
- Check desktop and a 390px mobile width. Confirm the new module matches the existing visual rhythm.
- Exercise labs, quiz, and navigation manually or with available browser automation.
- Do not introduce a new visual direction. This workflow fits the established Studio Notebook system in `DESIGN.md`.

## PR & preview
Use a feature branch or worktree. Commit only intentional app, tests, sync scripts,
safe docs. Never commit `.env`, `.canvas-sync/`, raw payloads, or agent auth.
Push, open/update a GitHub PR using `$GH_BIN`, let Vercel's GitHub integration
build the preview. Manual preview only when needed:

```bash
npx vercel deploy --yes
```

Never run `vercel --prod` from this skill — production is the normal Vercel deploy after the PR merges to `main`.

## Schedule mode
Only after `scan`, `sync`, `pr`, `preview` all work manually. Use Codex cron,
a local LaunchAgent, or cron — never GitHub Actions for Canvas polling or
subscription-auth agents. The job runs scan, exits clean on no Canvas changes
and no app-missing modules, and creates reviewable work when either exists. It
must not merge PRs, deploy production, or store tokens outside `.env`/keychain.

## Stop and ask
- Canvas auth fails or a token must be generated/regenerated.
- New Canvas content includes grades, submissions, peer data, or PII.
- Repo or Vercel privacy is unclear before committing Canvas-derived content.
- GitHub, Vercel, or Codex login is needed, or a new CLI/package install.
- A scan finds a large ambiguous change needing editorial judgment.

## Done
Report: course id/name · new/changed item count · files changed · verification results · PR URL · preview URL · note that production deploy is pending merge to `main`.
