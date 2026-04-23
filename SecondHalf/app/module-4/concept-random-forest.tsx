import { Concept } from "../(shell)/concept";
import { BlockMath, InlineMath } from "../(shell)/katex";
import { MarginNote } from "../(shell)/margin-note";
import { ForestLab } from "./labs/forest-lab";

export function ConceptRandomForest() {
  return (
    <Concept section="4.2" slug="random-forest" title="Random Forest">
      <Concept.Definition>
        A bagging ensemble of decision trees in which each tree is also trained on a random subset of features
        at every split. Classification uses majority vote; regression uses the mean of tree outputs.
      </Concept.Definition>

      <Concept.Formula caption="Out-of-bag sample fraction">
        <BlockMath ariaLabel="OOB fraction limit">
          {`\\lim_{n \\to \\infty} \\left(1 - \\tfrac{1}{n}\\right)^{n} = \\tfrac{1}{e} \\approx 0.368`}
        </BlockMath>
        <ul className="concept__derivation">
          <li>
            Each bootstrap sample draws <em>n</em> points with replacement from a training set of size <em>n</em>;
            the probability any specific point is <em>not</em> chosen is{" "}
            <InlineMath>{`(1 - 1/n)^n \\to 1/e`}</InlineMath>.
          </li>
          <li>
            ≈37% of training points are <strong>out-of-bag</strong> for each tree → free hold-out without needing a
            validation split.
          </li>
          <li>
            Default feature subset: <InlineMath>{`m = \\lfloor \\sqrt{p} \\rfloor`}</InlineMath> for classification,{" "}
            <InlineMath>{`m = \\lfloor p/3 \\rfloor`}</InlineMath> for regression, where <em>p</em> is the number of features.
          </li>
        </ul>
      </Concept.Formula>

      <Concept.Intuition>
        <p>
          Two sources of randomness prevent the trees from all learning the same thing. Bootstrap sampling
          gives each tree a slightly different view of the data. Random feature subsetting at every split stops
          one strong feature from dominating every tree — so the trees disagree in useful ways, and their errors
          tend to cancel when averaged.
        </p>
        <p>
          The Canvas example: five hand-made trees, each keyed on a different feature pair, voting on whether a
          student will pass. Toggle the sliders below to watch individual tree predictions flip while the forest
          vote stays stable. That stability <em>is</em> the variance reduction.
        </p>
      </Concept.Intuition>

      <Concept.WorkedExample title="Five-tree forest simulator">
        <ForestLab />
      </Concept.WorkedExample>

      <Concept.Pitfall title="Impurity-based feature importance is biased.">
        <p>
          scikit-learn&apos;s default <code>feature_importances_</code> counts total impurity reduction per
          feature across all splits. This metric is{" "}
          <strong>biased toward features with many unique values</strong> (high-cardinality numerical columns,
          IDs). It also reflects importance on <em>training</em> data, not test data. Prefer{" "}
          <code>sklearn.inspection.permutation_importance</code>, which re-measures accuracy after shuffling each
          feature on the <em>held-out</em> set.
        </p>
      </Concept.Pitfall>

      <Concept.FurtherReading>
        <ul>
          <li>
            <a href="https://scikit-learn.org/stable/modules/ensemble.html#random-forests" rel="noreferrer" target="_blank">
              scikit-learn · Random forests
            </a>
          </li>
          <li>
            <a href="https://scikit-learn.org/stable/modules/permutation_importance.html" rel="noreferrer" target="_blank">
              scikit-learn · Permutation importance
            </a>
          </li>
        </ul>
      </Concept.FurtherReading>

      <MarginNote variant="citation">
        <p>Breiman, L. (2001). <em>Random Forests</em>. Machine Learning 45(1).</p>
      </MarginNote>
      <MarginNote variant="correction">
        Random Forest does <em>not</em> need a validation split to estimate generalisation — set{" "}
        <code>oob_score=True</code> in scikit-learn and the ≈37% out-of-bag points per tree are scored for free.
      </MarginNote>
    </Concept>
  );
}
