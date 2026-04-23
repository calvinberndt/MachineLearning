export type QuestionType = "multiple-choice" | "fill-blank";

export type Question = {
  id: string;
  module: "Module 3" | "Module 4" | "Module 5";
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
    id: "m6-q1",
    module: "Module 5",
    type: "multiple-choice",
    prompt: "Which layer of a neural network receives the raw data first?",
    choices: ["Output layer", "Input layer", "Loss layer", "Pooling layer"],
    answer: "Input layer",
    explanation: "The input layer holds the raw features before hidden layers transform them.",
  },
  {
    id: "m6-q2",
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
    id: "m6-q3",
    module: "Module 5",
    type: "multiple-choice",
    prompt: "Which NLP step breaks text into words or smaller units?",
    choices: ["Pooling", "Tokenization", "Backpropagation", "Bagging"],
    answer: "Tokenization",
    explanation:
      "Tokenization is the step where raw text is split into smaller processable pieces.",
  },
  {
    id: "m6-q4",
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
    id: "m6-q5",
    module: "Module 5",
    type: "multiple-choice",
    prompt: "Which output-layer function is commonly used for multi-class image classification?",
    choices: ["ReLU", "Sigmoid", "Softmax", "TF-IDF"],
    answer: "Softmax",
    explanation: "Softmax converts class scores into a probability distribution across classes.",
  },
  {
    id: "m6-q6",
    module: "Module 5",
    type: "fill-blank",
    prompt:
      "The process of sending prediction error backward through a neural network is called ______.",
    answer: "backpropagation",
    explanation:
      "Backpropagation computes gradients and updates weights based on model error.",
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
