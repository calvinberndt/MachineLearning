import test from "node:test";
import assert from "node:assert/strict";
import {
  prompts,
  layerLabels,
  isCorrect,
  type LandscapeLayer,
} from "../app/module-6/labs/landscape-utils.ts";

test("each prompt's answer is a known layer", () => {
  const layers: LandscapeLayer[] = ["model", "system", "landscape"];
  for (const p of prompts) {
    assert.ok(layers.includes(p.answer), `${p.id} has bad answer ${p.answer}`);
  }
});

test("prompt ids and descriptions are unique", () => {
  const ids = prompts.map((p) => p.id);
  const descs = prompts.map((p) => p.description);
  assert.equal(new Set(ids).size, ids.length, "duplicate ids");
  assert.equal(new Set(descs).size, descs.length, "duplicate descriptions");
});

test("layerLabels covers every layer", () => {
  for (const l of ["model", "system", "landscape"] as const) {
    assert.ok(layerLabels[l], `missing label for ${l}`);
  }
});

test("isCorrect returns true only for the prompt's answer", () => {
  const p = prompts[0];
  assert.equal(isCorrect(p, p.answer), true);
  const wrong = (["model", "system", "landscape"] as const).find(
    (l) => l !== p.answer,
  )!;
  assert.equal(isCorrect(p, wrong), false);
});
