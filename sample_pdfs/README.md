# NeuralSpark: Separated Question, Rubric, and Answer Test PDFs

This folder provides distinct, separated PDF files for **Questions**, **Grading Rubrics**, and **Student Submissions**, allowing you to test the AI Grader by uploading files into each respective upload field on the portal (`http://localhost:3000/upload` or `http://localhost:3000/products/ai-grader`).

---

## Suite 1: Linear Algebra (Scanned Handwritten PDF)

| Role | PDF File | Description |
| :--- | :--- | :--- |
| **Question PDF** | [`Question_1_Eigenvalues.pdf`](./Question_1_Eigenvalues.pdf) | Assignment sheet asking for matrix eigenvalues & characteristic equation. |
| **Rubric PDF** | [`Rubric_1_Eigenvalues.pdf`](./Rubric_1_Eigenvalues.pdf) | Official 5-mark rubric (2 marks setup, 2 marks polynomial, 1 mark roots). |
| **Answer PDF** | [`Answer_1_Eigenvalues_Handwritten.pdf`](./Answer_1_Eigenvalues_Handwritten.pdf) | Student's scanned handwritten derivation on ruled paper. |

- **Expected Evaluation:** `Score: 5/5` with step-by-step mathematical verification.

---

## Suite 2: Algorithms & Complexity (Master Theorem Proof)

| Role | PDF File | Description |
| :--- | :--- | :--- |
| **Question PDF** | [`Question_2_Master_Theorem.pdf`](./Question_2_Master_Theorem.pdf) | Question asking for Master Theorem proof on $T(n) = 2T(n/2) + \Theta(n)$. |
| **Rubric PDF** | [`Rubric_2_Master_Theorem.pdf`](./Rubric_2_Master_Theorem.pdf) | 5-mark rubric for standard form, $\log_b a$, and Case 2 conclusion. |
| **Answer PDF** | [`Answer_2_Master_Theorem_Proof.pdf`](./Answer_2_Master_Theorem_Proof.pdf) | Student's rigorous LaTeX mathematical proof. |

- **Expected Evaluation:** `Score: 5/5` for complete divide-and-conquer proof.

---

## Suite 3: Data Structures (Flawed Binary Search - Point Deductions)

| Role | PDF File | Description |
| :--- | :--- | :--- |
| **Question PDF** | [`Question_3_Binary_Search.pdf`](./Question_3_Binary_Search.pdf) | Question on binary search working principle & time complexity. |
| **Rubric PDF** | [`Rubric_3_Binary_Search.pdf`](./Rubric_3_Binary_Search.pdf) | 5-mark rubric checking $O(\log n)$, halving search space, sorted array. |
| **Answer PDF** | [`Answer_3_Binary_Search_Flawed.pdf`](./Answer_3_Binary_Search_Flawed.pdf) | Flawed student response claiming linear search complexity $O(n)$. |

- **Expected Evaluation:** `Score: 0/5` with clear diagnostic feedback detailing missing criteria.

---

## How to Test in the Web UI:

1. Go to **`http://localhost:3000/upload`** or **`http://localhost:3000/products/ai-grader`**.
2. Upload the **Question PDF** in the *Question File* field.
3. Upload the **Rubric PDF** in the *Rubric File* field.
4. Upload the **Answer PDF** in the *Student Answer File* field.
5. Click **"Evaluate Submission with AI"**.
