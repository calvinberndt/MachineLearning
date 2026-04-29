import { Concept } from "../(shell)/concept";
import { MarginNote } from "../(shell)/margin-note";
import { TokenizerLab } from "./labs/tokenizer-lab";

export function ConceptOpenAiTools() {
  return (
    <Concept section="6.1" slug="openai-tools" title="OpenAI tools">
      <Concept.Definition>
        OpenAI is an AI research and deployment company that packages foundation-model research into tools for
        language, images, speech, code, and assisted problem solving.
      </Concept.Definition>

      <Concept.Formula caption="Canvas product map">
        <div className="concept__derivation">
          <span><strong>GPT / ChatGPT.</strong> Conversational text generation, tutoring, analysis, and code help.</span>
          <span><strong>DALL·E.</strong> Image generation from natural-language descriptions.</span>
          <span><strong>Whisper.</strong> Speech-to-text transcription across many languages.</span>
          <span><strong>Codex.</strong> Programming assistance built around code understanding and generation.</span>
        </div>
      </Concept.Formula>

      <Concept.Intuition>
        <p>
          Canvas frames OpenAI as both a research organisation and a deployment stack: the same broad research
          agenda becomes student-facing tutors, developer tools, transcription systems, and creative image
          workflows. The important distinction is that a product is more than a model. It includes the interface,
          safety policies, data handling, monitoring, and the workflow around the model.
        </p>
        <p>
          The language side builds directly on Module 5 foundations: neural networks learn parameters through
          training (§5.1), and NLP systems turn raw text into processable units (§5.2). Module 6 starts after
          that bridge: what happens when those pieces are scaled into foundation models and deployed as products.
        </p>
      </Concept.Intuition>

      <Concept.WorkedExample title="Prompt text → token IDs → embedding coordinates">
        <TokenizerLab />
      </Concept.WorkedExample>

      <Concept.Pitfall title="Do not equate a brand with one model.">
        <p>
          ChatGPT, DALL·E, Whisper, and Codex are product surfaces or model families with different input and
          output types. Saying &quot;OpenAI is an LLM&quot; loses the system-level layers Canvas emphasizes: tools,
          alignment, APIs, safety, and infrastructure.
        </p>
      </Concept.Pitfall>

      <Concept.FurtherReading>
        <ul>
          <li>
            <a href="https://openai.com/research/" rel="noreferrer" target="_blank">
              OpenAI research index
            </a>
          </li>
          <li>
            <a href="https://cookbook.openai.com/" rel="noreferrer" target="_blank">
              OpenAI Cookbook
            </a>
          </li>
        </ul>
      </Concept.FurtherReading>

      <MarginNote variant="citation">
        Canvas notes, slides 2-5: OpenAI overview and major tool families.
      </MarginNote>
      <MarginNote variant="aside" label="Cross-link">
        The tokenizer demo extends the §5.2 NLP pipeline. It keeps the old idea, &quot;split text into units,&quot;
        but swaps hand-built word features for token IDs and learned vectors.
      </MarginNote>
    </Concept>
  );
}
