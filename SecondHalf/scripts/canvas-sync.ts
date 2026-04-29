import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

type EnvMap = Record<string, string>;

type CanvasCourse = {
  id: number;
  name: string;
  course_code?: string;
};

type CanvasModule = {
  id: number;
  name: string;
  position?: number;
  items_count?: number;
  published?: boolean;
};

type CanvasModuleItem = {
  id: number;
  module_id: number;
  position?: number;
  title: string;
  type: string;
  content_id?: number;
  page_url?: string;
  html_url?: string;
  url?: string;
  content_details?: Record<string, unknown>;
  published?: boolean;
};

type NormalizedItem = {
  key: string;
  moduleId: number;
  moduleName: string;
  moduleNumber: number | null;
  position: number | null;
  title: string;
  type: string;
  contentId: number | null;
  pageUrl: string | null;
  htmlUrl: string | null;
  contentHash: string;
  updatedAt: string | null;
};

type CanvasState = {
  courseId: string;
  courseName: string;
  courseCode: string | null;
  lastScanAt: string;
  totals: {
    modules: number;
    items: number;
    announcements: number;
  };
  appCoverage: {
    existingModuleNumbers: number[];
    missingModuleNumbers: number[];
  };
  items: Record<string, NormalizedItem>;
};

type ScanSummary = {
  courseId: string;
  courseName: string;
  totals: CanvasState["totals"];
  canvasChanges: {
    added: string[];
    changed: string[];
    removed: string[];
  };
  appMissingModules: Array<{
    moduleNumber: number;
    moduleName: string;
    itemCount: number;
  }>;
  statePath: string;
  rawPath: string;
};

const REQUIRED_ENV = ["CANVAS_API_URL", "CANVAS_API_TOKEN", "CANVAS_COURSE_ID"] as const;

export function parseDotEnv(text: string): EnvMap {
  const env: EnvMap = {};

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const equals = line.indexOf("=");
    if (equals === -1) continue;

    const key = line.slice(0, equals).trim();
    let value = line.slice(equals + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

export function parseLinkHeader(header: string | null): Record<string, string> {
  if (!header) return {};

  const links: Record<string, string> = {};
  for (const part of header.split(",")) {
    const match = part.match(/<([^>]+)>;\s*rel="([^"]+)"/);
    if (match) links[match[2]] = match[1];
  }

  return links;
}

export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item)).join(",")}]`;

  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
    .join(",")}}`;
}

export function extractModuleNumber(name: string): number | null {
  const match = name.match(/\bmodule\s*(\d+)\b/i);
  return match ? Number(match[1]) : null;
}

