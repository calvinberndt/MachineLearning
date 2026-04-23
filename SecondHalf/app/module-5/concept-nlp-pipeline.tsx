import { Concept } from "../(shell)/concept";
import { MarginNote } from "../(shell)/margin-note";
import { NlpLab } from "./labs/nlp-lab";

export function ConceptNlpPipeline() {
  return (
    <Concept section="5.2" slug="nlp-pipeline" title="NLP pipeline">
      <Concept.Definition>
        A sequence of text-processing stages that turns raw language into features a model can learn from:
        cleaning, tokenisation, stop-word removal, lemmatisation, part-of-speech / named-entity tagging, and
        task-specific scoring.
      </Concept.Definition>

      <Concept.Formula caption="Canvas 6-step pipeline">
        <div className="concept__derivation">
          <span>1. <strong>Clean.</strong> Lowercase, strip punctuation + numbers, collapse whitespace.</span>
          <span>2. <strong>Tokenise.</strong> Split on whitespace / punctuation into units.</span>
          <span>3. <strong>Remove stop words.</strong> Drop high-frequency low-information tokens (the, a, is…).</span>
          <span>4. <strong>Lemmatise.</strong> Reduce inflected forms to a base lemma (studying → study).</span>
          <span>5. <strong>POS + NER.</strong> Tag each token with syntax role or entity category.</span>
          <span>6. <strong>Represent + predict.</strong> Map to vectors (Bag-of-Words, TF-IDF) and classify.</span>
        </div>
      </Concept.Formula>

      <Concept.Intuition>
        <p>
          The classroom pipeline is pedagogically clean: each step is visible, reversible, and easy to inspect.
          In the demo below, type or pick an example and watch the same sentence propagate through all six
          stages. Sentiment is scored from the final lemma set.
        </p>
        <p>
          Lemmatisation <em>helps</em> when morphology is noise (study / studied / studying all mean the same
          thing). It <em>hurts</em> when morphology is signal (positive run / positively runs carries tense
          information that may matter).
        </p>
      </Concept.Intuition>

      <Concept.WorkedExample title="Sentence → pipeline → sentiment">
        <NlpLab />
      </Concept.WorkedExample>

      <Concept.Pitfall title="Production NLP skips most of this.">
        <p>
          Modern systems replace hand-crafted tokenisation with <strong>subword algorithms</strong> (BPE,
          WordPiece, SentencePiece) that learn an optimal vocabulary from data, and replace bag-of-words with
          <strong> learned embeddings</strong> (Word2Vec, GloVe, BERT contextual embeddings). The classroom
          pipeline teaches the <em>ideas</em> — cleaning, representing, predicting — but very little of its
          code survives in production.
        </p>
      </Concept.Pitfall>

      <Concept.FurtherReading>
        <ul>
          <li>
            <a href="https://www.nltk.org/book/" rel="noreferrer" target="_blank">
              NLTK Book · classical NLP pipeline
            </a>
          </li>
          <li>
            <a href="https://huggingface.co/learn/nlp-course/chapter2/4" rel="noreferrer" target="_blank">
              Hugging Face · Tokenizers explained
            </a>
          </li>
        </ul>
      </Concept.FurtherReading>

      <MarginNote variant="correction">
        Stop-word removal is <em>not</em> always a win. For sentiment (&quot;not good&quot;) or intent
        classification, high-frequency words carry critical signal. Validate on your data.
      </MarginNote>
      <MarginNote variant="aside" label="Production note">
        BERT-style models tokenise into subwords: <em>unbelievable</em> → <code>un</code> + <code>##believ</code>{" "}
        + <code>##able</code>. Unknown words never hit an <code>&lt;UNK&gt;</code> token.
      </MarginNote>
    </Concept>
  );
}
