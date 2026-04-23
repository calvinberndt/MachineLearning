import { Concept } from "../(shell)/concept";
import { BlockMath, InlineMath } from "../(shell)/katex";
import { MarginNote } from "../(shell)/margin-note";
import { SvmLab } from "./labs/svm-lab";

export function ConceptSvm() {
  return (
    <Concept section="3.3" slug="support-vector-machines" title="Support Vector Machines">
      <Concept.Definition>
        A maximum-margin classifier that finds the hyperplane separating two classes by the widest safe slab, with
        optional non-linear boundaries via the kernel trick.
      </Concept.Definition>

      <Concept.Formula caption="Soft-margin primal">
        <BlockMath ariaLabel="SVM soft-margin primal">
          {`\\min_{w,b,\\zeta} \\; \\tfrac{1}{2}\\lVert w \\rVert^2 + C \\sum_i \\zeta_i \\quad \\text{s.t.} \\quad y_i(w^\\top \\phi(x_i) + b) \\ge 1 - \\zeta_i, \\; \\zeta_i \\ge 0`}
        </BlockMath>
        <ul className="concept__derivation">
          <li>
            Margin width = <InlineMath>{`2 / \\lVert w \\rVert`}</InlineMath>; maximising it is equivalent to
            minimising <InlineMath>{`\\lVert w \\rVert^2`}</InlineMath>.
          </li>
          <li>
            Slack <InlineMath>{`\\zeta_i`}</InlineMath> lets the model tolerate misclassified points;{" "}
            <strong>C</strong> is the penalty.
          </li>
          <li>
            RBF kernel: <InlineMath>{`K(x,x') = \\exp(-\\gamma \\lVert x - x' \\rVert^2)`}</InlineMath>. Polynomial:{" "}
            <InlineMath>{`(\\gamma \\langle x,x' \\rangle + r)^d`}</InlineMath>.
          </li>
        </ul>
      </Concept.Formula>

      <Concept.Intuition>
        <p>
          SVM does not try to match every point — it picks the <em>support vectors</em>, the handful of points that
          actually touch the margin, and places the boundary as far from each class as possible. For non-linear
          data, the kernel trick implicitly maps points into a higher-dimensional space where a linear separator
          exists, without ever computing those coordinates.
        </p>
        <p>
          <strong>C controls the trade-off between margin width and training error.</strong> Large C punishes every
          slack violation heavily — a harder margin, less regularisation, possibly overfitting. Small C accepts
          misclassifications in exchange for a wider, simpler margin.
        </p>
      </Concept.Intuition>

      <Concept.WorkedExample>
        <SvmLab />
      </Concept.WorkedExample>

      <Concept.Pitfall title="C points the opposite way from most regularisers.">
        <p>
          In SVM, <strong>larger C = harder margin = less regularisation</strong> — the opposite direction to the{" "}
          <InlineMath>{`\\lambda`}</InlineMath> of ridge regression. Remember it via the constraint:{" "}
          <em>&quot;C multiplies the penalty for crossing the margin.&quot;</em>
        </p>
      </Concept.Pitfall>

      <Concept.FurtherReading>
        <ul>
          <li>
            <a href="https://scikit-learn.org/stable/modules/svm.html" rel="noreferrer" target="_blank">
              scikit-learn · SVM
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/watch?v=efR1C6CvhmE" rel="noreferrer" target="_blank">
              StatQuest · SVM main ideas
            </a>
          </li>
        </ul>
      </Concept.FurtherReading>

      <MarginNote variant="aside">
        Multi-class: <code>SVC</code> uses one-vs-one (pairwise); <code>LinearSVC</code> uses one-vs-rest.
      </MarginNote>
      <MarginNote variant="correction">
        RBF γ and C interact. Always standardise features before tuning — otherwise γ has no meaningful scale.
      </MarginNote>
    </Concept>
  );
}
