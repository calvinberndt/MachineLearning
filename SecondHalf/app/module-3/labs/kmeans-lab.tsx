"use client";

import { useModule3Lab } from "./lab-context";

type ScorePoint = { id: string; math: number; science: number };

type ClusterStep = {
  label: string;
  description: string;
  centroids: Array<{ math: number; science: number; color: "amber" | "teal" }>;
  assignments: Partial<Record<string, "amber" | "teal">>;
};

const studentScores: ScorePoint[] = [
  { id: "A", math: 85, science: 70 },
  { id: "B", math: 90, science: 85 },
  { id: "C", math: 75, science: 60 },
  { id: "D", math: 40, science: 45 },
  { id: "E", math: 50, science: 50 },
  { id: "F", math: 55, science: 35 },
];

const clusterSteps: ClusterStep[] = [
  {
    label: "1. Seed",
    description: "Use the professor's example: pick A and D as starting centroids. No groupings yet.",
    centroids: [
      { math: 85, science: 70, color: "amber" },
      { math: 40, science: 45, color: "teal" },
    ],
    assignments: {},
  },
  {
    label: "2. Assign",
    description: "Every student joins the nearer centroid. A, B, C land with A's centroid. D, E, F with D's.",
    centroids: [
      { math: 85, science: 70, color: "amber" },
      { math: 40, science: 45, color: "teal" },
    ],
    assignments: { A: "amber", B: "amber", C: "amber", D: "teal", E: "teal", F: "teal" },
  },
  {
    label: "3. Update",
    description: "Recompute each centroid as the mean of its members. Amber moves to (83.3, 71.7). Teal moves to (48.3, 43.3).",
    centroids: [
      { math: 83.33, science: 71.67, color: "amber" },
      { math: 48.33, science: 43.33, color: "teal" },
    ],
    assignments: { A: "amber", B: "amber", C: "amber", D: "teal", E: "teal", F: "teal" },
  },
  {
    label: "4. Converge",
    description: "Assignments are stable; k-means halts. The fixed assignment is the final clustering.",
    centroids: [
      { math: 83.33, science: 71.67, color: "amber" },
      { math: 48.33, science: 43.33, color: "teal" },
    ],
    assignments: { A: "amber", B: "amber", C: "amber", D: "teal", E: "teal", F: "teal" },
  },
];

function plotX(value: number, max: number, width = 420, padding = 36) {
  return padding + (value / max) * (width - padding * 2);
}

function plotY(value: number, max: number, height = 280, padding = 28) {
  return height - padding - (value / max) * (height - padding * 2);
}

export function KMeansLab() {
  const { clusterStep, setClusterStep } = useModule3Lab();
  const current = clusterSteps[clusterStep];

  return (
    <div className="lab-surface">
      <div className="lab-surface__controls" role="tablist" aria-label="K-means step">
        {clusterSteps.map((step, index) => (
          <button
            key={step.label}
            className="mini-switch"
            data-active={clusterStep === index}
            onClick={() => setClusterStep(index)}
            type="button"
            role="tab"
            aria-selected={clusterStep === index}
          >
            {step.label}
          </button>
        ))}
      </div>

      <svg className="plot" viewBox="0 0 420 280" role="img" aria-label="K-means clustering progress">
        <line x1="36" y1="252" x2="392" y2="252" className="axis-line" />
        <line x1="36" y1="252" x2="36" y2="28" className="axis-line" />
        <text x="392" y="270" className="axis-label">Math</text>
        <text x="10" y="34" className="axis-label">Science</text>

        {studentScores.map((point) => {
          const color = current.assignments[point.id] ?? "neutral";
          return (
            <g key={point.id} transform={`translate(${plotX(point.math, 100)}, ${plotY(point.science, 100)})`}>
              <circle className={`plot-point plot-point--${color}`} r="11" />
              <text className="point-text" dy="4">{point.id}</text>
            </g>
          );
        })}

        {current.centroids.map((c) => (
          <g
            key={`${c.color}-${c.math}-${c.science}`}
            transform={`translate(${plotX(c.math, 100)}, ${plotY(c.science, 100)}) rotate(45)`}
          >
            <rect className={`plot-centroid plot-centroid--${c.color}`} x="-10" y="-10" width="20" height="20" rx="3" />
          </g>
        ))}
      </svg>

      <p className="lab-surface__caption tabular">
        <span className="kicker">Step {clusterStep + 1} / {clusterSteps.length} · {current.label}</span>
        {current.description}
      </p>
    </div>
  );
}
