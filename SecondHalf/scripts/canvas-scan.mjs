#!/usr/bin/env node
// Canvas Module 6 scan — Canvas Course Sync skill, scan mode.
// Reads .env via deterministic parse (no shell `source`), fetches Canvas REST,
// writes a gitignored raw snapshot + normalized state manifest.
//
// Usage: node scripts/canvas-scan.mjs [--module 6]

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, dirname } from "node:path";

// --- 0. parse .env without sourcing --------------------------------------
function loadEnv(path) {
  const text = readFileSync(path, "utf8");
  const env = {};
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!m) continue;
    let v = m[2];
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    env[m[1]] = v;
  }
  return env;
}

const env = loadEnv(resolve(".env"));
const API = env.CANVAS_API_URL?.replace(/\/+$/, "");
const TOKEN = env.CANVAS_API_TOKEN;
const COURSE = env.CANVAS_COURSE_ID;
if (!API || !TOKEN || !COURSE) {
  console.error(
    "Missing CANVAS_API_URL, CANVAS_API_TOKEN, or CANVAS_COURSE_ID in .env"
  );
  process.exit(2);
}

// CLI: --module N (defaults to 6)
const args = process.argv.slice(2);
const moduleArgIdx = args.indexOf("--module");
const TARGET_MODULE_NUMBER =
  moduleArgIdx >= 0 ? Number(args[moduleArgIdx + 1]) : 6;

