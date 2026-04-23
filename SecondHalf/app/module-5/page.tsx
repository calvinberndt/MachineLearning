import type { Metadata } from "next";
import { Module5Lab } from "./study-lab";

export const metadata: Metadata = {
  title: "Module 5 | ML Second Half Study Lab",
  description: "Interactive study page for deep learning, NLP, and CNNs.",
};

export default function Module5Page() {
  return <Module5Lab />;
}
