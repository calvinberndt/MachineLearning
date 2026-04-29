"use client";

import { useMemo } from "react";
import { useModule6Lab } from "./lab-context";
import { TOKENIZER_EXAMPLES, tokenize, type TokenMode } from "./tokenizer-utils";

const MODES: TokenMode[] = ["word", "bpe"];

export function TokenizerLab() {
  const { sentence, setSentence, tokenMode, setTokenMode } = useModule6Lab();
  const records = useMemo(() => tokenize(sentence, tokenMode), [sentence, tokenMode]);
  const modeIndex = MODES.indexOf(tokenMode);

  return (
    <div className="lab-surface">
      <div className="lab-surface__controls">
        {TOKENIZER_EXAMPLES.map((example, index) => (
          <button
            key={example}
            type="button"
            className="mini-switch"
            data-active={sentence === example}
            onClick={() => setSentence(example)}
          >
            Sample {index + 1}
          </button>
        ))}
      </div>

      <label className="nlp-input">
        <span className="kicker">Prompt text</span>
        <textarea
          rows={2}
          value={sentence}
          onChange={(event) => setSentence(event.target.value)}
          aria-label="Tokenizer input sentence"
          autoComplete="off"
          spellCheck={false}
        />
      </label>

      <label className="range-field token-mode-field">
        <span>Split</span>
        <input
          type="range"
          min="0"
          max="1"
          step="1"
          value={modeIndex}
          onChange={(event) => setTokenMode(MODES[Number(event.target.value)])}
          aria-label="Token splitting mode"
        />
        <span className="tabular">{tokenMode === "word" ? "Word" : "BPE"}</span>
      </label>

      <div className="token-table" role="table" aria-label="Token ids and embeddings">
        <div className="token-table__row token-table__row--head" role="row">
          <span role="columnheader">Token</span>
          <span role="columnheader">ID</span>
          <span role="columnheader">Embedding</span>
        </div>
        {records.map((record, index) => (
          <div className="token-table__row" role="row" key={`${record.text}-${index}`}>
            <span className="token token--accent" role="cell">{record.text}</span>
            <span className="tabular" role="cell">{record.id}</span>
            <span className="embedding-bars" role="cell" aria-label={`Embedding for ${record.text}`}>
              {record.embedding.map((value, dim) => (
                <span key={`${record.text}-${dim}`} className="embedding-bars__bar">
                  <span style={{ transform: `scaleX(${value})` }} />
                  <em className="tabular">{value.toFixed(2)}</em>
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>

      <p className="lab-surface__caption">
        Word-level splitting is easy to read but brittle for unseen forms. BPE-style pieces reuse smaller units,
        which is why production LLM tokenizers can handle new words more gracefully than the classroom pipeline
        in §5.2.
      </p>
    </div>
  );
}
