"use client";

import { motion } from "framer-motion";
import { theme } from "@/lib/theme";

interface ConfusionMatrixProps {
  matrix: number[][];
  labels: string[];
  title?: string;
}

export function ConfusionMatrix({ matrix, labels, title }: ConfusionMatrixProps) {
  const maxVal = Math.max(...matrix.flat());

  return (
    <div>
      {title && <h3 className="text-sm font-semibold mb-3 opacity-60">{title}</h3>}
      <div
        className="p-4 rounded-lg"
        style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
      >
        <div className="text-xs text-center mb-2 opacity-50">Predicted</div>
        <div className="flex">
          <div
            className="flex flex-col justify-center items-center mr-2"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            <span className="text-xs opacity-50">Actual</span>
          </div>
          <div className="flex-1">
            {/* Column headers */}
            <div className="flex ml-20 mb-1">
              {labels.map((l) => (
                <div key={l} className="flex-1 text-center text-xs opacity-60 truncate px-1">
                  {l}
                </div>
              ))}
            </div>
            {/* Rows */}
            {matrix.map((row, i) => (
              <div key={i} className="flex items-center mb-1">
                <div className="w-20 text-right pr-3 text-xs opacity-60 truncate">{labels[i]}</div>
                {row.map((val, j) => {
                  const intensity = val / maxVal;
                  const isDiag = i === j;
                  const bgColor = isDiag
                    ? `rgba(84, 224, 61, ${0.1 + intensity * 0.5})`
                    : `rgba(234, 118, 0, ${0.05 + intensity * 0.3})`;
                  return (
                    <motion.div
                      key={j}
                      className="flex-1 mx-0.5 rounded text-center py-3 font-mono font-bold text-sm"
                      style={{ background: bgColor }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: (i * row.length + j) * 0.1, duration: 0.4 }}
                    >
                      {val}
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