// --- 1. authorized fetch -------------------------------------------------
async function api(pathOrUrl, { all = false } = {}) {
  const url = pathOrUrl.startsWith("http") ? pathOrUrl : `${API}${pathOrUrl}`;
  const out = [];
  let next = url;
  while (next) {
    const res = await fetch(next, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    if (!res.ok) {
      throw new Error(`Canvas ${res.status} ${res.statusText} for ${next}`);
    }
    const data = await res.json();
    if (Array.isArray(data) && all) {
      out.push(...data);
      const link = res.headers.get("link") || "";
      const nextLink = link
        .split(",")
        .find((p) => p.includes('rel="next"'));
      next = nextLink ? nextLink.match(/<([^>]+)>/)?.[1] : null;
    } else {
      return data;
    }
  }
  return out;
}

// --- 2. content normalizer (strip volatile fields) -----------------------
function normalizeForHash(value) {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(normalizeForHash);
  if (typeof value === "object") {
    const VOLATILE = new Set([
      "url",
      "download_url",
      "preview_url",
      "thumbnail_url",
      "lock_info",
      "lock_explanation",
      "permissions",
      "page_count",
      "uuid",
      "verifier",
      "session_token",
    ]);
    const out = {};
    for (const k of Object.keys(value).sort()) {
      if (VOLATILE.has(k)) continue;
      out[k] = normalizeForHash(value[k]);
    }
    return out;
  }
  return value;
}

function sha256(obj) {
  return (
    "sha256:" +
    createHash("sha256")
      .update(JSON.stringify(normalizeForHash(obj)))
      .digest("hex")
  );
}

// --- 3. main scan --------------------------------------------------------
const ts = new Date().toISOString().replace(/[:.]/g, "-");
mkdirSync(".canvas-sync/raw", { recursive: true });

console.log(`[scan] Canvas course=${COURSE} target module=${TARGET_MODULE_NUMBER}`);

const course = await api(`/courses/${COURSE}`);
const modules = await api(
  `/courses/${COURSE}/modules?per_page=100`,
  { all: true }
);

// Find module by leading "Module N" in the name, case-insensitive
const target = modules.find((m) =>
  new RegExp(`^Module\\s+${TARGET_MODULE_NUMBER}\\b`, "i").test(m.name || "")
);
if (!target) {
  console.error(
    `[scan] No module matching /Module ${TARGET_MODULE_NUMBER}\\b/ found in course ${COURSE}.`
  );
  console.error(
    `[scan] Available: ${modules.map((m) => m.name).join(" | ")}`
  );
  process.exit(3);
}
console.log(`[scan] match: id=${target.id} name="${target.name}"`);

// Items in module — Canvas often omits items from the module list, so call /items.
const items = await api(
  `/courses/${COURSE}/modules/${target.id}/items?per_page=100`,
  { all: true }
);

// Hydrate each item to capture rendered content.
const hydrated = [];
for (const item of items) {
  const base = {
    id: item.id,
    moduleName: target.name,
    title: item.title,
    type: item.type,
    htmlUrl: item.html_url,
    canvasItemId: item.id,
    contentId: item.content_id,
    pageUrl: item.page_url,
    externalUrl: item.external_url,
  };
  let detail = null;
  try {
    if (item.type === "Page" && item.page_url) {
      detail = await api(
        `/courses/${COURSE}/pages/${encodeURIComponent(item.page_url)}`
      );
    } else if (item.type === "Assignment" && item.content_id) {
      detail = await api(
        `/courses/${COURSE}/assignments/${item.content_id}`
      );
    } else if (item.type === "Quiz" && item.content_id) {
      detail = await api(
        `/courses/${COURSE}/quizzes/${item.content_id}`
      );
    } else if (item.type === "Discussion" && item.content_id) {
      detail = await api(
        `/courses/${COURSE}/discussion_topics/${item.content_id}`
      );
    } else if (item.type === "File" && item.content_id) {
      detail = await api(`/files/${item.content_id}`);
    }
  } catch (e) {
    detail = { error: String(e) };
  }
  hydrated.push({ ...base, detail });
}

// Normalized manifest entries
const manifestItems = {};
for (const h of hydrated) {
  // Body extraction (paraphrasing later, never quoting full text in TSX)
  let body = "";
  let updatedAt = "";
  if (h.detail) {
    body =
      h.detail.body ||
      h.detail.message ||
      h.detail.description ||
      h.detail.html_url ||
      "";
    updatedAt = h.detail.updated_at || h.detail.modified_at || "";
  }
  const key = `${h.type}:${h.id}`;
  manifestItems[key] = {
    moduleName: h.moduleName,
    title: h.title,
    type: h.type,
    htmlUrl: h.htmlUrl,
    externalUrl: h.externalUrl || null,
    pageUrl: h.pageUrl || null,
    contentHash: sha256({
      title: h.title,
      type: h.type,
      body,
      updatedAt,
    }),
    bodyChars: typeof body === "string" ? body.length : 0,
    updatedAt,
  };
}

// Write raw + normalized
const rawPath = `.canvas-sync/raw/${ts}-module-${TARGET_MODULE_NUMBER}.json`;
writeFileSync(rawPath, JSON.stringify({ course, target, items, hydrated }, null, 2));

const statePath = ".canvas-sync/state.json";
const newState = {
  courseId: String(COURSE),
  courseName: course.name || course.course_code,
  targetModule: TARGET_MODULE_NUMBER,
  moduleId: target.id,
  moduleName: target.name,
  lastScanAt: new Date().toISOString(),
  items: manifestItems,
};

// Diff vs prior state for "what's new / what's changed"
let priorState = null;
if (existsSync(statePath)) {
  try {
    priorState = JSON.parse(readFileSync(statePath, "utf8"));
  } catch {}
}
const diff = { added: [], changed: [], unchanged: [], removed: [] };
const priorItems = priorState?.items || {};
for (const [k, v] of Object.entries(manifestItems)) {
  if (!(k in priorItems)) diff.added.push(k);
  else if (priorItems[k].contentHash !== v.contentHash) diff.changed.push(k);
  else diff.unchanged.push(k);
}
for (const k of Object.keys(priorItems)) {
  if (!(k in manifestItems)) diff.removed.push(k);
}

writeFileSync(statePath, JSON.stringify(newState, null, 2));

// --- 4. report ----------------------------------------------------------
console.log(`[scan] items: ${Object.keys(manifestItems).length}`);
console.log(
  `[scan] diff: +${diff.added.length} added · ~${diff.changed.length} changed · =${diff.unchanged.length} same · -${diff.removed.length} removed`
);
console.log(`[scan] raw → ${rawPath}`);
console.log(`[scan] state → ${statePath}`);
console.log("");
console.log("=== Items ===");
for (const [key, m] of Object.entries(manifestItems)) {
  const tag = diff.added.includes(key)
    ? "NEW"
    : diff.changed.includes(key)
      ? "MOD"
      : "OK ";
  console.log(
    `  [${tag}] ${m.type.padEnd(11)} ${m.title.slice(0, 70).padEnd(72)} ${m.bodyChars} chars`
  );
}
