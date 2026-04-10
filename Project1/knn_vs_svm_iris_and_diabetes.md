# KNN vs SVM: Iris and Diabetes — Presentation Notes

**Purpose:** Slide-ready material for comparing **k-NN** and **SVM** on the same datasets, using your four notebooks: `iris_knn`, `iris_svm`, `diabetes_knn`, `diabetes_svm`.

**Fair comparison:** Your notebooks use the **same** `train_test_split` (`test_size=0.2`, `random_state=42`), **StandardScaler** fit on training data, and (for Diabetes) the **same** CSV loading and zero-imputation steps. That way, metric differences reflect **algorithm behavior**, not a different random split.

---

## 1. How the two algorithms differ (high level)

| | **k-NN (KNeighborsClassifier)** | **SVM (SVC)** |
|---|----------------------------------|---------------|
| **Idea** | Classify a point by **majority vote** among the **k** nearest training examples (in scaled feature space). | Find a **decision boundary** that separates classes with a **large margin**; kernels allow **nonlinear** boundaries. |
| **Learning style** | **Lazy:** training mostly **stores** data; heavy work at **predict** time. | **Eager:** **fit** solves for support vectors and the boundary; **predict** is usually faster per point. |
| **Main hyperparameters** | **k** (number of neighbors), distance metric (often Euclidean after scaling). | **Kernel** (e.g. linear, RBF, polynomial), plus `C`, `gamma` in real projects (your notebooks use defaults except kernel). |
| **Strengths** | Simple, no strong global model assumption; can track **local** patterns. | Strong theory (max margin); compact model after training; good when a **smooth** boundary fits the problem. |
| **Weaknesses** | Slow at scale (distance to many points); sensitive to noise for **small k**; curse of dimensionality. | Training can be costly on huge n; need kernel / tuning on messy data; less interpretable with nonlinear kernels. |

*Slide idea:* One visual: k-NN = “who are my k neighbors?” vs SVM = “where is the best separating surface?”

---

## 2. Iris — side-by-side (same split)

Your Iris pipelines: scaled features, 80/20 split, `random_state=42`. k-NN sweeps **k**; SVM compares **linear / RBF / poly** kernels.

| | **k-NN** (`iris_knn.ipynb`) | **SVM** (`iris_svm.ipynb`) |
|---|-----------------------------|----------------------------|
| **What you tuned** | **k** (best **k = 1** on test accuracy among the grid) | **Kernel** (best **RBF** in saved output) |
| **Test accuracy** | **1.0000** | **1.0000** |
| **Takeaway** | On this easy, well-separated data, **both** hit perfect test accuracy; the comparison is about **mechanism**, not “which wins.” | Same: Iris does not separate lazy vs eager by accuracy alone. |

**Talking point:** Iris is a **sanity check**: both learners look great. Use it to explain **how** they differ (vote vs margin boundary), then move to Diabetes for **meaningful** score differences.

---

## 3. Diabetes (Pima) — side-by-side (same split & preprocessing)

Diabetes: **768** rows, **8** features, **binary** outcome; classes **imbalanced** (e.g. 500 vs 268 in notebook output); zeros imputed with medians for selected columns; same split and scaling as k-NN notebook.

| | **k-NN** (`diabetes_knn.ipynb`) | **SVM** (`diabetes_svm.ipynb`) |
|---|----------------------------------|--------------------------------|
| **What you tuned** | **k** (best **k = 11** in saved output) | **Kernel** (best **linear** in saved output: linear **0.7532**, RBF **0.7468**, poly **0.7403**) |
| **Test accuracy** | **~0.7662** | **0.7532** |
| **Precision / recall / F1** (final model, saved outputs) | Precision **~0.6863**, Recall **~0.6364**, F1 **~0.6604** | Precision **0.6667**, Recall **0.6182**, F1 **0.6415** |
| **Interpretation** | On **this** split, k-NN edges SVM slightly on these metrics; differences are **small**—report both and discuss **medical** priorities (e.g. recall for “diabetic”). | Linear kernel winning suggests a **nearly linear** separation in scaled space is competitive; RBF/poly do not beat it here with default hyperparameters. |

**Talking point:** Overlap and noise mean **no** algorithm gets near-perfect accuracy; the comparison is **instructive**. Ask: *Which class matters more to catch?* (Often **recall** for the positive/disease class.)

---

## 4. When to prefer k-NN vs SVM (practical guide)

Use these as **rules of thumb**, not laws—they overlap, and tuning matters.

### Consider **k-NN** when:

- You want a **simple baseline** and interpretable “nearest neighbors” behavior.
- The decision surface is **highly local** and the data are **not** enormous (prediction cost grows with training set size).
- You can **scale** features and choose **k** (or use cross-validation).
- Prototyping: **minimal** training code; add data by appending rows.

### Consider **SVM** when:

- You want a **compact model** after training and **faster prediction** on large training sets (once fitted—subject to number of support vectors).
- You care about **margin-based** separation and are willing to try **kernels** for nonlinearity.
- You have **moderate** dataset size; for **very** large n, linear models or other scalers are often used (linear SVM, SGD, etc.).

### Diabetes-specific angle:

- **Imbalance + cost asymmetry:** Accuracy alone is weak; compare **recall/precision** per class and discuss **false negatives** (missed diabetes) vs **false positives**.
- **Same metrics, different story:** If k-NN and SVM are close, emphasize **deployment**: storage/latency for k-NN vs training cost and interpretability for SVM.

---

## 5. Mapping to your `diabetes_svm` “Step 5” comparison

Your notebook already lists the right **conceptual** contrasts:

- **KNN:** predictions from **closest K** points; performance depends on **K**.
- **SVM:** predictions from a learned **boundary**; performance depends on **kernel** (and separability).

Add for the presentation:

- **Iris:** both algorithms **excel**; highlight **lazy vs eager**.
- **Diabetes:** both **struggle** somewhat; compare **numbers** and **recall for diabetic class** for a health narrative.

---

## 6. Suggested PowerPoint flow

1. **Title:** k-NN vs SVM on Iris and Pima Diabetes  
2. **Setup:** same data, same split, scaling — **fair comparison**  
3. **One slide:** algorithm table (vote vs margin, lazy vs eager, k vs kernel)  
4. **Iris results:** both **100%** test accuracy (cite best k and best kernel from notebooks)  
5. **Diabetes results:** table with accuracy / precision / recall / F1 for **both** (fill from your runs if you change code)  
6. **When to use which:** bullets from section 4  
7. **Limitations:** single holdout split; no CV; default SVM `C`/`gamma`; Pima cohort not representative of all patients  
8. **Closing:** Iris shows **method** differences; Diabetes shows **performance** differences under **real-world** difficulty  

---

## 7. One-sentence summaries

- **Iris:** k-NN and SVM both reach **perfect** test accuracy here; use it to teach **how** they differ, not **who wins**.  
- **Diabetes:** Scores are **close**; k-NN is slightly **higher** on this run—emphasize **metrics beyond accuracy** and **when** each algorithm fits production constraints.  
- **Big picture:** Same preprocessing and split → differences reflect **inductive bias** of **neighbor voting** vs **margin maximization** in feature (and kernel) space.
