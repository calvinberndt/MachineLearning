"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid,
} from "recharts";
import { theme } from "@/lib/theme";
import { K_VALUES } from "@/lib/data";

interface KnnAccuracyChartProps {
  accuracies: number[];
  bestK: number;
  title: string;
  domainMin?: number;
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { k: string; acc: number } }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const isOptimal = d.acc === Math.max(...payload.map((p) => p.payload.acc));
  return (
    <div
      className="px-3 py-2 rounded-lg text-xs shadow-lg"
      style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
    >
      <p className="font-bold text-sm">{d.k}</p>
      <p style={{ color: isOptimal ? theme.accent2 : theme.accent1 }}>
        Accuracy: {(d.acc * 100).toFixed(2)}%
      </p>
    </div>
  );
}

export function KnnAccuracyChart({ accuracies, bestK, title, domainMin = 0.6 }: KnnAccuracyChartProps) {
  const bestAcc = Math.max(...accuracies);
  const data = K_VALUES.map((k, i) => ({
    k: `K=${k}`,
    acc: accuracies[i],
    isOptimal: accuracies[i] === bestAcc,
  }));

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3 opacity-60">{title}</h3>
      <div
        className="p-4 rounded-lg"
        style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
      >
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(84,224,61,0.08)" />
            <XAxis
              dataKey="k"
              tick={{ fill: theme.text, fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <YAxis
              domain={[domainMin, 1.02]}
              tick={{ fill: theme.text, fontSize: 11 }}
              tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="acc" radius={[4, 4, 0, 0]} animationDuration={1200}>
              {data.map((d, i) => (
                <Cell
                  key={i}
                  fill={d.isOptimal ? theme.accent2 : theme.accent1}
                  style={
                    d.isOptimal
                      ? { filter: `drop-shadow(0 0 8px ${theme.accent2}80)` }
                      : undefined
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-5 mt-3 text-xs opacity-70">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm" style={{ background: theme.accent1 }} />
          Standard
        </span>
        <span className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-sm"
            style={{ background: theme.accent2, boxShadow: `0 0 6px ${theme.accent2}60` }}
          />
          Optimal (K={bestK})
        </span>
      </div>
    </div>
  );
}
