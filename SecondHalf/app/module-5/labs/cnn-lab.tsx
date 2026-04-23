"use client";

import { useMemo } from "react";
import { useModule5Lab } from "./lab-context";
import {
  HORIZONTAL_EDGE_KERNEL,
  VERTICAL_EDGE_KERNEL,
  applyRelu,
  convolve,
  maxPool2x2,
} from "./cnn-utils";

const GRID_PRESETS = {
  vertical: [
    [0, 0, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0],
  ],
  horizontal: [
    [0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ],
  blank: Array.from({ length: 6 }, () => Array.from({ length: 6 }, () => 0)),
} as const;

function intensityStyle(value: number, range = 4): React.CSSProperties {
  const clamped = Math.max(-range, Math.min(range, value));
  const alpha = Math.max(0.06, Math.min(1, Math.abs(clamped) / range));
  const accent = clamped < 0 ? "184, 88, 58" : "45, 90, 107"; // correction | primary
  return { background: `rgba(${accent}, ${alpha})` };
}

function positiveIntensity(value: number, range = 4): React.CSSProperties {
  const v = Math.max(0, Math.min(range, value));
  const alpha = Math.max(0.08, v / range);
  return { background: `rgba(45, 90, 107, ${alpha})` };
}

export function CnnLab() {
  const { kernelMode, setKernelMode, grid, setGrid } = useModule5Lab();
  const kernel = kernelMode === "vertical" ? VERTICAL_EDGE_KERNEL : HORIZONTAL_EDGE_KERNEL;

  const convolved = useMemo(() => convolve(grid, kernel), [grid, kernel]);
  const activated = useMemo(() => applyRelu(convolved), [convolved]);
  const pooled = useMemo(() => maxPool2x2(activated), [activated]);
  const strongest = Math.max(...pooled.flat());

  const toggleCell = (row: number, col: number) => {
    setGrid(
      grid.map((r, ri) =>
        r.map((v, ci) => (ri === row && ci === col ? (v === 1 ? 0 : 1) : v)),
      ),
    );
  };

  return (
    <div className="lab-surface">
      <div className="lab-surface__controls">
        <button
          type="button" className="mini-switch"
          data-active={kernelMode === "vertical"}
          onClick={() => setKernelMode("vertical")}
          aria-pressed={kernelMode === "vertical"}
        >Vertical edge</button>
        <button
          type="button" className="mini-switch"
          data-active={kernelMode === "horizontal"}
          onClick={() => setKernelMode("horizontal")}
          aria-pressed={kernelMode === "horizontal"}
        >Horizontal edge</button>
        <button type="button" className="mini-switch" onClick={() => setGrid(GRID_PRESETS.vertical.map((r) => [...r]))}>
          Load vertical stripe
        </button>
        <button type="button" className="mini-switch" onClick={() => setGrid(GRID_PRESETS.horizontal.map((r) => [...r]))}>
          Load horizontal stripe
        </button>
        <button type="button" className="mini-switch" onClick={() => setGrid(GRID_PRESETS.blank.map((r) => [...r]))}>
          Clear
        </button>
      </div>

      <div className="cnn-grid">
        <div className="cnn-stage">
          <span className="kicker">Input · 6×6</span>
          <div className="matrix">
            {grid.map((row, ri) =>
              row.map((v, ci) => (
                <button
                  key={`in-${ri}-${ci}`}
                  type="button"
                  className="matrix-cell"
                  data-on={v === 1}
                  aria-label={`Row ${ri + 1} col ${ci + 1}, ${v === 1 ? "on" : "off"}`}
                  onClick={() => toggleCell(ri, ci)}
                />
              )),
            )}
          </div>
        </div>

        <div className="cnn-stage">
          <span className="kicker">Kernel · 3×3</span>
          <div className="mini-matrix">
            {kernel.flat().map((value, i) => (
              <span key={`k-${i}`} className="mini-matrix__cell tabular">{value}</span>
            ))}
          </div>
          <p className="lab-surface__caption">
            Filter slides across the input, dot-products each 3×3 patch. Output size = (6 − 3 + 1) = 4.
          </p>
        </div>

        <div className="cnn-stage">
          <span className="kicker">Conv output · 4×4</span>
          <div className="mini-matrix mini-matrix--wide">
            {convolved.flat().map((value, i) => (
              <span
                key={`c-${i}`}
                className="mini-matrix__cell tabular"
                style={intensityStyle(value)}
              >
                {value}
              </span>
            ))}
          </div>
        </div>

        <div className="cnn-stage">
          <span className="kicker">ReLU + 2×2 pool · 2×2</span>
          <div className="mini-matrix">
            {pooled.flat().map((value, i) => (
              <span
                key={`p-${i}`}
                className="mini-matrix__cell tabular"
                style={positiveIntensity(value)}
              >
                {value}
              </span>
            ))}
          </div>
          <p className="lab-surface__caption tabular">
            Strongest surviving feature: <strong>{strongest}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
