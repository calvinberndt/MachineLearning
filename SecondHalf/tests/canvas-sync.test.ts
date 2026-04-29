import assert from "node:assert/strict";
import test from "node:test";
import {
  detectAppMissingModules,
  extractModuleNumber,
  parseDotEnv,
  parseLinkHeader,
  stableStringify,
} from "../scripts/canvas-sync.ts";

test("parseDotEnv preserves token characters without shell evaluation", () => {
  const env = parseDotEnv("CANVAS_API_TOKEN='abc$def~ghi'\nCANVAS_COURSE_ID=809921\n");

  assert.equal(env.CANVAS_API_TOKEN, "abc$def~ghi");
  assert.equal(env.CANVAS_COURSE_ID, "809921");
});

test("parseLinkHeader extracts pagination rels", () => {
  const links = parseLinkHeader(
    '<https://canvas.example/api/v1/courses/1/modules?page=2>; rel="next", <https://canvas.example/api/v1/courses/1/modules?page=4>; rel="last"',
  );

  assert.equal(links.next, "https://canvas.example/api/v1/courses/1/modules?page=2");
  assert.equal(links.last, "https://canvas.example/api/v1/courses/1/modules?page=4");
});

test("stableStringify sorts object keys recursively", () => {
  assert.equal(stableStringify({ b: 1, a: { d: 4, c: 3 } }), '{"a":{"c":3,"d":4},"b":1}');
});

test("extractModuleNumber finds Canvas module labels", () => {
  assert.equal(extractModuleNumber("Module 6: OpenAI & Large Language Model"), 6);
  assert.equal(extractModuleNumber("Course Orientation"), null);
});

test("detectAppMissingModules treats app-missing Canvas modules as actionable work", () => {
  const missing = detectAppMissingModules(
    [
      { id: 0, name: "Module 2: Supervised Learning", items_count: 4 },
      { id: 1, name: "Module 5: Deep Learning", items_count: 3 },
      { id: 2, name: "Module 6: OpenAI & LLM", items_count: 1 },
      { id: 3, name: "Course Orientation", items_count: 2 },
    ],
    [3, 4, 5],
  );

  assert.deepEqual(missing, [
    {
      moduleNumber: 6,
      moduleName: "Module 6: OpenAI & LLM",
      itemCount: 1,
    },
  ]);
});
