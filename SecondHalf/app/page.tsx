import Link from "next/link";
import { SourceTrail, sourceGroups } from "./source-trail";

const CHAPTERS = [
  {
    number: "01",
    kicker: "Module 3 · Unsupervised + nearby classifiers",
    title: "Finding structure with and without labels.",
    lede: "K-means clustering, K-nearest neighbors, and support vector machines.",
    href: "/module-3",
  },
  {
    number: "02",
    kicker: "Module 4 · Ensemble learning",
    title: "Many wobbly learners, one steady prediction.",
    lede: "Bagging, boosting, stacking, voting, and the mechanics of Random Forest.",
    href: "/module-4",
  },
  {
    number: "03",
    kicker: "Module 5 · Deep learning",
    title: "Representations that learn themselves.",
    lede: "Neural network forward/backward pass, the NLP pipeline, and convolution.",
    href: "/module-5",
  },
  {
    number: "04",
    kicker: "Module 6 · OpenAI & LLMs",
    title: "From transformer cores to usable AI systems.",
    lede: "OpenAI tools, self-attention, training stages, and the LLM landscape.",
    href: "/module-6",
  },
  {
    number: "05",
    kicker: "Practice",
    title: "Exam-style quiz generator.",
    lede: "Fresh multiple-choice and fill-in-the-blank sets drawn from every module.",
    href: "/quiz",
  },
];

export default function HomePage() {
  return (
    <div className="home">
      {/* 1. Calm hero */}
      <section className="home-hero">
        <span className="home-hero__kicker">COMP SCI 465 · Spring 2026</span>
        <h1 className="home-hero__title">
          A study lab for the second half of machine learning.
        </h1>
        <p className="home-hero__deck">
          Four interactive modules and a practice quiz, aligned to the COMP SCI 465 syllabus.
          Work through a concept, move the sliders, then test yourself.
        </p>
        <div className="home-hero__actions">
          <Link className="home-cta home-cta--primary" href="/module-3">
            Start · Module 3
          </Link>
          <Link className="home-cta" href="#chapters">
            Browse modules
          </Link>
        </div>
        <div className="home-hero__backdrop" aria-hidden="true" />
      </section>

      {/* 2. Chaptered module index */}
      <section id="chapters" className="home-chapters" aria-label="Modules">
        <header className="home-chapters__head">
          <span className="home-kicker">The second-half syllabus</span>
          <h2 className="home-chapters__title">Five stops in sequence.</h2>
        </header>
        <ol className="home-chapters__list">
          {CHAPTERS.map((chapter, index) => (
            <li
              key={chapter.href}
              className="home-chapter"
              style={{ ["--stagger" as string]: `${index * 80}ms` }}
            >
              <Link href={chapter.href} className="home-chapter__link">
                <span className="home-chapter__number tabular">{chapter.number}</span>
                <div className="home-chapter__body">
                  <span className="home-kicker">{chapter.kicker}</span>
                  <h3 className="home-chapter__title">{chapter.title}</h3>
                  <p className="home-chapter__lede">{chapter.lede}</p>
                </div>
                <span className="home-chapter__arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* 3. Approach note */}
      <section className="home-approach">
        <span className="home-kicker">How each module reads</span>
        <p>
          Every concept follows the same six-slot template: a one-sentence definition, a rendered
          formula with short derivation, an intuition section, an interactive worked example, a
          correction-marked pitfall, and a curated pair of further-reading links. Click the ML Study
          Lab wordmark to jump across modules; each module&apos;s sidebar indexes its own sections.
        </p>
      </section>

      {/* 4. Source trail (compact) */}
      <SourceTrail title="Design references" sources={sourceGroups.learning} />
    </div>
  );
}
