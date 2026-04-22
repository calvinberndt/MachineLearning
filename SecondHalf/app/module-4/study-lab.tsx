"use client";

import Link from "next/link";
import { useState } from "react";
import { LearningTracks, SourceTrail, sourceGroups } from "../source-trail";

type LabView = "ensemble" | "forest" | "tradeoffs";

type EnsembleMode = "bagging" | "boosting" | "stacking" | "voting";

const sectionTabs: Array<{ id: LabView; label: string }> = [
  { id: "ensemble", label: "Ensemble overview" },
  { id: "forest", label: "Random forest lab" },
  { id: "tradeoffs", label: "Tradeoffs" },
];

const modeNotes: Record<
  EnsembleMode,
  { title: string; summary: string; steps: string[] }
> = {
  bagging: {
    title: "Bagging trains many models in parallel.",
    summary:
      "Each model sees a bootstrapped sample. Averaging or majority voting reduces variance, which is why random forests are so stable.",
    steps: ["Sample with replacement", "Train models independently", "Aggregate the outputs"],
  },
  boosting: {
    title: "Boosting trains sequentially.",
    summary:
      "Each new learner pays more attention to the points previous learners struggled with. That usually reduces bias.",
    steps: ["Fit a weak learner", "Upweight hard examples", "Add the next learner"],
  },
  stacking: {
    title: "Stacking learns how to combine models.",
    summary:
      "A meta-model looks at the base models' predictions and learns which one to trust under different conditions.",
    steps: ["Train base learners", "Collect their predictions", "Train a meta-learner"],
  },
  voting: {
    title: "Voting turns several opinions into one prediction.",
    summary:
      "Hard voting takes the majority class. Soft voting averages probabilities and picks the larger average confidence.",
    steps: ["Ask each model for a prediction", "Combine the votes", "Return the final class"],
  },
};

