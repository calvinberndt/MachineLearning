"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/module-3", label: "Module 3" },
  { href: "/module-4", label: "Module 4" },
  { href: "/module-5", label: "Module 5" },
  { href: "/quiz", label: "Quiz" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header" aria-label="Primary">
      <Link className="site-mark" href="/">
        <span className="site-mark__kicker">COMP&nbsp;SCI&nbsp;465</span>
        <span className="site-mark__title">ML Study Lab</span>
      </Link>
      <nav className="site-nav" aria-label="Main navigation">
        {NAV.map((item) => {
          const active = item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className="site-link"
              data-active={active}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
