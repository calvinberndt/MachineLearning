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
