"use client";

import { createContext, use, useCallback, useMemo, useState, type ReactNode } from "react";

export type LabView = "kmeans" | "knn" | "svm";

export type Module3LabState = {
  view: LabView;
  setView: (view: LabView) => void;

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
  const [view, setView] = useState<LabView>("kmeans");
  const [clusterStep, setClusterStep] = useState(0);
  const [testPoint, setTestPoint] = useState({ x: 5, y: 3 });
  const [k, setK] = useState(3);
  const [kernel, setKernel] = useState<"linear" | "rbf">("linear");
  const [cValue, setCValue] = useState(1.0);

  const setTestPointStable = useCallback(
    (point: { x: number; y: number }) => setTestPoint(point),
    [],
  );

  const value = useMemo<Module3LabState>(
    () => ({
      view, setView,
      clusterStep, setClusterStep,
      testPoint, setTestPoint: setTestPointStable,
      k, setK,
      kernel, setKernel,
      cValue, setCValue,
    }),
    [view, clusterStep, testPoint, k, kernel, cValue, setTestPointStable],
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
