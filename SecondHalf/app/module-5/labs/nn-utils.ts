export function sigmoid(value: number): number {
  return 1 / (1 + Math.exp(-value));
}

export function relu(value: number): number {
  return Math.max(0, value);
}
