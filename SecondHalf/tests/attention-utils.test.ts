import assert from "node:assert/strict";
import test from "node:test";
import { getAttentionForQuery, getAttentionMatrix, getWeightedContext, softmax } from "../app/module-6/labs/attention-utils.ts";

test("softmax normalizes scores into probabilities", () => {
  const weights = softmax([1, 2, 3]);
  assert.equal(Number(weights.reduce((sum, value) => sum + value, 0).toFixed(6)), 1);
  assert.ok(weights[2] > weights[1]);
  assert.ok(weights[1] > weights[0]);
});

test("attention matrix has one probability row per token", () => {
  const matrix = getAttentionMatrix();
  assert.equal(matrix.length, 4);
  for (const row of matrix) {
    assert.equal(row.length, 4);
    assert.equal(Number(row.reduce((sum, value) => sum + value, 0).toFixed(6)), 1);
  }
});

test("bank query attends most strongly to loan in the fixture", () => {
  const weights = getAttentionForQuery(0);
  const maxIndex = weights.indexOf(Math.max(...weights));
  assert.equal(maxIndex, 3);
});

test("weighted context is deterministic for a query row", () => {
  assert.deepEqual(getWeightedContext(2).map((value) => Number(value.toFixed(3))), [0.465, 0.632]);
});
