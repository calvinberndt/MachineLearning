"use client";

import { ATTENTION_TOKENS, getAttentionForQuery, getWeightedContext } from "./attention-utils";
import { useModule6Lab } from "./lab-context";

export function AttentionLab() {
  const { queryIndex, setQueryIndex } = useModule6Lab();
  const weights = getAttentionForQuery(queryIndex);
  const context = getWeightedContext(queryIndex);

  return (
    <div className="lab-surface">
      <div className="lab-surface__controls" role="group" aria-label="Choose query token">
        {ATTENTION_TOKENS.map((token, index) => (
          <button
            key={token.text}
            type="button"
            className="mini-switch"
            data-active={queryIndex === index}
            onClick={() => setQueryIndex(index)}
          >
            q: {token.text}
          </button>
        ))}
      </div>

      <div className="attention-grid">
        <section className="attention-panel" aria-label="Token positions">
          <span className="kicker">4 token positions</span>
          <div className="attention-tokens">
            {ATTENTION_TOKENS.map((token) => (
              <span
                key={token.text}
                className="attention-token"
                data-active={token.position === queryIndex}
              >
                <em className="tabular">{token.position}</em>
                {token.text}
              </span>
            ))}
          </div>
        </section>

        <section className="attention-panel" aria-label="Attention weights">
          <span className="kicker">Weights from selected query</span>
          <div className="attention-heatmap">
            {weights.map((weight, index) => (
              <div
                key={`${ATTENTION_TOKENS[index].text}-${weight}`}
                className="attention-cell"
                style={{ opacity: Math.min(0.95, 0.28 + weight * 1.8) }}
              >
                <span>{ATTENTION_TOKENS[index].text}</span>
                <strong className="tabular">{weight.toFixed(2)}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="attention-panel" aria-label="Weighted context vector">
          <span className="kicker">Context vector</span>
          <p className="attention-vector tabular">
            [{context[0].toFixed(2)}, {context[1].toFixed(2)}]
          </p>
          <p>
            For the selected query, the model mixes value vectors in proportion to the heatmap. Here,
            <strong> bank</strong> leans toward <strong>loan</strong>, not <strong>river</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
