"use client";

import { Presentation, type SlideProps } from "./components/Presentation";
import { BuildStep } from "./components/BuildStep";
import { AnimatedValue } from "./components/AnimatedValue";
import { KnnAccuracyChart } from "./components/KnnAccuracyChart";
import { SvmKernelChart } from "./components/SvmKernelChart";
import { ConfusionMatrix } from "./components/ConfusionMatrix";
import { theme } from "@/lib/theme";
import * as data from "@/lib/data";

// ─── Shared UI ────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`p-5 rounded-lg ${className}`}
      style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
    >
      {children}
    </div>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-bold mb-2 leading-tight" style={{ fontSize: theme.titleSize }}>
      {children}
    </h2>
  );
}

function Subtitle({ children }: { children: React.ReactNode }) {
  return <p className="text-base opacity-60 mb-8">{children}</p>;
}

function MetricCard({
  value, label, color, active = true,
}: {
  value: number; label: string; color: string; active?: boolean;
}) {
  return (
    <Card className="text-center">
      <AnimatedValue value={value} color={color} active={active} />
      <p className="text-xs uppercase tracking-wider mt-2 opacity-60">{label}</p>
    </Card>
  );
}

// ─── Slide 1: Title ───────────────────────────────────────

function TitleSlide({ step }: SlideProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-8">
      <BuildStep visible={step >= 0}>
        <p
          className="text-sm uppercase tracking-[4px] font-semibold mb-5"
          style={{ color: theme.accent1 }}
        >
          COMP SCI 465 | Machine Learning
        </p>
        <h1 className="text-5xl font-extrabold leading-tight mb-4">
          Supervised Classification
          <br />
          Algorithm Comparison
        </h1>
        <p className="text-lg opacity-50 mb-8">
          KNN vs SVM vs Decision Tree on Iris &amp; Diabetes Datasets
        </p>
        <div
          className="w-24 h-1 rounded-full mx-auto mb-8"
          style={{ background: `linear-gradient(90deg, ${theme.accent1}, ${theme.accent2})` }}
        />
        <p className="text-base opacity-40">Calvin Berndt | UW-Green Bay | Spring 2026</p>
      </BuildStep>
    </div>
  );
}

// ─── Slide 2: Introduction ────────────────────────────────

function IntroSlide({ step }: SlideProps) {
  return (
    <div>
      <Title>Introduction</Title>
      <Subtitle>What is supervised classification and why does it matter?</Subtitle>
      <BuildStep visible={step >= 0}>
        <Card className="mb-4">
          <h3 className="font-semibold mb-2" style={{ color: theme.accent1 }}>
            The Problem
          </h3>
          <p className="text-sm opacity-80 leading-relaxed">
            Given labeled training data, can a machine learn to correctly classify new, unseen
            examples? This is the core question of supervised classification, one of the most
            widely used tasks in machine learning.
          </p>
        </Card>
      </BuildStep>
      <BuildStep visible={step >= 1}>
        <Card>
          <h3 className="font-semibold mb-2" style={{ color: theme.accent2 }}>
            Our Objective
          </h3>
          <p className="text-sm opacity-80 leading-relaxed">
            Implement, evaluate, and compare three classification algorithms —{" "}
            <strong>K-Nearest Neighbors (KNN)</strong>, <strong>Support Vector Machine (SVM)</strong>,
            and <strong>Decision Tree</strong> — across two datasets with different characteristics
            to understand when each algorithm excels or struggles.
          </p>
        </Card>
      </BuildStep>
    </div>
  );
}

// ─── Slide 3: Datasets Overview ───────────────────────────

