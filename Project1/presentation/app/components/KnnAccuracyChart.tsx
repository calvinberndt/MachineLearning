"use client";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceDot,
} from "recharts";
import { theme } from "@/lib/theme";
import { K_VALUES } from "@/lib/data";

interface KnnAccuracyChartProps {
  accuracies: number[];
  bestK: number;
  title: string;
  domainMin?: number;
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { k: string; acc: number; kNum: number } }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      className="px-3 py-2 rounded-lg text-xs shadow-lg"
      style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
    >
      <p className="font-bold text-sm">{d.k}</p>
      <p style={{ color: theme.accent1 }}>
        Accuracy: {(d.acc * 100).toFixed(2)}%
      </p>
    </div>
  );
}

export function KnnAccuracyChart({ accuracies, bestK, title, domainMin = 0.6 }: KnnAccuracyChartProps) {
  const bestAcc = Math.max(...accuracies);
  const bestIdx = accuracies.indexOf(bestAcc);
  const data = K_VALUES.map((k, i) => ({
    k: `K=${k}`,
    kNum: k,
    acc: accuracies[i],
  }));

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3 opacity-60">{title}</h3>
      <div
        className="p-4 rounded-lg"
        style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
      >
        <ResponsiveContainer width="100%" height={200} className="sm:!h-[260px]">
          <LineChart data={data} margin={{ top: 12, right: 12, bottom: 0, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(84,224,61,0.08)" />
            <XAxis
              dataKey="k"
              tick={{ fill: theme.text, fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <YAxis
              domain={[domainMin, 1.0]}
              tick={{ fill: theme.text, fontSize: 11 }}
              tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <Tooltip content={<ChartTooltip />} />
            <Line
              type="monotone"
              dataKey="acc"
              stroke={theme.accent1}
              strokeWidth={2.5}
              dot={{ r: 5, fill: theme.accent1, stroke: theme.cardBg, strokeWidth: 2 }}
              activeDot={{ r: 7, fill: theme.accent1, stroke: theme.accent1, strokeWidth: 2, style: { filter: `drop-shadow(0 0 6px ${theme.accent1}80)` } }}
              animationDuration={1500}
            />
            {/* Highlight the optimal K point */}
            <ReferenceDot
              x={data[bestIdx].k}
              y={bestAcc}
              r={8}
              fill={theme.accent2}
              stroke={theme.accent2}
              strokeWidth={2}
              style={{ filter: `drop-shadow(0 0 10px ${theme.accent2}aa)` }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-5 mt-3 text-xs opacity-70">
        <span className="flex items-center gap-2">
          <span className="w-3 h-0.5 rounded-full" style={{ background: theme.accent1 }} />
          <span className="w-2 h-2 rounded-full" style={{ background: theme.accent1 }} />
          Accuracy
        </span>
        <span className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: theme.accent2, boxShadow: `0 0 6px ${theme.accent2}60` }}
          />
          Optimal (K={bestK})
        </span>
      </div>
    </div>
  );
}
