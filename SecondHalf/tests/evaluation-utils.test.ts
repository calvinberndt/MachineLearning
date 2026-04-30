import assert from "node:assert/strict";
import test from "node:test";
import { EVALUATION_SCENARIOS, computeEvaluation } from "../app/module-6/labs/evaluation-utils.ts";

const fraud = EVALUATION_SCENARIOS.find((scenario) => scenario.id === "fraud")!;
const support = EVALUATION_SCENARIOS.find((scenario) => scenario.id === "llm-support")!;

test("threshold trades recall against false positives", () => {
  const permissive = computeEvaluation(fraud, 25, 20);
  const strict = computeEvaluation(fraud, 80, 20);

  assert.ok(permissive.recall > strict.recall);
  assert.ok(permissive.falsePositive > strict.falsePositive);
});

test("confusion matrix counts stay anchored to 1,000 cases", () => {
  const result = computeEvaluation(fraud, 55, 30);
  const total =
    result.truePositive + result.falsePositive + result.trueNegative + result.falseNegative;

  assert.equal(total, 1000);
  assert.ok(result.f1 >= 0);
  assert.ok(result.f1 <= 1);
});

test("higher temperature increases generation risk", () => {
  const cool = computeEvaluation(support, 55, 0);
  const warm = computeEvaluation(support, 55, 100);

  assert.ok(warm.hallucinationRate > cool.hallucinationRate);
  assert.ok(warm.consistency < cool.consistency);
  assert.ok(warm.perplexity > cool.perplexity);
});
