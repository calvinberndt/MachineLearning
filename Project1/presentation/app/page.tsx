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
    <h2 className="font-bold mb-2 leading-tight" style={{ fontSize: 44 }}>
      {children}
    </h2>
  );
}

function Subtitle({ children }: { children: React.ReactNode }) {
  return <p className="text-lg opacity-60 mb-5">{children}</p>;
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

function Bullets({ items, className = "" }: { items: React.ReactNode[]; className?: string }) {
  return (
    <ul className={`space-y-2 ${className}`}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-base leading-relaxed">
          <span className="opacity-30 mt-0.5 shrink-0">&#8250;</span>
          <span className="opacity-80">{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ─── Slide 1: Title ───────────────────────────────────────

function TitleSlide({ step }: SlideProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-6">
      <BuildStep visible={step >= 0}>
        <p
          className="text-base uppercase tracking-[4px] font-semibold mb-5"
          style={{ color: theme.accent1 }}
        >
          COMP SCI 465 | Machine Learning
        </p>
        <h1 className="text-6xl font-extrabold leading-tight mb-4">
          Supervised Classification
          <br />
          Algorithm Comparison
        </h1>
        <p className="text-xl opacity-50 mb-8">
          KNN vs SVM on Iris &amp; Diabetes Datasets
        </p>
        <div
          className="w-24 h-1 rounded-full mx-auto mb-8"
          style={{ background: `linear-gradient(90deg, ${theme.accent1}, ${theme.accent2})` }}
        />
        <p className="text-lg opacity-40">Calvin Berndt | UW-Green Bay | Spring 2026</p>
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
          <h3 className="font-semibold text-lg mb-3" style={{ color: theme.accent1 }}>
            The Problem
          </h3>
          <Bullets items={[
            <><strong>Supervised classification</strong> — train on labeled data, predict on unseen examples</>,
            <><strong>Core question</strong> — can the model generalize beyond what it was trained on?</>,
            <><strong>Our approach</strong> — compare KNN and SVM across two datasets with very different characteristics</>,
          ]} />
        </Card>
      </BuildStep>
      <BuildStep visible={step >= 1}>
        <Card className="mb-4">
          <h3 className="font-semibold text-lg mb-3" style={{ color: theme.accent2 }}>
            Objective
          </h3>
          <Bullets items={[
            <><strong>Implement &amp; evaluate</strong> — K-Nearest Neighbors (KNN) and Support Vector Machine (SVM)</>,
            <><strong>Compare across datasets</strong> — clean data (Iris) vs noisy real-world data (Diabetes)</>,
            <><strong>Understand the &quot;why&quot;</strong> — when does each algorithm excel or struggle, and what drives the results?</>,
          ]} />
        </Card>
      </BuildStep>
      <BuildStep visible={step >= 2}>
        <Card>
          <h3 className="font-semibold text-lg mb-3" style={{ color: theme.accent3 }}>
            Two Learning Paradigms
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-base font-bold mb-2" style={{ color: theme.accent1 }}>KNN — Lazy Learner</p>
              <Bullets items={[
                <><strong>Stores data</strong> — no model built during training</>,
                <><strong>Works at predict time</strong> — computes distances to find K closest neighbors</>,
                <><strong>Majority vote</strong> — neighbors vote on the class label</>,
              ]} />
            </div>
            <div>
              <p className="text-base font-bold mb-2" style={{ color: theme.accent2 }}>SVM — Eager Learner</p>
              <Bullets items={[
                <><strong>Builds a boundary</strong> — finds the optimal separating hyperplane during training</>,
                <><strong>Maximizes margin</strong> — pushes boundary as far from both classes as possible</>,
                <><strong>Fast prediction</strong> — just check which side of the line a point falls on</>,
              ]} />
            </div>
          </div>
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
              <h3 className="font-bold text-xl mb-3" style={{ color }}>{d.name}</h3>
              <p className="text-sm opacity-50 mb-3">Source: {d.source}</p>
              <div className="space-y-2 text-base">
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
                  <span className="font-bold text-sm">{d.balance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Split</span>
                  <span className="font-mono">{d.split}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-sm opacity-50">Features: {d.featureNames.join(", ")}</p>
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
            icon: "01",
            bullets: [
              <><strong>Invalid zeros</strong> — Glucose, BP, SkinThickness, Insulin, BMI can&apos;t be zero in real life</>,
              <><strong>Replaced with medians</strong> — medians resist outlier influence better than means</>,
              <><strong>Diabetes only</strong> — Iris was already clean, no preprocessing needed</>,
            ],
          },
          {
            title: "Feature Scaling",
            icon: "02",
            bullets: [
              <><strong>StandardScaler</strong> — normalizes all features to mean=0, std=1</>,
              <><strong>Critical for KNN</strong> — without scaling, large-range features dominate distance calculations</>,
              <><strong>Critical for SVM</strong> — margin optimization is skewed by unscaled features</>,
            ],
          },
          {
            title: "Train/Test Split",
            icon: "03",
            bullets: [
              <><strong>80/20 split</strong> — 80% training, 20% testing</>,
              <><strong>random_state=42</strong> — identical split across all notebooks</>,
              <><strong>Fair comparison</strong> — any metric difference is the algorithm, not the data</>,
            ],
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
              <h3 className="font-semibold text-base mb-3" style={{ color: theme.accent1 }}>
                {item.title}
              </h3>
              <Bullets items={item.bullets} />
            </Card>
          </BuildStep>
        ))}
      </div>
    </div>
  );
}

// ─── Slide 5: Methodology ─────────────────────────────────

function MethodologySlide({ step }: SlideProps) {
  return (
    <div>
      <Title>Methodology</Title>
      <Subtitle>Two algorithms, two fundamentally different approaches</Subtitle>
      <div className="grid grid-cols-2 gap-5">
        <BuildStep visible={step >= 0}>
          <Card className="h-full">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ background: theme.accent1 }} />
              <h3 className="font-bold text-lg" style={{ color: theme.accent1 }}>K-Nearest Neighbors</h3>
            </div>
            <span
              className="inline-block text-xs px-2 py-0.5 rounded-full mb-3"
              style={{ background: `${theme.accent1}20`, color: theme.accent1 }}
            >
              Lazy Learner
            </span>
            <Bullets items={[
              <><strong>How it works</strong> — finds K closest training points, takes majority vote</>,
              <><strong>Key parameter</strong> — K (number of neighbors)</>,
              <><strong>Strength</strong> — simple, no assumptions about boundary shape, adapts to local patterns</>,
              <><strong>Weakness</strong> — slow at prediction (scans all training data), sensitive to noise at low K</>,
            ]} />
          </Card>
        </BuildStep>
        <BuildStep visible={step >= 1}>
          <Card className="h-full">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ background: theme.accent2 }} />
              <h3 className="font-bold text-lg" style={{ color: theme.accent2 }}>Support Vector Machine</h3>
            </div>
            <span
              className="inline-block text-xs px-2 py-0.5 rounded-full mb-3"
              style={{ background: `${theme.accent2}20`, color: theme.accent2 }}
            >
              Eager Learner
            </span>
            <Bullets items={[
              <><strong>How it works</strong> — finds the hyperplane that maximizes margin between classes</>,
              <><strong>Key parameter</strong> — kernel type (Linear, RBF, Polynomial)</>,
              <><strong>Strength</strong> — compact model, fast prediction, kernels handle nonlinear data</>,
              <><strong>Weakness</strong> — training can be expensive, needs hyperparameter tuning on messy data</>,
            ]} />
          </Card>
        </BuildStep>
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
        Best K = {data.knnIris.bestK} | Perfect classification across K values 1 through 20
      </Subtitle>
      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-3">
          <BuildStep visible={step >= 0}>
            <KnnAccuracyChart
              accuracies={data.knnIris.accuracies}
              bestK={data.knnIris.bestK}
              title="Accuracy vs K Value (Iris)"
              domainMin={0.9}
            />
          </BuildStep>
        </div>
        <div className="col-span-2">
          <BuildStep visible={step >= 1}>
            <Card>
              <h3 className="font-semibold text-base mb-3" style={{ color: theme.accent1 }}>
                Why perfect accuracy?
              </h3>
              <Bullets items={[
                <><strong>Clean, well-separated data</strong> — species form tight clusters with almost no overlap</>,
                <><strong>K=1 works here</strong> — nearest neighbor is almost always the correct class</>,
                <><strong>Drops at K=31, 51</strong> — too many neighbors pulls in other species (underfitting)</>,
              ]} />
            </Card>
          </BuildStep>
          <BuildStep visible={step >= 1}>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <MetricCard value={100} label="Accuracy" color={theme.accent1} active={step >= 1} />
              <MetricCard value={100} label="F1 Score" color={theme.accent2} active={step >= 1} />
            </div>
          </BuildStep>
        </div>
      </div>
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
            <Card>
              <h3 className="font-semibold text-base mb-3" style={{ color: theme.accent2 }}>
                Why only ~77% accuracy?
              </h3>
              <Bullets items={[
                <><strong>Overlapping classes</strong> — diabetic and non-diabetic patients share similar feature values</>,
                <><strong>8 noisy features</strong> — single-neighbor predictions become unreliable</>,
                <><strong>Imbalanced (65/35%)</strong> — predicting &quot;not diabetic&quot; every time gets 65% for free</>,
                <><strong>77% is modest</strong> — only 12 points above the naive baseline</>,
              ]} />
            </Card>
          </BuildStep>
          <BuildStep visible={step >= 2}>
            <ConfusionMatrix
              matrix={data.knnDiabetes.confusionMatrix}
              labels={data.knnDiabetes.classes}
              title="Confusion Matrix (K=11)"
            />
          </BuildStep>
          <BuildStep visible={step >= 2}>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <MetricCard
                value={data.knnDiabetes.metrics.recall * 100}
                label="Recall"
                color={theme.accent2}
                active={step >= 2}
              />
              <MetricCard
                value={data.knnDiabetes.metrics.f1 * 100}
                label="F1 Score"
                color={theme.accent3}
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
      <Subtitle>Same algorithm, different data → different optimal K</Subtitle>
      <BuildStep visible={step >= 0}>
        <div className="grid grid-cols-2 gap-5 mb-5">
          <Card>
            <h3 className="font-semibold text-lg mb-3" style={{ color: theme.accent1 }}>
              Iris: Best K = 1
            </h3>
            <Bullets items={[
              <><strong>Clean data</strong> — classes form tight, well-separated clusters</>,
              <><strong>Tight boundaries work</strong> — no noise to mislead the nearest neighbor</>,
              <><strong>Low bias wins</strong> — memorization works when the data is tidy</>,
            ]} />
          </Card>
          <Card>
            <h3 className="font-semibold text-lg mb-3" style={{ color: theme.accent2 }}>
              Diabetes: Best K = 11
            </h3>
            <Bullets items={[
              <><strong>Noisy, overlapping data</strong> — one neighbor could be an outlier</>,
              <><strong>&quot;Vote among 11&quot;</strong> — smooths out noise, more robust predictions</>,
              <><strong>Reduced variance wins</strong> — stability matters more than precision here</>,
            ]} />
          </Card>
        </div>
      </BuildStep>
      <BuildStep visible={step >= 1}>
        <Card>
          <h3 className="font-semibold text-base mb-4 text-center opacity-60">
            The Bias-Variance Tradeoff
          </h3>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-base font-bold mb-2" style={{ color: theme.accent2 }}>Low K (K=1)</p>
              <Bullets items={[
                <><strong>Low bias</strong> — follows the data closely</>,
                <><strong>High variance</strong> — sensitive to noise</>,
                <><strong>Risk</strong> — overfits on messy data</>,
              ]} />
            </div>
            <div>
              <div className="w-8 h-1 rounded-full mx-auto mb-2" style={{ background: theme.accent1 }} />
              <p className="text-base font-bold mb-2" style={{ color: theme.accent1 }}>Sweet Spot</p>
              <Bullets items={[
                <><strong>Balanced tradeoff</strong> — not too simple, not too complex</>,
                <><strong>Best generalization</strong> — peak test accuracy</>,
              ]} />
            </div>
            <div>
              <p className="text-base font-bold mb-2" style={{ color: theme.accent3 }}>High K (K=51)</p>
              <Bullets items={[
                <><strong>High bias</strong> — oversimplifies patterns</>,
                <><strong>Low variance</strong> — very stable but blunt</>,
                <><strong>Risk</strong> — underfits, misses real signal</>,
              ]} />
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
        <div>
          <BuildStep visible={step >= 0}>
            <SvmKernelChart
              kernels={data.svmIris.kernels}
              bestKernel={data.svmIris.bestKernel}
              title="Accuracy by Kernel Type"
              domainMin={0.9}
            />
          </BuildStep>
          <BuildStep visible={step >= 1}>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <MetricCard value={100} label="Accuracy" color={theme.accent1} active={step >= 1} />
              <MetricCard value={100} label="F1 Score" color={theme.accent2} active={step >= 1} />
            </div>
          </BuildStep>
        </div>
        <BuildStep visible={step >= 1}>
          <Card className="h-full">
            <h3 className="font-semibold text-base mb-3" style={{ color: theme.accent1 }}>
              Why does RBF win?
            </h3>
            <Bullets items={[
              <><strong>Curved boundaries</strong> — RBF maps data to higher dimensions where classes become linearly separable</>,
              <><strong>Captures edge cases</strong> — Linear/Poly get 96.67%, RBF catches the 1-2 borderline flowers they miss</>,
              <><strong>Iris is mostly linear</strong> — all kernels do well, RBF just edges ahead</>,
            ]} />
            <h3 className="font-semibold text-base mb-3 mt-5" style={{ color: theme.accent3 }}>
              What are support vectors?
            </h3>
            <Bullets items={[
              <><strong>Closest points to the boundary</strong> — they define where the decision line goes</>,
              <><strong>All other points are irrelevant</strong> — removing them doesn&apos;t change the model</>,
              <><strong>Compact representation</strong> — SVM only needs these critical points to classify</>,
            ]} />
          </Card>
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
        <div>
          <BuildStep visible={step >= 0}>
            <SvmKernelChart
              kernels={data.svmDiabetes.kernels}
              bestKernel={data.svmDiabetes.bestKernel}
              title="Accuracy by Kernel Type"
              domainMin={0.7}
            />
          </BuildStep>
          <BuildStep visible={step >= 1}>
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
          </BuildStep>
        </div>
        <BuildStep visible={step >= 1}>
          <Card className="h-full">
            <h3 className="font-semibold text-base mb-3" style={{ color: theme.accent2 }}>
              Why does Linear win?
            </h3>
            <Bullets items={[
              <><strong>Roughly linear separation</strong> — after scaling, the boundary between classes is nearly straight</>,
              <><strong>More complexity hurts</strong> — RBF/Poly overfit to noise in the overlap region</>,
              <><strong>Default hyperparameters</strong> — no tuning of C or gamma, Linear is most robust out-of-box</>,
            ]} />
            <h3 className="font-semibold text-base mb-3 mt-5" style={{ color: theme.accent3 }}>
              Medical context
            </h3>
            <Bullets items={[
              <><strong>Recall = 61.8%</strong> — we miss ~38% of diabetic patients</>,
              <><strong>False negatives are dangerous</strong> — missed diagnosis means delayed treatment</>,
              <><strong>Room for improvement</strong> — class weights or SMOTE could boost diabetic recall</>,
            ]} />
          </Card>
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
          <table className="w-full text-base">
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
            <h3 className="font-bold text-base mb-3" style={{ color: theme.accent1 }}>
              Iris: Sanity check
            </h3>
            <Bullets items={[
              <><strong>Both hit 100%</strong> — Iris doesn&apos;t separate the algorithms</>,
              <><strong>Shows mechanism</strong> — neighbor voting vs margin boundary</>,
              <><strong>Proves setup works</strong> — validates our pipeline before the hard test</>,
            ]} />
          </Card>
          <Card>
            <h3 className="font-bold text-base mb-3" style={{ color: theme.accent2 }}>
              Diabetes: The real test
            </h3>
            <Bullets items={[
              <><strong>KNN edges SVM</strong> — 76.6% vs 75.3%, small but consistent margin</>,
              <><strong>Same ceiling</strong> — class overlap limits both algorithms to ~75%</>,
              <><strong>Different inductive bias</strong> — local neighborhoods (KNN) vs global boundary (SVM)</>,
            ]} />
          </Card>
        </div>
      </BuildStep>
    </div>
  );
}

