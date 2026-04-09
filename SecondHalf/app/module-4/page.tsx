import type { Metadata } from "next";
import { Module4Lab } from "./study-lab";

export const metadata: Metadata = {
  title: "Module 4 | ML Second Half Study Lab",
  description: "Interactive study page for ensemble learning and random forests.",
};

export default function Module4Page() {
  return <Module4Lab />;
}
