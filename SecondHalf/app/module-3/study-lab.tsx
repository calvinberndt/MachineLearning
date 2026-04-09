"use client";

import Link from "next/link";
import { useState } from "react";

type LabView = "clusters" | "knn" | "svm";

type ScorePoint = {
  id: string;
  math: number;
  science: number;
};

type ClusterStep = {
  label: string;
  description: string;
  centroids: Array<{ math: number; science: number; color: "amber" | "teal" }>;
  assignments: Partial<Record<string, "amber" | "teal">>;
};

type KnnSample = {
  x: number;
  y: number;
  label: "A" | "B";
};

type SvmSample = {
  id: string;
  x: number;
  y: number;
  label: "0" | "1";
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
    description:
      "Use the professor's example: pick A and D as the starting centroids. At this point the algorithm has not grouped anyone yet.",
    centroids: [
      { math: 85, science: 70, color: "amber" },
      { math: 40, science: 45, color: "teal" },
    ],
    assignments: {},
  },
  {
    label: "2. Assign",
    description:
      "Every student joins the nearest centroid. A, B, and C land in the higher-scoring cluster. D, E, and F land in the lower-scoring cluster.",
    centroids: [
      { math: 85, science: 70, color: "amber" },
      { math: 40, science: 45, color: "teal" },
    ],
    assignments: {
      A: "amber",
      B: "amber",
      C: "amber",
      D: "teal",
      E: "teal",
      F: "teal",
    },
  },
  {
    label: "3. Update",
    description:
      "Now take the mean of each cluster. The new amber centroid moves to roughly (83.3, 71.7), and the teal centroid moves to roughly (48.3, 43.3).",
    centroids: [
      { math: 83.33, science: 71.67, color: "amber" },
      { math: 48.33, science: 43.33, color: "teal" },
    ],
    assignments: {
      A: "amber",
      B: "amber",
      C: "amber",
      D: "teal",
      E: "teal",
      F: "teal",
    },
  },
  {
    label: "4. Converge",
    description:
      "The assignments do not change anymore, so K-means stops. That stable state is the final clustering.",
    centroids: [
      { math: 83.33, science: 71.67, color: "amber" },
      { math: 48.33, science: 43.33, color: "teal" },
    ],
    assignments: {
      A: "amber",
      B: "amber",
      C: "amber",
      D: "teal",
      E: "teal",
      F: "teal",
    },
  },
];

const knnTraining: KnnSample[] = [
  { x: 2, y: 4, label: "A" },
  { x: 4, y: 6, label: "A" },
  { x: 4, y: 4, label: "A" },
  { x: 6, y: 2, label: "B" },
  { x: 6, y: 4, label: "B" },
  { x: 8, y: 2, label: "B" },
];

const svmSamples: SvmSample[] = [
  { id: "p1", x: 2, y: 3, label: "0" },
  { id: "p2", x: 3, y: 4, label: "0" },
  { id: "p3", x: 4, y: 5, label: "0" },
  { id: "p4", x: 5, y: 6, label: "0" },
  { id: "p5", x: 6, y: 7, label: "0" },
  { id: "p6", x: 7, y: 8, label: "1" },
  { id: "p7", x: 8, y: 1, label: "1" },
  { id: "p8", x: 9, y: 2, label: "1" },
  { id: "p9", x: 10, y: 3, label: "1" },
  { id: "p10", x: 11, y: 4, label: "1" },
];

const moduleViews: Array<{ id: LabView; label: string }> = [
  { id: "clusters", label: "Clustering" },
  { id: "knn", label: "KNN" },
  { id: "svm", label: "SVM" },
];

function plotX(value: number, max: number, width = 420, padding = 36) {
  return padding + (value / max) * (width - padding * 2);
}

