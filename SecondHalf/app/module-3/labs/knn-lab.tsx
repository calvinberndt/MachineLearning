"use client";

import { useDeferredValue, useMemo } from "react";
import { useModule3Lab } from "./lab-context";

type KnnSample = { x: number; y: number; label: "A" | "B" };

const training: KnnSample[] = [
  { x: 2, y: 4, label: "A" },
  { x: 4, y: 6, label: "A" },
  { x: 4, y: 4, label: "A" },
  { x: 6, y: 2, label: "B" },
  { x: 6, y: 4, label: "B" },
  { x: 8, y: 2, label: "B" },
];

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function plotX(value: number, max: number, width = 420, padding = 36) {
  return padding + (value / max) * (width - padding * 2);
}

function plotY(value: number, max: number, height = 280, padding = 28) {
  return height - padding - (value / max) * (height - padding * 2);
}

export function KnnLab() {
  const { testPoint, setTestPoint, k, setK } = useModule3Lab();
  const deferredPoint = useDeferredValue(testPoint);

  const ranked = useMemo(
    () =>
      training
        .map((sample, index) => ({ id: index, ...sample, dist: distance(sample, deferredPoint) }))
        .sort((a, b) => a.dist - b.dist),
    [deferredPoint],
  );

  const neighbors = ranked.slice(0, k);
  const votes = neighbors.reduce(
    (acc, n) => ({ ...acc, [n.label]: acc[n.label] + 1 }),
    { A: 0, B: 0 } as Record<"A" | "B", number>,
  );
  const predicted: "A" | "B" =
    votes.A === votes.B ? neighbors[0]?.label ?? "A" : votes.A > votes.B ? "A" : "B";

  return (
    <div className="lab-surface">
      <div className="lab-surface__controls">
        <label className="range-field">
          <span>Test X</span>
          <input
            type="range" min="0" max="10" step="0.5"
            value={testPoint.x}
            onChange={(e) => setTestPoint({ ...testPoint, x: Number(e.target.value) })}
            aria-label="Test point X coordinate"
          />
          <span className="tabular">{testPoint.x.toFixed(1)}</span>
        </label>
        <label className="range-field">
          <span>Test Y</span>
          <input
            type="range" min="0" max="10" step="0.5"
            value={testPoint.y}
            onChange={(e) => setTestPoint({ ...testPoint, y: Number(e.target.value) })}
            aria-label="Test point Y coordinate"
          />
          <span className="tabular">{testPoint.y.toFixed(1)}</span>
        </label>
        <label className="range-field">
          <span>k</span>
          <input
            type="range" min="1" max="5" step="1"
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            aria-label="Number of neighbors"
          />
          <span className="tabular">{k}</span>
        </label>
      </div>

      <svg className="plot" viewBox="0 0 420 280" role="img" aria-label="KNN classification">
        <line x1="36" y1="252" x2="392" y2="252" className="axis-line" />
        <line x1="36" y1="252" x2="36" y2="28" className="axis-line" />
        {neighbors.map((n) => (
          <line
            key={`line-${n.id}`}
            className="neighbor-line"
            x1={plotX(testPoint.x, 10)} y1={plotY(testPoint.y, 10)}
            x2={plotX(n.x, 10)} y2={plotY(n.y, 10)}
          />
        ))}
        {training.map((s, i) => {
          const isNeighbor = neighbors.some((n) => n.id === i);
          return (
            <g key={`${s.label}-${i}`} transform={`translate(${plotX(s.x, 10)}, ${plotY(s.y, 10)})`}>
              <circle className={`plot-point plot-point--${s.label === "A" ? "amber" : "teal"}`} r={isNeighbor ? 12 : 9} />
              <text className="point-text" dy="4">{s.label}</text>
            </g>
          );
        })}
        <g transform={`translate(${plotX(testPoint.x, 10)}, ${plotY(testPoint.y, 10)})`}>
          <polygon className="plot-star" points="0,-14 4,-4 14,-4 6,2 10,12 0,6 -10,12 -6,2 -14,-4 -4,-4" />
        </g>
      </svg>

      <p className="lab-surface__caption tabular">
        <span className="kicker">Prediction</span>
        {k} nearest neighbors vote {votes.A}–{votes.B} → class <strong>{predicted}</strong>.
      </p>
    </div>
  );
}
