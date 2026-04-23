export const STOP_WORDS = new Set([
  "a",
  "an",
  "because",
  "i",
  "is",
  "it",
  "my",
  "the",
  "this",
  "to",
  "very",
]);

const LEMMA_MAP: Record<string, string> = {
  delivered: "deliver",
  helpful: "helpful",
  studying: "study",
  studies: "study",
  studied: "study",
  won: "win",
};

export const NAMED_ENTITIES: Record<string, string> = {
  amazon: "Organization",
  farzana: "Person",
  uwgb: "Organization",
  wisconsin: "Location",
};

export type PosTag = "Pronoun" | "Verb" | "Adjective" | "Noun";

export function simpleLemma(token: string): string {
  if (LEMMA_MAP[token]) return LEMMA_MAP[token];
  if (token.endsWith("ing") && token.length > 4) return token.slice(0, -3);
  if (token.endsWith("ed") && token.length > 3) return token.slice(0, -2);
  if (token.endsWith("s") && token.length > 3) return token.slice(0, -1);
  return token;
}

export function tagToken(token: string): PosTag {
  if (["i", "you", "we", "they", "my"].includes(token)) return "Pronoun";
  if (["love", "deliver", "won", "win", "submitted"].includes(simpleLemma(token))) return "Verb";
  if (["helpful", "late", "free", "amazing"].includes(token)) return "Adjective";
  return "Noun";
}

export function scoreSentiment(lemmas: string[]): "Positive" | "Negative" | "Neutral" {
  const score = lemmas.reduce((acc, token) => {
    if (["love", "helpful", "amazing"].includes(token)) return acc + 1;
    if (["late", "free", "complaint", "spam"].includes(token)) return acc - 1;
    return acc;
  }, 0);
  if (score > 0) return "Positive";
  if (score < 0) return "Negative";
  return "Neutral";
}
