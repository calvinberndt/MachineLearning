"use client";

import { createContext, use, useMemo, useState, type ReactNode } from "react";

export type EnsembleMode = "bagging" | "boosting" | "stacking" | "voting";

export type StudentProfile = {
  studyHours: number;
  gpa: number;
  attendance: number;
  assignments: number;
  participation: number;
};

export type Module4LabState = {
  mode: EnsembleMode;
  setMode: (mode: EnsembleMode) => void;

  hardVotes: boolean[];
  setHardVotes: (votes: boolean[]) => void;

  softVotes: number[];
  setSoftVotes: (votes: number[]) => void;

  student: StudentProfile;
  setStudent: (student: StudentProfile) => void;
};

const Module4LabContext = createContext<Module4LabState | null>(null);

export function Module4LabProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<EnsembleMode>("bagging");
  const [hardVotes, setHardVotes] = useState([true, true, false, true, false]);
  const [softVotes, setSoftVotes] = useState([0.74, 0.58, 0.42]);
  const [student, setStudent] = useState<StudentProfile>({
    studyHours: 6,
    gpa: 3.2,
    attendance: 80,
    assignments: 8,
    participation: 0.6,
  });

  const value = useMemo<Module4LabState>(
    () => ({
      mode, setMode,
      hardVotes, setHardVotes,
      softVotes, setSoftVotes,
      student, setStudent,
    }),
    [mode, hardVotes, softVotes, student],
  );

  return <Module4LabContext value={value}>{children}</Module4LabContext>;
}

export function useModule4Lab(): Module4LabState {
  const ctx = use(Module4LabContext);
  if (!ctx) {
    throw new Error("useModule4Lab must be used within <Module4LabProvider>");
  }
  return ctx;
}
