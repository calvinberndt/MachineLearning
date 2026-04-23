import { test } from "node:test";
import assert from "node:assert/strict";
import { buildConceptHeadingId } from "../app/(shell)/concept.ts";

test("builds stable id from section + slug", () => {
  assert.equal(buildConceptHeadingId("3.1", "k-means"), "s-3-1-k-means");
});

test("slugs lowercase and replace spaces", () => {
  assert.equal(buildConceptHeadingId("4.2", "Random Forest"), "s-4-2-random-forest");
});

test("strips punctuation", () => {
  assert.equal(buildConceptHeadingId("6.1", "Neural Networks!"), "s-6-1-neural-networks");
});
