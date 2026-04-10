"use client";

import { useEffect, useRef } from "react";
import { animate } from "framer-motion";

interface AnimatedValueProps {
  value: number;
  suffix?: string;
  decimals?: number;
  color?: string;
  className?: string;
  active?: boolean;
}

export function AnimatedValue({
  value,
  suffix = "%",
  decimals = 1,
  color,
  className = "text-4xl font-bold font-mono",
  active = true,
}: AnimatedValueProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current || !active) return;
    const ctrl = animate(0, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) {
          ref.current.textContent = v.toFixed(decimals) + suffix;
        }
      },
    });
    return () => ctrl.stop();
  }, [value, suffix, decimals, active]);

  return (
    <span ref={ref} className={className} style={{ color }}>
      {active ? "0" + suffix : value.toFixed(decimals) + suffix}
    </span>
  );
}
