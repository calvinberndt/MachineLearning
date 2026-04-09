"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";

type LabView = "network" | "nlp" | "cnn";

const tabs: Array<{ id: LabView; label: string }> = [
  { id: "network", label: "Neural network" },
  { id: "nlp", label: "NLP pipeline" },
  { id: "cnn", label: "CNN lab" },
];

const stopWords = new Set([
  "a",
  "an",
  "because",
  "i",
  "is",
  "it",
  "my",
  "the",
  "this",
  "to",
  "very",
]);

const lemmaMap: Record<string, string> = {
  delivered: "deliver",
  helpful: "helpful",
  studying: "study",
  studies: "study",
  studied: "study",
  won: "win",
};

const namedEntityMap: Record<string, string> = {
  amazon: "Organization",
  farzana: "Person",
  uwgb: "Organization",
  wisconsin: "Location",
};

const verticalKernel = [
  [1, 0, -1],
  [1, 0, -1],
  [1, 0, -1],
];

const horizontalKernel = [
  [1, 1, 1],
  [0, 0, 0],
  [-1, -1, -1],
];

const blankGrid = () =>
  Array.from({ length: 6 }, () => Array.from({ length: 6 }, () => 0));

const presetVertical = () => [
  [0, 0, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 0],
];

const presetHorizontal = () => [
  [0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
];

function sigmoid(value: number) {
  return 1 / (1 + Math.exp(-value));
}

function relu(value: number) {
  return Math.max(0, value);
}

function simpleLemma(token: string) {
  if (lemmaMap[token]) {
    return lemmaMap[token];
  }

  if (token.endsWith("ing") && token.length > 4) {
    return token.slice(0, -3);
  }

  if (token.endsWith("ed") && token.length > 3) {
    return token.slice(0, -2);
  }

  if (token.endsWith("s") && token.length > 3) {
    return token.slice(0, -1);
  }

  return token;
}

function tagToken(token: string) {
  if (["i", "you", "we", "they", "my"].includes(token)) {
    return "Pronoun";
  }
  if (["love", "deliver", "won", "win", "submitted"].includes(simpleLemma(token))) {
    return "Verb";
  }
  if (["helpful", "late", "free", "amazing"].includes(token)) {
    return "Adjective";
  }
  return "Noun";
}

function convolve(grid: number[][], kernel: number[][]) {
  const result: number[][] = [];

  for (let row = 0; row <= grid.length - kernel.length; row += 1) {
    const currentRow: number[] = [];

    for (let col = 0; col <= grid[0].length - kernel[0].length; col += 1) {
      let sum = 0;

      for (let kernelRow = 0; kernelRow < kernel.length; kernelRow += 1) {
        for (let kernelCol = 0; kernelCol < kernel[0].length; kernelCol += 1) {
          sum += grid[row + kernelRow][col + kernelCol] * kernel[kernelRow][kernelCol];
        }
      }

      currentRow.push(sum);
    }

    result.push(currentRow);
  }

  return result;
}

function maxPool(grid: number[][]) {
  const result: number[][] = [];

  for (let row = 0; row < grid.length; row += 2) {
    const currentRow: number[] = [];

    for (let col = 0; col < grid[0].length; col += 2) {
      const values = [
        grid[row]?.[col] ?? 0,
        grid[row]?.[col + 1] ?? 0,
        grid[row + 1]?.[col] ?? 0,
        grid[row + 1]?.[col + 1] ?? 0,
      ];

      currentRow.push(Math.max(...values));
    }

    result.push(currentRow);
  }

  return result;
}

function renderIntensity(value: number, positiveOnly = false) {
  const normalized = positiveOnly
    ? Math.max(0, value) / 4
    : (Math.max(-4, Math.min(4, value)) + 4) / 8;
  const alpha = Math.max(0.08, Math.min(1, normalized));
  return `rgba(255, 181, 79, ${alpha})`;
}

export function Module6Lab() {
  const [view, setView] = useState<LabView>("network");
  const [studyHours, setStudyHours] = useState(6);
  const [attendance, setAttendance] = useState(82);
  const [assignments, setAssignments] = useState(8);
  const [sentence, setSentence] = useState("I love this course because it is very helpful.");
  const deferredSentence = useDeferredValue(sentence);
  const [kernelMode, setKernelMode] = useState<"vertical" | "horizontal">("vertical");
  const [grid, setGrid] = useState<number[][]>(presetVertical);

  const hoursSignal = studyHours / 12;
  const attendanceSignal = attendance / 100;
  const assignmentSignal = assignments / 10;

  const hiddenNodes = [
    relu(hoursSignal * 1.3 + attendanceSignal * 0.9 - 0.7),
    relu(assignmentSignal * 1.4 + attendanceSignal * 0.7 - 0.6),
    relu(hoursSignal * 0.5 + assignmentSignal * 0.8 + attendanceSignal * 0.6 - 0.55),
  ];
  const passProbability = sigmoid(hiddenNodes[0] * 2.3 + hiddenNodes[1] * 1.8 + hiddenNodes[2] * 2.1 - 1.6);

  const cleanedText = deferredSentence
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const tokens = cleanedText.length > 0 ? cleanedText.split(" ") : [];
  const reducedTokens = tokens.filter((token) => !stopWords.has(token));
  const lemmas = reducedTokens.map((token) => simpleLemma(token));
  const posTags = tokens.map((token) => ({ token, tag: tagToken(token) }));
  const namedEntities = tokens
    .filter((token) => namedEntityMap[token])
    .map((token) => `${token} → ${namedEntityMap[token]}`);
  const sentimentScore = lemmas.reduce((score, token) => {
    if (["love", "helpful", "amazing"].includes(token)) {
      return score + 1;
    }
    if (["late", "free", "complaint", "spam"].includes(token)) {
      return score - 1;
    }
    return score;
  }, 0);
  const sentiment = sentimentScore > 0 ? "Positive" : sentimentScore < 0 ? "Negative" : "Neutral";

  const activeKernel = kernelMode === "vertical" ? verticalKernel : horizontalKernel;
  const convolved = convolve(grid, activeKernel);
  const reluMap = convolved.map((row) => row.map((value) => relu(value)));
  const pooled = maxPool(reluMap);
  const strongestFeature = Math.max(...pooled.flat());

  return (
    <article className="module-page" data-tone="module-6">
      <section className="module-hero">
        <div>
          <p className="hero-kicker">Module 6</p>
          <h1 className="module-title">Deep learning turns raw input into layered features.</h1>
          <p className="module-copy">
            Start with neuron activations, move through an NLP pipeline, then watch a CNN pull edges
            out of a grid of pixels. This module is about representation: what the model notices, and
            how that noticing becomes a prediction.
          </p>
        </div>
        <aside className="module-note">
          <p className="section-tag">Study frame</p>
          <p>
            When a question asks what makes deep learning different, the short answer is that the
            network learns useful features directly from raw input instead of needing most features
            handcrafted first.
          </p>
        </aside>
      </section>

      <div className="lab-nav" role="tablist" aria-label="Module 6 sections">
        {tabs.map((tab) => (
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

      {view === "network" ? (
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
                  value={studyHours}
                  onChange={(event) => setStudyHours(Number(event.target.value))}
                />
                <span className="readout">{studyHours}</span>
              </label>
              <label className="control">
                <span className="range-label">Attendance</span>
                <input
                  max="100"
                  min="30"
                  step="1"
                  type="range"
                  value={attendance}
                  onChange={(event) => setAttendance(Number(event.target.value))}
                />
                <span className="readout">{attendance}%</span>
              </label>
              <label className="control">
                <span className="range-label">Assignments submitted</span>
                <input
                  max="10"
                  min="0"
                  step="1"
                  type="range"
                  value={assignments}
                  onChange={(event) => setAssignments(Number(event.target.value))}
                />
                <span className="readout">{assignments}</span>
              </label>
            </div>

            <div className="network-stage">
              <div className="node-column">
                <p className="section-tag">Input layer</p>
                {[
                  { label: "Study hours", value: hoursSignal },
                  { label: "Attendance", value: attendanceSignal },
                  { label: "Assignments", value: assignmentSignal },
                ].map((node) => (
                  <div key={node.label} className="node-row">
                    <div className="node">
                      <span>{Math.round(node.value * 100)}%</span>
                    </div>
                    <span className="node-label">{node.label}</span>
                  </div>
                ))}
              </div>
              <div className="node-column">
                <p className="section-tag">Hidden layer</p>
                {hiddenNodes.map((value, index) => (
                  <div key={`hidden-${index}`} className="node-row">
                    <div className="node node--accent">
                      <span>{value.toFixed(2)}</span>
                    </div>
                    <span className="node-label">Neuron {index + 1}</span>
                  </div>
                ))}
              </div>
              <div className="node-column">
                <p className="section-tag">Output layer</p>
                <div className="node-row">
                  <div className="node node--strong">
                    <span>{Math.round(passProbability * 100)}%</span>
                  </div>
                  <span className="node-label">Probability of Pass</span>
                </div>
              </div>
            </div>

            <div className="concept-copy">
              <p className="section-tag">Forward propagation</p>
              <h2 className="section-title">Data flows forward, then loss tells the network how wrong it was.</h2>
              <p className="section-copy">
                In class terms: inputs enter, hidden layers extract patterns, the output layer makes
                a prediction, and backpropagation adjusts the weights for the next round.
              </p>
            </div>
          </div>

          <aside className="study-panel">
            <p className="section-tag">Further study</p>
            <ul className="resource-list">
              <li>
                <Link href="https://www.youtube.com/watch?v=aircAruvnKk" target="_blank">
                  3Blue1Brown: But what is a neural network?
                </Link>
              </li>
            </ul>
          </aside>
        </section>
      ) : null}

      {view === "nlp" ? (
        <section className="lab-layout">
          <div className="lab-surface">
            <div className="control-row">
              <button
                className="mini-switch"
                type="button"
                onClick={() => setSentence("I love this course because it is very helpful.")}
              >
                Positive example
              </button>
              <button
                className="mini-switch"
                type="button"
                onClick={() => setSentence("Amazon delivered my package late.")}
              >
                Complaint example
              </button>
              <button className="mini-switch" type="button" onClick={() => setSentence("Congratulations! You won a free iPhone. Click here now!")}>
                Spam example
              </button>
            </div>

            <label className="control control--textarea">
              <span className="range-label">Input sentence</span>
              <textarea rows={4} value={sentence} onChange={(event) => setSentence(event.target.value)} />
            </label>

            <div className="pipeline-grid">
              <article className="pipeline-step">
                <p className="section-tag">1. Clean</p>
                <p>{cleanedText || "Type a sentence above."}</p>
              </article>
              <article className="pipeline-step">
                <p className="section-tag">2. Tokenize</p>
                <div className="token-list">
                  {tokens.map((token, index) => (
                    <span key={`token-${index}-${token}`} className="token">
                      {token}
                    </span>
                  ))}
                </div>
              </article>
              <article className="pipeline-step">
                <p className="section-tag">3. Remove stop words</p>
                <div className="token-list">
                  {reducedTokens.map((token, index) => (
                    <span key={`reduced-${index}-${token}`} className="token token--accent">
                      {token}
                    </span>
                  ))}
                </div>
              </article>
              <article className="pipeline-step">
                <p className="section-tag">4. Lemmatize</p>
                <div className="token-list">
                  {lemmas.map((lemma, index) => (
                    <span key={`lemma-${lemma}-${index}`} className="token token--accent">
                      {lemma}
                    </span>
                  ))}
                </div>
              </article>
              <article className="pipeline-step">
                <p className="section-tag">5. POS / NER</p>
                <ul className="micro-list">
                  {posTags.slice(0, 5).map(({ token, tag }) => (
                    <li key={`${token}-${tag}`}>
                      {token} → {tag}
                    </li>
                  ))}
                  {namedEntities.map((entity) => (
                    <li key={entity}>{entity}</li>
                  ))}
                </ul>
              </article>
              <article className="pipeline-step">
                <p className="section-tag">6. Output</p>
                <p>
                  Sentiment: <strong>{sentiment}</strong>
                </p>
              </article>
            </div>

            <p className="section-copy">
              This classroom demo is deliberately simple, but it mirrors the sequence in your
              professor&apos;s notes: clean the text, split it, reduce it, represent it, then predict.
            </p>
          </div>

          <aside className="study-panel">
            <p className="section-tag">Further study</p>
            <ul className="resource-list">
              <li>
                <Link href="https://www.nltk.org/book/" target="_blank">
                  Natural Language Processing with Python
                </Link>
              </li>
            </ul>
          </aside>
        </section>
      ) : null}

      {view === "cnn" ? (
        <section className="lab-layout">
          <div className="lab-surface">
            <div className="control-row">
              <button
                className="mini-switch"
                data-active={kernelMode === "vertical"}
                onClick={() => setKernelMode("vertical")}
                type="button"
              >
                Vertical edge filter
              </button>
              <button
                className="mini-switch"
                data-active={kernelMode === "horizontal"}
                onClick={() => setKernelMode("horizontal")}
                type="button"
              >
                Horizontal edge filter
              </button>
              <button className="mini-switch" type="button" onClick={() => setGrid(presetVertical())}>
                Load vertical pattern
              </button>
              <button className="mini-switch" type="button" onClick={() => setGrid(presetHorizontal())}>
                Load horizontal pattern
              </button>
              <button className="mini-switch" type="button" onClick={() => setGrid(blankGrid())}>
                Clear grid
              </button>
            </div>

            <div className="cnn-grid">
              <div>
                <p className="section-tag">Input image</p>
                <div className="matrix">
                  {grid.map((row, rowIndex) =>
                    row.map((value, colIndex) => (
                      <button
                        key={`cell-${rowIndex}-${colIndex}`}
                        className="matrix-cell"
                        data-on={value === 1}
                        type="button"
                        onClick={() =>
                          setGrid((current) =>
                            current.map((currentRow, currentRowIndex) =>
                              currentRow.map((currentValue, currentColIndex) =>
                                currentRowIndex === rowIndex && currentColIndex === colIndex
                                  ? currentValue === 1
                                    ? 0
                                    : 1
                                  : currentValue,
                              ),
                            ),
                          )
                        }
                      />
                    )),
                  )}
                </div>
              </div>

              <div>
                <p className="section-tag">Kernel</p>
                <div className="mini-matrix">
                  {activeKernel.flat().map((value, index) => (
                    <span key={`kernel-${index}`} className="mini-matrix__cell">
                      {value}
                    </span>
                  ))}
                </div>
                <p className="section-copy">
                  The filter slides across the image and scores how strongly that local patch matches
                  the pattern.
                </p>
              </div>

              <div>
                <p className="section-tag">Convolution output</p>
                <div className="mini-matrix mini-matrix--wide">
                  {convolved.flat().map((value, index) => (
                    <span
                      key={`conv-${index}`}
                      className="mini-matrix__cell"
                      style={{ background: renderIntensity(value) }}
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="section-tag">ReLU + pooling</p>
                <div className="mini-matrix mini-matrix--wide">
                  {pooled.flat().map((value, index) => (
                    <span
                      key={`pool-${index}`}
                      className="mini-matrix__cell"
                      style={{ background: renderIntensity(value, true) }}
                    >
                      {value}
                    </span>
                  ))}
                </div>
                <p className="section-copy">
                  Strongest retained feature: <strong>{strongestFeature}</strong>
                </p>
              </div>
            </div>
          </div>

          <aside className="study-panel">
            <p className="section-tag">Further study</p>
            <ul className="resource-list">
              <li>
                <Link href="https://www.tensorflow.org/tutorials/images/cnn" target="_blank">
                  TensorFlow CNN tutorial
                </Link>
              </li>
              <li>
                <Link href="https://www.youtube.com/watch?v=YRhxdVk_sIs" target="_blank">
                  deeplizard: CNNs explained
                </Link>
              </li>
            </ul>
          </aside>
        </section>
      ) : null}
    </article>
  );
}
