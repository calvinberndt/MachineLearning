"use client";

import { createContext, use, useMemo, useState, type ReactNode } from "react";

export type Module3LabState = {
  clusterStep: number;
  setClusterStep: (step: number) => void;

  testPoint: { x: number; y: number };
  setTestPoint: (point: { x: number; y: number }) => void;

  k: number;
  setK: (k: number) => void;

  kernel: "linear" | "rbf";
  setKernel: (kernel: "linear" | "rbf") => void;

  cValue: number;
  setCValue: (c: number) => void;
};

const Module3LabContext = createContext<Module3LabState | null>(null);

export function Module3LabProvider({ children }: { children: ReactNode }) {
  const [clusterStep, setClusterStep] = useState(0);
  const [testPoint, setTestPoint] = useState({ x: 5, y: 3 });
  const [k, setK] = useState(3);
  const [kernel, setKernel] = useState<"linear" | "rbf">("linear");
  const [cValue, setCValue] = useState(1.0);

  const value = useMemo<Module3LabState>(
    () => ({
      clusterStep, setClusterStep,
      testPoint, setTestPoint,
      k, setK,
      kernel, setKernel,
      cValue, setCValue,
    }),
    [clusterStep, testPoint, k, kernel, cValue],
  );

  return <Module3LabContext value={value}>{children}</Module3LabContext>;
}

export function useModule3Lab(): Module3LabState {
  const ctx = use(Module3LabContext);
  if (!ctx) {
    throw new Error("useModule3Lab must be used within <Module3LabProvider>");
  }
  return ctx;
}
