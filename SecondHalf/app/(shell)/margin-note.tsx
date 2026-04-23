import type { ReactNode } from "react";

type MarginNoteVariant = "citation" | "correction" | "aside";

const LABELS: Record<MarginNoteVariant, string> = {
  citation: "Citation",
  correction: "Watch out",
  aside: "Aside",
};

export function MarginNote({
  variant = "aside",
  label,
  children,
}: {
  variant?: MarginNoteVariant;
  label?: string;
  children: ReactNode;
}) {
  return (
    <aside className="margin-note" data-variant={variant}>
      <span className="margin-note__label">{label ?? LABELS[variant]}</span>
      <div className="margin-note__body">{children}</div>
    </aside>
  );
}
