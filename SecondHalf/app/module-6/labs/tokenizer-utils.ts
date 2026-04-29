export type TokenMode = "word" | "bpe";

export type TokenRecord = {
  text: string;
  id: number;
  embedding: [number, number, number];
};

type VocabEntry = {
  id: number;
  embedding: [number, number, number];
};

const WORD_VOCAB: Record<string, VocabEntry> = {
  transformers: { id: 101, embedding: [0.82, 0.18, 0.64] },
  turn: { id: 102, embedding: [0.48, 0.61, 0.22] },
  tokens: { id: 103, embedding: [0.33, 0.74, 0.51] },
  into: { id: 104, embedding: [0.27, 0.29, 0.69] },
  context: { id: 105, embedding: [0.71, 0.44, 0.39] },
  aware: { id: 106, embedding: [0.66, 0.35, 0.57] },
  vectors: { id: 107, embedding: [0.54, 0.72, 0.43] },
  openai: { id: 108, embedding: [0.75, 0.31, 0.68] },
  systems: { id: 109, embedding: [0.57, 0.49, 0.76] },
  align: { id: 110, embedding: [0.69, 0.52, 0.28] },
  model: { id: 111, embedding: [0.62, 0.58, 0.47] },
  outputs: { id: 112, embedding: [0.38, 0.67, 0.59] },
  with: { id: 113, embedding: [0.25, 0.46, 0.41] },
  human: { id: 114, embedding: [0.78, 0.37, 0.32] },
  feedback: { id: 115, embedding: [0.81, 0.42, 0.36] },
};

const BPE_VOCAB: Record<string, VocabEntry> = {
  transform: { id: 301, embedding: [0.80, 0.16, 0.58] },
  "##ers": { id: 302, embedding: [0.41, 0.19, 0.47] },
  turn: { id: 303, embedding: [0.48, 0.61, 0.22] },
  token: { id: 304, embedding: [0.31, 0.71, 0.48] },
  "##s": { id: 305, embedding: [0.22, 0.34, 0.26] },
  into: { id: 306, embedding: [0.27, 0.29, 0.69] },
  context: { id: 307, embedding: [0.71, 0.44, 0.39] },
  aware: { id: 308, embedding: [0.66, 0.35, 0.57] },
  vector: { id: 309, embedding: [0.50, 0.70, 0.41] },
  open: { id: 310, embedding: [0.70, 0.26, 0.64] },
  "##ai": { id: 311, embedding: [0.39, 0.35, 0.58] },
  system: { id: 312, embedding: [0.55, 0.47, 0.73] },
  align: { id: 313, embedding: [0.69, 0.52, 0.28] },
  model: { id: 314, embedding: [0.62, 0.58, 0.47] },
  output: { id: 315, embedding: [0.36, 0.65, 0.57] },
  with: { id: 316, embedding: [0.25, 0.46, 0.41] },
  human: { id: 317, embedding: [0.78, 0.37, 0.32] },
  feed: { id: 318, embedding: [0.77, 0.39, 0.31] },
  "##back": { id: 319, embedding: [0.43, 0.33, 0.29] },
};

const BPE_SPLITS: Record<string, string[]> = {
  transformers: ["transform", "##ers"],
  tokens: ["token", "##s"],
  vectors: ["vector", "##s"],
  openai: ["open", "##ai"],
  systems: ["system", "##s"],
  outputs: ["output", "##s"],
  feedback: ["feed", "##back"],
};

const UNKNOWN: VocabEntry = { id: 0, embedding: [0.1, 0.1, 0.1] };

export const TOKENIZER_EXAMPLES = [
  "Transformers turn tokens into context aware vectors.",
  "OpenAI systems align model outputs with human feedback.",
];

export function normalizeForTokenizer(sentence: string): string[] {
  return sentence
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

export function splitIntoTokenPieces(sentence: string, mode: TokenMode): string[] {
  const words = normalizeForTokenizer(sentence);
  if (mode === "word") return words;
  return words.flatMap((word) => BPE_SPLITS[word] ?? [word]);
}

export function tokenize(sentence: string, mode: TokenMode): TokenRecord[] {
  const vocab = mode === "word" ? WORD_VOCAB : BPE_VOCAB;
  return splitIntoTokenPieces(sentence, mode).map((text) => {
    const entry = vocab[text] ?? UNKNOWN;
    return { text, id: entry.id, embedding: entry.embedding };
  });
}
