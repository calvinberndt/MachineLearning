# Second Half Study Lab Design System

## Product Goal

Build a classroom-style machine learning study tool for COMP SCI 465 that supports both exam cramming and deeper conceptual understanding. The professor's Canvas material is the source of truth. Outside sources are used to improve explanation quality, diagram design, and optional follow-up learning.

## Source Policy

- Canvas-first: every module must preserve the professor's topics, examples, wording emphasis, and exam style.
- Outside sources supplement, never replace Canvas.
- If an outside source shapes an explanation, diagram, or recommended study path, the page should expose it in a visible source trail.
- Source trails should be short, curated, and clickable. They are for students who want to verify or go deeper.
- Do not copy long text from outside sources. Summarize the idea and link to the source.

## Learning Model

Each module should support two study modes at the same time:

- Cram track: the exact definitions, contrasts, formulas, and traps likely to appear on a quiz or exam.
- Deep track: visual intuition, representations, parameter effects, and why the algorithm behaves the way it does.

Every module should include:

- Canvas Core: the professor's concept in plain language.
- Dynamic Diagram: an interactive state change, slider, stepper, or visual transformation.
- Representation Lens: what the data looks like to the model, such as points, distances, votes, trees, tokens, embeddings, matrices, or feature maps.
- Misconception Check: a short correction of the most likely wrong answer.
- Source Trail: visible links to supplemental learning.
- Practice Bridge: a reminder to use quiz mode after the module.

## Visual Direction

The interface should feel like a bright classroom whiteboard crossed with a notebook:

- Background: warm off-white with faint grid/dot paper texture.
- Surfaces: whiteboard panels, notebook cards, and lightly ruled sections.
- Color: black ink, muted graphite, warm yellow marker, teal marker, soft blue marker, and red/orange correction marks.
- Typography: display type for page headlines, clean sans-serif for body text, mono for labels and source/citation metadata.
- Motion: gentle entrance and hover transitions that make controls feel tactile, not flashy.

Avoid returning to the dark editorial theme unless a future module explicitly needs it.

## Page Template

Use this structure for future modules:

1. Hero: module title, Canvas-first promise, and a compact professor-emphasis note.
2. Learning Tracks: Cram and Deep cards.
3. Tabs/Lab: interactive diagram or simulator.
4. Source Trail: visible links with concise labels.
5. Quiz CTA: direct students to practice mode.

Quiz pages should also include a compact source trail so students can see whether a question set is
Canvas-only, Canvas-first with outside review aids, or based on a newly added module.

## Current Module Enhancements

Module 3:

- Cram focus: K-means is unsupervised; KNN and SVM are supervised.
- Deep focus: points in feature space, Euclidean distance, neighbor voting, margin width, support vectors, kernels.
- Diagrams: K-means assignment/update, KNN live vote, SVM margin/kernel switch.

Module 4:

- Cram focus: ensemble types, bagging vs boosting, Random Forest voting/averaging.
- Deep focus: variance reduction, bootstrapped samples, feature subsampling, tree disagreement, feature importance caveats.
- Diagrams: bagging/boosting/stacking/voting flow, forest simulator, tradeoff comparison.

Module 5:

- Cram focus: neural-network parts, forward propagation, loss, backpropagation, NLP pipeline, CNN layer order.
- Deep focus: representations moving from raw input to vectors, tokens, embeddings, filters, feature maps, and class scores.
- Diagrams: neural network signal flow, NLP pipeline, CNN convolution/ReLU/pooling.

## Source Trail Starter Set

- GeeksforGeeks Machine Learning with Python overview.
- GeeksforGeeks pages for K-means, KNN, SVM, and Random Forest.
- scikit-learn docs for nearest neighbors, classifier comparison, K-means examples, silhouette analysis, and ensembles.
- Google Machine Learning Crash Course for interactive exercises and study structure.
- CNN Explainer paper for CNN teaching interaction patterns.
- Distill feature visualization for representation and interpretability language.
- TensorFlow Embedding Projector for embedding visualization ideas.

## Expansion Rules

- Add new modules by copying the module template, not by creating a one-off page.
- Keep the source trail visible but compact.
- Prefer one strong dynamic diagram over many small decorative widgets.
- Add at least one exam-style practice question whenever a new concept is introduced.
- If a new outside source is used, add it to the visible source trail and update this file.
