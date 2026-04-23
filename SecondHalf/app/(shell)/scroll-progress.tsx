"use client";

import { useEffect, useRef } from "react";
import { computeScrollProgress } from "./scroll-progress-math";

export function ScrollProgress() {
  const fillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = fillRef.current;
    if (!el) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const progress = computeScrollProgress({ scrollTop, scrollHeight, clientHeight });
      el.style.transform = `scaleX(${progress})`;
    };

    const onScroll = () => {
      if (raf === 0) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="scroll-progress" role="presentation" aria-hidden="true">
      <div ref={fillRef} className="scroll-progress__fill" />
    </div>
  );
}