export async function detectExistingAppModules(appRoot: string): Promise<number[]> {
  const appDir = path.join(appRoot, "app");
  if (!existsSync(appDir)) return [];

  const entries = await readdir(appDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name.match(/^module-(\d+)$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => Number(match[1]))
    .sort((a, b) => a - b);
}

export function detectAppMissingModules(
  modules: CanvasModule[],
  existingModuleNumbers: number[],
  minModuleNumber = 3,
): ScanSummary["appMissingModules"] {
  const existing = new Set(existingModuleNumbers);

  return modules
    .map((module) => ({
      moduleNumber: extractModuleNumber(module.name),
      moduleName: module.name,
      itemCount: module.items_count ?? 0,
    }))
    .filter(
      (module): module is { moduleNumber: number; moduleName: string; itemCount: number } =>
        module.moduleNumber !== null &&
        module.moduleNumber >= minModuleNumber &&
        !existing.has(module.moduleNumber),
    )
    .sort((a, b) => a.moduleNumber - b.moduleNumber);
}

function hasFetchError(value: unknown): boolean {
  return Boolean(
    value &&
      typeof value === "object" &&
      "fetchError" in value &&
      typeof (value as { fetchError?: unknown }).fetchError === "string",
  );
}

function hashStable(value: unknown): string {
  return `sha256:${createHash("sha256").update(stableStringify(value)).digest("hex")}`;
}

function stripHtml(value: unknown): string | null {
  if (typeof value !== "string") return null;

  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function stableContentDetails(details: Record<string, unknown> | undefined): Record<string, unknown> {
  if (!details) return {};

  const allowedKeys = [
    "content_type",
    "due_at",
    "filename",
    "lock_at",
    "points_possible",
    "size",
    "unlock_at",
  ];

  return Object.fromEntries(
    allowedKeys
      .filter((key) => details[key] !== undefined && details[key] !== null)
      .map((key) => [key, details[key]]),
  );
}

function normalizeLinkedContent(type: string, content: unknown): Record<string, unknown> {
  if (!content || typeof content !== "object") return {};

  const record = content as Record<string, unknown>;
  const body = stripHtml(record.body ?? record.description ?? record.message);

  return {
    type,
    title: record.title ?? record.name ?? record.display_name ?? record.filename ?? null,
    updatedAt: record.updated_at ?? record.modified_at ?? record.lock_at ?? null,
    dueAt: record.due_at ?? null,
    pointsPossible: record.points_possible ?? null,
    workflowState: record.workflow_state ?? null,
    body,
    file: {
      filename: record.filename ?? record.display_name ?? null,
      contentType: record["content-type"] ?? record.content_type ?? null,
      size: record.size ?? null,
      updatedAt: record.updated_at ?? null,
    },
  };
}

async function readCanvasEnv(appRoot: string): Promise<EnvMap> {
  const envPath = path.join(appRoot, ".env");
  const env = parseDotEnv(await readFile(envPath, "utf8"));
  const missing = REQUIRED_ENV.filter((key) => !env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing Canvas env keys: ${missing.join(", ")}`);
  }

  return env;
}

class CanvasClient {
  private readonly baseUrl: string;
  private readonly token: string;

  constructor(env: EnvMap) {
    this.baseUrl = env.CANVAS_API_URL.replace(/\/$/, "");
    this.token = env.CANVAS_API_TOKEN;
  }

  async getOne<T>(apiPath: string): Promise<T> {
    const response = await this.fetch(apiPath);
    return (await response.json()) as T;
  }

  async getPaginated<T>(apiPath: string): Promise<T[]> {
    const results: T[] = [];
    let nextUrl: string | null = this.toUrl(apiPath);

    while (nextUrl) {
      const response = await this.fetch(nextUrl);
      const data = (await response.json()) as T[];
      if (!Array.isArray(data)) {
        throw new Error(`Expected Canvas array response for ${this.safePath(nextUrl)}`);
      }

      results.push(...data);
      nextUrl = parseLinkHeader(response.headers.get("link")).next ?? null;
    }

    return results;
  }

  private async fetch(apiPathOrUrl: string): Promise<Response> {
    const url = this.toUrl(apiPathOrUrl);
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Canvas API ${response.status} for ${this.safePath(url)}`);
    }

    return response;
  }

  private toUrl(apiPathOrUrl: string): string {
    if (/^https?:\/\//.test(apiPathOrUrl)) return apiPathOrUrl;
    return `${this.baseUrl}${apiPathOrUrl.startsWith("/") ? "" : "/"}${apiPathOrUrl}`;
  }

  private safePath(url: string): string {
    const parsed = new URL(url);
    return `${parsed.pathname}${parsed.search}`;
  }
}

async function fetchLinkedContent(
  client: CanvasClient,
  courseId: string,
  item: CanvasModuleItem,
): Promise<unknown> {
  try {
    if (item.type === "Page" && item.page_url) {
      return await client.getOne(
        `/courses/${courseId}/pages/${encodeURIComponent(item.page_url)}`,
      );
    }

    if (item.type === "Assignment" && item.content_id) {
      return await client.getOne(`/courses/${courseId}/assignments/${item.content_id}`);
    }

    if (item.type === "Quiz" && item.content_id) {
      return await client.getOne(`/courses/${courseId}/quizzes/${item.content_id}`);
    }

    if (item.type === "Discussion" && item.content_id) {
      return await client.getOne(`/courses/${courseId}/discussion_topics/${item.content_id}`);
    }

    if (item.type === "File" && item.content_id) {
      return await client.getOne(`/files/${item.content_id}`);
    }
  } catch (error) {
    return {
      fetchError: error instanceof Error ? error.message : "Unknown Canvas fetch error",
    };
  }

  return null;
}

async function writeJsonAtomic(filePath: string, value: unknown): Promise<void> {
  const tempPath = `${filePath}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(tempPath, filePath);
}

async function readPreviousState(statePath: string): Promise<CanvasState | null> {
  if (!existsSync(statePath)) return null;

  try {
    return JSON.parse(await readFile(statePath, "utf8")) as CanvasState;
  } catch {
    return null;
  }
}

function compareItems(
  previous: CanvasState | null,
  currentItems: Record<string, NormalizedItem>,
): ScanSummary["canvasChanges"] {
  const previousItems = previous?.items ?? {};
  const added = Object.keys(currentItems).filter((key) => !previousItems[key]);
  const changed = Object.keys(currentItems).filter(
    (key) => previousItems[key] && previousItems[key].contentHash !== currentItems[key].contentHash,
  );
  const removed = Object.keys(previousItems).filter((key) => !currentItems[key]);

  return { added, changed, removed };
}

export async function runCanvasScan(appRoot = process.cwd()): Promise<ScanSummary> {
  const env = await readCanvasEnv(appRoot);
  const courseId = env.CANVAS_COURSE_ID;
  const client = new CanvasClient(env);
  const stateDir = path.join(appRoot, ".canvas-sync");
  const rawDir = path.join(stateDir, "raw");
  const statePath = path.join(stateDir, "state.json");
  const timestamp = new Date().toISOString();
  const safeTimestamp = timestamp.replace(/[:.]/g, "-");
  const rawPath = path.join(rawDir, `${safeTimestamp}.json`);

  await mkdir(rawDir, { recursive: true });

  const previousState = await readPreviousState(statePath);
  const course = await client.getOne<CanvasCourse>(`/courses/${courseId}`);
  const modules = await client.getPaginated<CanvasModule>(
    `/courses/${courseId}/modules?per_page=100`,
  );

  const itemsByModule = new Map<number, CanvasModuleItem[]>();
  const linkedContent: Record<string, unknown> = {};

  for (const module of modules) {
    const items = await client.getPaginated<CanvasModuleItem>(
      `/courses/${courseId}/modules/${module.id}/items?per_page=100&include%5B%5D=content_details`,
    );
    itemsByModule.set(module.id, items);

    for (const item of items) {
      linkedContent[`module-item:${item.id}`] = await fetchLinkedContent(client, courseId, item);
    }
  }

  const announcements = await client.getPaginated<Record<string, unknown>>(
    `/announcements?context_codes%5B%5D=course_${courseId}&per_page=100`,
  );

  const existingModuleNumbers = await detectExistingAppModules(appRoot);
  const appMissingModules = detectAppMissingModules(modules, existingModuleNumbers);
  const normalizedItems: Record<string, NormalizedItem> = {};

  for (const module of modules) {
    const moduleNumber = extractModuleNumber(module.name);
    for (const item of itemsByModule.get(module.id) ?? []) {
      const key = `module-item:${item.id}`;
      const normalizedForHash = {
        moduleId: module.id,
        moduleName: module.name,
        moduleNumber,
        position: item.position ?? null,
        title: item.title,
        type: item.type,
        contentId: item.content_id ?? null,
        pageUrl: item.page_url ?? null,
        htmlUrl: item.html_url ?? null,
        published: item.published ?? null,
        contentDetails: stableContentDetails(item.content_details),
        linkedContent: normalizeLinkedContent(item.type, linkedContent[key]),
      };

      const previousItem = previousState?.items[key];
      const linkedFetchError = hasFetchError(linkedContent[key]);
      const contentHash =
        linkedFetchError && previousItem ? previousItem.contentHash : hashStable(normalizedForHash);
      const updatedAt =
        linkedFetchError && previousItem
          ? previousItem.updatedAt
          : ((normalizedForHash.linkedContent.updatedAt as string | null) ??
            (item.content_details?.updated_at as string | undefined) ??
            null);

      normalizedItems[key] = {
        key,
        moduleId: module.id,
        moduleName: module.name,
        moduleNumber,
        position: item.position ?? null,
        title: item.title,
        type: item.type,
        contentId: item.content_id ?? null,
        pageUrl: item.page_url ?? null,
        htmlUrl: item.html_url ?? null,
        contentHash,
        updatedAt,
      };
    }
  }

  const state: CanvasState = {
    courseId,
    courseName: course.name,
    courseCode: course.course_code ?? null,
    lastScanAt: timestamp,
    totals: {
      modules: modules.length,
      items: Object.keys(normalizedItems).length,
      announcements: announcements.length,
    },
    appCoverage: {
      existingModuleNumbers,
      missingModuleNumbers: appMissingModules.map((module) => module.moduleNumber),
    },
    items: normalizedItems,
  };

  const rawSnapshot = {
    scannedAt: timestamp,
    course,
    modules,
    moduleItems: Object.fromEntries(itemsByModule),
    linkedContent,
    announcements,
  };

  await writeJsonAtomic(rawPath, rawSnapshot);
  await writeJsonAtomic(statePath, state);

  return {
    courseId,
    courseName: course.name,
    totals: state.totals,
    canvasChanges: compareItems(previousState, normalizedItems),
    appMissingModules,
    statePath: path.relative(appRoot, statePath),
    rawPath: path.relative(appRoot, rawPath),
  };
}

function printSummary(summary: ScanSummary): void {
  console.log(`Canvas scan: ${summary.courseId} ${summary.courseName}`);
  console.log(
    `Totals: ${summary.totals.modules} modules, ${summary.totals.items} module items, ${summary.totals.announcements} announcements`,
  );
  console.log(
    `Canvas changes: ${summary.canvasChanges.added.length} added, ${summary.canvasChanges.changed.length} changed, ${summary.canvasChanges.removed.length} removed`,
  );

  if (summary.appMissingModules.length > 0) {
    console.log("App-missing modules:");
    for (const module of summary.appMissingModules) {
      console.log(`- Module ${module.moduleNumber}: ${module.moduleName} (${module.itemCount} items)`);
    }
  } else {
    console.log("App-missing modules: none");
  }

  console.log(`State: ${summary.statePath}`);
  console.log(`Raw snapshot: ${summary.rawPath}`);
}

async function main(): Promise<void> {
  const [command = "scan", ...args] = process.argv.slice(2);
  if (command !== "scan") {
    throw new Error(`Unsupported command: ${command}`);
  }

  const json = args.includes("--json");
  const summary = await runCanvasScan(process.cwd());

  if (json) {
    console.log(JSON.stringify(summary, null, 2));
  } else {
    printSummary(summary);
  }
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
