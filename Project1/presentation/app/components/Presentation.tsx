"use client";

import { useState, useEffect, useCallback, type ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { theme } from "@/lib/theme";

export interface SlideProps {
  step: number;
}

interface SlideEntry {
  element: ReactElement<SlideProps>;
  steps: number;
}

export function Presentation({ slides }: { slides: SlideEntry[] }) {
  const [current, setCurrent] = useState(0);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const total = slides.length;

  const next = useCallback(() => {
    const s = slides[current];
    if (step < s.steps - 1) {
      setStep((v) => v + 1);
    } else if (current < total - 1) {
      setDirection(1);
      setCurrent((v) => v + 1);
      setStep(0);
    }
  }, [current, step, slides, total]);

  const prev = useCallback(() => {
    if (step > 0) {
      setStep((v) => v - 1);
    } else if (current > 0) {
      setDirection(-1);
      setCurrent((v) => v - 1);
      setStep(slides[current - 1].steps - 1);
    }
  }, [current, step, slides]);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
      if (e.key === "f" || e.key === "F") {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen?.();
        } else {
          document.exitFullscreen?.();
        }
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const progress = ((current + 1) / total) * 100;

  const slideVariants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
  };

  return (
    <div
      className="h-screen w-screen flex flex-col overflow-hidden select-none"
      style={{ background: theme.bg, color: theme.text }}
      onClick={next}
    >
      {/* Header */}
      <header
        className="h-10 flex items-center justify-between px-8 shrink-0"
        style={{ background: theme.gradient }}
      >
        <span className="text-sm font-bold tracking-wide opacity-90">
          COMP SCI 465 | Machine Learning
        </span>
        <span className="text-xs font-mono opacity-60">
          {current + 1} / {total}
        </span>
      </header>

      {/* Slide area */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0 flex items-center justify-center p-6 px-10"
          >
            <div className="w-full max-w-7xl">
              {/* Clone the slide element and inject step prop */}
              {(() => {
                const { element } = slides[current];
                const Component = element.type as React.ComponentType<SlideProps>;
                return <Component {...element.props} step={step} />;
              })()}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="h-8 flex items-center justify-between px-8 shrink-0 opacity-50 text-xs">
        <span>Calvin Berndt | UW-Green Bay | Spring 2026</span>
        <div className="flex items-center gap-4">
          <span className="opacity-60">Press F for fullscreen</span>
          <div
            className="w-48 h-1 rounded-full overflow-hidden"
            style={{ background: theme.cardBg }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: theme.accent1 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
