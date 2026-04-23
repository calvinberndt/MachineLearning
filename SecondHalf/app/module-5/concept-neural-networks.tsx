import { Concept } from "../(shell)/concept";
import { BlockMath, InlineMath } from "../(shell)/katex";
import { MarginNote } from "../(shell)/margin-note";
import { NeuralNetworkLab } from "./labs/nn-lab";

export function ConceptNeuralNetworks() {
  return (
    <Concept section="5.1" slug="neural-networks" title="Neural networks">
      <Concept.Definition>
        A composition of parameterised affine transformations and non-linear activations, trained
        end-to-end by gradient descent on a differentiable loss.
      </Concept.Definition>

      <Concept.Formula caption="Forward pass · one layer">
        <BlockMath ariaLabel="One-layer forward pass">
          {`a^{(\\ell)} = \\sigma\\!\\left( W^{(\\ell)} a^{(\\ell-1)} + b^{(\\ell)} \\right)`}
        </BlockMath>
        <ul className="concept__derivation">
          <li>
            <strong>Loss (classification).</strong> Cross-entropy:{" "}
            <InlineMath>{`L = -\\sum_{c} y_c \\log \\hat{y}_c`}</InlineMath>.
          </li>
          <li>
            <strong>Backprop gradient.</strong>{" "}
            <InlineMath>{`\\tfrac{\\partial L}{\\partial W^{(\\ell)}} = \\delta^{(\\ell)} \\, (a^{(\\ell-1)})^\\top`}</InlineMath>.
          </li>
          <li>
            <strong>Why non-linearity matters.</strong> Without{" "}
            <InlineMath>{`\\sigma`}</InlineMath>, stacking layers gives{" "}
            <InlineMath>{`W_2 (W_1 x + b_1) + b_2 = (W_2 W_1) x + (W_2 b_1 + b_2)`}</InlineMath>{" "}
            — still a single affine map, no matter how deep.
          </li>
        </ul>
      </Concept.Formula>

      <Concept.Intuition>
        <p>
          A neuron computes a weighted sum and passes it through an activation. Stack neurons into a layer,
          stack layers into a network, and the model learns a feature hierarchy: early layers respond to simple
          patterns, later layers combine them into task-specific evidence. Each weight is a knob; training
          turns the knobs to make the output closer to the true label.
        </p>
        <p>
          Canvas terminology: <strong>forward propagation</strong> is the prediction direction;
          <strong> backpropagation</strong> is the gradient-flowing direction. Gradient descent uses those
          gradients to update every weight by a small step against the error surface.
        </p>
      </Concept.Intuition>

      <Concept.WorkedExample title="Three inputs → three hidden neurons → one output">
        <NeuralNetworkLab />
      </Concept.WorkedExample>

      <Concept.Pitfall title="Sigmoids in deep stacks cause vanishing gradients.">
        <p>
          The derivative of the sigmoid peaks at 0.25. Multiplying many such derivatives through the chain rule
          of backprop drives the gradient to zero in early layers — so those layers stop learning. Modern deep
          networks default to <strong>ReLU</strong> (derivative 0 or 1) for hidden layers; sigmoid/softmax are
          reserved for probability outputs.
        </p>
      </Concept.Pitfall>

      <Concept.FurtherReading>
        <ul>
          <li>
            <a href="https://developers.google.com/machine-learning/crash-course/neural-networks/anatomy" rel="noreferrer" target="_blank">
              Google MLCC · Anatomy of a neural network
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/watch?v=aircAruvnKk" rel="noreferrer" target="_blank">
              3Blue1Brown · But what is a neural network?
            </a>
          </li>
        </ul>
      </Concept.FurtherReading>

      <MarginNote variant="citation">
        <p>Rumelhart, Hinton &amp; Williams (1986). <em>Learning representations by back-propagating errors</em>. Nature 323(6088).</p>
      </MarginNote>
      <MarginNote variant="correction">
        Forward pass produces a prediction. Only the <em>loss</em> has a scalar value to differentiate — the
        gradients of that scalar flow back through W and b at every layer via the chain rule.
      </MarginNote>
    </Concept>
  );
}
