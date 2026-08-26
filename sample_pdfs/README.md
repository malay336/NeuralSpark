# NeuralSpark: Sample Test PDFs for AI Grader Portal

This folder contains ready-to-test sample PDFs covering different subjects, file types, and evaluation scenarios (scanned handwriting, rigorous proofs, point deduction checks, and machine learning math).

---

## How to Test in the NeuralSpark AI Grader Web Portal

1. Start the platform using `run_offline.bat` or navigate to **`http://localhost:3000/upload`** (or **`http://localhost:3000/products/ai-grader`**).
2. Copy-paste the **Question** and **Rubric** below into the web form.
3. Upload the corresponding sample PDF file from this folder.
4. Click **"Evaluate Submission with AI"**.

---

## 1. Sample 1: Scanned Handwritten PDF
- **File:** [`Sample_Handwritten_Eigenvalues_Answer.pdf`](./Sample_Handwritten_Eigenvalues_Answer.pdf)
- **Subject:** Linear Algebra (Matrix Spectral Decomposition)
- **Question:**
  ```text
  Find the eigenvalues of 2x2 matrix A = [[4, 1], [2, 3]].
  ```
- **Rubric:**
  ```text
  Max 5 Marks: 2 marks for characteristic equation det(A - lambda*I) = 0; 2 marks for polynomial lambda^2 - 7lambda + 10 = 0; 1 mark for correct eigenvalues lambda in {5, 2}.
  ```
- **Expected Score:** `5/5` (Handwritten equations visually extracted and verified).

---

## 2. Sample 2: Master Theorem Proof (Perfect Score)
- **File:** [`Sample_Master_Theorem_Derivation.pdf`](./Sample_Master_Theorem_Derivation.pdf)
- **Subject:** Algorithms & Complexity
- **Question:**
  ```text
  State Master Theorem formulation and derive the tight bound for T(n) = 2T(n/2) + Theta(n).
  ```
- **Rubric:**
  ```text
  Max 5 Marks: 2 marks for stating standard Master Theorem form; 2 marks for computing critical exponent log_b(a) = 1; 1 mark for Theta(n log n) by Case 2.
  ```
- **Expected Score:** `5/5` (Full marks awarded for rigorous mathematical proof).

---

## 3. Sample 3: Flawed / Incomplete Answer (Point Deductions Check)
- **File:** [`Sample_Flawed_BinarySearch_Answer.pdf`](./Sample_Flawed_BinarySearch_Answer.pdf)
- **Subject:** Data Structures & Search Algorithms
- **Question:**
  ```text
  Explain the working principle and derive the exact time complexity of Binary Search.
  ```
- **Rubric:**
  ```text
  Max 5 Marks: 2 marks for stating O(log n); 2 marks for explaining halving search space at each comparison; 1 mark for sorted input requirement.
  ```
- **Expected Score:** `0/5` (Correctly detects linear search misconception, explains missing criteria).

---

## 4. Sample 4: ML Binary Cross-Entropy Gradient Derivation
- **File:** [`Sample_ML_BinaryCrossEntropy_Answer.pdf`](./Sample_ML_BinaryCrossEntropy_Answer.pdf)
- **Subject:** Machine Learning & AI
- **Question:**
  ```text
  Prove that the derivative of Binary Cross-Entropy loss with respect to logit z is y_hat - y.
  ```
- **Rubric:**
  ```text
  Max 5 Marks: 2 marks for sigmoid derivative d(y_hat)/dz = y_hat(1-y_hat); 2 marks for dL/d(y_hat) = (y_hat-y)/(y_hat(1-y_hat)); 1 mark for chain rule simplification to y_hat - y.
  ```
- **Expected Score:** `5/5` (Chain rule and loss residual verified).
