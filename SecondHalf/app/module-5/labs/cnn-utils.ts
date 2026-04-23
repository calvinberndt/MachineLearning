import { relu } from "./nn-utils.ts";

export const VERTICAL_EDGE_KERNEL: number[][] = [
  [1, 0, -1],
  [1, 0, -1],
  [1, 0, -1],
];

export const HORIZONTAL_EDGE_KERNEL: number[][] = [
  [1, 1, 1],
  [0, 0, 0],
  [-1, -1, -1],
];

/**
 * 2D correlation (what CNN frameworks call "convolution") with stride 1 and no padding.
 * Output size: (H - F + 1) × (W - F + 1). For a 6x6 input and 3x3 kernel, that's 4x4.
 */
export function convolve(grid: number[][], kernel: number[][]): number[][] {
  const result: number[][] = [];
  const kh = kernel.length;
  const kw = kernel[0]?.length ?? 0;

  for (let row = 0; row <= grid.length - kh; row += 1) {
    const currentRow: number[] = [];
    for (let col = 0; col <= (grid[0]?.length ?? 0) - kw; col += 1) {
      let sum = 0;
      for (let kr = 0; kr < kh; kr += 1) {
        for (let kc = 0; kc < kw; kc += 1) {
          sum += grid[row + kr][col + kc] * kernel[kr][kc];
        }
      }
      currentRow.push(sum);
    }
    result.push(currentRow);
  }
  return result;
}

/** 2×2 non-overlapping max pooling with stride 2. */
export function maxPool2x2(grid: number[][]): number[][] {
  const result: number[][] = [];
  for (let row = 0; row < grid.length; row += 2) {
    const currentRow: number[] = [];
    for (let col = 0; col < (grid[0]?.length ?? 0); col += 2) {
      const values = [
        grid[row]?.[col] ?? 0,
        grid[row]?.[col + 1] ?? 0,
        grid[row + 1]?.[col] ?? 0,
        grid[row + 1]?.[col + 1] ?? 0,
      ];
      currentRow.push(Math.max(...values));
    }
    result.push(currentRow);
  }
  return result;
}

export function applyRelu(grid: number[][]): number[][] {
  return grid.map((row) => row.map(relu));
}

/** `(H - F + 2P) / S + 1` — the canonical CNN output-dimension formula. */
export function convOutputSize(
  inputSize: number,
  filterSize: number,
  padding = 0,
  stride = 1,
): number {
  return Math.floor((inputSize - filterSize + 2 * padding) / stride) + 1;
}
