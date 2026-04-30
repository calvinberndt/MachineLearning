export type EvaluationScenarioId = "fraud" | "medical" | "satire" | "llm-support";

export type EvaluationScenario = {
  id: EvaluationScenarioId;
  label: string;
  task: string;
  prevalence: number;
  baseRecall: number;
  baseFalsePositiveRate: number;
  falsePositiveCost: number;
  falseNegativeCost: number;
  ambiguity: number;
  basePerplexity: number;
  baseHallucinationRate: number;
  safetyWeight: number;
};

export type EvaluationResult = {
  actualPositive: number;
  actualNegative: number;
  truePositive: number;
  falsePositive: number;
  trueNegative: number;
  falseNegative: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  expectedCost: number;
  perplexity: number;
  consistency: number;
  hallucinationRate: number;
  humanReviewNeed: number;
};

const TOTAL_CASES = 1000;

export const EVALUATION_SCENARIOS: EvaluationScenario[] = [
  {
    id: "fraud",
    label: "Fraud alerts",
    task: "Bank transactions are rare-positive events: missed fraud is expensive, but too many false alerts harm customers.",
    prevalence: 0.08,
    baseRecall: 0.84,
    baseFalsePositiveRate: 0.11,
    falsePositiveCost: 2,
    falseNegativeCost: 9,
    ambiguity: 0.34,
    basePerplexity: 12.5,
    baseHallucinationRate: 0.06,
    safetyWeight: 0.72,
  },
  {
    id: "medical",
    label: "Medical screening",
    task: "A screening model should catch most true positives, then send uncertain cases to a human workflow.",
    prevalence: 0.18,
    baseRecall: 0.9,
    baseFalsePositiveRate: 0.16,
    falsePositiveCost: 3,
    falseNegativeCost: 10,
    ambiguity: 0.28,
    basePerplexity: 10.2,
    baseHallucinationRate: 0.05,
    safetyWeight: 0.95,
  },
  {
    id: "satire",
    label: "Satire detector",
    task: "A fake-news detector can confuse satire with misinformation unless the representation captures context.",
    prevalence: 0.22,
    baseRecall: 0.75,
    baseFalsePositiveRate: 0.19,
    falsePositiveCost: 4,
    falseNegativeCost: 7,
    ambiguity: 0.62,
    basePerplexity: 18.4,
    baseHallucinationRate: 0.11,
    safetyWeight: 0.68,
  },
  {
    id: "llm-support",
    label: "LLM support answers",
    task: "An assistant must be relevant, factual, safe, and consistent across similar prompts.",
    prevalence: 0.14,
    baseRecall: 0.8,
    baseFalsePositiveRate: 0.13,
    falsePositiveCost: 3,
    falseNegativeCost: 8,
    ambiguity: 0.48,
    basePerplexity: 15.8,
    baseHallucinationRate: 0.09,
    safetyWeight: 0.88,
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function safeDivide(numerator: number, denominator: number) {
  return denominator === 0 ? 0 : numerator / denominator;
}

export function computeEvaluation(
  scenario: EvaluationScenario,
  thresholdPercent: number,
  temperaturePercent: number,
): EvaluationResult {
  const thresholdShift = (50 - thresholdPercent) / 100;
  const temperature = temperaturePercent / 100;

  const recallRate = clamp(scenario.baseRecall + thresholdShift * 0.78, 0.05, 0.98);
  const falsePositiveRate = clamp(
    scenario.baseFalsePositiveRate + thresholdShift * (0.46 + scenario.ambiguity * 0.18),
    0.01,
    0.72,
  );

  const actualPositive = Math.round(TOTAL_CASES * scenario.prevalence);
  const actualNegative = TOTAL_CASES - actualPositive;
  const truePositive = Math.round(actualPositive * recallRate);
  const falseNegative = actualPositive - truePositive;
  const falsePositive = Math.round(actualNegative * falsePositiveRate);
  const trueNegative = actualNegative - falsePositive;
  const precision = safeDivide(truePositive, truePositive + falsePositive);
  const recall = safeDivide(truePositive, truePositive + falseNegative);
  const f1 = safeDivide(2 * precision * recall, precision + recall);

  const perplexity = scenario.basePerplexity * (1 + temperature * 0.55 + scenario.ambiguity * 0.18);
  const consistency = clamp(0.96 - temperature * 0.48 - scenario.ambiguity * 0.16, 0.05, 0.98);
  const hallucinationRate = clamp(
    scenario.baseHallucinationRate + temperature * 0.18 + scenario.ambiguity * 0.08,
    0.01,
    0.65,
  );
  const humanReviewNeed = clamp(
    scenario.safetyWeight * (0.45 * hallucinationRate + 0.55 * (1 - consistency)),
    0.02,
    0.95,
  );

  return {
    actualPositive,
    actualNegative,
    truePositive,
    falsePositive,
    trueNegative,
    falseNegative,
    accuracy: safeDivide(truePositive + trueNegative, TOTAL_CASES),
    precision,
    recall,
    f1,
    expectedCost:
      falsePositive * scenario.falsePositiveCost + falseNegative * scenario.falseNegativeCost,
    perplexity,
    consistency,
    hallucinationRate,
    humanReviewNeed,
  };
}

export function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}
