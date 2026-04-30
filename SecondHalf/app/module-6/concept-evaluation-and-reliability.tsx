import { Concept } from "../(shell)/concept";
import { BlockMath, InlineMath } from "../(shell)/katex";
import { MarginNote } from "../(shell)/margin-note";
import { EvaluationLab } from "./labs/evaluation-lab";

export function ConceptEvaluationAndReliability() {
  return (
    <Concept section="6.4" slug="evaluation-and-reliability" title="Evaluation and reliability">
      <Concept.Definition>
        Model evaluation matches the metric to the task, then checks whether errors are fair, stable, and safe
        enough for deployment.
      </Concept.Definition>

      <Concept.Formula caption="Classification and generation metrics">
        <BlockMath ariaLabel="Precision recall F1 and perplexity formulas">
          {`\\text{Precision}=\\frac{TP}{TP+FP},\\quad \\text{Recall}=\\frac{TP}{TP+FN},\\quad F_1=\\frac{2PR}{P+R},\\quad \\text{PPL}=e^{H}`}
        </BlockMath>
        <ul className="concept__derivation">
          <li>
            Accuracy is only safe when classes and costs are balanced. With rare positives, compare{" "}
            <InlineMath>{`TP`}</InlineMath>, <InlineMath>{`FP`}</InlineMath>,{" "}
            <InlineMath>{`FN`}</InlineMath>, precision, recall, and F1.
          </li>
          <li>
            Random Forests reduce variance through averaging; CNNs and NLP systems still need subgroup tests
            when deployment conditions change.
          </li>
          <li>
            LLMs add open-ended checks: perplexity, cross-entropy, task accuracy/F1, human ratings, factuality,
            safety, consistency, and hallucination rate.
          </li>
        </ul>
      </Concept.Formula>

      <Concept.Intuition>
        <p>
          Bias and variance are not only training-set vocabulary. Bias appears when a model systematically
          misses a group, a context, or a language pattern. Variance appears when small data or prompt changes
          produce unstable predictions. A high headline score can hide both problems.
        </p>
        <p>
          Use the deployment cost to choose the metric. Fraud detection and medical screening often prefer high
          recall because missed positives are expensive. A moderation or support assistant also needs human
          review triggers because fluent text can still be irrelevant, unsafe, or fabricated.
        </p>
        <p>
          The same logic links earlier modules: ensemble diversity in §4.1, Random Forest variance reduction in
          §4.2, CNN robustness in §5.3, and NLP ambiguity in §5.2 all become evaluation questions before a
          model is accepted.
        </p>
      </Concept.Intuition>

      <Concept.WorkedExample title="Tune threshold and temperature, then inspect the error profile">
        <EvaluationLab />
      </Concept.WorkedExample>

      <Concept.Pitfall title="Do not defend a model with one metric.">
        <p>
          A model can be 95% accurate and still fail the cases that matter most. Always ask which errors are
          hidden by the average, whether the model is stable on new data, and whether the deployment context
          changes the cost of false positives or false negatives.
        </p>
      </Concept.Pitfall>

      <Concept.FurtherReading>
        <ul>
          <li>
            <a href="https://crfm-helm.readthedocs.io/" rel="noreferrer" target="_blank">
              Stanford CRFM · HELM
            </a>
          </li>
          <li>
            <a href="https://github.com/openai/evals" rel="noreferrer" target="_blank">
              OpenAI Evals
            </a>
          </li>
        </ul>
      </Concept.FurtherReading>

      <MarginNote variant="correction">
        Lower perplexity means the model predicts text more confidently. It is not a guarantee of truth,
        fairness, safety, or usefulness on a real task.
      </MarginNote>
    </Concept>
  );
}
