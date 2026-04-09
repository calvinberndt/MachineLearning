"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Overview" },
  { href: "/module-3", label: "Module 3" },
  { href: "/module-4", label: "Module 4" },
  { href: "/module-6", label: "Module 6" },
  { href: "/quiz", label: "Quiz" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <Link className="site-mark" href="/">
        <span className="site-mark__kicker">COMP SCI 465</span>
        <span className="site-mark__title">Second Half Study Lab</span>
      </Link>

      <div className="site-header__meta">
        <span className="site-badge">Spring 2026</span>
        <nav className="site-nav" aria-label="Primary">
          {navLinks.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                className="site-link"
                data-active={isActive}
                href={link.href}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
