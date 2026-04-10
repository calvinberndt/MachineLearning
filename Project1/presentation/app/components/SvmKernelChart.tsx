"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, LabelList,
} from "recharts";
import { theme } from "@/lib/theme";

interface Kernel {
  name: string;
  accuracy: number;
}

interface SvmKernelChartProps {
  kernels: Kernel[];
  bestKernel: string;
  title: string;
  domainMin?: number;
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: Kernel }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      className="px-3 py-2 rounded-lg text-xs shadow-lg"
      style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
    >
      <p className="font-bold text-sm">{d.name} Kernel</p>
      <p style={{ color: theme.accent1 }}>
        Accuracy: {(d.accuracy * 100).toFixed(2)}%
      </p>
    </div>
  );
}

export function SvmKernelChart({ kernels, bestKernel, title, domainMin = 0.7 }: SvmKernelChartProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3 opacity-60">{title}</h3>
      <div
        className="p-4 rounded-lg"
        style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
      >
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={kernels} margin={{ top: 24, right: 8, bottom: 0, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(84,224,61,0.08)" />
            <XAxis
              dataKey="name"
              tick={{ fill: theme.text, fontSize: 12 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <YAxis
              domain={[domainMin, 1.0]}
              tick={{ fill: theme.text, fontSize: 11 }}
              tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="accuracy" radius={[4, 4, 0, 0]} animationDuration={1000}>
              {kernels.map((k) => (
                <Cell
                  key={k.name}
                  fill={k.name === bestKernel ? theme.accent2 : theme.accent3}
                  style={
                    k.name === bestKernel
                      ? { filter: `drop-shadow(0 0 8px ${theme.accent2}80)` }
                      : undefined
                  }
                />
              ))}
              <LabelList
                dataKey="accuracy"
                position="top"
                formatter={(v: number) => `${(v * 100).toFixed(2)}%`}
                style={{ fill: theme.text, fontSize: 13, fontWeight: 700, fontFamily: "monospace" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
