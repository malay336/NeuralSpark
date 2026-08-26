import os
import subprocess
from PIL import Image, ImageDraw

def generate_separated_pdfs():
    print("Generating distinct, separated Question, Rubric, and Answer PDFs for NeuralSpark AI Grader...")
    
    out_dir = os.path.join(os.path.dirname(__file__), "..", "..", "sample_pdfs")
    os.makedirs(out_dir, exist_ok=True)

    # =========================================================================
    # SUITE 1: LINEAR ALGEBRA (EIGENVALUES)
    # =========================================================================
    
    # 1A. Question 1 PDF
    tex_q1 = r'''\documentclass[11pt,a4paper]{article}
\usepackage[utf8]{inputenc}
\usepackage{mathptmx}
\usepackage[margin=1in]{geometry}
\usepackage{xcolor}
\definecolor{navy}{RGB}{30, 64, 175}

\begin{document}
\begin{center}
    {\large\bfseries\textcolor{navy}{PARUL INSTITUTE OF ENGINEERING \& TECHNOLOGY}}\\[0.1cm]
    {\normalsize\textbf{Department of AI \& Data Sciences $\mid$ Subject: Linear Algebra (203105400)}}\\[0.2cm]
    {\bfseries Assignment 3 --- Question Paper}
\end{center}
\hrule
\vspace{0.6cm}

\noindent\textbf{Question 1 (5 Marks):}\\
Given the $2 \times 2$ real matrix:
\[
A = \begin{pmatrix} 4 & 1 \\ 2 & 3 \end{pmatrix}
\]
\begin{enumerate}[label=(\alph*)]
    \item Set up the characteristic matrix equation $\det(A - \lambda I) = 0$.
    \item Compute the determinant and expand to find the characteristic polynomial.
    \item Solve for all eigenvalues $\lambda_1, \lambda_2$ of matrix $A$. Show all factorization steps.
\end{enumerate}
\end{document}
'''
    with open(os.path.join(out_dir, "Question_1_Eigenvalues.tex"), "w", encoding="utf-8") as f:
        f.write(tex_q1)
    subprocess.run(f"pdflatex -interaction=nonstopmode -output-directory={out_dir} {os.path.join(out_dir, 'Question_1_Eigenvalues.tex')}", shell=True)

    # 1B. Rubric 1 PDF
    tex_r1 = r'''\documentclass[11pt,a4paper]{article}
\usepackage[utf8]{inputenc}
\usepackage{mathptmx}
\usepackage[margin=1in]{geometry}
\usepackage{xcolor}
\usepackage{booktabs}
\definecolor{navy}{RGB}{30, 64, 175}

\begin{document}
\begin{center}
    {\large\bfseries\textcolor{navy}{OFFICIAL GRADING RUBRIC}}\\[0.1cm]
    {\normalsize\textbf{Assignment 3: Matrix Spectral Decomposition $\mid$ Total: 5 Marks}}
\end{center}
\hrule
\vspace{0.6cm}

\begin{table}[h]
\centering
\begin{tabular}{p{3.5cm} p{8.5cm} c}
\toprule
\textbf{Evaluation Criteria} & \textbf{Requirement / Expected Derivation} & \textbf{Marks} \\
\midrule
\textbf{Characteristic Eq.} & States $\det(A - \lambda I) = 0$ with matrix $\begin{vmatrix} 4-\lambda & 1 \\ 2 & 3-\lambda \end{vmatrix} = 0$ & \textbf{2.0} \\[0.3cm]
\textbf{Polynomial Expansion} & Expands $(4-\lambda)(3-\lambda) - 2 = 0$ to get $\lambda^2 - 7\lambda + 10 = 0$ & \textbf{2.0} \\[0.3cm]
\textbf{Roots / Eigenvalues} & Factorizes $(\lambda - 5)(\lambda - 2) = 0 \implies \lambda_1 = 5, \lambda_2 = 2$ & \textbf{1.0} \\
\bottomrule
\end{tabular}
\end{table}
\end{document}
'''
    with open(os.path.join(out_dir, "Rubric_1_Eigenvalues.tex"), "w", encoding="utf-8") as f:
        f.write(tex_r1)
    subprocess.run(f"pdflatex -interaction=nonstopmode -output-directory={out_dir} {os.path.join(out_dir, 'Rubric_1_Eigenvalues.tex')}", shell=True)

    # 1C. Answer 1 Handwritten Scanned PDF
    img1 = Image.new("RGB", (1000, 1300), color=(252, 252, 254))
    draw1 = ImageDraw.Draw(img1)
    for y in range(120, 1250, 36):
        draw1.line([(60, y), (940, y)], fill=(230, 235, 245), width=1)
    draw1.line([(140, 60), (140, 1250)], fill=(245, 210, 210), width=2)
    
    ans_text1 = (
        "STUDENT HANDWRITTEN ANSWER SHEET\n"
        "Name: Malay Singh | Roll No: 2303031249003\n\n"
        "Solution for Question 1:\n\n"
        "Step 1: Characteristic Equation\n"
        "        det(A - lambda * I) = 0\n"
        "        | 4 - lambda        1       |\n"
        "        | 2             3 - lambda  | = 0\n\n"
        "Step 2: Determinant Expansion\n"
        "        (4 - lambda)(3 - lambda) - (1 * 2) = 0\n"
        "        12 - 4*lambda - 3*lambda + lambda^2 - 2 = 0\n"
        "        lambda^2 - 7*lambda + 10 = 0   [Characteristic Polynomial]\n\n"
        "Step 3: Quadratic Factorization\n"
        "        (lambda - 5)(lambda - 2) = 0\n\n"
        "Step 4: Final Eigenvalues\n"
        "        lambda_1 = 5,   lambda_2 = 2. [Q.E.D.]"
    )
    draw1.text((160, 140), ans_text1, fill=(15, 20, 80))
    img1.save(os.path.join(out_dir, "Answer_1_Eigenvalues_Handwritten.pdf"), format="PDF")

    # =========================================================================
    # SUITE 2: ALGORITHMS & COMPLEXITY (MASTER THEOREM)
    # =========================================================================
    
    # 2A. Question 2 PDF
    tex_q2 = r'''\documentclass[11pt,a4paper]{article}
\usepackage[utf8]{inputenc}
\usepackage{mathptmx}
\usepackage[margin=1in]{geometry}
\usepackage{xcolor}
\definecolor{navy}{RGB}{30, 64, 175}

\begin{document}
\begin{center}
    {\large\bfseries\textcolor{navy}{GATE CS/DA ASSESSMENT: ALGORITHMS \& COMPLEXITY}}\\[0.2cm]
    {\bfseries Problem Sheet 2: Divide-and-Conquer Recurrence Relations}
\end{center}
\hrule
\vspace{0.6cm}

\noindent\textbf{Question:}\\
State the general form of the Master Theorem for divide-and-conquer recurrences. Using the Master Theorem, derive the exact tight asymptotic bound $\Theta(\cdot)$ for:
\[
T(n) = 2T\left(\frac{n}{2}\right) + \Theta(n)
\]
\end{document}
'''
    with open(os.path.join(out_dir, "Question_2_Master_Theorem.tex"), "w", encoding="utf-8") as f:
        f.write(tex_q2)
    subprocess.run(f"pdflatex -interaction=nonstopmode -output-directory={out_dir} {os.path.join(out_dir, 'Question_2_Master_Theorem.tex')}", shell=True)

    # 2B. Rubric 2 PDF
    tex_r2 = r'''\documentclass[11pt,a4paper]{article}
\usepackage[utf8]{inputenc}
\usepackage{mathptmx}
\usepackage[margin=1in]{geometry}
\usepackage{xcolor}
\usepackage{booktabs}
\definecolor{navy}{RGB}{30, 64, 175}

\begin{document}
\begin{center}
    {\large\bfseries\textcolor{navy}{EVALUATION RUBRIC: MASTER THEOREM}}\\[0.1cm]
    {\normalsize\textbf{Total: 5 Marks}}
\end{center}
\hrule
\vspace{0.6cm}

\begin{table}[h]
\centering
\begin{tabular}{p{4cm} p{8cm} c}
\toprule
\textbf{Criterion} & \textbf{Evaluation Details} & \textbf{Marks} \\
\midrule
\textbf{Master Theorem Form} & States $T(n) = aT(n/b) + f(n)$ with $a \ge 1, b > 1$ & \textbf{2.0} \\[0.3cm]
\textbf{Critical Exponent} & Computes $\log_b a = \log_2 2 = 1 \implies n^{\log_b a} = n$ & \textbf{2.0} \\[0.3cm]
\textbf{Case 2 Conclusion} & Identifies $f(n) = \Theta(n) = \Theta(n^1) \implies T(n) = \Theta(n \log n)$ & \textbf{1.0} \\
\bottomrule
\end{tabular}
\end{table}
\end{document}
'''
    with open(os.path.join(out_dir, "Rubric_2_Master_Theorem.tex"), "w", encoding="utf-8") as f:
        f.write(tex_r2)
    subprocess.run(f"pdflatex -interaction=nonstopmode -output-directory={out_dir} {os.path.join(out_dir, 'Rubric_2_Master_Theorem.tex')}", shell=True)

    # 2C. Answer 2 PDF
    tex_a2 = r'''\documentclass[11pt,a4paper]{article}
\usepackage[utf8]{inputenc}
\usepackage{mathptmx}
\usepackage[margin=1in]{geometry}
\usepackage{amsmath,amssymb}

\begin{document}
\begin{center}
    {\large\bfseries Student Submission: Divide-and-Conquer Analysis}\\[0.1cm]
    \textbf{Student ID:} 2303031240687
\end{center}
\hrule
\vspace{0.5cm}

\noindent\textbf{Derivation Steps:}\\
1. The standard Master Theorem representation is $T(n) = aT(n/b) + f(n)$.\\
2. Comparing with $T(n) = 2T(n/2) + \Theta(n)$, we obtain parameters $a = 2, b = 2, f(n) = \Theta(n)$.\\
3. We compute the critical exponent:
\[
\log_b a = \log_2 2 = 1 \implies n^{\log_b a} = n^1 = n
\]
4. Since $f(n) = \Theta(n) = \Theta(n^{\log_b a})$, this recurrence strictly satisfies \textbf{Case 2} of the Master Theorem.\\
5. Therefore, the asymptotic tight bound is:
\[
T(n) = \Theta(n^{\log_b a} \log n) = \Theta(n \log n)
\]
\end{document}
'''
    with open(os.path.join(out_dir, "Answer_2_Master_Theorem_Proof.tex"), "w", encoding="utf-8") as f:
        f.write(tex_a2)
    subprocess.run(f"pdflatex -interaction=nonstopmode -output-directory={out_dir} {os.path.join(out_dir, 'Answer_2_Master_Theorem_Proof.tex')}", shell=True)

    # =========================================================================
    # SUITE 3: DATA STRUCTURES (BINARY SEARCH - FLAWED TEST)
    # =========================================================================
    
    # 3A. Question 3 PDF
    tex_q3 = r'''\documentclass[11pt,a4paper]{article}
\usepackage[utf8]{inputenc}
\usepackage{mathptmx}
\usepackage[margin=1in]{geometry}
\usepackage{xcolor}
\definecolor{navy}{RGB}{30, 64, 175}

\begin{document}
\begin{center}
    {\large\bfseries\textcolor{navy}{DATA STRUCTURES \& ALGORITHMS QUESTION PAPER}}\\[0.2cm]
    {\bfseries Topic: Binary Search Complexity}
\end{center}
\hrule
\vspace{0.6cm}
\noindent\textbf{Question:}\\
Explain the working principle and derive the exact time complexity recurrence relation of Binary Search. State all necessary preconditions.
\end{document}
'''
    with open(os.path.join(out_dir, "Question_3_Binary_Search.tex"), "w", encoding="utf-8") as f:
        f.write(tex_q3)
    subprocess.run(f"pdflatex -interaction=nonstopmode -output-directory={out_dir} {os.path.join(out_dir, 'Question_3_Binary_Search.tex')}", shell=True)

    # 3B. Rubric 3 PDF
    tex_r3 = r'''\documentclass[11pt,a4paper]{article}
\usepackage[utf8]{inputenc}
\usepackage{mathptmx}
\usepackage[margin=1in]{geometry}
\usepackage{xcolor}
\usepackage{booktabs}
\definecolor{navy}{RGB}{30, 64, 175}

\begin{document}
\begin{center}
    {\large\bfseries\textcolor{navy}{GRADING RUBRIC: BINARY SEARCH}}\\[0.1cm]
    {\normalsize\textbf{Total: 5 Marks}}
\end{center}
\hrule
\vspace{0.6cm}
\begin{table}[h]
\centering
\begin{tabular}{p{4cm} p{8cm} c}
\toprule
\textbf{Criterion} & \textbf{Requirement} & \textbf{Marks} \\
\midrule
\textbf{Complexity} & States $O(\log n)$ time complexity & \textbf{2.0} \\[0.3cm]
\textbf{Halving Search Space} & Explains search space reduces by $n/2$ at each comparison & \textbf{2.0} \\[0.3cm]
\textbf{Sorted Precondition} & States the input array must be sorted & \textbf{1.0} \\
\bottomrule
\end{tabular}
\end{table}
\end{document}
'''
    with open(os.path.join(out_dir, "Rubric_3_Binary_Search.tex"), "w", encoding="utf-8") as f:
        f.write(tex_r3)
    subprocess.run(f"pdflatex -interaction=nonstopmode -output-directory={out_dir} {os.path.join(out_dir, 'Rubric_3_Binary_Search.tex')}", shell=True)

    # 3C. Answer 3 Flawed PDF
    tex_a3 = r'''\documentclass[11pt,a4paper]{article}
\usepackage[utf8]{inputenc}
\usepackage{mathptmx}
\usepackage[margin=1in]{geometry}

\begin{document}
\begin{center}
    {\large\bfseries Student Submission: Binary Search}\\[0.1cm]
    \textbf{Student ID:} 2303031241262
\end{center}
\hrule
\vspace{0.5cm}
\noindent\textbf{Student Response:}\\
Binary search traverses every element in an array one by one until the target is matched.
Because it scans sequentially from start to end, the time complexity is $O(n)$.
It can run directly on unsorted lists without any sorting.
\end{document}
'''
    with open(os.path.join(out_dir, "Answer_3_Binary_Search_Flawed.tex"), "w", encoding="utf-8") as f:
        f.write(tex_a3)
    subprocess.run(f"pdflatex -interaction=nonstopmode -output-directory={out_dir} {os.path.join(out_dir, 'Answer_3_Binary_Search_Flawed.tex')}", shell=True)

    print("\nAll separated Question, Rubric, and Answer PDFs generated successfully in sample_pdfs/!")

if __name__ == "__main__":
    generate_separated_pdfs()