type StudentProfile = {
  studyHours: number;
  gpa: number;
  attendance: number;
  assignments: number;
  participation: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function Module4Lab() {
  const [view, setView] = useState<LabView>("ensemble");
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

  const hardVoteTotal = hardVotes.reduce((sum, vote) => sum + Number(vote), 0);
  const hardVoteResult = hardVoteTotal >= Math.ceil(hardVotes.length / 2) ? "Pass" : "Fail";
  const softAverage = softVotes.reduce((sum, vote) => sum + vote, 0) / softVotes.length;
  const softVoteResult = softAverage >= 0.5 ? "Pass" : "Fail";

  const trees = [
    {
      name: "Tree 1",
      rule: "Study hours + attendance",
      pass: student.studyHours >= 6 && student.attendance >= 75,
      score: 44 + student.studyHours * 3.2 + student.attendance * 0.24,
    },
    {
      name: "Tree 2",
      rule: "GPA + assignments",
      pass: student.gpa >= 2.8 && student.assignments >= 7,
      score: 28 + student.gpa * 13 + student.assignments * 2.8,
    },
    {
      name: "Tree 3",
      rule: "Attendance + participation",
      pass: student.attendance >= 70 && student.participation >= 0.5,
      score: 34 + student.attendance * 0.3 + student.participation * 18,
    },
    {
      name: "Tree 4",
      rule: "Study hours + GPA",
      pass: student.studyHours >= 5 && student.gpa >= 2.6,
      score: 31 + student.studyHours * 3.6 + student.gpa * 12,
    },
    {
      name: "Tree 5",
      rule: "Assignments + attendance",
      pass: student.assignments >= 6 && student.attendance >= 72,
      score: 36 + student.assignments * 3.1 + student.attendance * 0.27,
    },
  ];

  const passVotes = trees.filter((tree) => tree.pass).length;
  const forestLabel = passVotes >= 3 ? "Pass" : "Fail";
  const forestScore = Math.round(
    trees.reduce((sum, tree) => sum + tree.score, 0) / trees.length,
  );
  const featureShare = [
    { label: "Study hours", value: 2 },
    { label: "GPA", value: 2 },
    { label: "Attendance", value: 3 },
    { label: "Assignments", value: 2 },
    { label: "Participation", value: 1 },
  ];

  return (
    <article className="module-page" data-tone="module-4">
      <section className="module-hero">
        <div>
          <p className="hero-kicker">Module 4</p>
          <h1 className="module-title">Why many models together often beat one model alone.</h1>
          <p className="module-copy">
            Ensemble methods combine opinions. Random forests do it by training many decision trees
            on bootstrapped data and random feature subsets, then letting the crowd decide.
          </p>
        </div>
        <aside className="module-note">
          <p className="section-tag">Professor emphasis</p>
          <p>
            The recurring exam theme here is <strong>variance reduction</strong>. A single tree can
            wobble. A forest averages out that wobble.
          </p>
        </aside>
      </section>

      <LearningTracks
        cram={[
          "Ensemble learning combines multiple models to improve accuracy and generalization.",
          "Bagging reduces variance; boosting focuses on hard examples; stacking uses a meta-model.",
          "Random Forest uses bootstrap samples, random feature subsets, and voting or averaging.",
        ]}
        deep={[
          "A single decision tree is unstable; a forest smooths out that instability by aggregating many trees.",
          "Random feature selection makes trees disagree in useful ways, reducing correlation across the forest.",
          "Feature importance is helpful, but impurity-based importance can be misleading for high-cardinality features.",
        ]}
      />

      <div className="lab-nav" role="tablist" aria-label="Module 4 sections">
        {sectionTabs.map((tab) => (
          <button
            key={tab.id}
            className="lab-tab"
            data-active={view === tab.id}
            onClick={() => setView(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {view === "ensemble" ? (
        <section className="lab-layout">
          <div className="lab-surface">
            <div className="control-row">
              {(Object.keys(modeNotes) as EnsembleMode[]).map((option) => (
                <button
                  key={option}
                  className="mini-switch"
                  data-active={mode === option}
                  onClick={() => setMode(option)}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="explain-strip">
              <div className="flow-rail">
                <span className="flow-pill">Data</span>
                <span className="flow-link" />
                <span className="flow-pill">{mode === "boosting" ? "Learner 1 → Learner 2 → Learner 3" : "Learner 1 • Learner 2 • Learner 3"}</span>
                <span className="flow-link" />
                <span className="flow-pill">{mode === "stacking" ? "Meta-model" : "Combine"}</span>
                <span className="flow-link" />
                <span className="flow-pill">Prediction</span>
              </div>
              <div className="concept-copy">
                <p className="section-tag">{mode}</p>
                <h2 className="section-title">{modeNotes[mode].title}</h2>
                <p className="section-copy">{modeNotes[mode].summary}</p>
              </div>
            </div>

            <div className="dual-grid">
              <div className="study-panel">
                <p className="section-tag">Hard voting</p>
                <div className="vote-grid">
                  {hardVotes.map((vote, index) => (
                    <button
                      key={`hard-${index}`}
                      className="vote-chip"
                      data-positive={vote}
                      onClick={() =>
                        setHardVotes((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index ? !item : item,
                          ),
                        )
                      }
                      type="button"
                    >
                      Model {index + 1}: {vote ? "Pass" : "Fail"}
                    </button>
                  ))}
                </div>
                <p className="section-copy">
                  Majority result: <strong>{hardVoteResult}</strong> with {hardVoteTotal} of{" "}
                  {hardVotes.length} votes.
                </p>
              </div>

              <div className="study-panel">
                <p className="section-tag">Soft voting</p>
                <div className="slider-stack">
                  {softVotes.map((vote, index) => (
                    <label key={`soft-${index}`} className="control">
                      <span className="range-label">Model {index + 1} probability of Pass</span>
                      <input
                        max="1"
                        min="0"
                        step="0.01"
                        type="range"
                        value={vote}
                        onChange={(event) =>
                          setSoftVotes((current) =>
                            current.map((item, itemIndex) =>
                              itemIndex === index ? Number(event.target.value) : item,
                            ),
                          )
                        }
                      />
                      <span className="readout">{Math.round(vote * 100)}%</span>
                    </label>
                  ))}
                </div>
                <p className="section-copy">
                  Average probability: <strong>{Math.round(softAverage * 100)}%</strong>, so the
                  soft-vote result is <strong>{softVoteResult}</strong>.
                </p>
              </div>
            </div>
          </div>

          <aside className="study-panel">
            <p className="section-tag">Memory hooks</p>
            <ul className="insight-list">
              <li>Bagging reduces variance.</li>
              <li>Boosting chases hard examples.</li>
              <li>Stacking learns how to blend models.</li>
              <li>Voting is the simplest ensemble to explain quickly.</li>
            </ul>
            <p className="section-tag">Further study</p>
            <ul className="resource-list">
              <li>
                <Link
                  href="https://scikit-learn.org/stable/modules/ensemble.html"
                  rel="noreferrer"
                  target="_blank"
                >
                  scikit-learn ensemble methods guide
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.youtube.com/watch?v=J4Wdy0Wc_xQ"
                  rel="noreferrer"
                  target="_blank"
                >
                  StatQuest: Random Forests Part 1
                </Link>
              </li>
            </ul>
          </aside>
        </section>
      ) : null}

      {view === "forest" ? (
        <section className="lab-layout">
          <div className="lab-surface">
            <div className="control-grid">
              <label className="control">
                <span className="range-label">Study hours</span>
                <input
                  max="12"
                  min="0"
                  step="1"
                  type="range"
                  value={student.studyHours}
                  onChange={(event) =>
                    setStudent((current) => ({ ...current, studyHours: Number(event.target.value) }))
                  }
                />
                <span className="readout">{student.studyHours} hrs</span>
              </label>
              <label className="control">
                <span className="range-label">GPA</span>
                <input
                  max="4"
                  min="0"
                  step="0.1"
                  type="range"
                  value={student.gpa}
                  onChange={(event) =>
                    setStudent((current) => ({ ...current, gpa: Number(event.target.value) }))
                  }
                />
                <span className="readout">{student.gpa.toFixed(1)}</span>
              </label>
              <label className="control">
                <span className="range-label">Attendance</span>
                <input
                  max="100"
                  min="30"
                  step="1"
                  type="range"
                  value={student.attendance}
                  onChange={(event) =>
                    setStudent((current) => ({ ...current, attendance: Number(event.target.value) }))
                  }
                />
                <span className="readout">{student.attendance}%</span>
              </label>
              <label className="control">
                <span className="range-label">Assignments submitted</span>
                <input
                  max="10"
                  min="0"
                  step="1"
                  type="range"
                  value={student.assignments}
                  onChange={(event) =>
                    setStudent((current) => ({ ...current, assignments: Number(event.target.value) }))
                  }
                />
                <span className="readout">{student.assignments}</span>
              </label>
              <label className="control">
                <span className="range-label">Participation</span>
                <input
                  max="1"
                  min="0"
                  step="0.05"
                  type="range"
                  value={student.participation}
                  onChange={(event) =>
                    setStudent((current) => ({
                      ...current,
                      participation: Number(event.target.value),
                    }))
                  }
                />
                <span className="readout">{Math.round(student.participation * 100)}%</span>
              </label>
            </div>

            <div className="dual-grid">
              <div className="forest-grid">
                {trees.map((tree) => (
                  <article key={tree.name} className="tree-card">
                    <p className="section-tag">{tree.name}</p>
                    <h3>{tree.rule}</h3>
                    <p>{tree.pass ? "Votes Pass" : "Votes Fail"}</p>
                    <strong>{Math.round(tree.score)}</strong>
                  </article>
                ))}
              </div>

              <div className="study-panel">
                <p className="section-tag">Forest result</p>
                <div className="metric-row">
                  <div className="metric">
                    <span className="metric-label">Classification</span>
                    <strong className="metric-value">{forestLabel}</strong>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Predicted score</span>
                    <strong className="metric-value">{forestScore}</strong>
                  </div>
                </div>
                <p className="section-copy">
                  {passVotes} of {trees.length} trees predict <strong>Pass</strong>. For regression,
                  the forest averages all tree outputs instead of voting.
                </p>
                <div className="feature-bars">
                  {featureShare.map((feature) => (
                    <div key={feature.label} className="feature-bar">
                      <span>{feature.label}</span>
                      <div className="feature-bar__track">
                        <div
                          className="feature-bar__fill"
                          style={{ width: `${clamp(feature.value / 3, 0.15, 1) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="study-panel">
            <p className="section-tag">How to say it on an exam</p>
            <p className="section-copy">
              A random forest is many decision trees trained on bootstrapped samples and random
              feature subsets. Classification uses majority vote. Regression uses the average.
            </p>
            <ul className="insight-list">
              <li>Bagging creates different training sets with replacement.</li>
              <li>Random feature selection decorrelates the trees.</li>
              <li>Aggregation lowers variance and overfitting risk.</li>
            </ul>
          </aside>
        </section>
      ) : null}

      {view === "tradeoffs" ? (
        <section className="lab-layout">
          <div className="lab-surface">
            <div className="dual-grid">
              <article className="study-panel">
                <p className="section-tag">Advantages</p>
                <ul className="insight-list">
                  <li>Higher accuracy than a single weak learner.</li>
                  <li>Better generalization across noisy data.</li>
                  <li>Random forests can estimate feature importance.</li>
                  <li>Bagging-style methods are usually very stable.</li>
                </ul>
              </article>
              <article className="study-panel">
                <p className="section-tag">Disadvantages</p>
                <ul className="insight-list">
                  <li>More computation and memory.</li>
                  <li>Harder to interpret than one model.</li>
                  <li>More hyperparameters to tune.</li>
                  <li>Boosting can overfit noisy data if pushed too hard.</li>
                </ul>
              </article>
            </div>
            <div className="concept-copy">
              <p className="section-tag">Fast comparisons</p>
              <h2 className="section-title">Bagging vs boosting</h2>
              <p className="section-copy">
                If the question asks about variance, think <strong>bagging</strong>. If the question
                asks about correcting earlier mistakes or focusing on hard examples, think{" "}
                <strong>boosting</strong>.
              </p>
            </div>
          </div>

          <aside className="study-panel">
            <p className="section-tag">Question traps</p>
            <ul className="insight-list">
              <li>KNN is not an ensemble method.</li>
              <li>Random forest is bagging, not boosting.</li>
              <li>Stacking uses a meta-model, not simple majority vote.</li>
            </ul>
          </aside>
        </section>
      ) : null}

      <SourceTrail title="Module 4 source trail" sources={sourceGroups.module4} />
    </article>
  );
}
