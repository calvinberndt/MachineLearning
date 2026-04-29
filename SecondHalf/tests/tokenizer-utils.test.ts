import assert from "node:assert/strict";
import test from "node:test";
import { splitIntoTokenPieces, tokenize } from "../app/module-6/labs/tokenizer-utils.ts";

test("word mode keeps whole known words", () => {
  assert.deepEqual(splitIntoTokenPieces("Transformers turn tokens.", "word"), [
    "transformers",
    "turn",
    "tokens",
  ]);
});

test("bpe mode splits known words into deterministic subword pieces", () => {
  assert.deepEqual(splitIntoTokenPieces("Transformers turn tokens.", "bpe"), [
    "transform",
    "##ers",
    "turn",
    "token",
    "##s",
  ]);
});

test("tokenize returns stable ids and embedding coordinates", () => {
  assert.deepEqual(tokenize("tokens", "bpe"), [
    { text: "token", id: 304, embedding: [0.31, 0.71, 0.48] },
    { text: "##s", id: 305, embedding: [0.22, 0.34, 0.26] },
  ]);
});
