export type AttentionToken = {
  text: string;
  position: number;
  embedding: [number, number];
};

export const ATTENTION_TOKENS: AttentionToken[] = [
  { text: "bank", position: 0, embedding: [0.86, 0.21] },
  { text: "approves", position: 1, embedding: [0.64, 0.58] },
  { text: "river", position: 2, embedding: [0.22, 0.81] },
  { text: "loan", position: 3, embedding: [0.77, 0.49] },
];

const SCORE_ROWS = [
  [1.4, 1.1, 0.2, 1.9],
  [0.8, 1.3, 0.1, 1.7],
  [0.4, 0.2, 1.6, 0.3],
  [1.2, 1.6, 0.1, 1.8],
];

export function softmax(values: number[]): number[] {
  const max = Math.max(...values);
  const exps = values.map((value) => Math.exp(value - max));
  const total = exps.reduce((sum, value) => sum + value, 0);
  return exps.map((value) => value / total);
}

export function getAttentionMatrix(): number[][] {
  return SCORE_ROWS.map(softmax);
}

export function getAttentionForQuery(queryIndex: number): number[] {
  const matrix = getAttentionMatrix();
  return matrix[Math.max(0, Math.min(queryIndex, matrix.length - 1))];
}

export function getWeightedContext(queryIndex: number): [number, number] {
  const weights = getAttentionForQuery(queryIndex);
  return weights.reduce<[number, number]>(
    (context, weight, index) => [
      context[0] + weight * ATTENTION_TOKENS[index].embedding[0],
      context[1] + weight * ATTENTION_TOKENS[index].embedding[1],
    ],
    [0, 0],
  );
}
