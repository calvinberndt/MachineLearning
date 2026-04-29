export type QuestionType = "multiple-choice" | "fill-blank";

export type Question = {
  id: string;
  module: "Module 3" | "Module 4" | "Module 5" | "Module 6";
  type: QuestionType;
  prompt: string;
  choices?: string[];
  answer: string;
  explanation: string;
};

const questionBank: Question[] = [
  {
    id: "m3-q1",
    module: "Module 3",
    type: "multiple-choice",
    prompt: "Which technique is truly unsupervised in Module 3?",
    choices: ["KNN", "SVM", "K-means clustering", "Logistic regression"],
    answer: "K-means clustering",
    explanation:
      "K-means groups unlabeled points by similarity. KNN and SVM are supervised because they use labeled training data.",
  },
  {
    id: "m3-q2",
    module: "Module 3",
    type: "multiple-choice",
    prompt: "In K-means, what happens immediately after assigning each point to the nearest centroid?",
    choices: [
      "The data labels are removed",
      "The centroids are updated using the mean of each cluster",
      "The algorithm switches to KNN",
      "The margin is maximized",
    ],
    answer: "The centroids are updated using the mean of each cluster",
    explanation:
      "K-means alternates between assignment and centroid update until the clusters stabilize.",
  },
  {
    id: "m3-q3",
    module: "Module 3",
    type: "multiple-choice",
    prompt: "What does the value k control in KNN classification?",
    choices: [
      "The number of classes",
      "The number of features",
      "The number of nearest neighbors used for voting",
      "The width of the SVM margin",
    ],
    answer: "The number of nearest neighbors used for voting",
    explanation:
      "KNN classifies a new point by looking at the labels of its k nearest training examples.",
  },
  {
    id: "m3-q4",
    module: "Module 3",
    type: "multiple-choice",
    prompt: "What is the main goal of an SVM classifier with a linear kernel?",
    choices: [
      "Find the widest-margin separating boundary",
      "Average many decision trees",
      "Remove stop words from text",
      "Compute cluster means repeatedly",
    ],
    answer: "Find the widest-margin separating boundary",
    explanation: "SVM searches for a hyperplane with maximum margin between classes.",
  },
  {
    id: "m3-q5",
    module: "Module 3",
    type: "fill-blank",
    prompt: "The data points closest to an SVM decision boundary are called ______ vectors.",
    answer: "support",
    explanation:
      "Support vectors are the points that define the margin and therefore control the separating boundary.",
  },
  {
    id: "m4-q1",
    module: "Module 4",
    type: "multiple-choice",
    prompt: "Which ensemble method is Random Forest most closely associated with?",
    choices: ["Boosting", "Bagging", "Stacking", "Dimensionality reduction"],
    answer: "Bagging",
    explanation:
      "Random Forest uses bootstrap samples and many trees in parallel, which is the core idea of bagging.",
  },
  {
    id: "m4-q2",
    module: "Module 4",
    type: "multiple-choice",
    prompt: "Why does bagging often improve performance over a single decision tree?",
    choices: [
      "It increases bias on purpose",
      "It reduces variance by averaging multiple models",
      "It removes all hyperparameters",
      "It guarantees zero overfitting",
    ],
    answer: "It reduces variance by averaging multiple models",
    explanation: "Averaging many noisy trees smooths out the instability of any one tree.",
  },
  {
    id: "m4-q3",
    module: "Module 4",
    type: "multiple-choice",
    prompt: "In boosting, what happens to examples that were misclassified earlier?",
    choices: [
      "They are deleted",
      "They are ignored",
      "They receive more attention or weight",
      "They become validation data",
    ],
    answer: "They receive more attention or weight",
    explanation:
      "Boosting focuses later learners on the hard cases that earlier learners missed.",
  },
  {
    id: "m4-q4",
    module: "Module 4",
    type: "multiple-choice",
    prompt: "For random-forest regression, how is the final prediction produced?",
    choices: [
      "Majority vote",
      "Weighted median of classes",
      "Average of the tree outputs",
      "Largest single tree prediction",
    ],
    answer: "Average of the tree outputs",
    explanation: "Classification forests vote. Regression forests average numeric predictions.",
  },
  {
    id: "m4-q5",
    module: "Module 4",
    type: "fill-blank",
    prompt: "In stacking, the model that combines the base learners is called a ______-model.",
    answer: "meta",
    explanation:
      "Stacking uses a meta-model to learn how to combine the predictions of base models.",
  },
  {
    id: "m5-q1",
    module: "Module 5",
    type: "multiple-choice",
    prompt: "Which layer of a neural network receives the raw data first?",
    choices: ["Output layer", "Input layer", "Loss layer", "Pooling layer"],
    answer: "Input layer",
    explanation: "The input layer holds the raw features before hidden layers transform them.",
  },
  {
    id: "m5-q2",
    module: "Module 5",
    type: "multiple-choice",
    prompt: "Why are activation functions such as ReLU important?",
    choices: [
      "They make the model purely linear",
      "They introduce non-linearity so the network can learn more complex patterns",
      "They remove the need for training data",
      "They replace the loss function",
    ],
    answer: "They introduce non-linearity so the network can learn more complex patterns",
    explanation:
      "Without an activation function, stacked layers collapse into a linear transformation.",
  },
  {
    id: "m5-q3",
    module: "Module 5",
    type: "multiple-choice",
    prompt: "Which NLP step breaks text into words or smaller units?",
    choices: ["Pooling", "Tokenization", "Backpropagation", "Bagging"],
    answer: "Tokenization",
    explanation:
      "Tokenization is the step where raw text is split into smaller processable pieces.",
  },
  {
    id: "m5-q4",
    module: "Module 5",
    type: "multiple-choice",
    prompt: "What is the main purpose of pooling in a CNN?",
    choices: [
      "Increase the size of the feature map",
      "Reduce spatial size while keeping strong features",
      "Convert text to numbers",
      "Choose the optimizer",
    ],
    answer: "Reduce spatial size while keeping strong features",
    explanation:
      "Pooling keeps the strongest local signals while shrinking the map and reducing computation.",
  },
  {
    id: "m5-q5",
    module: "Module 5",
    type: "multiple-choice",
    prompt: "Which output-layer function is commonly used for multi-class image classification?",
    choices: ["ReLU", "Sigmoid", "Softmax", "TF-IDF"],
    answer: "Softmax",
    explanation: "Softmax converts class scores into a probability distribution across classes.",
  },
  {
    id: "m5-q6",
    module: "Module 5",
    type: "fill-blank",
    prompt:
      "The process of sending prediction error backward through a neural network is called ______.",
    answer: "backpropagation",
    explanation:
      "Backpropagation computes gradients and updates weights based on model error.",
  },
  {
    id: "m3-q6",
    module: "Module 3",
    type: "multiple-choice",
    prompt: "What is the main advantage of k-means++ over random initialisation?",
    choices: [
      "It guarantees the global minimum",
      "It picks initial centroids that are spread apart, reducing bad local minima",
      "It removes the need to choose k",
      "It lets k-means handle non-globular clusters",
    ],
    answer: "It picks initial centroids that are spread apart, reducing bad local minima",
    explanation:
      "Arthur & Vassilvitskii (2007) showed k-means++ seeds centroids with probability proportional to squared distance from existing centroids, which gives provably better starting points than uniform random selection. It does not guarantee the global minimum — scikit-learn still runs n_init restarts on top.",
  },
  {
    id: "m3-q7",
    module: "Module 3",
    type: "multiple-choice",
    prompt: "In SVM, what happens when you increase the regularisation parameter C?",
    choices: [
      "The margin widens and the model becomes more regularised",
      "The margin shrinks and the model becomes less regularised (harder margin)",
      "The kernel switches from RBF to linear",
      "The number of support vectors always increases",
    ],
    answer: "The margin shrinks and the model becomes less regularised (harder margin)",
    explanation:
      "C points the opposite way from the λ in ridge regression. Large C penalises every slack violation heavily, producing a harder margin that classifies training points more aggressively — less regularisation, more overfitting risk.",
  },
  {
    id: "m3-q8",
    module: "Module 3",
    type: "fill-blank",
    prompt:
      "KNN suffers from the curse of dimensionality; scikit-learn switches to brute-force search past roughly D > ______ features.",
    answer: "15",
    explanation:
      "Above ~15 dimensions, tree-based indexes (KD-tree, ball-tree) lose their speed advantage and brute force becomes competitive or faster.",
  },
  {
    id: "m4-q6",
    module: "Module 4",
    type: "multiple-choice",
    prompt: "Approximately what fraction of training points are out-of-bag for each tree in a Random Forest?",
    choices: ["1/2 ≈ 50%", "1/e ≈ 37%", "1/π ≈ 32%", "1/10 = 10%"],
    answer: "1/e ≈ 37%",
    explanation:
      "Bootstrapping draws n points with replacement from n. The probability any specific point is not drawn is (1 − 1/n)^n → 1/e ≈ 0.368. Those out-of-bag points give a free hold-out estimate without a validation split.",
  },
  {
    id: "m4-q7",
    module: "Module 4",
    type: "multiple-choice",
    prompt: "For a Random Forest classifier, what is scikit-learn's default number of features considered at each split?",
    choices: [
      "All features (no subsetting)",
      "log2(n_features)",
      "sqrt(n_features)",
      "n_features / 3",
    ],
    answer: "sqrt(n_features)",
    explanation:
      "max_features='sqrt' is the classification default; regression defaults to max_features=1.0 (all). The subsetting decorrelates the trees and is what distinguishes Random Forest from plain bagging.",
  },
  {
    id: "m4-q8",
    module: "Module 4",
    type: "multiple-choice",
    prompt: "Why does scikit-learn recommend permutation_importance over the default feature_importances_?",
    choices: [
      "Permutation importance is faster to compute",
      "feature_importances_ is biased toward high-cardinality features and reflects training data only",
      "feature_importances_ only works for regression",
      "Permutation importance always gives larger numbers",
    ],
    answer: "feature_importances_ is biased toward high-cardinality features and reflects training data only",
    explanation:
      "Impurity-based importance has two known flaws: it inflates importance for features with many unique values (e.g. IDs), and it's computed on training data so it doesn't measure generalisation. Permutation importance shuffles each feature on held-out data and measures the drop in score — both flaws disappear.",
  },
  {
    id: "m5-q7",
    module: "Module 5",
    type: "multiple-choice",
    prompt: "If you stack two linear (no activation) layers, the composition is equivalent to:",
    choices: [
      "A deeper non-linear function",
      "A single affine transformation",
      "A sigmoid classifier",
      "A convolutional layer",
    ],
    answer: "A single affine transformation",
    explanation:
      "W₂(W₁x + b₁) + b₂ = (W₂W₁)x + (W₂b₁ + b₂) — a linear map composed with a linear map is still a single linear map. This is the algebraic reason activation functions are essential; otherwise depth adds no expressive power.",
  },
  {
    id: "m5-q8",
    module: "Module 5",
    type: "multiple-choice",
    prompt: "Which loss function is standard for multi-class classification with a neural network?",
    choices: ["Mean squared error", "Hinge loss", "Cross-entropy loss", "L1 loss"],
    answer: "Cross-entropy loss",
    explanation:
      "Cross-entropy L = −Σ y_c log ŷ_c pairs with a softmax output to give well-behaved gradients. MSE is for regression; hinge is for SVM-style classification.",
  },
  {
    id: "m5-q9",
    module: "Module 5",
    type: "fill-blank",
    prompt:
      "For a CNN conv layer, the output spatial dimension is (H − F + 2P) / S + ______.",
    answer: "1",
    explanation:
      "The canonical output-dim formula: H_out = ⌊(H_in − F + 2P) / S⌋ + 1, where F = filter size, P = padding, S = stride.",
  },
  {
    id: "m5-q10",
    module: "Module 5",
    type: "multiple-choice",
    prompt: "What does weight sharing in a convolutional layer accomplish?",
    choices: [
      "Reduces parameters and produces translation-tolerant feature detectors",
      "Forces all filters to learn the same pattern",
      "Eliminates the need for non-linear activations",
      "Makes training slower but more accurate",
    ],
    answer: "Reduces parameters and produces translation-tolerant feature detectors",
    explanation:
      "A fully-connected layer would have H·W·C·H'·W'·C' parameters for image input. A conv layer shares the same F×F×C filter across every spatial location, reducing parameters to F·F·C·C'. As a side-effect, the same feature is detected regardless of where it appears in the input.",
  },
  {
    id: "m5-q11",
    module: "Module 5",
    type: "multiple-choice",
    prompt: "What is a key limitation of the classroom NLP pipeline (tokenise + stop-words + lemmatise + BoW)?",
    choices: [
      "It can't handle English text",
      "Production systems typically use subword tokenisation (BPE/WordPiece) and learned embeddings instead",
      "It only works for sentiment analysis",
      "It requires GPU acceleration",
    ],
    answer: "Production systems typically use subword tokenisation (BPE/WordPiece) and learned embeddings instead",
    explanation:
      "Modern NLP replaces hand-crafted tokens with data-driven subword algorithms and replaces bag-of-words with context-aware learned embeddings (Word2Vec, GloVe, BERT). The classroom pipeline teaches the ideas; production rarely uses its code.",
  },
  {
    id: "m5-q12",
    module: "Module 5",
    type: "fill-blank",
    prompt:
      "The derivative of the sigmoid peaks at 0.25, which causes the ______ gradient problem in deep networks.",
    answer: "vanishing",
    explanation:
      "Multiplying many sub-unity derivatives through the chain rule of backprop drives gradients toward zero in early layers. ReLU (derivative 0 or 1) is the standard fix for hidden-layer activations.",
  },
  {
    id: "m6-q1",
    module: "Module 6",
    type: "multiple-choice",
    prompt: "Why does an LLM tokenizer run before the transformer sees a prompt?",
    choices: [
      "It converts text into token IDs the model can map to vectors",
      "It performs RLHF automatically",
      "It downloads the latest model weights",
      "It removes the need for embeddings",
    ],
    answer: "It converts text into token IDs the model can map to vectors",
    explanation:
      "The tokenizer is the bridge from raw text to integer token IDs. Those IDs index embeddings, extending the Module 5 NLP pipeline idea without using hand-built bag-of-words features.",
  },
  {
    id: "m6-q2",
    module: "Module 6",
    type: "fill-blank",
    prompt: "The learned numeric vector associated with a token ID is called an ______.",
    answer: "embedding",
    explanation:
      "An embedding is a learned vector representation. It lets the transformer operate on numbers while preserving useful relationships between tokens.",
  },
  {
    id: "m6-q3",
    module: "Module 6",
    type: "multiple-choice",
    prompt: "In self-attention, what does the selected query token compute over the other tokens?",
    choices: [
      "A set of weights for mixing relevant value vectors",
      "A fixed alphabetical order",
      "A new Canvas module number",
      "A bootstrap sample of training rows",
    ],
    answer: "A set of weights for mixing relevant value vectors",
    explanation:
      "Self-attention compares a query to keys, normalizes the scores, and uses the resulting weights to mix value vectors into a contextual representation.",
  },
  {
    id: "m6-q4",
    module: "Module 6",
    type: "multiple-choice",
    prompt: "What role does RLHF play in the Canvas training pipeline?",
    choices: [
      "Humans rank responses so the model can learn preferred, safer behavior",
      "It replaces pretraining with a hand-coded rule table",
      "It turns images into pixels",
      "It guarantees that every answer is factually correct",
    ],
    answer: "Humans rank responses so the model can learn preferred, safer behavior",
    explanation:
      "RLHF means reinforcement learning from human feedback. It aligns response style and safety after broad pretraining and task-oriented tuning, but it does not make the model infallible.",
  },
  {
    id: "m6-q5",
    module: "Module 6",
    type: "multiple-choice",
    prompt: "Compared with a classic RNN, why is a transformer better suited to long prompt context?",
    choices: [
      "Self-attention lets tokens consult one another directly instead of passing state step by step",
      "It removes positional information entirely",
      "It trains only on labeled classroom datasets",
      "It uses decision trees inside every layer",
    ],
    answer: "Self-attention lets tokens consult one another directly instead of passing state step by step",
    explanation:
      "RNNs process sequences through recurrent state. Transformers use attention across token positions, then add positional information so order is still available.",
  },
  {
    id: "m6-q6",
    module: "Module 6",
    type: "multiple-choice",
    prompt: "Which statement best captures the OpenAI-vs-LLM distinction from Module 6?",
    choices: [
      "An LLM is the model engine; OpenAI-style products add interfaces, safety, APIs, and infrastructure",
      "OpenAI and LLM are exact synonyms",
      "An LLM is only an image generator",
      "OpenAI systems do not use transformer models",
    ],
    answer: "An LLM is the model engine; OpenAI-style products add interfaces, safety, APIs, and infrastructure",
    explanation:
      "Canvas uses the engine-vs-car analogy: the LLM is the core model, while a deployed OpenAI-style system includes the surrounding product and safety layers.",
  },
  {
    id: "m6-q7",
    module: "Module 6",
    type: "multiple-choice",
    prompt: "What does a multimodal extension add to a language-model system?",
    choices: [
      "The ability to work across input types such as text, images, and audio",
      "A guarantee that no tokenization is needed",
      "A switch from neural networks to K-means",
      "A rule that every model must be open source",
    ],
    answer: "The ability to work across input types such as text, images, and audio",
    explanation:
      "Canvas lists text, images, and audio as modern OpenAI system inputs. Multimodal systems connect those modalities inside a broader user-facing product.",
  },
  {
    id: "m6-q8",
    module: "Module 6",
    type: "fill-blank",
    prompt: "The maximum amount of prompt and generated text a model can consider at once is its ______ window.",
    answer: "context",
    explanation:
      "A context window bounds how many tokens the model can use during inference. Larger windows help with long documents but still have limits and cost tradeoffs.",
  },
  {
    id: "m6-q9",
    module: "Module 6",
    type: "multiple-choice",
    prompt: "Which popular LLM family is associated with Meta and open-weight releases in the Canvas landscape?",
    choices: ["Llama", "Whisper", "DALL·E", "K-means"],
    answer: "Llama",
    explanation:
      "Canvas lists Llama as Meta's prominent open-weight model family. Whisper and DALL·E are OpenAI speech/image tools, and K-means is an unsupervised clustering algorithm from Module 3.",
  },
  {
    id: "m6-q10",
    module: "Module 6",
    type: "multiple-choice",
    prompt: "What is the main objective during broad LLM pretraining in Module 6?",
    choices: [
      "Predict the next token from large text datasets",
      "Vote across decision trees",
      "Manually label every possible prompt",
      "Compute Euclidean distance to a centroid",
    ],
    answer: "Predict the next token from large text datasets",
    explanation:
      "Canvas describes pretraining as learning grammar, facts, and patterns by predicting the next token before later fine-tuning and RLHF stages.",
  },
];

function createGenerator(seed: number) {
  let current = seed;

  return () => {
    current = (current * 1664525 + 1013904223) % 4294967296;
    return current / 4294967296;
  };
}

function shuffleWithSeed<T>(items: T[], seed: number) {
  const copy = [...items];
  const random = createGenerator(seed);

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

export function generateExam(seed: number) {
  const multipleChoice = shuffleWithSeed(
    questionBank.filter((question) => question.type === "multiple-choice"),
    seed,
  ).slice(0, 6);
  const fillBlank = shuffleWithSeed(
    questionBank.filter((question) => question.type === "fill-blank"),
    seed + 1,
  ).slice(0, 2);

  return shuffleWithSeed([...multipleChoice, ...fillBlank], seed + 2);
}

export function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}
