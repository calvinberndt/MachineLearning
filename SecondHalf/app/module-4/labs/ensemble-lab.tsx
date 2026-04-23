"use client";

import { type EnsembleMode, useModule4Lab } from "./lab-context";

const MODE_NOTES: Record<
  EnsembleMode,
  { title: string; summary: string; flow: string }
> = {
  bagging: {
    title: "Bagging trains many models in parallel.",
    summary:
      "Each base learner sees an independent bootstrap sample of the training set. Averaging (regression) or majority voting (classification) cancels out the variance that any single learner would inherit from its idiosyncratic training set. This is why Random Forests are so stable.",
    flow: "Data → Learner 1 · Learner 2 · Learner 3 → Combine → Prediction",
  },
  boosting: {
    title: "Boosting trains sequentially.",
    summary:
      "Each new learner focuses on the points previous learners got wrong — AdaBoost reweights misclassified examples; gradient boosting fits the residuals. This lowers bias at the cost of longer training and higher sensitivity to noise.",
    flow: "Data → Learner 1 → Learner 2 → Learner 3 → Final model",
  },
  stacking: {
    title: "Stacking learns how to combine models.",
    summary:
      "A meta-learner (often a simple linear model) is trained on the out-of-fold predictions of the base learners, so it learns which base model to trust in which region of feature space.",
    flow: "Data → Base learners → Meta-learner → Prediction",
  },
  voting: {
    title: "Voting turns several opinions into one prediction.",
    summary:
      "Hard voting takes the majority class. Soft voting averages predicted probabilities — usually stronger because it uses the confidence of each learner, not just its top pick.",
    flow: "Data → Learner 1 · Learner 2 · Learner 3 → Vote → Prediction",
  },
};

const MODES: EnsembleMode[] = ["bagging", "boosting", "stacking", "voting"];

export function EnsembleLab() {
  const { mode, setMode, hardVotes, setHardVotes, softVotes, setSoftVotes } = useModule4Lab();

  const hardTotal = hardVotes.reduce((sum, v) => sum + (v ? 1 : 0), 0);
  const hardResult = hardTotal >= Math.ceil(hardVotes.length / 2) ? "Pass" : "Fail";
  const softAverage = softVotes.reduce((a, b) => a + b, 0) / softVotes.length;
  const softResult = softAverage >= 0.5 ? "Pass" : "Fail";

  const note = MODE_NOTES[mode];

  return (
    <div className="lab-surface">
      <div className="lab-surface__controls" role="tablist" aria-label="Ensemble family">
        {MODES.map((option) => (
          <button
            key={option}
            className="mini-switch"
            data-active={mode === option}
            onClick={() => setMode(option)}
            type="button"
            role="tab"
            aria-selected={mode === option}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="ensemble-flow">{note.flow}</div>

      <div className="concept__intuition">
        <strong>{note.title}</strong>
        <p>{note.summary}</p>
      </div>

      <div className="vote-grid">
        <div className="vote-card">
          <span className="kicker">Hard vote</span>
          <div className="vote-chips">
            {hardVotes.map((vote, index) => (
              <button
                key={`hard-${index}`}
                className="vote-chip"
                data-on={vote}
                type="button"
                aria-pressed={vote}
                onClick={() =>
                  setHardVotes(hardVotes.map((v, i) => (i === index ? !v : v)))
                }
              >
                Model {index + 1}: {vote ? "Pass" : "Fail"}
              </button>
            ))}
          </div>
          <p className="lab-surface__caption tabular">
            Majority rule · <strong>{hardResult}</strong> ({hardTotal}/{hardVotes.length} votes for Pass)
          </p>
        </div>

        <div className="vote-card">
          <span className="kicker">Soft vote</span>
          <div className="vote-sliders">
            {softVotes.map((vote, index) => (
              <label key={`soft-${index}`} className="range-field">
                <span>M{index + 1}</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={vote}
                  onChange={(event) =>
                    setSoftVotes(
                      softVotes.map((v, i) => (i === index ? Number(event.target.value) : v)),
                    )
                  }
                  aria-label={`Model ${index + 1} probability of Pass`}
                />
                <span className="tabular">{Math.round(vote * 100)}%</span>
              </label>
            ))}
          </div>
          <p className="lab-surface__caption tabular">
            Mean probability <strong>{Math.round(softAverage * 100)}%</strong> · <strong>{softResult}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
