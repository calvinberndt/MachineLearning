"use client";

import { useMemo, useState } from "react";
import {
  EVALUATION_SCENARIOS,
  computeEvaluation,
  formatPercent,
  type EvaluationScenarioId,
} from "./evaluation-utils";

const metricRows = [
  ["Precision", "Of flagged positives, how many were right"],
  ["Recall", "Of real positives, how many were caught"],
  ["F1", "Single score balancing precision and recall"],
  ["Accuracy", "Overall correctness, fragile on imbalance"],
] as const;

export function EvaluationLab() {
  const [scenarioId, setScenarioId] = useState<EvaluationScenarioId>("llm-support");
  const [threshold, setThreshold] = useState(55);
  const [temperature, setTemperature] = useState(30);

  const scenario = EVALUATION_SCENARIOS.find((item) => item.id === scenarioId) ?? EVALUATION_SCENARIOS[0];
  const result = useMemo(
    () => computeEvaluation(scenario, threshold, temperature),
    [scenario, threshold, temperature],
  );

  const metricValues = {
    Precision: formatPercent(result.precision),
    Recall: formatPercent(result.recall),
    F1: formatPercent(result.f1),
    Accuracy: formatPercent(result.accuracy),
  };

  return (
    <div className="lab-surface evaluation-lab">
      <div className="evaluation-tabs" role="group" aria-label="Evaluation scenario">
        {EVALUATION_SCENARIOS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="mini-switch"
            data-active={item.id === scenarioId}
            onClick={() => setScenarioId(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p className="evaluation-lab__task">{scenario.task}</p>

      <div className="lab-surface__controls evaluation-controls">
        <label className="range-field">
          <span>Threshold</span>
          <input
            type="range"
            min="20"
            max="85"
            step="5"
            value={threshold}
            onChange={(event) => setThreshold(Number(event.target.value))}
            aria-label="Classification threshold"
          />
          <span className="tabular">{threshold}%</span>
        </label>

        <label className="range-field">
          <span>Temperature</span>
          <input
            type="range"
            min="0"
            max="100"
            step="10"
            value={temperature}
            onChange={(event) => setTemperature(Number(event.target.value))}
            aria-label="Decoding temperature"
          />
          <span className="tabular">{(temperature / 100).toFixed(1)}</span>
        </label>
      </div>

      <div className="evaluation-grid">
        <section className="evaluation-panel" aria-label="Confusion matrix">
          <span className="kicker">Confusion matrix per 1,000 cases</span>
          <div className="evaluation-matrix">
            <MetricCell label="True positive" value={result.truePositive} tone="good" />
            <MetricCell label="False positive" value={result.falsePositive} tone="warn" />
            <MetricCell label="False negative" value={result.falseNegative} tone="danger" />
            <MetricCell label="True negative" value={result.trueNegative} tone="neutral" />
          </div>
        </section>

        <section className="evaluation-panel" aria-label="Metric scoreboard">
          <span className="kicker">Metric scoreboard</span>
          <div className="evaluation-scoreboard">
            {metricRows.map(([label, hint]) => (
              <div key={label} className="evaluation-score">
                <strong className="tabular">{metricValues[label]}</strong>
                <span>{label}</span>
                <p>{hint}</p>
              </div>
            ))}
          </div>
          <p className="evaluation-cost">
            Weighted error cost: <strong className="tabular">{result.expectedCost}</strong>
          </p>
        </section>
      </div>

      <section className="evaluation-panel" aria-label="Generation reliability">
        <span className="kicker">Generation reliability checks</span>
        <div className="evaluation-meters">
          <Meter label="Consistency" value={result.consistency} />
          <Meter label="Hallucination risk" value={result.hallucinationRate} inverse />
          <Meter label="Human review need" value={result.humanReviewNeed} inverse />
          <Meter
            label="Perplexity index"
            value={Math.min(result.perplexity / 40, 1)}
            text={result.perplexity.toFixed(1)}
            inverse
          />
        </div>
      </section>

      <p className="lab-surface__caption">
        Lowering the threshold catches more positives but also creates more false alerts. Raising temperature
        increases output variety, so consistency checks and human review matter more for open-ended answers.
      </p>
    </div>
  );
}

function MetricCell({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "good" | "warn" | "danger" | "neutral";
}) {
  return (
    <div className="evaluation-cell" data-tone={tone}>
      <strong className="tabular">{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function Meter({
  label,
  value,
  text = formatPercent(value),
  inverse = false,
}: {
  label: string;
  value: number;
  text?: string;
  inverse?: boolean;
}) {
  return (
    <div className="evaluation-meter" data-inverse={inverse}>
      <div>
        <span>{label}</span>
        <strong className="tabular">{text}</strong>
      </div>
      <span className="evaluation-meter__track">
        <span style={{ transform: `scaleX(${value})` }} />
      </span>
    </div>
  );
}
