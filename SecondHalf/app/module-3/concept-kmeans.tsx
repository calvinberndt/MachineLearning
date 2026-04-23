import { Concept } from "../(shell)/concept";
import { BlockMath, InlineMath } from "../(shell)/katex";
import { MarginNote } from "../(shell)/margin-note";
import { KMeansLab } from "./labs/kmeans-lab";

export function ConceptKMeans() {
  return (
    <Concept section="3.1" slug="k-means" title="K-means clustering">
      <Concept.Definition>
        An unsupervised algorithm that partitions <em>n</em> observations into <em>k</em> clusters by iteratively
        minimising the within-cluster sum of squares.
      </Concept.Definition>

      <Concept.Formula caption="Objective · inertia / within-cluster sum of squares">
        <BlockMath ariaLabel="K-means objective">
          {`J(C,\\mu) = \\sum_{j=1}^{k}\\sum_{x_i \\in S_j} \\lVert x_i - \\mu_j \\rVert^2`}
        </BlockMath>
        <ul className="concept__derivation">
          <li>
            <strong>Assignment step.</strong>{" "}
            <InlineMath>{`C(i) = \\arg\\min_j \\lVert x_i - \\mu_j \\rVert^2`}</InlineMath>
          </li>
          <li>
            <strong>Update step.</strong>{" "}
            <InlineMath>{`\\mu_j = \\frac{1}{|S_j|} \\sum_{i \\in S_j} x_i`}</InlineMath>
          </li>
          <li>
            Each step weakly decreases <InlineMath>{`J`}</InlineMath>; with finite partitions, the procedure converges.
          </li>
        </ul>
      </Concept.Formula>

      <Concept.Intuition>
        <p>
          The algorithm is the Canvas four-step loop: seed centroids, assign every point to its nearest centroid,
          recompute centroids as cluster means, repeat until nobody switches sides. The geometric picture is simpler
          than the formula: each centroid &quot;claims&quot; a Voronoi region, and points in each region contribute
          their squared distances to the running total.
        </p>
        <p>
          Because inertia measures squared Euclidean distance, K-means tacitly assumes clusters are convex and
          roughly equal in spread. It will find clusters even when none exist — which is why <em>k</em> is a
          modelling choice, not a discovery.
        </p>
      </Concept.Intuition>

      <Concept.WorkedExample title="Professor's student-score example">
        <KMeansLab />
      </Concept.WorkedExample>

      <Concept.Pitfall title="K-means does not always find the best clusters.">
        <p>
          Lloyd&apos;s algorithm converges to a <em>local</em> minimum of inertia. Different random seeds can land
          in different solutions, which is why scikit-learn runs <code>n_init</code> restarts (default 10) and keeps
          the best. Production code uses <strong>k-means++ seeding</strong> to pick well-spread initial centroids.
        </p>
      </Concept.Pitfall>

      <Concept.FurtherReading>
        <ul>
          <li>
            <a href="https://scikit-learn.org/stable/modules/clustering.html#k-means" rel="noreferrer" target="_blank">
              scikit-learn · K-means
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/watch?v=4b5d3muPQmA" rel="noreferrer" target="_blank">
              StatQuest · K-means clustering
            </a>
          </li>
        </ul>
      </Concept.FurtherReading>

      <MarginNote variant="citation">
        <p>Lloyd, S. (1982). Least squares quantization in PCM. <em>IEEE TIT 28(2)</em>.</p>
        <p>Arthur &amp; Vassilvitskii (2007). k-means++: The advantages of careful seeding.</p>
      </MarginNote>
      <MarginNote variant="correction">
        Choose <em>k</em> with the <strong>elbow method</strong> (plot inertia vs <em>k</em>, pick the knee) or the{" "}
        <strong>silhouette coefficient</strong>{" "}
        <InlineMath>{`s = \\frac{b - a}{\\max(a, b)}`}</InlineMath> (higher is better; <em>a</em>: mean
        intra-cluster distance, <em>b</em>: mean distance to nearest other cluster).
      </MarginNote>
    </Concept>
  );
}
