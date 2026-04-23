import { Concept } from "../(shell)/concept.tsx";
import { BlockMath, InlineMath } from "../(shell)/katex";
import { MarginNote } from "../(shell)/margin-note";
import { KnnLab } from "./labs/knn-lab";

export function ConceptKnn() {
  return (
    <Concept section="3.2" slug="k-nearest-neighbors" title="K-Nearest Neighbors">
      <Concept.Definition>
        A non-parametric, instance-based classifier that predicts the label of a new point by majority vote of the{" "}
        <em>k</em> nearest training examples under a chosen distance metric.
      </Concept.Definition>

      <Concept.Formula caption="Decision rule (uniform vote)">
        <BlockMath ariaLabel="KNN uniform majority vote">
          {`\\hat{y}(x) = \\arg\\max_{c} \\sum_{i \\in N_k(x)} \\mathbb{1}[y_i = c]`}
        </BlockMath>
        <ul className="concept__derivation">
          <li>
            Distance-weighted variant:{" "}
            <InlineMath>{`\\hat{y}(x) = \\arg\\max_{c} \\sum_{i \\in N_k(x)} \\frac{1}{d(x, x_i)} \\cdot \\mathbb{1}[y_i = c]`}</InlineMath>
          </li>
          <li>
            Metric family (Minkowski):{" "}
            <InlineMath>{`d_p(x, x') = \\left( \\sum_m |x_m - x'_m|^p \\right)^{1/p}`}</InlineMath>{" "}
            — <em>p = 1</em> Manhattan, <em>p = 2</em> Euclidean.
          </li>
        </ul>
      </Concept.Formula>

      <Concept.Intuition>
        <p>
          KNN does not learn a formula. At prediction time it searches the training set for the <em>k</em> points
          closest to the new observation, then lets them vote. &quot;Closest&quot; is entirely defined by your
          distance metric — so <strong>feature scaling is not optional</strong>. A feature measured in thousands
          (salary) will drown out a feature measured on a 1–5 scale (rating).
        </p>
        <p>
          Small <em>k</em> lets noisy points dominate local decisions (low bias, high variance). Large <em>k</em>{" "}
          smooths the boundary but can wash out real local structure. Cross-validate.
        </p>
      </Concept.Intuition>

      <Concept.WorkedExample>
        <KnnLab />
      </Concept.WorkedExample>

      <Concept.Pitfall title="KNN collapses in high dimensions.">
        <p>
          Past roughly <strong>15 dimensions</strong>, the distances between all pairs of points approach each
          other — every training example is &quot;far&quot; from the test point in the same way. This is the curse
          of dimensionality. scikit-learn switches to brute-force search in high dimensions because tree-based
          indexes stop helping. Reduce dimensions (PCA, feature selection) or pick a different model.
        </p>
      </Concept.Pitfall>

      <Concept.FurtherReading>
        <ul>
          <li>
            <a href="https://scikit-learn.org/stable/modules/neighbors.html" rel="noreferrer" target="_blank">
              scikit-learn · Nearest neighbors
            </a>
          </li>
        </ul>
      </Concept.FurtherReading>

      <MarginNote variant="correction">
        KNN makes predictions in <InlineMath>{`\\mathcal{O}(nd)`}</InlineMath> per query with brute force; KD-trees
        amortise that for low <em>d</em> but lose their edge around <em>d &gt; 15</em>.
      </MarginNote>
      <MarginNote variant="aside" label="Exam trap">
        Even <em>k</em> allows a tied vote. Use odd <em>k</em> for binary problems and fall back to distance-weighted
        voting when ties matter.
      </MarginNote>
    </Concept>
  );
}
