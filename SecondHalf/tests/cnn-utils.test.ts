import { test } from "node:test";
import assert from "node:assert/strict";
import {
  VERTICAL_EDGE_KERNEL,
  HORIZONTAL_EDGE_KERNEL,
  convolve,
  maxPool2x2,
  applyRelu,
  convOutputSize,
} from "../app/module-5/labs/cnn-utils.ts";

test("convOutputSize matches (H - F + 2P) / S + 1", () => {
  assert.equal(convOutputSize(6, 3), 4);
  assert.equal(convOutputSize(6, 3, 1, 1), 6);
  assert.equal(convOutputSize(28, 5, 0, 1), 24);
  assert.equal(convOutputSize(28, 5, 2, 1), 28);
  assert.equal(convOutputSize(32, 3, 0, 2), 15);
});

test("convolve of 6x6 input with 3x3 kernel produces 4x4 output", () => {
  const grid = Array.from({ length: 6 }, () => Array.from({ length: 6 }, () => 1));
  const result = convolve(grid, VERTICAL_EDGE_KERNEL);
  assert.equal(result.length, 4);
  assert.equal(result[0].length, 4);
});

test("vertical edge kernel returns 0 on a uniform field", () => {
  const grid = Array.from({ length: 6 }, () => Array.from({ length: 6 }, () => 1));
  const result = convolve(grid, VERTICAL_EDGE_KERNEL);
  for (const row of result) for (const v of row) assert.equal(v, 0);
});

test("vertical edge kernel fires on a vertical stripe", () => {
  const grid = [
    [0, 0, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0],
  ];
  const result = convolve(grid, VERTICAL_EDGE_KERNEL);
  const maxAbs = Math.max(...result.flat().map(Math.abs));
  assert.ok(maxAbs >= 3, `expected strong edge response, got max |${maxAbs}|`);
});

test("horizontal edge kernel fires on a horizontal stripe", () => {
  const grid = [
    [0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ];
  const result = convolve(grid, HORIZONTAL_EDGE_KERNEL);
  const maxAbs = Math.max(...result.flat().map(Math.abs));
  assert.ok(maxAbs >= 3, `expected strong horizontal response, got max |${maxAbs}|`);
});

test("applyRelu zeroes negatives and preserves positives", () => {
  const grid = [
    [-2, -1, 0],
    [1, 2, 3],
  ];
  assert.deepEqual(applyRelu(grid), [
    [0, 0, 0],
    [1, 2, 3],
  ]);
});

test("maxPool2x2 halves each dimension and keeps the max per 2x2 block", () => {
  const grid = [
    [1, 2, 5, 6],
    [3, 4, 7, 8],
    [9, 10, 13, 14],
    [11, 12, 15, 16],
  ];
  assert.deepEqual(maxPool2x2(grid), [
    [4, 8],
    [12, 16],
  ]);
});
