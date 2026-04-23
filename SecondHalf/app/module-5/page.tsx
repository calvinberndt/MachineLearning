import type { Metadata } from "next";
import { PageShell } from "../(shell)/page-shell";
import { SourceTrail, sourceGroups } from "../source-trail";
import { Module5LabProvider } from "./labs/lab-context";
import { ConceptNeuralNetworks } from "./concept-neural-networks";
import { ConceptNlpPipeline } from "./concept-nlp-pipeline";
import { ConceptCnn } from "./concept-cnn";

export const metadata: Metadata = {
  title: "Module 5 · ML Study Lab",
  description:
    "Deep learning, NLP pipelines, and CNNs — forward/backward pass, classroom tokenisation pipeline, and the Conv → ReLU → Pool block.",
};

const TOC = [
  {
    label: "Module 5",
    items: [
      { id: "s-5-1-neural-networks", label: "§5.1 Neural networks" },
      { id: "s-5-2-nlp-pipeline", label: "§5.2 NLP pipeline" },
      { id: "s-5-3-convolutional-neural-networks", label: "§5.3 CNNs" },
    ],
  },
];

export default function Module5Page() {
  return (
    <PageShell moduleLabel="Module 5" moduleTone="module-5" tocGroups={TOC}>
      <section className="module-hero">
        <p className="module-hero__kicker">Module 5 · Deep learning</p>
        <h1 className="module-hero__title">Representations that learn themselves.</h1>
        <p className="module-hero__deck">
          A neural network chains affine transformations with non-linear activations — stacked deep enough, it
          learns useful features directly from raw input. NLP pipelines and CNNs show the idea applied to text
          and to pixel grids. Each lab below lets you watch the representation change under your hands.
        </p>
      </section>

      <Module5LabProvider>
        <ConceptNeuralNetworks />
        <ConceptNlpPipeline />
        <ConceptCnn />
      </Module5LabProvider>

      <SourceTrail title="Module 5 source trail" sources={sourceGroups.module5} />
    </PageShell>
  );
}
