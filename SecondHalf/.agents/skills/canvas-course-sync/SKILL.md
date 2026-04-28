---
name: canvas-course-sync
description: Use this project-local skill when asked to scan Canvas, sync Canvas modules into this course web app, run a manual Canvas ingest, create a PR for Canvas-derived app changes, or deploy a Vercel preview. It uses local Canvas credentials, Canvas MCP when available, local headless Codex for app edits, a gitignored snapshot/hash manifest, GitHub PRs for review, and production deploy only after merging main.
---

# Canvas Course Sync

This skill is local to `SecondHalf`. It is self-contained and does not depend on
global skills, OpenAI API keys, or GitHub Actions running an agent. It uses the
local Codex subscription-auth CLI when headless app edits are needed.

## Goals

- Fetch the full Canvas course content for this Machine Learning course.
- Detect Canvas content that is new or changed compared with the web app.
- Update the app using its existing theme and module patterns.
- Verify locally with tests, typecheck, build, and browser review when pages change.
- Prepare a GitHub PR and Vercel preview for manual review.
- Let production deploy happen only after the PR is accepted and merged into `main`.

## Local Facts

- App root: `SecondHalf`
- Canvas API URL: `https://uwgby.instructure.com/api/v1`
- Canvas course id: `809921`
- Canvas course name: `Machine Learning`
- Canvas course code: `COMP SCI 465-0001`
- Required local env keys: `CANVAS_API_URL`, `CANVAS_API_TOKEN`, `CANVAS_COURSE_ID`

## Secret Boundary

Before any Canvas operation, verify only key names:

```bash
test -f .env && awk -F= '/^CANVAS_/ {print $1}' .env
```

Never print `.env` values. Never run `cat .env`. Never source `.env`; parse it in
Node or the app so special characters in tokens cannot mutate.

If a Canvas token is missing or expired, ask the user before the final token
generation action because that creates persistent Canvas API access.

## State Strategy

Do not create a database for the first version. Use a gitignored manifest:

- `.canvas-sync/state.json` - latest normalized hashes and last-seen Canvas ids.
- `.canvas-sync/raw/<timestamp>.json` - raw Canvas payloads for local debugging.
- Tracked tests/schema - only for normalization code, not for private Canvas content.

Manifest shape:

```json
{
  "courseId": "809921",
  "courseName": "Machine Learning",
  "lastScanAt": "2026-04-28T19:00:00.000Z",
  "items": {
    "module-item:31472421": {
      "moduleName": "Module 6: OpenAI & Large Language Model (LLM)",
      "title": "OpenAI & LLM.pptx",
      "type": "File",
      "htmlUrl": "https://uwgby.instructure.com/courses/809921/modules/items/31472421",
      "contentHash": "sha256:...",
      "updatedAt": "2026-04-28T18:30:00.000Z"
    }
  }
}
```

Hash normalized content, not raw JSON order. Include stable ids, titles, types,
Canvas URLs, due dates, page body text, and attachment metadata. Strip volatile
fields, signed download URLs, access tokens, and pagination noise.

Move to SQLite only if JSON becomes painful: multiple machines, multi-user scan
history, conflict resolution, or a dashboard for scan history.

## Modes

Pick the smallest useful mode from the user request:

- `scan`: fetch Canvas and report new/changed items.
- `sync`: fetch Canvas, update the app, verify, and leave a ready local diff.
- `pr`: complete sync, commit, push a feature branch, and open/update a PR.
- `preview`: deploy the current branch to a Vercel preview for manual review.
- `schedule`: add a local poller only after manual scan/sync/pr/preview works.

## Canvas Ingest

Prefer Canvas MCP when it is configured for Codex. If not available, use Canvas
REST from a deterministic local script that writes the same normalized manifest.

Minimum fetch set:

- Course details.
- Modules.
- Module items for every module. Canvas can omit `items` from the module list, so
  call each module's items endpoint when needed.
- Linked pages, assignments, quizzes, discussions, external URLs, files, and
  announcements when relevant.

