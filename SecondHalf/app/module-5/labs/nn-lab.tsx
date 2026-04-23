"use client";

import { useModule5Lab } from "./lab-context";
import { relu, sigmoid } from "./nn-utils";

export function NeuralNetworkLab() {
  const { student, setStudent } = useModule5Lab();

  const hoursSignal = student.studyHours / 12;
  const attendanceSignal = student.attendance / 100;
  const assignmentSignal = student.assignments / 10;

  const hidden = [
    relu(hoursSignal * 1.3 + attendanceSignal * 0.9 - 0.7),
    relu(assignmentSignal * 1.4 + attendanceSignal * 0.7 - 0.6),
    relu(hoursSignal * 0.5 + assignmentSignal * 0.8 + attendanceSignal * 0.6 - 0.55),
  ];
  const passProb = sigmoid(hidden[0] * 2.3 + hidden[1] * 1.8 + hidden[2] * 2.1 - 1.6);

  const inputs = [
    { label: "Study hours", value: hoursSignal },
    { label: "Attendance", value: attendanceSignal },
    { label: "Assignments", value: assignmentSignal },
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
      </div>

      <div className="nn-stage">
        <div className="nn-column">
          <span className="kicker">Input · x</span>
          {inputs.map((input) => (
            <div key={input.label} className="nn-node">
              <span className="nn-node__value tabular">{Math.round(input.value * 100)}%</span>
              <span className="nn-node__label">{input.label}</span>
            </div>
          ))}
        </div>
        <div className="nn-column">
          <span className="kicker">Hidden · ReLU(Wx + b)</span>
          {hidden.map((value, index) => (
            <div key={`h${index}`} className="nn-node nn-node--hidden">
              <span className="nn-node__value tabular">{value.toFixed(2)}</span>
              <span className="nn-node__label">Neuron {index + 1}</span>
            </div>
          ))}
        </div>
        <div className="nn-column">
          <span className="kicker">Output · σ(Wh + b)</span>
          <div className="nn-node nn-node--output">
            <span className="nn-node__value tabular">{Math.round(passProb * 100)}%</span>
            <span className="nn-node__label">P(Pass)</span>
          </div>
        </div>
      </div>

      <p className="lab-surface__caption">
        Data flows left to right during <strong>forward propagation</strong>. Training minimises the
        cross-entropy loss between <em>ŷ</em> and the true label by back-propagating its gradients into W and b
        at every layer.
      </p>
    </div>
  );
}
