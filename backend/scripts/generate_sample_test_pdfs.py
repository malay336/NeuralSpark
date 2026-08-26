import os
import io
import subprocess
from PIL import Image, ImageDraw, ImageFont

def generate_sample_pdfs():
    print("Generating comprehensive sample test PDFs for NeuralSpark AI Grader...")
    
    # -------------------------------------------------------------------------
    # 1. Sample 1: Handwritten Scanned PDF (Eigenvalues Derivation)
    # -------------------------------------------------------------------------
    print("Generating Sample 1: Handwritten Scanned PDF...")
    img = Image.new("RGB", (1000, 1300), color=(252, 252, 254))
    draw = ImageDraw.Draw(img)

    # Add light ruled paper grid/lines for realistic handwritten assignment look
    for y in range(120, 1250, 36):
        draw.line([(60, y), (940, y)], fill=(230, 235, 245), width=1)
    draw.line([(140, 60), (140, 1250)], fill=(245, 210, 210), width=2) # Red margin

    # Handwritten assignment text
    header = "PARUL INSTITUTE OF ENGINEERING & TECHNOLOGY\nDepartment of AI & Data Sciences | Subject: Linear Algebra\nStudent: Malay Singh (Roll No: 2303031249003)"
    
    content = (
        "Assignment 3: Matrix Spectral Decomposition\n"
        "Question 1: Find all eigenvalues of the 2x2 matrix A = [[4, 1], [2, 3]].\n\n"
        "Solution Steps (Handwritten Derivation):\n\n"
        "1. Write the characteristic equation:\n"
        "       det(A - lambda * I) = 0\n"
        "       | 4 - lambda        1       |\n"
        "       | 2             3 - lambda  | = 0\n\n"
        "2. Compute the 2x2 determinant:\n"
        "       (4 - lambda)(3 - lambda) - (1 * 2) = 0\n"
        "       12 - 4*lambda - 3*lambda + lambda^2 - 2 = 0\n"
        "       lambda^2 - 7*lambda + 10 = 0   <-- Characteristic Polynomial\n\n"
        "3. Factorize the quadratic polynomial:\n"
        "       (lambda - 5)(lambda - 2) = 0\n\n"
        "4. Solve for roots (Eigenvalues):\n"
        "       lambda_1 = 5\n"
        "       lambda_2 = 2\n\n"
        "Conclusion: The matrix has two distinct real eigenvalues: lambda in {5, 2}."
    )

    draw.text((60, 40), header, fill=(70, 70, 90))
    draw.text((160, 140), content, fill=(15, 20, 80))

    img.save("Sample_Handwritten_Eigenvalues_Answer.pdf", format="PDF")
    print("Created Sample_Handwritten_Eigenvalues_Answer.pdf")

    # -------------------------------------------------------------------------
    # 2. Sample 2: Master Theorem Rigorous Proof (LaTeX PDF)
    # -------------------------------------------------------------------------
    print("Generating Sample 2: Master Theorem LaTeX Proof PDF...")
    tex_sample2 = r'''\documentclass[11pt,a4paper]{article}
\usepackage[utf8]{inputenc}
\usepackage{mathptmx}
\usepackage[margin=1in]{geometry}
\usepackage{xcolor}
\usepackage{amsmath,amssymb}

\definecolor{navy}{RGB}{30, 64, 175}

\begin{document}
\begin{center}
    {\large\bfseries\textcolor{navy}{GATE CS/DA Assignment Submission: Algorithms \& Complexity}}\\[0.2cm]
    \textbf{Student ID:} 2303031240687 \quad $\mid$ \quad \textbf{Subject Code:} 203105400
\end{center}
\hrule
\vspace{0.4cm}

\noindent\textbf{Problem Statement:}\\
State the Master Theorem formulation and derive the asymptotic tight bound for the divide-and-conquer recurrence relation:
\[
T(n) = 2T\left(\frac{n}{2}\right) + \Theta(n), \quad \text{with } T(1) = \Theta(1)
\]

\vspace{0.3cm}
\noindent\textbf{Student Solution Derivation:}\\
\textbf{Step 1: Standard Master Theorem Form}\\
The standard divide-and-conquer recurrence is represented as:
\[
T(n) = aT\left(\frac{n}{b}\right) + f(n)
\]
where $a \ge 1$ represents the number of recursive subproblems, $b > 1$ represents the subproblem size reduction factor, and $f(n)$ is the non-recursive recombination work.

\vspace{0.2cm}
\noindent\textbf{Step 2: Parameter Extraction \& Critical Exponent Calculation}\\
From the given recurrence $T(n) = 2T(n/2) + \Theta(n)$:
\[
a = 2, \quad b = 2, \quad f(n) = \Theta(n)
\]
We evaluate the critical exponent value $\log_b a$:
\[
c_{\text{crit}} = \log_b a = \log_2 2 = 1 \implies n^{\log_b a} = n^1 = n
\]

\vspace{0.2cm}
\noindent\textbf{Step 3: Case Identification}\\
We compare $f(n)$ with $n^{\log_b a}$:
\[
f(n) = \Theta(n) = \Theta\left(n^{\log_b a}\right)
\]
Since $f(n) = \Theta(n^{\log_b a})$, this problem strictly satisfies \textbf{Case 2} of the Master Theorem with $k = 0$.

\vspace{0.2cm}
\noindent\textbf{Step 4: Asymptotic Tight Bound Conclusion}\\
According to Case 2 of the Master Theorem:
\[
T(n) = \Theta\left(n^{\log_b a} \log^{k+1} n\right) = \Theta(n \log n)
\]
\textbf{Final Answer:} The recurrence has a tight complexity of $\Theta(n \log n)$ (as observed in MergeSort).
\end{document}
'''
    with open("Sample_Master_Theorem_Derivation.tex", "w", encoding="utf-8") as f:
        f.write(tex_sample2)
    subprocess.run("pdflatex -interaction=nonstopmode Sample_Master_Theorem_Derivation.tex", shell=True)
    print("Created Sample_Master_Theorem_Derivation.pdf")

    # -------------------------------------------------------------------------
    # 3. Sample 3: Flawed / Incomplete Binary Search Answer PDF
    # -------------------------------------------------------------------------
    print("Generating Sample 3: Flawed Binary Search PDF...")
    tex_sample3 = r'''\documentclass[11pt,a4paper]{article}
\usepackage[utf8]{inputenc}
\usepackage{mathptmx}
\usepackage[margin=1in]{geometry}
\usepackage{xcolor}

\begin{document}
\begin{center}
    {\large\bfseries Data Structures \& Algorithms --- Weekly Assessment}\\[0.2cm]
    \textbf{Student ID:} 2303031241262
\end{center}
\hrule
\vspace{0.4cm}

\noindent\textbf{Question:}\\
Explain the working principle and derive the exact time complexity of Binary Search.

\vspace{0.3cm}
\noindent\textbf{Student Answer:}\\
Binary search works by looking at every element in an array sequentially until it finds the key.
Because it checks each element from index 0 to $n-1$, the recurrence is $T(n) = T(n-1) + 1$, which solves to $O(n)$ in all cases.
It can be applied directly on any unsorted list without preprocessing.
\end{document}
'''
    with open("Sample_Flawed_BinarySearch_Answer.tex", "w", encoding="utf-8") as f:
        f.write(tex_sample3)
    subprocess.run("pdflatex -interaction=nonstopmode Sample_Flawed_BinarySearch_Answer.tex", shell=True)
    print("Created Sample_Flawed_BinarySearch_Answer.pdf")

    # -------------------------------------------------------------------------
    # 4. Sample 4: Machine Learning Binary Cross-Entropy Derivation PDF
    # -------------------------------------------------------------------------
    print("Generating Sample 4: ML Binary Cross-Entropy Derivation PDF...")
    tex_sample4 = r'''\documentclass[11pt,a4paper]{article}
\usepackage[utf8]{inputenc}
\usepackage{mathptmx}
\usepackage[margin=1in]{geometry}
\usepackage{xcolor}
\usepackage{amsmath,amssymb}

\definecolor{navy}{RGB}{30, 64, 175}

\begin{document}
\begin{center}
    {\large\bfseries\textcolor{navy}{Machine Learning \& Neural Networks Assignment}}\\[0.2cm]
    \textbf{Topic: Logistic Regression \& Backpropagation Gradients} \quad $\mid$ \quad \textbf{Student ID:} 2303031240866
\end{center}
\hrule
\vspace{0.4cm}

\noindent\textbf{Problem Statement:}\\
Given the Binary Cross-Entropy (BCE) loss $\mathcal{L}(y, \hat{y}) = -\left[y \ln \hat{y} + (1-y)\ln(1-\hat{y})\right]$ where $\hat{y} = \sigma(z) = \frac{1}{1 + e^{-z}}$, prove that the gradient with respect to logit $z$ simplifies to $\frac{\partial \mathcal{L}}{\partial z} = \hat{y} - y$.

\vspace{0.3cm}
\noindent\textbf{Student Solution Derivation:}\\
\textbf{Step 1: Derivative of the Sigmoid Activation Function}\\
The sigmoid function is $\sigma(z) = (1 + e^{-z})^{-1}$. Differentiating with respect to $z$:
\[
\frac{d\hat{y}}{dz} = \frac{d\sigma(z)}{dz} = -(1 + e^{-z})^{-2} (-e^{-z}) = \frac{1}{1 + e^{-z}} \cdot \frac{e^{-z}}{1 + e^{-z}} = \hat{y}(1 - \hat{y})
\]

\vspace{0.2cm}
\noindent\textbf{Step 2: Derivative of BCE Loss with respect to Prediction $\hat{y}$}\\
Differentiating $\mathcal{L} = -y \ln \hat{y} - (1-y)\ln(1-\hat{y})$:
\[
\frac{\partial \mathcal{L}}{\partial \hat{y}} = -\frac{y}{\hat{y}} - \frac{1-y}{1-\hat{y}}(-1) = -\frac{y}{\hat{y}} + \frac{1-y}{1-\hat{y}} = \frac{-y(1-\hat{y}) + \hat{y}(1-y)}{\hat{y}(1-\hat{y})} = \frac{\hat{y} - y}{\hat{y}(1-\hat{y})}
\]

\vspace{0.2cm}
\noindent\textbf{Step 3: Chain Rule Application}\\
Applying the chain rule $\frac{\partial \mathcal{L}}{\partial z} = \frac{\partial \mathcal{L}}{\partial \hat{y}} \cdot \frac{\partial \hat{y}}{\partial z}$:
\[
\frac{\partial \mathcal{L}}{\partial z} = \left(\frac{\hat{y} - y}{\hat{y}(1-\hat{y})}\right) \cdot \left(\hat{y}(1 - \hat{y})\right) = \hat{y} - y
\]
\textbf{Conclusion:} The gradient simplifies directly to $\hat{y} - y$ (Prediction Residual). [Q.E.D.]
\end{document}
'''
    with open("Sample_ML_BinaryCrossEntropy_Answer.tex", "w", encoding="utf-8") as f:
        f.write(tex_sample4)
    subprocess.run("pdflatex -interaction=nonstopmode Sample_ML_BinaryCrossEntropy_Answer.tex", shell=True)
    print("Created Sample_ML_BinaryCrossEntropy_Answer.pdf")

    print("\nAll 4 Sample Test PDFs created successfully!")

if __name__ == "__main__":
    generate_sample_pdfs()
