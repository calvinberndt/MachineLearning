import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteHeader } from "./(shell)/header";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "variable",
  axes: ["SOFT", "opsz"],
  display: "swap",
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ML Second Half Study Lab",
  description:
    "A whiteboard-style study lab for machine learning — Module 3 (clustering, KNN, SVM), Module 4 (ensembles), Module 6 (deep learning, NLP, CNNs) — grounded in COMP SCI 465 Canvas notes.",
};

export const viewport: Viewport = {
  themeColor: "#fbf7ee",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <div className="site-shell">
          <SiteHeader />
          <main id="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
