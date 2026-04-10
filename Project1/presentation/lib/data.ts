// All ML results extracted from the Jupyter notebooks

export const K_VALUES = [1, 3, 5, 7, 9, 11, 15, 20, 31, 51];

export const knnIris = {
  accuracies: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.9667, 0.9333],
  bestK: 1,
  bestAccuracy: 1.0,
  metrics: { accuracy: 1.0, precision: 1.0, recall: 1.0, f1: 1.0 },
  confusionMatrix: [[10, 0, 0], [0, 9, 0], [0, 0, 11]],
  classes: ["Setosa", "Versicolor", "Virginica"],
};

export const knnDiabetes = {
  accuracies: [0.6558, 0.7208, 0.7208, 0.7078, 0.7403, 0.7662, 0.7532, 0.7597, 0.7532, 0.7662],
  bestK: 11,
  bestAccuracy: 0.7662,
  metrics: { accuracy: 0.7662, precision: 0.6863, recall: 0.6364, f1: 0.6604 },
  confusionMatrix: [[83, 16], [20, 35]],
  classes: ["Not Diabetic", "Diabetic"],
};

export const svmIris = {
  kernels: [
    { name: "Linear", accuracy: 0.9667 },
    { name: "RBF", accuracy: 1.0 },
    { name: "Poly", accuracy: 0.9667 },
  ],
  bestKernel: "RBF",
  metrics: { accuracy: 1.0, precision: 1.0, recall: 1.0, f1: 1.0 },
  confusionMatrix: [[10, 0, 0], [0, 9, 0], [0, 0, 11]],
  classes: ["Setosa", "Versicolor", "Virginica"],
};

export const svmDiabetes = {
  kernels: [
    { name: "Linear", accuracy: 0.7532 },
    { name: "RBF", accuracy: 0.7468 },
    { name: "Poly", accuracy: 0.7403 },
  ],
  bestKernel: "Linear",
  metrics: { accuracy: 0.7532, precision: 0.6667, recall: 0.6182, f1: 0.6415 },
  confusionMatrix: [[82, 17], [21, 34]],
  classes: ["Not Diabetic", "Diabetic"],
};

export const irisDataset = {
  name: "Iris",
  source: "UCI ML Repository / sklearn",
  samples: 150,
  features: 4,
  classes: 3,
  classNames: ["Setosa", "Versicolor", "Virginica"],
  featureNames: ["Sepal Length", "Sepal Width", "Petal Length", "Petal Width"],
  balance: "Balanced (50 per class)",
  split: "80/20 train/test",
};

export const diabetesDataset = {
  name: "Pima Indians Diabetes",
  source: "NIDDK / Kaggle",
  samples: 768,
  features: 8,
  classes: 2,
  classNames: ["Not Diabetic (500)", "Diabetic (268)"],
  featureNames: ["Pregnancies", "Glucose", "Blood Pressure", "Skin Thickness", "Insulin", "BMI", "Diabetes Pedigree", "Age"],
  balance: "Imbalanced (65.1% / 34.9%)",
  split: "80/20 train/test",
};

export const comparisonTable = [
  { metric: "Accuracy", knnIris: "100%", svmIris: "100%", knnDiab: "76.6%", svmDiab: "75.3%" },
  { metric: "Precision", knnIris: "100%", svmIris: "100%", knnDiab: "68.6%", svmDiab: "66.7%" },
  { metric: "Recall", knnIris: "100%", svmIris: "100%", knnDiab: "63.6%", svmDiab: "61.8%" },
  { metric: "F1 Score", knnIris: "100%", svmIris: "100%", knnDiab: "66.0%", svmDiab: "64.2%" },
  { metric: "Best Config", knnIris: "K = 1", svmIris: "RBF Kernel", knnDiab: "K = 11", svmDiab: "Linear Kernel" },
];