Files:

- Store file metadata and hashes first.
- Download only files needed to render or summarize app content.
- Keep private raw downloads under `.canvas-sync/raw/`.
- Only commit Canvas-derived assets if the repo and deploy target are private and
  the asset is intended to appear in the app.

## Headless Codex Edit Loop

Find Codex without assuming a global install:

```bash
CODEX_BIN="$(command -v codex || true)"
if [ -z "$CODEX_BIN" ] && [ -x /Applications/Codex.app/Contents/Resources/codex ]; then
  CODEX_BIN="/Applications/Codex.app/Contents/Resources/codex"
fi
```

Use local subscription auth only:

```bash
"$CODEX_BIN" exec "<prompt>" \
  -C "$PWD" \
  -s workspace-write \
  -a never \
  -c 'model_reasoning_effort="high"' \
  --json
```

Prompt boundary for the headless agent:

```text
You are updating a private course web app from Canvas content.
Use the provided Canvas diff and existing app patterns.
Do not read or print .env values.
Do not call OpenAI, Anthropic, or other model APIs directly.
Do not modify unrelated course folders.
Keep raw Canvas snapshots gitignored.
Create or update pages so the app follows the existing theme.
Run tests, typecheck, and build before reporting ready.
Production deploy happens only after the PR merges to main.
```

Give Codex the normalized Canvas diff, not the token. If it needs raw payloads,
point it at a gitignored local file and restate the secret boundary.

## Branch Workflow

Start with:

```bash
git rev-parse --show-toplevel
git status --short --branch
git remote -v
```

Do not work directly on `main`. If the current repo has unrelated changes, use a
feature worktree:

```bash
git worktree add -b codex/canvas-sync-<date> .worktrees/canvas-sync-<date> origin/main
```

Only commit intentional app, tests, sync scripts, and safe docs. Never commit
`.env`, `.canvas-sync/`, raw Canvas payloads, private downloads, or agent auth.

## Verification

For this app:

```bash
npm test
npm run typecheck
npm run build
```

Run the ingest command twice:

- First run detects Canvas changes and writes state.
- Second run should be idempotent and report no new changes unless Canvas changed.

For page changes, start the dev server and inspect changed routes on desktop and
mobile widths.

## PR and Preview

PR flow:

1. Commit only intentional files.
2. Push the feature branch.
3. Open or update a GitHub PR.
4. Let Vercel's GitHub integration create the PR preview.
5. If a manual preview is requested, use Vercel CLI after login/install is ready.

Manual preview command:

```bash
npx vercel deploy --yes
```

Never run `vercel --prod` from this skill. Production deploy is the normal Vercel
production deployment after the accepted PR is merged into `main`.

## Schedule Mode

Configure scheduling only after manual `scan`, `sync`, `pr`, and `preview` work.

Use a local LaunchAgent or cron job on the user's machine. The scheduled job should:

- Run scan.
- Exit cleanly when there are no changes.
- Stop and notify the user by default when changes exist.
- Create branches/PRs unattended only if the user explicitly approves that later.
- Never merge PRs.
- Never deploy production.
- Never store Canvas tokens outside local `.env` or an OS keychain.

GitHub Actions is for CI only: tests, typecheck, build, and Vercel preview status.
Do not run Canvas polling or subscription-auth coding agents in GitHub Actions.

## Stop Conditions

Stop and ask when:

- Canvas auth fails or token generation/regeneration is needed.
- New Canvas content contains grades, submissions, peer data, or student PII.
- Repo or Vercel privacy is unclear before committing Canvas-derived content.
- GitHub, Vercel, or Codex login is required.
- A new CLI/package install is needed.
- The scan finds a large ambiguous content change that needs editorial judgment.

## Completion Report

End with:

- Canvas course id/name scanned.
- New/changed item count.
- Files changed.
- Verification commands and results.
- PR URL if created.
- Vercel preview URL if deployed.
- Note that production deploy is pending merge to `main`.
