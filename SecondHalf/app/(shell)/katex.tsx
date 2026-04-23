"use client";

import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

function renderIntoElement(
  el: HTMLElement,
  latex: string,
  displayMode: boolean,
): void {
  try {
    katex.render(latex, el, {
      displayMode,
      throwOnError: false,
      output: "html",
    });
  } catch {
    el.replaceChildren();
    const fallback = document.createElement("code");
    fallback.className = "katex-fallback";
    fallback.textContent = latex;
    el.appendChild(fallback);
  }
}

export function InlineMath({ children }: { children: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    if (ref.current) renderIntoElement(ref.current, children, false);
  }, [children]);
  return <span ref={ref} className="math-inline" />;
}

export function BlockMath({
  children,
  ariaLabel,
}: {
  children: string;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (ref.current) renderIntoElement(ref.current, children, true);
  }, [children]);
  return <div ref={ref} className="math-block" role="math" aria-label={ariaLabel} />;
}
