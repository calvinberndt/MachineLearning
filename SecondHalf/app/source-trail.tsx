import Link from "next/link";

export type SourceItem = {
  title: string;
  href: string;
  note: string;
};

export const sourceGroups = {
  learning: [
    {
      title: "Google ML Crash Course",
      href: "https://developers.google.com/machine-learning/crash-course",
      note: "Interactive exercises, videos, and quizzes informed the cram-plus-practice structure.",
    },
    {
      title: "Dynamic visualization pedagogy",
      href: "https://pubsonline.informs.org/doi/10.1287/ited.2018.0203",
      note: "Supports the idea that seeing, doing, and playing can improve quantitative learning.",
    },
    {
      title: "Visualization meta-analysis",
      href: "https://www.sciencedirect.com/science/article/pii/S1747938X24000484",
      note: "Supports using external visualizations as a serious learning aid, not decoration.",
    },
  ],
  module3: [
    {
      title: "Canvas notes: Clustering, KNN code, SVM",
      href: "#",
      note: "Source of truth for definitions, examples, and the professor's exam emphasis.",
    },
    {
      title: "GFG K-means introduction",
      href: "https://www.geeksforgeeks.org/machine-learning/k-means-clustering-introduction/",
      note: "Useful supplement for the initialize, assign, update, repeat loop.",
    },
    {
      title: "GFG KNN with scikit-learn",
      href: "https://www.geeksforgeeks.org/machine-learning/k-nearest-neighbor-algorithm-in-python/",
      note: "Reinforces k choice, scaling, decision boundaries, and confusion-matrix evaluation.",
    },
    {
      title: "GFG SVM in Python",
      href: "https://www.geeksforgeeks.org/machine-learning/classifying-data-using-support-vector-machinessvms-in-python/",
      note: "Good review for hyperplane, margin, support vectors, C, and kernels.",
    },
    {
      title: "scikit-learn classifier comparison",
      href: "https://scikit-learn.org/stable/auto_examples/classification/plot_classifier_comparison.html",
      note: "Reference for decision-boundary comparisons across KNN, SVM, Random Forest, and neural nets.",
    },
  ],
  module4: [
    {
      title: "Canvas notes: Ensemble Learning and Random Forest",
      href: "#",
      note: "Source of truth for bagging, boosting, stacking, voting, and the student-performance case study.",
    },
    {
      title: "GFG Random Forest Classifier",
      href: "https://www.geeksforgeeks.org/random-forest-classifier-using-scikit-learn/",
      note: "Supplement for bootstrap sampling, random feature selection, voting, and feature importance.",
    },
    {
      title: "scikit-learn ensemble guide",
      href: "https://scikit-learn.org/stable/modules/ensemble.html",
      note: "Reference for ensemble families and implementation vocabulary.",
    },
    {
      title: "scikit-learn RandomForestClassifier",
      href: "https://scikit-learn.org/1.3/modules/generated/sklearn.ensemble.RandomForestClassifier.html",
      note: "Feature-importance details and the caution that impurity importances can mislead.",
    },
  ],
  module5: [
    {
      title: "Canvas notes: Deep Learning, NLP, CNN Algorithm Details",
      href: "#",
      note: "Source of truth for neural-network vocabulary, NLP steps, and CNN layer order.",
    },
    {
      title: "Google MLCC interactive exercises",
      href: "https://developers.google.com/machine-learning/crash-course/exercises",
      note: "Model for combining short explanations, interactives, and module-end checks.",
    },
    {
      title: "CNN Explainer paper",
      href: "https://arxiv.org/abs/2004.15004",
      note: "Informs the CNN diagram style: overview plus on-demand operation-level explanations.",
    },
    {
      title: "Distill Feature Visualization",
      href: "https://distill.pub/2017/feature-visualization/",
      note: "Useful for explaining representations and what neural network parts respond to.",
    },
    {
      title: "TensorFlow Embedding Projector",
      href: "https://www.tensorflow.org/tensorboard/tensorboard_projector_plugin",
      note: "Reference for visualizing high-dimensional embeddings as explorable spaces.",
    },
  ],
  quiz: [
    {
      title: "Canvas notes: Professor-style question patterns",
      href: "#",
      note: "Source of truth for the multiple-choice and fill-in-the-blank topics used in practice mode.",
    },
    {
      title: "Google MLCC interactive exercises",
      href: "https://developers.google.com/machine-learning/crash-course/exercises",
      note: "Supplemental reference for short feedback loops, quick checks, and exercise-style learning.",
    },
    {
      title: "scikit-learn classifier comparison",
      href: "https://scikit-learn.org/stable/auto_examples/classification/plot_classifier_comparison.html",
      note: "Useful review source for comparing KNN, SVM, Random Forest, and neural-network decision behavior.",
    },
  ],
};

export function SourceTrail({
  sources,
  title = "Source trail",
}: {
  sources: SourceItem[];
  title?: string;
}) {
  return (
    <section className="source-trail" aria-label={title}>
      <div>
        <p className="section-tag">Visible citations</p>
        <h2 className="section-title">{title}</h2>
        <p className="section-copy">
          Canvas stays the source of truth. These links are the outside references used to sharpen
          diagrams, representations, and optional deeper review.
        </p>
      </div>
      <div className="source-list">
        {sources.map((source) =>
          source.href === "#" ? (
            <div key={source.title} className="source-card source-card--canvas">
              <span>Canvas</span>
              <strong>{source.title}</strong>
              <p>{source.note}</p>
            </div>
          ) : (
            <Link
              key={source.href}
              className="source-card"
              href={source.href}
              rel="noreferrer"
              target="_blank"
            >
              <span>External</span>
              <strong>{source.title}</strong>
              <p>{source.note}</p>
            </Link>
          ),
        )}
      </div>
    </section>
  );
}
