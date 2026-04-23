import type { Metadata } from "next";
import { PageShell } from "../(shell)/page-shell";
import { SourceTrail, sourceGroups } from "../source-trail";
import { Module3Content } from "./study-lab";

export const metadata: Metadata = {
  title: "Module 3 · ML Study Lab",
  description:
    "Unsupervised learning and nearby classifiers — K-means, K-Nearest Neighbors, and Support Vector Machines.",
};

const TOC = [
  {
    label: "Module 3",
    items: [
      { id: "s-3-1-k-means", label: "§3.1 K-means" },
      { id: "s-3-2-k-nearest-neighbors", label: "§3.2 KNN" },
      { id: "s-3-3-support-vector-machines", label: "§3.3 SVM" },
    ],
  },
];

export default function Module3Page() {
  return (
    <PageShell moduleLabel="Module 3" moduleTone="module-3" tocGroups={TOC}>
      <section className="module-hero">
        <p className="module-hero__kicker">Module 3 · Unsupervised learning</p>
        <h1 className="module-hero__title">Finding structure in data — with labels, and without.</h1>
        <p className="module-hero__deck">
          K-means groups unlabeled points by proximity. KNN and SVM are supervised classifiers that also
          organise points in space — but from labelled training examples. Your Canvas notes group all three
          together because the geometric intuition carries across them.
        </p>
      </section>

      <Module3Content />

      <SourceTrail title="Module 3 source trail" sources={sourceGroups.module3} />
    </PageShell>
  );
}
