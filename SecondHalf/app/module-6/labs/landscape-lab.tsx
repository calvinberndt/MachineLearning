"use client";

import { useState } from "react";
import {
  prompts,
  layerLabels,
  isCorrect,
  type LandscapeLayer,
} from "./landscape-utils";

const LAYERS: LandscapeLayer[] = ["model", "system", "landscape"];

export function LandscapeLab() {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<LandscapeLayer | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const prompt = prompts[index];

  function handlePick(layer: LandscapeLayer) {
    if (picked !== null) return;
    setPicked(layer);
    setScore((s) => ({
      correct: s.correct + (isCorrect(prompt, layer) ? 1 : 0),
      total: s.total + 1,
    }));
  }

  function handleNext() {
    setPicked(null);
    setIndex((i) => (i + 1) % prompts.length);
  }

  function handleReset() {
    setPicked(null);
    setIndex(0);
    setScore({ correct: 0, total: 0 });
  }

  const correctAfterPick = picked !== null && isCorrect(prompt, picked);

  return (
    <div className="lab-surface">
      <div className="landscape-classify">
        <header className="landscape-classify__header">
          <span className="kicker">
            Prompt {index + 1} / {prompts.length}
          </span>
          <span className="landscape-classify__score tabular">
            Score: {score.correct} / {score.total}
          </span>
        </header>

        <p className="landscape-classify__prompt">{prompt.description}</p>

        <div className="landscape-classify__choices" role="group" aria-label="Pick a layer">
          {LAYERS.map((layer) => {
            const state =
              picked === null
                ? "idle"
                : layer === prompt.answer
                  ? "correct"
                  : layer === picked
                    ? "wrong"
                    : "muted";
            return (
              <button
                key={layer}
                type="button"
                className="landscape-classify__choice"
                data-state={state}
                aria-pressed={picked === layer}
                disabled={picked !== null}
                onClick={() => handlePick(layer)}
              >
                {layerLabels[layer]}
              </button>
            );
          })}
        </div>

        {picked !== null && (
          <div
            className={`landscape-classify__feedback ${
              correctAfterPick ? "is-correct" : "is-wrong"
            }`}
            role="status"
          >
            <strong>
              {correctAfterPick
                ? "Correct."
                : `That belongs to ${layerLabels[prompt.answer]}.`}
            </strong>
            <p>{prompt.rationale}</p>
            <div className="landscape-classify__actions">
              <button
                type="button"
                className="landscape-classify__next"
                onClick={handleNext}
              >
                Next prompt →
              </button>
              {score.total >= prompts.length && (
                <button
                  type="button"
                  className="landscape-classify__reset"
                  onClick={handleReset}
                >
                  Restart
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
