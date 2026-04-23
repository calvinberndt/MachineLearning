import { Concept } from "../(shell)/concept";
import { BlockMath, InlineMath } from "../(shell)/katex";
import { MarginNote } from "../(shell)/margin-note";
import { CnnLab } from "./labs/cnn-lab";

export function ConceptCnn() {
  return (
    <Concept section="5.3" slug="convolutional-neural-networks" title="Convolutional neural networks">
      <Concept.Definition>
        A neural network that exploits local spatial structure via learnable convolutional filters with weight
        sharing, typically stacking <em>Conv → ReLU → Pool</em> blocks before flattening to a classifier head.
      </Concept.Definition>

      <Concept.Formula caption="Output spatial dimension">
        <BlockMath ariaLabel="Conv output-size formula">
          {`H_{\\text{out}} = \\left\\lfloor \\dfrac{H_{\\text{in}} - F + 2P}{S} \\right\\rfloor + 1`}
        </BlockMath>
        <ul className="concept__derivation">
          <li>
            <InlineMath>{`F`}</InlineMath> = filter size, <InlineMath>{`P`}</InlineMath> = padding,{" "}
            <InlineMath>{`S`}</InlineMath> = stride.
          </li>
          <li>
            Example: 6×6 input, 3×3 filter, no padding, stride 1 → (6 − 3 + 0)/1 + 1 = <strong>4</strong>.
          </li>
          <li>
            <strong>Parameter count per conv layer</strong> =
            <InlineMath>{` F \\times F \\times C_{\\text{in}} \\times C_{\\text{out}} + C_{\\text{out}}`}</InlineMath>.
            Note it does <em>not</em> scale with input resolution — this is <strong>weight sharing</strong>.
          </li>
        </ul>
      </Concept.Formula>

      <Concept.Intuition>
        <p>
          A convolutional filter is a small pattern detector that slides across the entire input. Because the
          same weights are applied at every location, the network learns <em>positionally invariant</em>{" "}
          features: an edge is an edge whether it&apos;s top-left or bottom-right. This is what a fully-connected
          layer <em>cannot</em> do without massive redundant parameters.
        </p>
        <p>
          Deeper layers compose simple features (edges) into complex ones (corners, textures, object parts).
          <strong> Pooling</strong> downsamples the spatial grid — keeping the strongest response in each local
          region — which gives translation tolerance and keeps compute manageable as the network goes deep.
        </p>
      </Concept.Intuition>

      <Concept.WorkedExample title="6×6 input · 3×3 edge filter · ReLU · 2×2 max-pool">
        <CnnLab />
      </Concept.WorkedExample>

      <Concept.Pitfall title="Pooling is not strictly necessary anymore.">
        <p>
          Early CNNs (LeNet, AlexNet, VGG) relied on max-pooling between every conv block. Modern architectures
          often replace pooling with <strong>strided convolutions</strong> (the conv itself downsamples) or drop
          spatial reduction entirely in favour of attention (Vision Transformers). Don&apos;t treat &quot;Conv
          → ReLU → Pool&quot; as a law — it&apos;s a strong default.
        </p>
      </Concept.Pitfall>

      <Concept.FurtherReading>
        <ul>
          <li>
            <a href="https://poloclub.github.io/cnn-explainer/" rel="noreferrer" target="_blank">
              CNN Explainer · interactive visualisation
            </a>
          </li>
          <li>
            <a href="https://www.tensorflow.org/tutorials/images/cnn" rel="noreferrer" target="_blank">
              TensorFlow · image classification tutorial
            </a>
          </li>
        </ul>
      </Concept.FurtherReading>

      <MarginNote variant="citation">
        <p>LeCun et&nbsp;al. (1998). Gradient-based learning applied to document recognition. <em>Proc. IEEE 86(11)</em>.</p>
      </MarginNote>
      <MarginNote variant="correction">
        &quot;Same&quot; padding chooses <InlineMath>{`P`}</InlineMath> so that{" "}
        <InlineMath>{`H_{\\text{out}} = H_{\\text{in}}`}</InlineMath>. &quot;Valid&quot; padding uses{" "}
        <InlineMath>{`P = 0`}</InlineMath> and shrinks the map.
      </MarginNote>
    </Concept>
  );
}
