import type { Metadata } from "next";
import { PageShell } from "../(shell)/page-shell";
import { SourceTrail, sourceGroups } from "../source-trail";
import { ConceptEvaluationAndReliability } from "./concept-evaluation-and-reliability";
import { ConceptOpenAiTools } from "./concept-openai-tools";
import { ConceptTransformersAndTraining } from "./concept-transformers-and-training";
import { ConceptLlmLandscape } from "./concept-llm-landscape";
import { Module6LabProvider } from "./labs/lab-context";

export const metadata: Metadata = {
  title: "Module 6 · ML Study Lab",
  description:
    "OpenAI tools, transformer attention and training, the LLM landscape, and evaluation reliability labs.",
};

const TOC = [
  {
    label: "Module 6",
    items: [
      { id: "s-6-1-openai-tools", label: "§6.1 OpenAI tools" },
      { id: "s-6-2-transformers-and-training", label: "§6.2 Transformers" },
      { id: "s-6-3-llm-landscape", label: "§6.3 LLM landscape" },
      { id: "s-6-4-evaluation-and-reliability", label: "§6.4 Evaluation" },
    ],
  },
];

export default function Module6Page() {
  return (
    <PageShell moduleLabel="Module 6" moduleTone="module-6" tocGroups={TOC}>
      <section className="module-hero">
        <p className="module-hero__kicker">Module 6 · OpenAI &amp; Large Language Models</p>
        <h1 className="module-hero__title">From transformer cores to usable AI systems.</h1>
        <p className="module-hero__deck">
          OpenAI tools sit on top of tokenizers, embeddings, transformer attention, staged training, alignment,
          serving infrastructure, and evaluation checks. This module keeps the model-level ideas separate from
          the product system so architecture and deployment questions stay clean.
        </p>
      </section>

      <Module6LabProvider>
        <ConceptOpenAiTools />
        <ConceptTransformersAndTraining />
        <ConceptLlmLandscape />
        <ConceptEvaluationAndReliability />
      </Module6LabProvider>

      <SourceTrail title="Module 6 source trail" sources={sourceGroups.module6} />
    </PageShell>
  );
}
