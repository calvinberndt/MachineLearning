import { Concept } from "../(shell)/concept";
import { BlockMath, InlineMath } from "../(shell)/katex";
import { MarginNote } from "../(shell)/margin-note";
import { EnsembleLab } from "./labs/ensemble-lab";

export function ConceptEnsembles() {
  return (
    <Concept section="4.1" slug="ensemble-methods" title="Ensemble methods">
      <Concept.Definition>
        Ensemble learning combines the predictions of several base estimators so that the combination
        generalises better — or is more robust — than any individual learner alone.
      </Concept.Definition>

      <Concept.Formula caption="Soft vote · probability-averaging classifier">
        <BlockMath ariaLabel="Soft vote prediction">
          {`\\hat{y}(x) = \\arg\\max_{c} \\sum_{i=1}^{M} w_i \\, P_i(c \\mid x)`}
        </BlockMath>
        <ul className="concept__derivation">
          <li>
            <strong>Hard vote:</strong>{" "}
            <InlineMath>{`\\hat{y}(x) = \\mathrm{mode}\\{h_1(x), \\dots, h_M(x)\\}`}</InlineMath>
          </li>
          <li>
            <strong>Bagging (classification):</strong> train <InlineMath>{`h_i`}</InlineMath> on a bootstrap sample
            <InlineMath>{`\\; D_i \\sim D^{(n)}`}</InlineMath> with replacement, then vote.
          </li>
          <li>
            <strong>Boosting (AdaBoost.M1):</strong>{" "}
            <InlineMath>{`F_M(x) = \\mathrm{sign}\\left( \\sum_{m=1}^{M} \\alpha_m h_m(x) \\right)`}</InlineMath>{" "}
            with <InlineMath>{`\\alpha_m = \\tfrac{1}{2} \\ln \\tfrac{1 - \\varepsilon_m}{\\varepsilon_m}`}</InlineMath>.
          </li>
        </ul>
      </Concept.Formula>

      <Concept.Intuition>
        <p>
          Your professor&apos;s Canvas notes group four ensemble families. The exam-critical distinctions:
          <strong> bagging</strong> runs base learners in parallel on bootstrap samples and reduces{" "}
          <em>variance</em>; <strong>boosting</strong> runs them sequentially with reweighted training data and
          reduces <em>bias</em>; <strong>stacking</strong> uses a meta-learner over the base predictions; and
          <strong> voting</strong> combines conceptually different models.
        </p>
        <p>
          The diversity requirement is mathematical: if every learner makes the same mistakes, combining them
          does nothing. Bagging enforces diversity via bootstrap resampling; boosting enforces it by chasing
          residuals; Random Forest adds a second randomness axis (feature subsets) on top of bagging.
        </p>
      </Concept.Intuition>

      <Concept.WorkedExample title="Mode switcher">
        <EnsembleLab />
      </Concept.WorkedExample>

      <Concept.Pitfall title="Boosting is NOT bagging with a twist.">
        <p>
          A common exam mistake: &quot;random forest is a boosting ensemble.&quot; It&apos;s not — Random
          Forest is <strong>bagging</strong> of decision trees plus random feature subsetting. Boosting grows
          learners <em>sequentially</em> by reweighting misclassified points; bagging grows them in parallel on
          resampled data. They lower error for different reasons.
        </p>
      </Concept.Pitfall>

      <Concept.FurtherReading>
        <ul>
          <li>
            <a href="https://scikit-learn.org/stable/modules/ensemble.html" rel="noreferrer" target="_blank">
              scikit-learn · Ensemble methods
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/watch?v=LsK-xG1cLYA" rel="noreferrer" target="_blank">
              StatQuest · AdaBoost, clearly explained
            </a>
          </li>
        </ul>
      </Concept.FurtherReading>

      <MarginNote variant="citation">
        <p>Breiman (1996). <em>Bagging predictors</em>. Machine Learning 24(2).</p>
        <p>Freund &amp; Schapire (1997). AdaBoost. <em>J. Comput. Syst. Sci. 55</em>.</p>
      </MarginNote>
      <MarginNote variant="correction">
        Boosting can <em>overfit</em> noisy labels because it keeps pushing the ensemble toward misclassified
        points — even mislabeled ones. Bagging does not have this failure mode.
      </MarginNote>
    </Concept>
  );
}
