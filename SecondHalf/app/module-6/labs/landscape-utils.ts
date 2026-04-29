export type LandscapeLayer = "model" | "system" | "landscape";

export type ClassifyPrompt = {
  id: string;
  description: string;
  answer: LandscapeLayer;
  rationale: string;
};

export const layerLabels: Record<LandscapeLayer, string> = {
  model: "Model-level",
  system: "System-level",
  landscape: "Landscape-level",
};

export const prompts: ClassifyPrompt[] = [
  {
    id: "p1",
    description:
      "Tokenizer, embeddings, self-attention, feedforward layers, output logits.",
    answer: "model",
    rationale:
      "These are the core operations inside a transformer — the pure model-level pieces that turn token IDs into next-token probabilities.",
  },
  {
    id: "p2",
    description:
      "API gateway, frontend app, moderation, logs, latency controls, access policy.",
    answer: "system",
    rationale:
      "These are the surrounding production layers that wrap a model into a usable, safe, monitored service.",
  },
  {
    id: "p3",
    description:
      "GPT, Claude, Gemini, Llama, DeepSeek, Mistral, and Grok as competing model families.",
    answer: "landscape",
    rationale:
      "Names of competing families describe the field, not a single architecture or deployment system.",
  },
  {
    id: "p4",
    description:
      "Multi-head attention computing weights over key/query/value vectors.",
    answer: "model",
    rationale:
      "Attention is the central transformer operation, executed inside the model.",
  },
  {
    id: "p5",
    description:
      "RLHF reward model, safety classifier, and prompt-injection filter.",
    answer: "system",
    rationale:
      "Alignment and safety filters live around the trained model in the deployed product, not inside the core transformer math.",
  },
  {
    id: "p6",
    description:
      "Open-weight vs proprietary, multimodal vs text-only, context window size.",
    answer: "landscape",
    rationale:
      "These are the comparison axes used to map the field of competing models.",
  },
];

export function isCorrect(prompt: ClassifyPrompt, picked: LandscapeLayer) {
  return picked === prompt.answer;
}
