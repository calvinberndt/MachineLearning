"use client";

import { createContext, use, useMemo, useState, type ReactNode } from "react";
import { TOKENIZER_EXAMPLES, type TokenMode } from "./tokenizer-utils";

export type Module6LabState = {
  tokenMode: TokenMode;
  setTokenMode: (next: TokenMode) => void;

  sentence: string;
  setSentence: (next: string) => void;

  queryIndex: number;
  setQueryIndex: (next: number) => void;
};

const Module6LabContext = createContext<Module6LabState | null>(null);

export function Module6LabProvider({ children }: { children: ReactNode }) {
  const [tokenMode, setTokenMode] = useState<TokenMode>("bpe");
  const [sentence, setSentence] = useState(TOKENIZER_EXAMPLES[0]);
  const [queryIndex, setQueryIndex] = useState(0);

  const value = useMemo<Module6LabState>(
    () => ({
      tokenMode, setTokenMode,
      sentence, setSentence,
      queryIndex, setQueryIndex,
    }),
    [tokenMode, sentence, queryIndex],
  );

  return <Module6LabContext value={value}>{children}</Module6LabContext>;
}

export function useModule6Lab(): Module6LabState {
  const ctx = use(Module6LabContext);
  if (!ctx) {
    throw new Error("useModule6Lab must be used within <Module6LabProvider>");
  }
  return ctx;
}
