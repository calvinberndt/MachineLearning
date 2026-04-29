import { Concept } from "../(shell)/concept";
import { BlockMath, InlineMath } from "../(shell)/katex";
import { MarginNote } from "../(shell)/margin-note";
import { AttentionLab } from "./labs/attention-lab";

export function ConceptTransformersAndTraining() {
  return (
    <Concept section="6.2" slug="transformers-and-training" title="Transformers and training">
      <Concept.Definition>
        A transformer maps tokens to contextual vectors with self-attention, then trains at scale through
        pretraining, task tuning, and alignment feedback before being served inside a production system.
      </Concept.Definition>

      <Concept.Formula caption="Scaled dot-product attention">
        <BlockMath ariaLabel="Scaled dot-product attention formula">
          {`\\operatorname{Attention}(Q,K,V)=\\operatorname{softmax}\\!\\left(\\dfrac{QK^\\top}{\\sqrt{d_k}}\\right)V`}
        </BlockMath>
        <ul className="concept__derivation">
          <li>
            <InlineMath>{`Q`}</InlineMath> asks what the current token is looking for;{" "}
            <InlineMath>{`K`}</InlineMath> advertises what each token contains;{" "}
            <InlineMath>{`V`}</InlineMath> carries the information to mix.
          </li>
          <li>
            The <InlineMath>{`\\sqrt{d_k}`}</InlineMath> divisor keeps dot products from exploding as key/query
            dimensions grow.
          </li>
          <li>
            Multi-head attention repeats this calculation in parallel so different heads can track different
            relationships.
          </li>
        </ul>
      </Concept.Formula>

      <Concept.Intuition>
        <p>
          The transformer stack is embeddings, positional information, self-attention, multi-head attention,
          feedforward layers, and an output layer. The embeddings and learned features are
          the same representation idea from §5.1 and §5.2; the new move is attention, which lets every token
          consult every other token instead of passing information through a strict RNN-style sequence.
        </p>
        <p>
          Training then happens in stages. Pretraining teaches next-token prediction from broad text data.
          Fine-tuning narrows behavior for tasks or domains. RLHF adds human preference rankings so the model
          learns responses that are more helpful, safer, and better aligned with user intent.
        </p>
        <p>
          A deployed system adds more layers around the trained model: frontend, API gateway, inference servers,
          moderation, response delivery, and cloud infrastructure. GPU/TPU clusters and distributed computing
          are not exam trivia; they explain why these models are expensive to train and why serving has to be
          engineered carefully.
        </p>
      </Concept.Intuition>

      <Concept.WorkedExample title="Pick a query token and inspect its attention row">
        <AttentionLab />
      </Concept.WorkedExample>

      <Concept.Pitfall title="Attention is not the same thing as human attention.">
        <p>
          The heatmap is a learned weighting operation over vectors. It can reveal which tokens influence a
          layer&apos;s representation, but it is not a full explanation of model reasoning or intent.
        </p>
      </Concept.Pitfall>

      <Concept.FurtherReading>
        <ul>
          <li>
            <a href="https://arxiv.org/abs/1706.03762" rel="noreferrer" target="_blank">
              Vaswani et al. · Attention Is All You Need
            </a>
          </li>
          <li>
            <a href="https://jalammar.github.io/illustrated-transformer/" rel="noreferrer" target="_blank">
              The Illustrated Transformer
            </a>
          </li>
        </ul>
      </Concept.FurtherReading>

      <MarginNote variant="correction">
        Transformers still need positional information. Self-attention compares all tokens at once, so order has
        to be supplied through positional encodings or learned position embeddings.
      </MarginNote>
    </Concept>
  );
}
