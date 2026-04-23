"use client";

import { useDeferredValue, useMemo } from "react";
import { useModule5Lab } from "./lab-context";
import { NAMED_ENTITIES, STOP_WORDS, scoreSentiment, simpleLemma, tagToken } from "./nlp-utils";

const EXAMPLES: Array<{ label: string; text: string }> = [
  { label: "Positive", text: "I love this course because it is very helpful." },
  { label: "Complaint", text: "Amazon delivered my package late." },
  { label: "Spam", text: "Congratulations! You won a free iPhone. Click here now!" },
];

export function NlpLab() {
  const { sentence, setSentence } = useModule5Lab();
  const deferred = useDeferredValue(sentence);

  const pipeline = useMemo(() => {
    const cleaned = deferred
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const tokens = cleaned.length > 0 ? cleaned.split(" ") : [];
    const reduced = tokens.filter((token) => !STOP_WORDS.has(token));
    const lemmas = reduced.map(simpleLemma);
    const tags = tokens.slice(0, 6).map((token) => ({ token, tag: tagToken(token) }));
    const entities = tokens
      .filter((token) => NAMED_ENTITIES[token])
      .map((token) => `${token} → ${NAMED_ENTITIES[token]}`);
    const sentiment = scoreSentiment(lemmas);
    return { cleaned, tokens, reduced, lemmas, tags, entities, sentiment };
  }, [deferred]);

  return (
    <div className="lab-surface">
      <div className="lab-surface__controls">
        {EXAMPLES.map((example) => (
          <button
            key={example.label}
            type="button"
            className="mini-switch"
            data-active={sentence === example.text}
            onClick={() => setSentence(example.text)}
          >
            {example.label}
          </button>
        ))}
      </div>

      <label className="nlp-input">
        <span className="kicker">Input sentence</span>
        <textarea
          rows={3}
          value={sentence}
          onChange={(event) => setSentence(event.target.value)}
          aria-label="NLP pipeline input sentence"
          autoComplete="off"
          spellCheck={false}
        />
      </label>

      <div className="pipeline-grid">
        <article className="pipeline-step">
          <span className="kicker">1 · Clean</span>
          <p>{pipeline.cleaned || "Type a sentence."}</p>
        </article>
        <article className="pipeline-step">
          <span className="kicker">2 · Tokenise</span>
          <div className="token-list">
            {pipeline.tokens.map((token, index) => (
              <span key={`t-${index}-${token}`} className="token">{token}</span>
            ))}
          </div>
        </article>
        <article className="pipeline-step">
          <span className="kicker">3 · Remove stop words</span>
          <div className="token-list">
            {pipeline.reduced.map((token, index) => (
              <span key={`r-${index}-${token}`} className="token token--accent">{token}</span>
            ))}
          </div>
        </article>
        <article className="pipeline-step">
          <span className="kicker">4 · Lemmatise</span>
          <div className="token-list">
            {pipeline.lemmas.map((lemma, index) => (
              <span key={`l-${index}-${lemma}`} className="token token--accent">{lemma}</span>
            ))}
          </div>
        </article>
        <article className="pipeline-step">
          <span className="kicker">5 · POS + NER</span>
          <ul className="micro-list">
            {pipeline.tags.map(({ token, tag }) => (
              <li key={`${token}-${tag}`}>{token} → {tag}</li>
            ))}
            {pipeline.entities.map((entity) => (
              <li key={entity}>{entity}</li>
            ))}
          </ul>
        </article>
        <article className="pipeline-step">
          <span className="kicker">6 · Output</span>
          <p>Sentiment: <strong>{pipeline.sentiment}</strong></p>
        </article>
      </div>
    </div>
  );
}