// ─── Slide 12: Key Findings ───────────────────────────────

function FindingsSlide({ step }: SlideProps) {
  return (
    <div>
      <Title>Key Findings</Title>
      <Subtitle>What we learned from comparing algorithms across datasets</Subtitle>
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            title: "Data difficulty > algorithm choice",
            color: theme.accent1,
            bullets: [
              <><strong>100% on Iris</strong> — both algorithms ace clean, separated data</>,
              <><strong>~75% on Diabetes</strong> — class overlap sets the ceiling</>,
              <><strong>Dataset matters most</strong> — switching algorithms barely moves the needle</>,
            ],
          },
          {
            title: "Accuracy alone is misleading",
            color: theme.accent2,
            bullets: [
              <><strong>65% baseline</strong> — just predicting majority class gets you this far</>,
              <><strong>Recall tells the truth</strong> — are we actually catching diabetic patients?</>,
              <><strong>In healthcare</strong> — missed diagnoses (false negatives) are worse than false alarms</>,
            ],
          },
          {
            title: "Hyperparameters must match data",
            color: theme.accent3,
            bullets: [
              <><strong>KNN</strong> — K=1 for clean data, K=11 for noisy data</>,
              <><strong>SVM</strong> — RBF for nonlinear separation, Linear when boundary is simple</>,
              <><strong>No universal best</strong> — optimal config depends on dataset characteristics</>,
            ],
          },
        ].map((f, i) => (
          <BuildStep key={f.title} visible={step >= i}>
            <Card className="h-full">
              <div className="w-3 h-3 rounded-full mb-3" style={{ background: f.color }} />
              <h3 className="font-semibold text-base mb-3" style={{ color: f.color }}>
                {f.title}
              </h3>
              <Bullets items={f.bullets} />
            </Card>
          </BuildStep>
        ))}
      </div>
    </div>
  );
}

