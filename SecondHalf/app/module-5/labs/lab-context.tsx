"use client";

import { createContext, use, useMemo, useState, type ReactNode } from "react";

export type KernelMode = "vertical" | "horizontal";

export type StudentInputs = {
  studyHours: number;
  attendance: number;
  assignments: number;
};

export type Module5LabState = {
  student: StudentInputs;
  setStudent: (next: StudentInputs) => void;

  sentence: string;
  setSentence: (next: string) => void;

  kernelMode: KernelMode;
  setKernelMode: (next: KernelMode) => void;

  grid: number[][];
  setGrid: (next: number[][]) => void;
};

const Module5LabContext = createContext<Module5LabState | null>(null);

const presetVertical = () => [
  [0, 0, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 0],
];

export function Module5LabProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<StudentInputs>({
    studyHours: 6,
    attendance: 82,
    assignments: 8,
  });
  const [sentence, setSentence] = useState("I love this course because it is very helpful.");
  const [kernelMode, setKernelMode] = useState<KernelMode>("vertical");
  const [grid, setGrid] = useState<number[][]>(presetVertical());

  const value = useMemo<Module5LabState>(
    () => ({
      student, setStudent,
      sentence, setSentence,
      kernelMode, setKernelMode,
      grid, setGrid,
    }),
    [student, sentence, kernelMode, grid],
  );

  return <Module5LabContext value={value}>{children}</Module5LabContext>;
}

export function useModule5Lab(): Module5LabState {
  const ctx = use(Module5LabContext);
  if (!ctx) {
    throw new Error("useModule5Lab must be used within <Module5LabProvider>");
  }
  return ctx;
}
