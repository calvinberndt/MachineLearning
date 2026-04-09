"use client";

import { startTransition, useMemo, useState } from "react";
import { generateExam, normalize, type Question } from "./exam-utils";

export function PracticeQuizLab() {
  const [examSeed, setExamSeed] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const exam = useMemo(() => generateExam(examSeed), [examSeed]);

  const score = useMemo(
    () =>
      exam.reduce((total, question) => {
        return total + Number(normalize(answers[question.id] ?? "") === normalize(question.answer));
      }, 0),
    [answers, exam],
  );

  const totalQuestions = exam.length;
  const multipleChoiceCount = exam.filter((question) => question.type === "multiple-choice").length;
  const fillBlankCount = totalQuestions - multipleChoiceCount;

  return (
    <article className="module-page" data-tone="quiz">
      <section className="module-hero">
        <div>
          <p className="hero-kicker">Practice Exam</p>
          <h1 className="module-title">A quiz tab that feels like your professor&apos;s style.</h1>
          <p className="module-copy">
            This page generates a fresh practice set from the same topics you posted: clustering,
            KNN, SVM, ensemble learning, random forests, deep learning, NLP, and CNNs. It leans
            heavily multiple choice, with a couple fill-in-the-blank questions mixed in.
          </p>
        </div>
        <aside className="module-note">
          <p className="section-tag">Exam pattern</p>
          <p>
            Each generated set includes <strong>{multipleChoiceCount} multiple-choice</strong> and{" "}
            <strong>{fillBlankCount} fill-in-the-blank</strong> questions.
          </p>
        </aside>
      </section>

      <section className="quiz-toolbar">
        <button
          className="action action--primary"
          type="button"
          onClick={() =>
            startTransition(() => {
              setExamSeed((current) => current + 3);
              setAnswers({});
              setSubmitted(false);
            })
          }
        >
          Generate New Practice Exam
        </button>
        <button className="action" type="button" onClick={() => setSubmitted(true)}>
          Grade My Answers
        </button>
        {submitted ? (
          <div className="quiz-score">
            Score: <strong>{score}</strong> / {totalQuestions}
          </div>
        ) : null}
      </section>

      <section className="quiz-grid">
        {exam.map((question, index) => {
          const correct = normalize(answers[question.id] ?? "") === normalize(question.answer);

          return (
            <article key={question.id} className="quiz-card">
              <div className="quiz-card__header">
                <span className="module-ticket__eyebrow">{question.module}</span>
                <span className="quiz-type">{question.type === "multiple-choice" ? "Multiple choice" : "Fill in the blank"}</span>
              </div>
              <h2 className="quiz-card__title">
                {index + 1}. {question.prompt}
              </h2>

              {question.type === "multiple-choice" ? (
                <div className="quiz-options" role="radiogroup" aria-label={question.prompt}>
                  {question.choices?.map((choice) => (
                    <label key={choice} className="quiz-option">
                      <input
                        checked={answers[question.id] === choice}
                        name={question.id}
                        type="radio"
                        value={choice}
                        onChange={(event) =>
                          setAnswers((current) => ({ ...current, [question.id]: event.target.value }))
                        }
                      />
                      <span>{choice}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <label className="control control--textarea">
                  <span className="range-label">Your answer</span>
                  <input
                    className="quiz-input"
                    type="text"
                    value={answers[question.id] ?? ""}
                    onChange={(event) =>
                      setAnswers((current) => ({ ...current, [question.id]: event.target.value }))
                    }
                  />
                </label>
              )}

              {submitted ? (
                <div className="quiz-feedback" data-correct={correct}>
                  <p>
                    <strong>{correct ? "Correct." : "Not quite."}</strong>{" "}
                    {!correct ? `Expected answer: ${question.answer}. ` : null}
                    {question.explanation}
                  </p>
                </div>
              ) : null}
            </article>
          );
        })}
      </section>
    </article>
  );
}