// ─── Slide 13: Conclusion ─────────────────────────────────

function ConclusionSlide({ step }: SlideProps) {
  return (
    <div>
      <Title>Conclusion</Title>
      <Subtitle>Summary and future directions</Subtitle>
      <BuildStep visible={step >= 0}>
        <Card className="mb-4">
          <h3 className="font-semibold text-lg mb-3" style={{ color: theme.accent1 }}>Best Model</h3>
          <Bullets items={[
            <><strong>KNN with K=11</strong> — best Diabetes result (76.6% accuracy, 66.0% F1)</>,
            <><strong>Both algorithms perfect on Iris</strong> — not a meaningful differentiator</>,
            <><strong>Recall is the critical metric</strong> — missing a diabetic patient has real consequences</>,
            <><strong>Neither model excels at recall (~63%)</strong> — significant room for improvement</>,
          ]} />
        </Card>
      </BuildStep>
      <BuildStep visible={step >= 1}>
        <Card>
          <h3 className="font-semibold text-lg mb-3" style={{ color: theme.accent2 }}>Future Improvements</h3>
          <Bullets items={[
            <><strong>Cross-validation</strong> — single train/test split can be lucky or unlucky, K-fold gives stable estimates</>,
            <><strong>Hyperparameter tuning</strong> — GridSearchCV for SVM&apos;s C and gamma, currently using defaults</>,
            <><strong>Address class imbalance</strong> — SMOTE oversampling or class weights to boost diabetic recall</>,
            <><strong>Ensemble methods</strong> — Random Forest, Gradient Boosting for stronger baselines</>,
          ]} />
        </Card>
      </BuildStep>
    </div>
  );
}

// ─── Slides Array (13 slides) ─────────────────────────────

const slides = [
  { element: <TitleSlide step={0} />, steps: 1 },
  { element: <IntroSlide step={0} />, steps: 3 },
  { element: <DatasetsSlide step={0} />, steps: 2 },
  { element: <PreprocessingSlide step={0} />, steps: 3 },
  { element: <MethodologySlide step={0} />, steps: 2 },
  { element: <KnnIrisSlide step={0} />, steps: 2 },
  { element: <KnnDiabetesSlide step={0} />, steps: 3 },
  { element: <KnnHyperparamSlide step={0} />, steps: 2 },
  { element: <SvmIrisSlide step={0} />, steps: 2 },
  { element: <SvmDiabetesSlide step={0} />, steps: 2 },
  { element: <ComparisonSlide step={0} />, steps: 2 },
  { element: <FindingsSlide step={0} />, steps: 3 },
  { element: <ConclusionSlide step={0} />, steps: 2 },
];

export default function Home() {
  return <Presentation slides={slides} />;
}
