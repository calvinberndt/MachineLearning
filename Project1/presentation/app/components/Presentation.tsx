"use client";

import { useState, useEffect, useCallback, useRef, type ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { theme } from "@/lib/theme";

export interface SlideProps {
  step: number;
}

export interface SlideEntry {
  element: ReactElement<SlideProps>;
  steps: number;
  title: string;
}

export function Presentation({ slides }: { slides: SlideEntry[] }) {
  const [current, setCurrent] = useState(0);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [numBuffer, setNumBuffer] = useState("");
  const numTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const total = slides.length;

  const goTo = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(total - 1, idx));
    setDirection(clamped > current ? 1 : -1);
    setCurrent(clamped);
    setStep(0);
    setMenuOpen(false);
  }, [current, total]);

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
      // Close menu on Escape
      if (e.key === "Escape") {
        setMenuOpen(false);
        setNumBuffer("");
        return;
      }

      // Number key input for slide jumping
      if (e.key >= "0" && e.key <= "9" && !menuOpen) {
        e.preventDefault();
        const next = numBuffer + e.key;
        setNumBuffer(next);
        if (numTimer.current) clearTimeout(numTimer.current);
        numTimer.current = setTimeout(() => setNumBuffer(""), 1500);
        return;
      }

      // Enter confirms number jump
      if (e.key === "Enter" && numBuffer) {
        e.preventDefault();
        const target = parseInt(numBuffer, 10) - 1;
        goTo(target);
        setNumBuffer("");
        if (numTimer.current) clearTimeout(numTimer.current);
        return;
      }

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
      if (e.key === "g" || e.key === "G") {
        setMenuOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, goTo, numBuffer, menuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

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
      onClick={(e) => {
        // Don't advance slide if clicking on the menu area
        if (menuRef.current?.contains(e.target as Node)) return;
        if (menuOpen) { setMenuOpen(false); return; }
        next();
      }}
    >
      {/* Header */}
      <header
        className="h-10 flex items-center justify-between px-8 shrink-0 relative z-20"
        style={{ background: theme.gradient }}
      >
        <span className="text-sm font-bold tracking-wide opacity-90">
          COMP SCI 465 | Machine Learning
        </span>

        {/* Clickable slide counter + dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            className="text-xs font-mono opacity-60 hover:opacity-100 transition-opacity cursor-pointer px-2 py-1 rounded"
            style={{ background: menuOpen ? "rgba(255,255,255,0.1)" : "transparent" }}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
          >
            {current + 1} / {total} ▾
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-1 rounded-lg overflow-hidden shadow-2xl"
                style={{
                  background: theme.cardBg,
                  border: `1px solid ${theme.cardBorder}`,
                  minWidth: 240,
                }}
              >
                {slides.map((s, i) => (
                  <button
                    key={i}
                    className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors"
                    style={{
                      background: i === current ? `${theme.accent1}15` : "transparent",
                      color: i === current ? theme.accent1 : theme.text,
                    }}
                    onMouseEnter={(e) => {
                      if (i !== current) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      if (i !== current) e.currentTarget.style.background = "transparent";
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      goTo(i);
                    }}
                  >
                    <span className="font-mono text-xs opacity-50 w-5 text-right">{i + 1}</span>
                    <span className={i === current ? "font-semibold" : "opacity-70"}>{s.title}</span>
                    {i === current && (
                      <span className="ml-auto text-xs opacity-40">●</span>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Number input indicator */}
      <AnimatePresence>
        {numBuffer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-16 right-8 z-30 px-4 py-2 rounded-lg font-mono text-lg"
            style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
          >
            Go to slide: <span style={{ color: theme.accent1 }}>{numBuffer}</span>
            <span className="text-xs opacity-40 ml-2">Enter ↵</span>
          </motion.div>
        )}
      </AnimatePresence>

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
            className="absolute inset-0 flex items-center justify-center py-4 px-8"
          >
            <div className="w-full max-w-[1400px]">
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
          <span className="opacity-60">F fullscreen · G menu · # Enter jump</span>
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
