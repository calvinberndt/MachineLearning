"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type TocGroup = {
  label: string;
  items: Array<{ id: string; label: string; href?: string }>;
};

export function Sidebar({
  moduleLabel,
  groups,
  ariaLabel = "On this page",
}: {
  moduleLabel?: string;
  groups: TocGroup[];
  ariaLabel?: string;
}) {
  const allIds = groups.flatMap((g) => g.items.map((i) => i.id)).filter(Boolean);
  const [active, setActive] = useState<string | null>(allIds[0] ?? null);

  useEffect(() => {
    if (allIds.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 1] },
    );

    for (const id of allIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [allIds.join("|")]);

  const tocContent = (
    <>
      {moduleLabel ? <p className="sidebar__module">{moduleLabel}</p> : null}
      {groups.map((group) => (
        <div key={group.label} className="sidebar__group">
          <p className="sidebar__group-label">{group.label}</p>
          <ul className="sidebar__list">
            {group.items.map((item) => {
              const href = item.href ?? `#${item.id}`;
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <Link
                    href={href}
                    className="sidebar__link"
                    data-active={isActive}
                    aria-current={isActive ? "location" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );

  return (
    <aside className="sidebar" aria-label={ariaLabel}>
      {/* On narrow phones this renders as a collapsible disclosure */}
      <details className="sidebar__details">
        <summary className="sidebar__summary">
          {moduleLabel ?? "On this page"}
        </summary>
        {tocContent}
      </details>
      {/* Desktop / tablet — visible always (details hidden via CSS) */}
      <div className="sidebar__always" aria-hidden="true">
        {tocContent}
      </div>
    </aside>
  );
}
