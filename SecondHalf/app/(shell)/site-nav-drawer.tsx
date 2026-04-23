"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

type ModuleEntry = {
  label: string;
  kicker: string;
  href: string;
  sections?: Array<{ id: string; label: string }>;
};

const MODULES: ModuleEntry[] = [
  {
    label: "Module 3",
    kicker: "Unsupervised + nearby classifiers",
    href: "/module-3",
    sections: [
      { id: "s-3-1-k-means", label: "§3.1 K-means" },
      { id: "s-3-2-k-nearest-neighbors", label: "§3.2 KNN" },
      { id: "s-3-3-support-vector-machines", label: "§3.3 SVM" },
    ],
  },
  {
    label: "Module 4",
    kicker: "Ensemble learning + random forests",
    href: "/module-4",
  },
  {
    label: "Module 5",
    kicker: "Deep learning, NLP, CNNs",
    href: "/module-5",
  },
  {
    label: "Quiz",
    kicker: "Practice exam generator",
    href: "/quiz",
  },
];

export function SiteNavDrawer() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const labelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const firstLink = panelRef.current?.querySelector<HTMLAnchorElement>("a[href]");
    firstLink?.focus();
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="site-mark"
        aria-expanded={open}
        aria-controls={labelId}
        aria-haspopup="dialog"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="site-mark__kicker">COMP&nbsp;SCI&nbsp;465</span>
        <span className="site-mark__title">ML Study Lab</span>
        <span className="site-mark__chevron" aria-hidden="true">{open ? "▾" : "▸"}</span>
      </button>

      {open ? (
        <div
          className="nav-drawer-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      <aside
        id={labelId}
        ref={panelRef}
        className="nav-drawer"
        data-open={open}
        aria-label="Course navigation"
        aria-hidden={!open}
        inert={open ? undefined : true}
      >
        <header className="nav-drawer__head">
          <p className="nav-drawer__kicker">COMP&nbsp;SCI&nbsp;465</p>
          <p className="nav-drawer__title">ML Study Lab</p>
          <button
            type="button"
            className="nav-drawer__close"
            aria-label="Close navigation"
            onClick={() => {
              setOpen(false);
              buttonRef.current?.focus();
            }}
          >
            ×
          </button>
        </header>

        <nav
          className="nav-drawer__nav"
          aria-label="All modules"
          onClick={(event) => {
            const target = event.target as HTMLElement;
            if (target.closest("a[href]")) setOpen(false);
          }}
        >
          {MODULES.map((entry) => {
            const onModule = entry.href === "/"
              ? pathname === "/"
              : pathname === entry.href || pathname.startsWith(entry.href + "/");
            return (
              <section key={entry.href} className="nav-drawer__group">
                <Link
                  href={entry.href}
                  className="nav-drawer__module"
                  data-active={onModule}
                  aria-current={onModule ? "page" : undefined}
                >
                  <span className="nav-drawer__module-label">{entry.label}</span>
                  <span className="nav-drawer__module-kicker">{entry.kicker}</span>
                </Link>
                {entry.sections ? (
                  <ul className="nav-drawer__sections">
                    {entry.sections.map((section) => (
                      <li key={section.id}>
                        <Link
                          href={`${entry.href}#${section.id}`}
                          className="nav-drawer__section"
                        >
                          {section.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            );
          })}
        </nav>

        <footer className="nav-drawer__foot">
          <Link
            href="/"
            className="nav-drawer__home"
            data-active={pathname === "/"}
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
        </footer>
      </aside>
    </>
  );
}
