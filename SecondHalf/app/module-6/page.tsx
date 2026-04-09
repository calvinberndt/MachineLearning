import type { Metadata } from "next";
import { Module6Lab } from "./study-lab";

export const metadata: Metadata = {
  title: "Module 6 | ML Second Half Study Lab",
  description: "Interactive study page for deep learning, NLP, and CNNs.",
};

export default function Module6Page() {
  return <Module6Lab />;
}
