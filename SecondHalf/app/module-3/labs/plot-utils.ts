export function plotX(value: number, max: number, width = 420, padding = 36) {
  return padding + (value / max) * (width - padding * 2);
}

export function plotY(value: number, max: number, height = 280, padding = 28) {
  return height - padding - (value / max) * (height - padding * 2);
}
