import { Concept } from "../(shell)/concept";
import { MarginNote } from "../(shell)/margin-note";

export function ConceptLlmLandscape() {
  return (
    <Concept section="6.3" slug="llm-landscape" title="LLM landscape">
      <Concept.Definition>
        A large language model is a parameter-heavy neural model trained on language to predict and generate
        text, usually using transformer blocks as its core architecture.
      </Concept.Definition>

      <Concept.Formula caption="Model vs deployed system">
        <div className="concept__derivation">
          <span><strong>LLM.</strong> Tokenizer, embeddings, transformer layers, feedforward layers, output probabilities.</span>
          <span><strong>OpenAI-style system.</strong> LLM plus alignment, safety filters, APIs, UI, monitoring, and scalable serving.</span>
          <span><strong>Multimodal extension.</strong> Text, image, and audio inputs can be routed through model components that share a user-facing system.</span>
        </div>
      </Concept.Formula>

      <Concept.Intuition>
        <p>
          The cleanest mental model is engine versus car: an LLM is the engine; a deployed product like ChatGPT
          is the full car system with steering, safety, dashboard, controls, and user experience. The model
          generates token probabilities; the product decides how a person safely and reliably uses that model.
        </p>
        <p>
          The &quot;large&quot; in LLM points to both training data and parameters. The &quot;language&quot; part points to
          human communication and next-token prediction. The &quot;model&quot; part means the learned mathematical
          machinery, not the surrounding app. Tokenization and embeddings are reviewed in §5.2 and §6.1; this
          section is about scope.
        </p>
        <p>
          The dominant 2026 families are GPT, Claude, Gemini, Llama, DeepSeek, Mistral, and Grok. Treat that
          list as a landscape map, not a permanent leaderboard. The durable exam idea is comparison by
          ownership, context length, multimodal support, openness, deployment layer, and safety/alignment
          strategy.
        </p>
      </Concept.Intuition>

      <Concept.WorkedExample title="Classify the layer being described">
        <div className="lab-surface">
          <div className="landscape-grid">
            <article className="pipeline-step">
              <span className="kicker">Model-level</span>
              <p>Tokenizer, embeddings, self-attention, feedforward layers, output logits.</p>
            </article>
            <article className="pipeline-step">
              <span className="kicker">System-level</span>
              <p>API gateway, frontend app, moderation, logs, latency controls, access policy.</p>
            </article>
            <article className="pipeline-step">
              <span className="kicker">Landscape-level</span>
              <p>GPT, Claude, Gemini, Llama, DeepSeek, Mistral, and Grok as model families or platforms.</p>
            </article>
          </div>
        </div>
      </Concept.WorkedExample>

      <Concept.Pitfall title="A leaderboard is not a concept definition.">
        <p>
          Popular models change quickly. For an exam answer, define the architecture and system boundary first,
          then use current model families only as examples.
        </p>
      </Concept.Pitfall>

      <Concept.FurtherReading>
        <ul>
          <li>
            <a href="https://www.vellum.ai/llm-leaderboard" rel="noreferrer" target="_blank">
              Vellum LLM Leaderboard
            </a>
          </li>
          <li>
            <a href="https://blogs.nvidia.com/blog/what-is-a-transformer-model/" rel="noreferrer" target="_blank">
              NVIDIA · What is a transformer model?
            </a>
          </li>
        </ul>
      </Concept.FurtherReading>

      <MarginNote variant="aside" label="Exam phrasing">
        If asked whether OpenAI and an LLM are the same, answer with scope: model-level core versus deployed
        product ecosystem.
      </MarginNote>
    </Concept>
  );
}
