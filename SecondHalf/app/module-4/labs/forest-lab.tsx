"use client";

import { useMemo } from "react";
import { useModule4Lab } from "./lab-context";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function ForestLab() {
  const { student, setStudent } = useModule4Lab();

  const trees = useMemo(
    () => [
      {
        name: "Tree 1",
        features: "Study hours + attendance",
        pass: student.studyHours >= 6 && student.attendance >= 75,
        score: 44 + student.studyHours * 3.2 + student.attendance * 0.24,
      },
      {
        name: "Tree 2",
        features: "GPA + assignments",
        pass: student.gpa >= 2.8 && student.assignments >= 7,
        score: 28 + student.gpa * 13 + student.assignments * 2.8,
      },
      {
        name: "Tree 3",
        features: "Attendance + participation",
        pass: student.attendance >= 70 && student.participation >= 0.5,
        score: 34 + student.attendance * 0.3 + student.participation * 18,
      },
      {
        name: "Tree 4",
        features: "Study hours + GPA",
        pass: student.studyHours >= 5 && student.gpa >= 2.6,
        score: 31 + student.studyHours * 3.6 + student.gpa * 12,
      },
      {
        name: "Tree 5",
        features: "Assignments + attendance",
        pass: student.assignments >= 6 && student.attendance >= 72,
        score: 36 + student.assignments * 3.1 + student.attendance * 0.27,
      },
    ],
    [student],
  );

  const passVotes = trees.filter((tree) => tree.pass).length;
  const forestLabel = passVotes >= 3 ? "Pass" : "Fail";
  const forestScore = Math.round(
    trees.reduce((sum, tree) => sum + tree.score, 0) / trees.length,
  );

  // Feature importance as OOB-permutation-style weights (illustrative)
  const featureShare = [
    { label: "Study hours", value: 0.26 },
    { label: "Attendance", value: 0.30 },
    { label: "GPA", value: 0.18 },
    { label: "Assignments", value: 0.16 },
    { label: "Participation", value: 0.10 },
  ];

  return (
    <div className="lab-surface">
      <div className="control-grid">
        <label className="range-field">
          <span>Study hrs</span>
          <input
            type="range" min="0" max="12" step="1"
            value={student.studyHours}
            onChange={(e) => setStudent({ ...student, studyHours: Number(e.target.value) })}
            aria-label="Study hours per week"
          />
          <span className="tabular">{student.studyHours}</span>
        </label>
        <label className="range-field">
          <span>GPA</span>
          <input
            type="range" min="0" max="4" step="0.1"
            value={student.gpa}
            onChange={(e) => setStudent({ ...student, gpa: Number(e.target.value) })}
            aria-label="Current GPA"
          />
          <span className="tabular">{student.gpa.toFixed(1)}</span>
        </label>
        <label className="range-field">
          <span>Attend</span>
          <input
            type="range" min="30" max="100" step="1"
            value={student.attendance}
            onChange={(e) => setStudent({ ...student, attendance: Number(e.target.value) })}
            aria-label="Attendance percentage"
          />
          <span className="tabular">{student.attendance}%</span>
        </label>
        <label className="range-field">
          <span>Assign.</span>
          <input
            type="range" min="0" max="10" step="1"
            value={student.assignments}
            onChange={(e) => setStudent({ ...student, assignments: Number(e.target.value) })}
            aria-label="Assignments submitted"
          />
          <span className="tabular">{student.assignments}</span>
        </label>
        <label className="range-field">
          <span>Part.</span>
          <input
            type="range" min="0" max="1" step="0.05"
            value={student.participation}
            onChange={(e) => setStudent({ ...student, participation: Number(e.target.value) })}
            aria-label="Class participation ratio"
          />
          <span className="tabular">{Math.round(student.participation * 100)}%</span>
        </label>
      </div>

      <div className="forest-grid">
        {trees.map((tree) => (
          <article key={tree.name} className="tree-card" data-vote={tree.pass ? "pass" : "fail"}>
            <span className="kicker">{tree.name}</span>
            <p className="tree-card__features">{tree.features}</p>
            <p className="tree-card__verdict">{tree.pass ? "Pass" : "Fail"}</p>
            <strong className="tabular">{Math.round(tree.score)}</strong>
          </article>
        ))}
      </div>

      <div className="forest-summary">
        <div>
          <span className="kicker">Forest vote</span>
          <strong className="tabular">{forestLabel}</strong>
          <p className="lab-surface__caption tabular">
            {passVotes} of {trees.length} trees → majority says <strong>{forestLabel}</strong>.
          </p>
        </div>
        <div>
          <span className="kicker">Predicted score</span>
          <strong className="tabular">{forestScore}</strong>
          <p className="lab-surface__caption">
            Regression forest averages tree outputs instead of voting.
          </p>
        </div>
      </div>

      <div>
        <span className="kicker">Permutation importance (illustrative)</span>
        <div className="feature-bars">
          {featureShare.map((feature) => (
            <div key={feature.label} className="feature-bar">
              <span>{feature.label}</span>
              <div className="feature-bar__track">
                <div
                  className="feature-bar__fill"
                  style={{ width: `${clamp(feature.value, 0, 1) * 100}%` }}
                />
              </div>
              <span className="tabular">{Math.round(feature.value * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
