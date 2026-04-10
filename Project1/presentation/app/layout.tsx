import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ML Classification Project — Calvin Berndt",
  description: "Supervised Classification Algorithm Comparison: KNN vs SVM vs Decision Tree",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