function plotY(value: number, max: number, height = 280, padding = 28) {
  return height - padding - (value / max) * (height - padding * 2);
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function Module3Lab() {
  const [view, setView] = useState<LabView>("clusters");
  const [clusterStep, setClusterStep] = useState(0);
  const [testPoint, setTestPoint] = useState({ x: 5, y: 3 });
  const [k, setK] = useState(3);
  const [kernel, setKernel] = useState<"linear" | "rbf">("linear");
  const [cValue, setCValue] = useState(1.0);

  const currentClusterStep = clusterSteps[clusterStep];

  const knnDistances = knnTraining
    .map((sample, index) => ({
      id: index,
      ...sample,
      value: distance(sample, testPoint),
    }))
    .sort((left, right) => left.value - right.value);

  const nearestNeighbors = knnDistances.slice(0, k);
  const voteCounts = nearestNeighbors.reduce(
    (counts, neighbor) => {
      counts[neighbor.label] += 1;
      return counts;
    },
    { A: 0, B: 0 },
  );
  const predictedLabel = voteCounts.A === voteCounts.B ? nearestNeighbors[0]?.label ?? "A" : voteCounts.A > voteCounts.B ? "A" : "B";

  const linearBoundary = plotX(6.5, 12);
  const linearMargin = 52 - cValue * 18;
  const rbfCurve = "M 154 34 C 236 68 258 132 244 198 C 228 250 188 262 134 244";
  const rbfHalo = 60 - cValue * 14;

  return (
    <article className="module-page" data-tone="module-3">
      <section className="module-hero">
        <div>
          <p className="hero-kicker">Module 3</p>
          <h1 className="module-title">Unsupervised learning, plus the classifiers sitting nearby.</h1>
          <p className="module-copy">
            Your professor grouped clustering, KNN, and SVM together here. The key study move is
            separating what is unsupervised from what is supervised, while still seeing how all
            three methods organize points in space.
          </p>
        </div>
        <aside className="module-note">
          <p className="section-tag">Important distinction</p>
          <p>
            <strong>Clustering</strong> is unsupervised because it finds groups without labels.
            <strong> KNN</strong> and <strong>SVM</strong> are supervised because they learn from
            labeled examples.
          </p>
        </aside>
      </section>

      <div className="lab-nav" role="tablist" aria-label="Module 3 sections">
        {moduleViews.map((item) => (
          <button
            key={item.id}
            className="lab-tab"
            data-active={view === item.id}
            onClick={() => setView(item.id)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>

      {view === "clusters" ? (
        <section className="lab-layout">
          <div className="lab-surface">
            <div className="control-row">
              {clusterSteps.map((step, index) => (
                <button
                  key={step.label}
                  className="mini-switch"
                  data-active={clusterStep === index}
                  onClick={() => setClusterStep(index)}
                  type="button"
                >
                  {step.label}
                </button>
              ))}
            </div>

            <svg className="plot" viewBox="0 0 420 280" role="img" aria-label="K-means clustering diagram">
              <line x1="36" y1="252" x2="392" y2="252" className="axis-line" />
              <line x1="36" y1="252" x2="36" y2="28" className="axis-line" />
              <text x="392" y="270" className="axis-label">
                Math
              </text>
              <text x="10" y="34" className="axis-label">
                Science
              </text>

              {studentScores.map((point) => {
                const color = currentClusterStep.assignments[point.id] ?? "neutral";
                return (
                  <g key={point.id} transform={`translate(${plotX(point.math, 100)}, ${plotY(point.science, 100)})`}>
                    <circle className={`plot-point plot-point--${color}`} r="10" />
                    <text className="point-text" dy="4">
                      {point.id}
                    </text>
                  </g>
                );
              })}

              {currentClusterStep.centroids.map((centroid) => (
                <g
                  key={`${centroid.color}-${centroid.math}-${centroid.science}`}
                  transform={`translate(${plotX(centroid.math, 100)}, ${plotY(centroid.science, 100)}) rotate(45)`}
                >
                  <rect className={`plot-centroid plot-centroid--${centroid.color}`} x="-10" y="-10" width="20" height="20" rx="3" />
                </g>
              ))}
            </svg>

            <div className="concept-copy">
              <p className="section-tag">What to notice</p>
              <h2 className="section-title">{currentClusterStep.label}</h2>
              <p className="section-copy">{currentClusterStep.description}</p>
            </div>
          </div>

          <aside className="study-panel">
            <p className="section-tag">Professor takeaway</p>
            <ul className="insight-list">
              <li>K-means needs a chosen value of K before it starts.</li>
              <li>It alternates between assigning points and recomputing means.</li>
              <li>It works best with numerical features and roughly compact clusters.</li>
            </ul>
            <p className="section-tag">Further study</p>
            <ul className="resource-list">
              <li>
                <Link href="https://scikit-learn.org/stable/modules/clustering.html" target="_blank">
                  scikit-learn clustering guide
                </Link>
              </li>
              <li>
                <Link href="https://www.youtube.com/watch?v=4b5d3muPQmA" target="_blank">
                  StatQuest: K-means clustering
                </Link>
              </li>
            </ul>
          </aside>
        </section>
      ) : null}

      {view === "knn" ? (
        <section className="lab-layout">
          <div className="lab-surface">
            <div className="control-grid">
              <label className="control">
                <span className="range-label">Test point X</span>
                <input
                  max="10"
                  min="0"
                  step="0.5"
                  type="range"
                  value={testPoint.x}
                  onChange={(event) => setTestPoint((current) => ({ ...current, x: Number(event.target.value) }))}
                />
                <span className="readout">{testPoint.x.toFixed(1)}</span>
              </label>
              <label className="control">
                <span className="range-label">Test point Y</span>
                <input
                  max="10"
                  min="0"
                  step="0.5"
                  type="range"
                  value={testPoint.y}
                  onChange={(event) => setTestPoint((current) => ({ ...current, y: Number(event.target.value) }))}
                />
                <span className="readout">{testPoint.y.toFixed(1)}</span>
              </label>
              <label className="control">
                <span className="range-label">k neighbors</span>
                <input
                  max="5"
                  min="1"
                  step="1"
                  type="range"
                  value={k}
                  onChange={(event) => setK(Number(event.target.value))}
                />
                <span className="readout">{k}</span>
              </label>
            </div>

            <svg className="plot" viewBox="0 0 420 280" role="img" aria-label="KNN classification diagram">
              <line x1="36" y1="252" x2="392" y2="252" className="axis-line" />
              <line x1="36" y1="252" x2="36" y2="28" className="axis-line" />
              <text x="392" y="270" className="axis-label">
                Feature 1
              </text>
              <text x="10" y="34" className="axis-label">
                Feature 2
              </text>

              {nearestNeighbors.map((neighbor) => (
                <line
                  key={`line-${neighbor.id}`}
                  className="neighbor-line"
                  x1={plotX(testPoint.x, 10)}
                  x2={plotX(neighbor.x, 10)}
                  y1={plotY(testPoint.y, 10)}
                  y2={plotY(neighbor.y, 10)}
                />
              ))}

              {knnTraining.map((sample, index) => {
                const isNearest = nearestNeighbors.some((neighbor) => neighbor.id === index);
                return (
                  <g key={`${sample.label}-${index}`} transform={`translate(${plotX(sample.x, 10)}, ${plotY(sample.y, 10)})`}>
                    <circle className={`plot-point plot-point--${sample.label === "A" ? "amber" : "teal"}`} r={isNearest ? 12 : 9} />
                    <text className="point-text" dy="4">
                      {sample.label}
                    </text>
                  </g>
                );
              })}

              <g transform={`translate(${plotX(testPoint.x, 10)}, ${plotY(testPoint.y, 10)})`}>
                <polygon className="plot-star" points="0,-14 4,-4 14,-4 6,2 10,12 0,6 -10,12 -6,2 -14,-4 -4,-4" />
              </g>
            </svg>

            <div className="concept-copy">
              <p className="section-tag">Live prediction</p>
              <h2 className="section-title">
                Predicted class: <span className="accent-text">{predictedLabel}</span>
              </h2>
              <p className="section-copy">
                KNN does not learn a formula first. It waits for a new point, finds the nearest
                labeled examples, and lets them vote.
              </p>
              <div className="metric-row">
                <div className="metric">
                  <span className="metric-label">Votes for A</span>
                  <strong className="metric-value">{voteCounts.A}</strong>
                </div>
                <div className="metric">
                  <span className="metric-label">Votes for B</span>
                  <strong className="metric-value">{voteCounts.B}</strong>
                </div>
              </div>
            </div>
          </div>

          <aside className="study-panel">
            <p className="section-tag">Nearest neighbors</p>
            <ul className="neighbor-list">
              {nearestNeighbors.map((neighbor) => (
                <li key={`neighbor-${neighbor.id}`}>
                  <span>{neighbor.label}</span>
                  <span>{neighbor.value.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <p className="section-tag">Study note</p>
            <p className="section-copy">
              Small <code>k</code> makes KNN sensitive to noise. Larger <code>k</code> smooths the
              decision boundary, but if it gets too large it can wash out the local pattern.
            </p>
            <p className="section-tag">Further study</p>
            <ul className="resource-list">
              <li>
                <Link href="https://scikit-learn.org/stable/modules/neighbors.html" target="_blank">
                  scikit-learn nearest neighbors guide
                </Link>
              </li>
            </ul>
          </aside>
        </section>
      ) : null}

      {view === "svm" ? (
        <section className="lab-layout">
          <div className="lab-surface">
            <div className="control-row">
              <button
                className="mini-switch"
                data-active={kernel === "linear"}
                onClick={() => setKernel("linear")}
                type="button"
              >
                Linear kernel
              </button>
              <button
                className="mini-switch"
                data-active={kernel === "rbf"}
                onClick={() => setKernel("rbf")}
                type="button"
              >
                Nonlinear idea
              </button>
              <label className="control control--compact">
                <span className="range-label">C parameter</span>
                <input
                  max="2"
                  min="0.4"
                  step="0.1"
                  type="range"
                  value={cValue}
                  onChange={(event) => setCValue(Number(event.target.value))}
                />
                <span className="readout">{cValue.toFixed(1)}</span>
              </label>
            </div>

            <svg className="plot" viewBox="0 0 420 280" role="img" aria-label="SVM margin diagram">
              <line x1="36" y1="252" x2="392" y2="252" className="axis-line" />
              <line x1="36" y1="252" x2="36" y2="28" className="axis-line" />
              <text x="392" y="270" className="axis-label">
                Feature 1
              </text>
              <text x="10" y="34" className="axis-label">
                Feature 2
              </text>

              {kernel === "linear" ? (
                <>
                  <rect
                    className="margin-band"
                    x={linearBoundary - linearMargin / 2}
                    y="36"
                    width={linearMargin}
                    height="208"
                    rx="24"
                  />
                  <line className="decision-line" x1={linearBoundary} x2={linearBoundary} y1="34" y2="246" />
                </>
              ) : (
                <>
                  <path className="margin-path" d={rbfCurve} style={{ strokeWidth: rbfHalo }} />
                  <path className="decision-curve" d={rbfCurve} />
                </>
              )}

              {svmSamples.map((sample) => {
                const isSupportVector = ["p5", "p6", "p7"].includes(sample.id);
                return (
                  <g key={sample.id} transform={`translate(${plotX(sample.x, 12)}, ${plotY(sample.y, 8)})`}>
                    <circle className={`plot-point plot-point--${sample.label === "0" ? "amber" : "teal"}`} r={isSupportVector ? 11 : 8} />
                    {isSupportVector ? <circle className="support-ring" r="16" /> : null}
                  </g>
                );
              })}
            </svg>

            <div className="concept-copy">
              <p className="section-tag">Max-margin intuition</p>
              <h2 className="section-title">
                {kernel === "linear" ? "A straight boundary with the widest safe margin." : "A curved boundary when the linear split is not enough."}
              </h2>
              <p className="section-copy">
                Lower <code>C</code> allows a wider margin and more forgiveness. Higher <code>C</code>
                squeezes the margin, pushing the model harder to classify every training point
                correctly.
              </p>
            </div>
          </div>

          <aside className="study-panel">
            <p className="section-tag">Vocabulary</p>
            <ul className="insight-list">
              <li>Hyperplane: the separating boundary.</li>
              <li>Support vectors: the closest points that define the margin.</li>
              <li>Kernel: a trick for drawing nonlinear boundaries.</li>
            </ul>
            <p className="section-tag">Further study</p>
            <ul className="resource-list">
              <li>
                <Link href="https://scikit-learn.org/stable/modules/svm.html" target="_blank">
                  scikit-learn SVM guide
                </Link>
              </li>
              <li>
                <Link href="https://www.youtube.com/watch?v=efR1C6CvhmE" target="_blank">
                  StatQuest: SVM main ideas
                </Link>
              </li>
            </ul>
          </aside>
        </section>
      ) : null}
    </article>
  );
}
