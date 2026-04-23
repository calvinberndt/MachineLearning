"use client";

import { useModule3Lab } from "./lab-context";
import { plotX, plotY } from "./plot-utils";

type SvmSample = { id: string; x: number; y: number; label: "0" | "1" };

const samples: SvmSample[] = [
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

const RBF_CURVE = "M 154 34 C 236 68 258 132 244 198 C 228 250 188 262 134 244";

export function SvmLab() {
  const { kernel, setKernel, cValue, setCValue } = useModule3Lab();
  const linearBoundary = plotX(6.5, 12);
  const linearMargin = 52 - cValue * 18;
  const rbfHalo = 60 - cValue * 14;

  return (
    <div className="lab-surface">
      <div className="lab-surface__controls">
        <button
          className="mini-switch" type="button"
          data-active={kernel === "linear"}
          onClick={() => setKernel("linear")}
          aria-pressed={kernel === "linear"}
        >Linear kernel</button>
        <button
          className="mini-switch" type="button"
          data-active={kernel === "rbf"}
          onClick={() => setKernel("rbf")}
          aria-pressed={kernel === "rbf"}
        >RBF kernel</button>
        <label className="range-field">
          <span>C</span>
          <input
            type="range" min="0.4" max="2" step="0.1"
            value={cValue}
            onChange={(e) => setCValue(Number(e.target.value))}
            aria-label="Regularization parameter C"
          />
          <span className="tabular">{cValue.toFixed(1)}</span>
        </label>
      </div>

      <svg className="plot" viewBox="0 0 420 280" role="img" aria-label="SVM decision boundary">
        <line x1="36" y1="252" x2="392" y2="252" className="axis-line" />
        <line x1="36" y1="252" x2="36" y2="28" className="axis-line" />

        {kernel === "linear" ? (
          <>
            <rect className="margin-band" x={linearBoundary - linearMargin / 2} y="36" width={linearMargin} height="208" rx="24" />
            <line className="decision-line" x1={linearBoundary} x2={linearBoundary} y1="34" y2="246" />
          </>
        ) : (
          <>
            <path className="margin-path" d={RBF_CURVE} style={{ strokeWidth: rbfHalo }} />
            <path className="decision-curve" d={RBF_CURVE} />
          </>
        )}

        {samples.map((s) => {
          const isSupport = ["p5", "p6", "p7"].includes(s.id);
          return (
            <g key={s.id} transform={`translate(${plotX(s.x, 12)}, ${plotY(s.y, 8)})`}>
              <circle className={`plot-point plot-point--${s.label === "0" ? "amber" : "teal"}`} r={isSupport ? 11 : 8} />
              {isSupport ? <circle className="support-ring" r="16" /> : null}
            </g>
          );
        })}
      </svg>

      <p className="lab-surface__caption">
        <span className="kicker">C = {cValue.toFixed(1)}</span>
        {kernel === "linear"
          ? "Linear kernel with the widest safe margin. Larger C shrinks the margin (harder, less regularised)."
          : "RBF kernel bends the boundary. γ controls each training point's influence radius."}
      </p>
    </div>
  );
}
