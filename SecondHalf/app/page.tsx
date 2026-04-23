import Link from "next/link";
import { LearningTracks, SourceTrail, sourceGroups } from "./source-trail";

const modules = [
  {
    href: "/module-3",
    label: "Module 3",
    title: "Unsupervised ML and nearby classifiers",
    tone: "module-3",
    note:
      "Clustering is the true unsupervised piece here. KNN and SVM are supervised classifiers that your professor also grouped into this study stretch.",
    bullets: ["K-means clustering", "KNN classification", "SVM margins and kernels"],
  },
  {
    href: "/module-4",
    label: "Module 4",
    title: "Ensemble learning and random forests",
    tone: "module-4",
    note:
      "Learn how multiple weak or moderate models combine into stronger decisions, then explore a forest that predicts both class labels and scores.",
    bullets: ["Bagging vs boosting", "Voting and stacking", "Random forest intuition"],
  },
  {
    href: "/module-5",
    label: "Module 5",
    title: "Deep learning, NLP, and CNNs",
    tone: "module-5",
    note:
      "Move from neural-network foundations into an NLP pipeline and a visual CNN sandbox that shows convolution, ReLU, and pooling.",
    bullets: ["Neural network flow", "NLP preprocessing pipeline", "CNN feature extraction"],
  },
  {
    href: "/quiz",
    label: "Quiz",
    title: "Practice exam generator",
    tone: "quiz",
    note:
      "Spin up fresh practice sets built from the question patterns your professor uses, mostly multiple choice with a few fill-in-the-blank checks.",
    bullets: ["Mostly multiple choice", "Auto-graded feedback", "Cross-module review"],
  },
];

export default function HomePage() {
  return (
    <div className="page-shell">
      <section className="poster">
        <div className="poster-copy">
          <p className="hero-kicker">Canvas-first review with visible outside sources</p>
          <h1 className="hero-title">
            A whiteboard study lab
            <br />
            for cramming and actually understanding.
          </h1>
          <p className="hero-copy">
            Three visual labs and one practice exam, anchored to your professor&apos;s Canvas material.
            Use the Cram track for fast recall, then use the Deep track and diagrams to make the
            concepts durable.
          </p>
          <div className="hero-actions">
            <Link className="action action--primary" href="/module-3">
              Start with Module 3
            </Link>
            <Link className="action" href="/quiz">
              Open Practice Exam
            </Link>
          </div>
          <div className="poster-notes">
            <div className="poster-note">
              <span className="section-tag">Source of truth</span>
              <strong>Canvas notes decide what matters for the course</strong>
            </div>
            <div className="poster-note">
              <span className="section-tag">Study modes</span>
              <strong>Exam-cram memory hooks plus deeper representations</strong>
            </div>
            <div className="poster-note">
              <span className="section-tag">Citations</span>
              <strong>Outside links are visible where they influence the lesson</strong>
            </div>
          </div>
        </div>
        <div className="poster-grid" aria-hidden="true">
          <div className="signal signal--warm" />
          <div className="signal signal--cool" />
          <div className="signal signal--green" />
          <div className="poster-matrix">
            <span>cluster</span>
            <span>margin</span>
            <span>forest</span>
            <span>kernel</span>
            <span>token</span>
            <span>convolve</span>
          </div>
          <div className="poster-rail">
            <div className="poster-rail__line" />
            <div className="poster-rail__stop">
              <strong>Module 3</strong>
              <span>K-means, KNN, SVM</span>
            </div>
            <div className="poster-rail__stop">
              <strong>Module 4</strong>
              <span>Bagging, forests, voting</span>
            </div>
            <div className="poster-rail__stop">
              <strong>Module 5</strong>
              <span>NLP, deep learning, CNNs</span>
            </div>
            <div className="poster-rail__stop">
              <strong>Quiz</strong>
              <span>Professor-style practice sets</span>
            </div>
          </div>
        </div>
      </section>

      <LearningTracks
        cram={[
          "Memorize the professor's definitions, algorithm steps, and compare/contrast traps.",
          "After each module, switch into Quiz mode and grade yourself immediately.",
          "Use source trails only when a Canvas idea needs a second explanation.",
        ]}
        deep={[
          "Treat each algorithm as a representation: points, distances, margins, trees, tokens, matrices, or feature maps.",
          "Move sliders and tabs until you can predict the diagram before it changes.",
          "Use outside sources to verify intuition, not to replace the Canvas emphasis.",
        ]}
      />

      <section className="module-strip" aria-label="Module navigation">
        {modules.map((module) => (
          <Link
            key={module.href}
            className="module-ticket"
            data-tone={module.tone}
            href={module.href}
          >
            <span className="module-ticket__eyebrow">{module.label}</span>
            <strong className="module-ticket__title">{module.title}</strong>
            <span className="module-ticket__note">{module.note}</span>
            <ul className="module-ticket__list">
              {module.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </Link>
        ))}
      </section>

      <section className="study-grid">
        <article className="study-panel">
          <p className="section-tag">How to use it</p>
          <h2 className="section-title">Read it, draw it, move it, test it.</h2>
          <p className="section-copy">
            The new structure is built for two passes. First, cram the Canvas Core and memory
            hooks. Second, use the diagrams to understand how the model represents the data.
          </p>
        </article>
        <article className="study-panel">
          <p className="section-tag">Course focus</p>
          <h2 className="section-title">What this covers from your posted material</h2>
          <p className="section-copy">
            Module 3: clustering, KNN code, SVM. Module 4: ensemble learning and random forests.
            Module 5: deep learning, what NLP is, and CNN algorithm details.
          </p>
        </article>
        <article className="study-panel">
          <p className="section-tag">Exam mindset</p>
          <h2 className="section-title">Watch for compare-and-contrast questions.</h2>
          <p className="section-copy">
            The highest-value study habit here is comparing methods: supervised vs unsupervised,
            bagging vs boosting, linear boundaries vs kernels, and feature extraction vs end-to-end
            representation learning.
          </p>
        </article>
        <article className="study-panel">
          <p className="section-tag">Practice mode</p>
          <h2 className="section-title">Then switch into quiz mode.</h2>
          <p className="section-copy">
            Use the Quiz tab after each module run-through. It generates fresh multiple-choice and
            fill-in-the-blank questions in the same style your professor has been posting.
          </p>
        </article>
      </section>

      <SourceTrail title="Learning design references" sources={sourceGroups.learning} />
    </div>
  );
}
