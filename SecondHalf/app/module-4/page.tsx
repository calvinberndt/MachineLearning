import type { Metadata } from "next";
import { PageShell } from "../(shell)/page-shell";
import { SourceTrail, sourceGroups } from "../source-trail";
import { Module4LabProvider } from "./labs/lab-context";
import { ConceptEnsembles } from "./concept-ensembles";
import { ConceptRandomForest } from "./concept-random-forest";

export const metadata: Metadata = {
  title: "Module 4 · ML Study Lab",
  description:
    "Ensemble learning and random forests — bagging, boosting, stacking, voting, and the specifics of Random Forest.",
};

const TOC = [
  {
    label: "Module 4",
    items: [
      { id: "s-4-1-ensemble-methods", label: "§4.1 Ensembles" },
      { id: "s-4-2-random-forest", label: "§4.2 Random Forest" },
    ],
  },
];

export default function Module4Page() {
  return (
    <PageShell moduleLabel="Module 4" moduleTone="module-4" tocGroups={TOC}>
      <section className="module-hero">
        <p className="module-hero__kicker">Module 4 · Ensemble learning</p>
        <h1 className="module-hero__title">Many wobbly learners, one steady prediction.</h1>
        <p className="module-hero__deck">
          A single decision tree is expressive but unstable — small changes in the training data can shift its
          splits dramatically. Ensembles average or sequence many such learners so the idiosyncratic mistakes
          cancel. Random Forest is the canonical bagging ensemble; boosting (AdaBoost, gradient boosting) and
          stacking are its better-known cousins.
        </p>
      </section>

      <Module4LabProvider>
        <ConceptEnsembles />
        <ConceptRandomForest />
      </Module4LabProvider>

      <SourceTrail title="Module 4 source trail" sources={sourceGroups.module4} />
    </PageShell>
  );
}