function DatasetsSlide({ step }: SlideProps) {
  const ds = [
    { d: data.irisDataset, color: theme.accent1 },
    { d: data.diabetesDataset, color: theme.accent2 },
  ];
  return (
    <div>
      <Title>Datasets</Title>
      <Subtitle>Two datasets with very different characteristics</Subtitle>
      <div className="grid grid-cols-2 gap-5">
        {ds.map(({ d, color }, i) => (
          <BuildStep key={d.name} visible={step >= i}>
            <Card>
              <h3 className="font-bold text-lg mb-3" style={{ color }}>{d.name}</h3>
              <p className="text-xs opacity-50 mb-3">Source: {d.source}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="opacity-60">Samples</span>
                  <span className="font-mono font-bold">{d.samples}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Features</span>
                  <span className="font-mono font-bold">{d.features}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Classes</span>
                  <span className="font-mono font-bold">{d.classes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Balance</span>
                  <span className="font-bold text-xs">{d.balance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Split</span>
                  <span className="font-mono">{d.split}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-xs opacity-50">Features: {d.featureNames.join(", ")}</p>
              </div>
            </Card>
          </BuildStep>
        ))}
      </div>
    </div>
  );
}

// ─── Slide 4: Data Preprocessing ──────────────────────────

function PreprocessingSlide({ step }: SlideProps) {
  return (
    <div>
      <Title>Data Preprocessing</Title>
      <Subtitle>Preparing raw data for model training</Subtitle>
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            title: "Missing Values",
            desc: "Diabetes dataset had invalid zeros in Glucose, BP, SkinThickness, Insulin, and BMI. Replaced with column medians.",
            icon: "01",
          },
          {
            title: "Feature Scaling",
            desc: "StandardScaler applied to normalize all features (mean=0, std=1). Critical for KNN distance calculations and SVM margin optimization.",
            icon: "02",
          },
          {
            title: "Train/Test Split",
            desc: "80/20 split with random_state=42 across all notebooks. Same split ensures fair algorithm comparison.",
            icon: "03",
          },
        ].map((item, i) => (
          <BuildStep key={item.title} visible={step >= i}>
            <Card className="h-full">
              <div
                className="text-2xl font-bold font-mono mb-3"
                style={{ color: theme.accent1, opacity: 0.3 }}
              >
                {item.icon}
              </div>
              <h3 className="font-semibold mb-2" style={{ color: theme.accent1 }}>
                {item.title}
              </h3>
              <p className="text-sm opacity-70 leading-relaxed">{item.desc}</p>
            </Card>
          </BuildStep>
        ))}
      </div>
    </div>
  );
}

// ─── Slide 5: Methodology ─────────────────────────────────

function MethodologySlide({ step }: SlideProps) {
  const algos = [
    {
      name: "K-Nearest Neighbors",
      type: "Lazy Learner",
      color: theme.accent1,
      desc: "Classifies by majority vote among K nearest training points in feature space. No model is built during training.",
      params: "K (number of neighbors)",
    },
    {
      name: "Support Vector Machine",
      type: "Eager Learner",
      color: theme.accent2,
      desc: "Finds the optimal hyperplane that maximizes margin between classes. Kernel trick enables nonlinear boundaries.",
      params: "Kernel type (Linear, RBF, Poly)",
    },
    {
      name: "Decision Tree",
      type: "Eager Learner",
      color: theme.accent3,
      desc: "Recursively splits data on features that best separate classes using Gini impurity or entropy as the splitting criterion.",
      params: "Criterion, max_depth",
    },
  ];
  return (
    <div>
      <Title>Methodology</Title>
      <Subtitle>Three algorithms, two learning paradigms</Subtitle>
      <div className="grid grid-cols-3 gap-4">
        {algos.map((a, i) => (
          <BuildStep key={a.name} visible={step >= i}>
            <Card className="h-full">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ background: a.color }} />
                <h3 className="font-bold" style={{ color: a.color }}>{a.name}</h3>
              </div>
              <span
                className="inline-block text-xs px-2 py-0.5 rounded-full mb-3"
                style={{ background: `${a.color}20`, color: a.color }}
              >
                {a.type}
              </span>
              <p className="text-sm opacity-70 leading-relaxed mb-3">{a.desc}</p>
              <p className="text-xs opacity-50">
                <strong>Key parameter:</strong> {a.params}
              </p>
            </Card>
          </BuildStep>
        ))}
      </div>
    </div>
  );
}

// ─── Slide 6: KNN Iris ────────────────────────────────────

