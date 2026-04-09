import type { Metadata } from "next";
import { Module3Lab } from "./study-lab";

export const metadata: Metadata = {
  title: "Module 3 | ML Second Half Study Lab",
  description: "Interactive study page for clustering, KNN, and SVM.",
};

export default function Module3Page() {
  return <Module3Lab />;
}
