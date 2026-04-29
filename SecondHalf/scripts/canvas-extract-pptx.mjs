#!/usr/bin/env node
// Extract per-slide text from the unzipped Canvas pptx.
// Reads ppt/slides/slide*.xml, outputs a JSON array of { slide, title, body[] }.

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const slideDir = ".canvas-sync/raw/pptx/extracted/ppt/slides";
const files = readdirSync(slideDir)
  .filter((f) => /^slide\d+\.xml$/.test(f))
  .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const slides = [];
for (const f of files) {
  const xml = readFileSync(join(slideDir, f), "utf8");
  const paras = [];
  // <a:p> = paragraph; within it, <a:t> = text run. Walk in document order.
  for (const pMatch of xml.matchAll(/<a:p\b[^>]*>([\s\S]*?)<\/a:p>/g)) {
    const inner = pMatch[1];
    const runs = [...inner.matchAll(/<a:t\b[^>]*>([\s\S]*?)<\/a:t>/g)].map(
      (m) => decode(m[1])
    );
    const joined = runs.join("").replace(/\s+/g, " ").trim();
    if (joined) paras.push(joined);
  }
  slides.push({
    slide: Number(f.match(/\d+/)[0]),
    title: paras[0] || "(untitled)",
    body: paras.slice(1),
  });
}

writeFileSync(
  ".canvas-sync/raw/pptx/slides.json",
  JSON.stringify(slides, null, 2)
);

const md = slides
  .map((s) => {
    const body = s.body.map((b) => `  - ${b}`).join("\n");
    return `## Slide ${s.slide}: ${s.title}\n${body}`;
  })
  .join("\n\n");
writeFileSync(".canvas-sync/raw/pptx/slides-outline.md", md);

console.log(`extracted ${slides.length} slides`);
console.log(`json: .canvas-sync/raw/pptx/slides.json`);
console.log(`outline: .canvas-sync/raw/pptx/slides-outline.md`);
