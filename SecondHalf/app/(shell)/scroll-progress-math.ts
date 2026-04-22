export type ScrollInput = {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
};

export function computeScrollProgress(input: ScrollInput): number {
  const max = input.scrollHeight - input.clientHeight;
  if (max <= 0) return 0;
  const raw = input.scrollTop / max;
  if (raw < 0) return 0;
  if (raw > 1) return 1;
  return raw;
}
