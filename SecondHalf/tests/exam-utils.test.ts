import assert from "node:assert/strict";
import test from "node:test";
import { generateExam, normalize } from "../app/quiz/exam-utils.ts";

test("generateExam is deterministic for a given seed", () => {
  assert.deepEqual(generateExam(1), generateExam(1));
});

test("generateExam keeps the expected professor-style mix", () => {
  const exam = generateExam(7);
  const multipleChoiceCount = exam.filter((question) => question.type === "multiple-choice").length;
  const fillBlankCount = exam.filter((question) => question.type === "fill-blank").length;

  assert.equal(exam.length, 8);
  assert.equal(multipleChoiceCount, 6);
  assert.equal(fillBlankCount, 2);
});

test("different seeds produce different question orderings", () => {
  const examA = generateExam(1).map((question) => question.id);
  const examB = generateExam(4).map((question) => question.id);

  assert.notDeepEqual(examA, examB);
});

test("normalize collapses case and extra whitespace", () => {
  assert.equal(normalize("  Support   "), "support");
  assert.equal(normalize("Back Propagation"), "back propagation");
});