function KnnIrisSlide({ step }: SlideProps) {
  return (
    <div>
      <Title>KNN: Iris Results</Title>
      <Subtitle>
        Best K = {data.knnIris.bestK} | Perfect classification across all K values 1-20
      </Subtitle>
      <BuildStep visible={step >= 0}>
        <KnnAccuracyChart
          accuracies={data.knnIris.accuracies}
          bestK={data.knnIris.bestK}
          title="Accuracy vs K Value (Iris)"
          domainMin={0.9}
        />
      </BuildStep>
      <BuildStep visible={step >= 1}>
        <div className="grid grid-cols-4 gap-3 mt-5">
          {(["accuracy", "precision", "recall", "f1"] as const).map((m, i) => (
            <MetricCard
              key={m}
              value={data.knnIris.metrics[m] * 100}
              label={m === "f1" ? "F1 Score" : m}
              color={[theme.accent1, theme.accent2, theme.accent3, theme.text][i]}
              active={step >= 1}
            />
          ))}
        </div>
      </BuildStep>
    </div>
  );
}

// ─── Slide 7: KNN Diabetes ────────────────────────────────

function KnnDiabetesSlide({ step }: SlideProps) {
  return (
    <div>
      <Title>KNN: Diabetes Results</Title>
      <Subtitle>
        Best K = {data.knnDiabetes.bestK} | Harder dataset shows meaningful accuracy variation
      </Subtitle>
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3">
          <BuildStep visible={step >= 0}>
            <KnnAccuracyChart
              accuracies={data.knnDiabetes.accuracies}
              bestK={data.knnDiabetes.bestK}
              title="Accuracy vs K Value (Diabetes)"
              domainMin={0.6}
            />
          </BuildStep>
        </div>
        <div className="col-span-2">
          <BuildStep visible={step >= 1}>
            <ConfusionMatrix
              matrix={data.knnDiabetes.confusionMatrix}
              labels={data.knnDiabetes.classes}
              title="Confusion Matrix (K=11)"
            />
          </BuildStep>
          <BuildStep visible={step >= 2}>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <MetricCard
                value={data.knnDiabetes.metrics.accuracy * 100}
                label="Accuracy"
                color={theme.accent1}
                active={step >= 2}
              />
              <MetricCard
                value={data.knnDiabetes.metrics.f1 * 100}
                label="F1 Score"
                color={theme.accent2}
                active={step >= 2}
              />
            </div>
          </BuildStep>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 8: KNN Hyperparameter Analysis ─────────────────

function KnnHyperparamSlide({ step }: SlideProps) {
  return (
    <div>
      <Title>KNN Hyperparameter Analysis</Title>
      <Subtitle>The bias-variance tradeoff in action</Subtitle>
      <BuildStep visible={step >= 0}>
        <div className="grid grid-cols-2 gap-5 mb-5">
          <Card>
            <h3 className="font-semibold mb-2" style={{ color: theme.accent1 }}>
              Iris: Best K = 1
            </h3>
            <p className="text-sm opacity-70 leading-relaxed">
              Clean, well-separated data allows a small K. Decision boundaries can be tight
              yet stable because classes don&apos;t overlap. Low bias wins.
            </p>
          </Card>
          <Card>
            <h3 className="font-semibold mb-2" style={{ color: theme.accent2 }}>
              Diabetes: Best K = 11
            </h3>
            <p className="text-sm opacity-70 leading-relaxed">
              Noisy, overlapping classes need more neighbors to smooth predictions.
              Single neighbors are unreliable. Reduced variance wins.
            </p>
          </Card>
        </div>
      </BuildStep>
      <BuildStep visible={step >= 1}>
        <Card>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-sm font-bold mb-1" style={{ color: theme.accent2 }}>Low K (e.g., K=1)</p>
              <p className="text-xs opacity-60">Low bias, high variance</p>
              <p className="text-xs opacity-40 mt-1">Follows every bump in the data</p>
            </div>
            <div>
              <p className="text-sm font-bold mb-1" style={{ color: theme.accent1 }}>
                Sweet Spot
              </p>
              <p className="text-xs opacity-60">Balanced tradeoff</p>
              <p className="text-xs opacity-40 mt-1">Best generalization</p>
            </div>
            <div>
              <p className="text-sm font-bold mb-1" style={{ color: theme.accent3 }}>High K (e.g., K=51)</p>
              <p className="text-xs opacity-60">High bias, low variance</p>
              <p className="text-xs opacity-40 mt-1">Over-smooths, misses patterns</p>
            </div>
          </div>
        </Card>
      </BuildStep>
    </div>
  );
}

// ─── Slide 9: SVM Iris ────────────────────────────────────

function SvmIrisSlide({ step }: SlideProps) {
  return (
    <div>
      <Title>SVM: Iris Results</Title>
      <Subtitle>
        Best kernel: {data.svmIris.bestKernel} | Maximum-margin classification
      </Subtitle>
      <div className="grid grid-cols-2 gap-5">
        <BuildStep visible={step >= 0}>
          <SvmKernelChart
            kernels={data.svmIris.kernels}
            bestKernel={data.svmIris.bestKernel}
            title="Accuracy by Kernel Type"
            domainMin={0.9}
          />
        </BuildStep>
        <BuildStep visible={step >= 1}>
          <div>
            <ConfusionMatrix
              matrix={data.svmIris.confusionMatrix}
              labels={data.svmIris.classes}
              title="Confusion Matrix (RBF)"
            />
            <div className="grid grid-cols-2 gap-2 mt-3">
              <MetricCard
                value={100}
                label="Accuracy"
                color={theme.accent1}
                active={step >= 1}
              />
              <MetricCard
                value={100}
                label="F1 Score"
                color={theme.accent2}
                active={step >= 1}
              />
            </div>
          </div>
        </BuildStep>
      </div>
    </div>
  );
}

// ─── Slide 10: SVM Diabetes ───────────────────────────────

function SvmDiabetesSlide({ step }: SlideProps) {
  return (
    <div>
      <Title>SVM: Diabetes Results</Title>
      <Subtitle>
        Best kernel: {data.svmDiabetes.bestKernel} | Linear separation competitive with defaults
      </Subtitle>
      <div className="grid grid-cols-2 gap-5">
        <BuildStep visible={step >= 0}>
          <SvmKernelChart
            kernels={data.svmDiabetes.kernels}
            bestKernel={data.svmDiabetes.bestKernel}
            title="Accuracy by Kernel Type"
            domainMin={0.7}
          />
        </BuildStep>
        <BuildStep visible={step >= 1}>
          <div>
            <ConfusionMatrix
              matrix={data.svmDiabetes.confusionMatrix}
              labels={data.svmDiabetes.classes}
              title="Confusion Matrix (Linear)"
            />
            <div className="grid grid-cols-2 gap-2 mt-3">
              <MetricCard
                value={data.svmDiabetes.metrics.accuracy * 100}
                label="Accuracy"
                color={theme.accent1}
                active={step >= 1}
              />
              <MetricCard
                value={data.svmDiabetes.metrics.f1 * 100}
                label="F1 Score"
                color={theme.accent2}
                active={step >= 1}
              />
            </div>
          </div>
        </BuildStep>
      </div>
    </div>
  );
}

// ─── Slide 11: Comparative Analysis ───────────────────────

function ComparisonSlide({ step }: SlideProps) {
  return (
    <div>
      <Title>Comparative Analysis</Title>
      <Subtitle>KNN vs SVM — same data, same split, different mechanisms</Subtitle>
      <BuildStep visible={step >= 0}>
        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: `${theme.header}80` }}>
                <th className="text-left p-3 text-xs uppercase tracking-wider opacity-60">Metric</th>
                <th className="p-3 text-xs uppercase tracking-wider" style={{ color: theme.accent1 }}>KNN (Iris)</th>
                <th className="p-3 text-xs uppercase tracking-wider" style={{ color: theme.accent3 }}>SVM (Iris)</th>
                <th className="p-3 text-xs uppercase tracking-wider" style={{ color: theme.accent2 }}>KNN (Diab.)</th>
                <th className="p-3 text-xs uppercase tracking-wider opacity-60">SVM (Diab.)</th>
              </tr>
            </thead>
            <tbody>
              {data.comparisonTable.map((row) => (
                <tr key={row.metric} className="border-t border-white/5">
                  <td className="p-3 font-medium">{row.metric}</td>
                  <td className="p-3 text-center font-mono font-bold" style={{ color: theme.accent1 }}>{row.knnIris}</td>
                  <td className="p-3 text-center font-mono font-bold" style={{ color: theme.accent3 }}>{row.svmIris}</td>
                  <td className="p-3 text-center font-mono font-bold" style={{ color: theme.accent2 }}>{row.knnDiab}</td>
                  <td className="p-3 text-center font-mono">{row.svmDiab}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </BuildStep>
      <BuildStep visible={step >= 1}>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Card>
            <h3 className="text-sm font-bold mb-1" style={{ color: theme.accent1 }}>Iris Takeaway</h3>
            <p className="text-xs opacity-70">
              Both algorithms achieve perfect accuracy. The comparison is about mechanism
              (neighbor voting vs margin maximization), not who wins.
            </p>
          </Card>
          <Card>
            <h3 className="text-sm font-bold mb-1" style={{ color: theme.accent2 }}>Diabetes Takeaway</h3>
            <p className="text-xs opacity-70">
              KNN slightly edges SVM (76.6% vs 75.3%). Small margin suggests both capture
              similar signal. Recall for diabetic class matters most medically.
            </p>
          </Card>
        </div>
      </BuildStep>
    </div>
  );
}

// ─── Slide 12: Decision Tree ──────────────────────────────

function DecisionTreeSlide({ step }: SlideProps) {
  const features = [
    { name: "Petal Width", importance: 0.92 },
    { name: "Petal Length", importance: 0.06 },
    { name: "Sepal Length", importance: 0.02 },
    { name: "Sepal Width", importance: 0.0 },
  ];
  return (
    <div>
      <Title>Decision Tree: Iris</Title>
      <Subtitle>Interpretable classification with feature importance</Subtitle>
      <div className="grid grid-cols-2 gap-5">
        <BuildStep visible={step >= 0}>
          <Card>
            <h3 className="text-sm font-semibold mb-3 opacity-60">
              Gini vs Entropy (max_depth=4)
            </h3>
            <p className="text-sm opacity-70 mb-4">
              Both splitting criteria produce similar results on Iris.
              Decision trees split data by asking yes/no questions about feature values,
              choosing splits that maximize class purity.
            </p>
            <div className="space-y-2 mt-4">
              <h4 className="text-xs uppercase tracking-wider opacity-50">Feature Importance</h4>
              {features.map((f) => (
                <div key={f.name} className="flex items-center gap-3">
                  <span className="text-xs w-24 opacity-60">{f.name}</span>
                  <div className="flex-1 h-5 rounded overflow-hidden" style={{ background: `${theme.cardBg}` }}>
                    <div
                      className="h-full rounded"
                      style={{
                        width: `${f.importance * 100}%`,
                        background: f.importance > 0.5
                          ? theme.accent1
                          : f.importance > 0 ? theme.accent3 : "transparent",
                        boxShadow: f.importance > 0.5
                          ? `0 0 8px ${theme.accent1}40` : "none",
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono w-12 text-right">
                    {(f.importance * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </BuildStep>
        <BuildStep visible={step >= 1}>
          <Card>
            <h3 className="text-sm font-semibold mb-3 opacity-60">
              Strengths &amp; Trade-offs
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-2">
                <span style={{ color: theme.accent1 }}>+</span>
                <span className="opacity-70">Highly interpretable — you can read the decision rules</span>
              </div>
              <div className="flex gap-2">
                <span style={{ color: theme.accent1 }}>+</span>
                <span className="opacity-70">No feature scaling required</span>
              </div>
              <div className="flex gap-2">
                <span style={{ color: theme.accent1 }}>+</span>
                <span className="opacity-70">Reveals which features drive classification</span>
              </div>
              <div className="flex gap-2">
                <span style={{ color: theme.accent2 }}>-</span>
                <span className="opacity-70">Prone to overfitting without depth limits</span>
              </div>
              <div className="flex gap-2">
                <span style={{ color: theme.accent2 }}>-</span>
                <span className="opacity-70">Unstable — small data changes can alter the tree</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10">
              <p className="text-xs opacity-50">
                <strong>Key finding:</strong> Petal width alone accounts for 92% of classification
                power on Iris, confirming it is the strongest discriminator between species.
              </p>
            </div>
          </Card>
        </BuildStep>
      </div>
    </div>
  );
}

// ─── Slide 13: Key Findings ───────────────────────────────

function FindingsSlide({ step }: SlideProps) {
  return (
    <div>
      <Title>Key Findings</Title>
      <Subtitle>What we learned from comparing algorithms across datasets</Subtitle>
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            title: "Data difficulty matters more than algorithm choice",
            body: "Both KNN and SVM achieved 100% on Iris but ~75% on Diabetes. The dataset's inherent difficulty is the dominant factor.",
            color: theme.accent1,
          },
          {
            title: "KNN slightly outperforms SVM on Diabetes",
            body: "76.6% vs 75.3% accuracy. KNN's local neighborhood approach captured slightly more signal than SVM's global boundary.",
            color: theme.accent2,
          },
          {
            title: "Hyperparameters must match the data",
            body: "Iris favors K=1 (clean data). Diabetes favors K=11 (noisy data). SVM Iris favors RBF. SVM Diabetes favors Linear.",
            color: theme.accent3,
          },
        ].map((f, i) => (
          <BuildStep key={f.title} visible={step >= i}>
            <Card className="h-full">
              <div className="w-2 h-2 rounded-full mb-3" style={{ background: f.color }} />
              <h3 className="font-semibold text-sm mb-2" style={{ color: f.color }}>
                {f.title}
              </h3>
              <p className="text-sm opacity-70 leading-relaxed">{f.body}</p>
            </Card>
          </BuildStep>
        ))}
      </div>
    </div>
  );
}

// ─── Slide 14: Conclusion ─────────────────────────────────

function ConclusionSlide({ step }: SlideProps) {
  return (
    <div>
      <Title>Conclusion</Title>
      <Subtitle>Summary and future directions</Subtitle>
      <BuildStep visible={step >= 0}>
        <Card className="mb-4">
          <h3 className="font-semibold mb-2" style={{ color: theme.accent1 }}>Best Model</h3>
          <p className="text-sm opacity-70 leading-relaxed">
            <strong>KNN with K=11</strong> gave the best Diabetes classification (76.6% accuracy,
            66.0% F1). For Iris, all three algorithms performed near-perfectly. In medical contexts,{" "}
            <strong>recall for the positive class</strong> is especially important — missing a diabetic
            patient has real consequences.
          </p>
        </Card>
      </BuildStep>
      <BuildStep visible={step >= 1}>
        <Card>
          <h3 className="font-semibold mb-2" style={{ color: theme.accent2 }}>Future Improvements</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm opacity-70">
            <p>Cross-validation instead of single train/test split</p>
            <p>Hyperparameter tuning (GridSearchCV for C, gamma)</p>
            <p>Ensemble methods (Random Forest, Gradient Boosting)</p>
            <p>Address class imbalance (SMOTE, class weights)</p>
            <p>Feature engineering and selection</p>
            <p>Larger, more diverse datasets</p>
          </div>
        </Card>
      </BuildStep>
    </div>
  );
}

// ─── Slides Array ─────────────────────────────────────────

const slides = [
  { element: <TitleSlide step={0} />, steps: 1 },
  { element: <IntroSlide step={0} />, steps: 2 },
  { element: <DatasetsSlide step={0} />, steps: 2 },
  { element: <PreprocessingSlide step={0} />, steps: 3 },
  { element: <MethodologySlide step={0} />, steps: 3 },
  { element: <KnnIrisSlide step={0} />, steps: 2 },
  { element: <KnnDiabetesSlide step={0} />, steps: 3 },
  { element: <KnnHyperparamSlide step={0} />, steps: 2 },
  { element: <SvmIrisSlide step={0} />, steps: 2 },
  { element: <SvmDiabetesSlide step={0} />, steps: 2 },
  { element: <ComparisonSlide step={0} />, steps: 2 },
  { element: <DecisionTreeSlide step={0} />, steps: 2 },
  { element: <FindingsSlide step={0} />, steps: 3 },
  { element: <ConclusionSlide step={0} />, steps: 2 },
];

export default function Home() {
  return <Presentation slides={slides} />;
}
