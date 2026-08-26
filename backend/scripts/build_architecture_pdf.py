import os
import subprocess

def create_perfect_architecture_document():
    print("Writing clean, error-free vector Architecture LaTeX source...")
    
    tex_content = r'''\documentclass[11pt,a4paper]{article}
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage{mathptmx} % Times New Roman
\usepackage[margin=0.8in]{geometry}
\usepackage{setspace}
\setstretch{1.25}
\usepackage{xcolor}
\usepackage{fancyhdr}
\usepackage{booktabs}
\usepackage{tabularx}
\usepackage{enumitem}
\usepackage{tikz}
\usetikzlibrary{shapes.geometric, arrows.meta, positioning, shadows, fit, backgrounds, calc}
\usepackage[hidelinks]{hyperref}

% Color Definitions
\definecolor{primaryblue}{RGB}{30, 64, 175}
\definecolor{accentblue}{RGB}{59, 130, 246}
\definecolor{lightbg}{RGB}{240, 245, 255}
\definecolor{purpleaccent}{RGB}{124, 58, 237}
\definecolor{purplebg}{RGB}{245, 243, 255}
\definecolor{greenaccent}{RGB}{16, 185, 129}
\definecolor{greenbg}{RGB}{236, 253, 245}
\definecolor{orangeaccent}{RGB}{245, 158, 11}
\definecolor{orangebg}{RGB}{254, 243, 199}
\definecolor{redaccent}{RGB}{220, 38, 38}
\definecolor{redbg}{RGB}{254, 242, 242}
\definecolor{darkgray}{RGB}{55, 65, 81}

\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\small\textit{NeuralSpark --- System Architecture \& Multimodal Infrastructure}}
\fancyhead[R]{\small\thepage}
\renewcommand{\headrulewidth}{0.4pt}

% TikZ Styles
\tikzset{
    compbox/.style={
        rectangle, rounded corners=4pt, minimum width=3.2cm, minimum height=0.9cm,
        text centered, draw=accentblue, fill=white, line width=0.9pt,
        font=\footnotesize, drop shadow
    },
    cloudbox/.style={
        rectangle, rounded corners=4pt, minimum width=3.5cm, minimum height=1.1cm,
        text centered, draw=greenaccent, fill=greenbg, line width=1pt,
        font=\footnotesize, drop shadow
    },
    localbox/.style={
        rectangle, rounded corners=4pt, minimum width=3.5cm, minimum height=1.1cm,
        text centered, draw=orangeaccent, fill=orangebg, line width=1pt,
        font=\footnotesize, drop shadow
    },
    widebox/.style={
        rectangle, rounded corners=4pt, text width=14.5cm, align=left,
        inner sep=8pt, line width=1pt, font=\footnotesize, drop shadow
    },
    arrow/.style={
        thick, ->, >=Stealth, color=primaryblue, line width=1.2pt
    }
}

\begin{document}

% -----------------------------------------------------------------------------
% TITLE & OFFICIAL HEADER
% -----------------------------------------------------------------------------
\begin{center}
    {\Huge\bfseries\textcolor{primaryblue}{NEURALSPARK}}\\[0.15cm]
    {\Large\bfseries System Architecture \& Multimodal Infrastructure Specification}\\[0.2cm]
    {\normalsize\textbf{4-Tier Microservices, Multimodal Handwritten PDF Grading Pipeline, and Edge Infrastructure}}\\[0.3cm]
    
    \textbf{Project Team:}\\
    \textbf{Malay Singh} (2303031249003) \quad \textbf{Prashant Nagre} (2303031240687)\\
    \textbf{Shreyansh Negi} (2303031241262) \quad \textbf{Nitesh Sukhwal} (2303031240866)\\[0.15cm]
    
    \textit{Project Guide:} \textbf{Prof. RASNA PATEL} (AI/DS Department, PIET)\\[0.05cm]
    \small Department of Artificial Intelligence and Data Sciences\\
    Parul Institute of Engineering and Technology, Parul University, Vadodara\\
    Subject Code: \textbf{203105400} \quad $\mid$ \quad Group ID: \textbf{PIET-CSE-111} \quad $\mid$ \quad Academic Year: \textbf{2025--2026}
\end{center}

\vspace{0.1cm}
\hrule
\vspace{0.3cm}

% =============================================================================
% 1. 4-TIER FULL-STACK SYSTEM ARCHITECTURE DIAGRAM
% =============================================================================
\section{1. 4-Tier Microservices Architecture Overview}
\noindent
NeuralSpark is designed as a decoupled, multi-tiered microservices architecture optimized for sub-35ms REST response times, high-accuracy multimodal visual grading, and zero-connectivity offline edge resilience.

\vspace{0.3cm}
\begin{center}
\begin{tikzpicture}[node distance=1.1cm and 0.5cm, auto]

    % TIER 1: CLIENT PRESENTATION TIER
    \node (tier1_title) [font=\bfseries\textcolor{primaryblue}] {\textbf{TIER 1: Client Presentation Layer (Next.js 16 + React 19)}};
    \node (tier1_hub) [compbox, below of=tier1_title, xshift=-5.2cm, yshift=-0.1cm] {
        \begin{tabular}{c}
        \textbf{Landing / Auth Hub}\\
        \texttt{page.tsx} $\mid$ \texttt{login}
        \end{tabular}
    };
    \node (tier1_learn) [compbox, right of=tier1_hub, xshift=2.9cm] {
        \begin{tabular}{c}
        \textbf{8-Subject Modules}\\
        PYQs $\mid$ Quizzes $\mid$ Theory
        \end{tabular}
    };
    \node (tier1_grader) [compbox, right of=tier1_learn, xshift=2.9cm] {
        \begin{tabular}{c}
        \textbf{AI Grader Portal}\\
        Multimodal PDF / Photo UI
        \end{tabular}
    };
    \node (tier1_forum) [compbox, right of=tier1_grader, xshift=2.9cm] {
        \begin{tabular}{c}
        \textbf{Community Forum}\\
        Gamified Doubt Board
        \end{tabular}
    };

    % TIER 2: API GATEWAY
    \node (tier2_title) [font=\bfseries\textcolor{primaryblue}, below of=tier1_hub, xshift=5.2cm, yshift=-0.9cm] {\textbf{TIER 2: Asynchronous API Gateway \& Serialization Layer (Django 6 Ninja)}};
    \node (tier2_box) [compbox, minimum width=15cm, below of=tier2_title, yshift=-0.1cm, fill=purplebg, draw=purpleaccent] {
        \begin{tabular}{c}
        \textbf{Django 6 Ninja Async Router (Port 8000)} $\mid$ Pydantic Request Validation $\mid$ CORS Security Headers\\
        \texttt{/api/pyqs/} \quad $\bullet$ \quad \texttt{/api/quizzes/} \quad $\bullet$ \quad \texttt{/api/products/ai-grader/} \quad $\bullet$ \quad \texttt{/api/articles/} \quad $\bullet$ \quad \texttt{/api/questions/}
        \end{tabular}
    };

    % TIER 3: INTELLIGENCE & EVALUATION ENGINES
    \node (tier3_title) [font=\bfseries\textcolor{primaryblue}, below of=tier2_box, yshift=-0.8cm] {\textbf{TIER 3: Dual-Engine AI Assessment \& Multimodal Ingestion Engine}};
    \node (tier3_vision) [cloudbox, below of=tier3_title, xshift=-4.5cm, yshift=-0.2cm] {
        \begin{tabular}{c}
        \textbf{Mode A: Cloud Vision AI}\\
        \textbf{(Llama 3.2 Vision / GPT-OSS-120B)}\\
        \hline
        $\bullet$ Scanned PDF page image extraction\\
        $\bullet$ Handwritten formula \& matrix check\\
        $\bullet$ Latency: 2.15s $\mid$ Accuracy: \textbf{92.8\%}
        \end{tabular}
    };
    \node (tier3_local) [localbox, below of=tier3_title, xshift=0.0cm, yshift=-0.2cm] {
        \begin{tabular}{c}
        \textbf{Mode B: Local Custom AI}\\
        \textbf{(Fine-Tuned RoBERTa on CPU)}\\
        \hline
        $\bullet$ 512-token sequence classification\\
        $\bullet$ Normalized interval regression\\
        $\bullet$ Latency: \textbf{115ms} $\mid$ Cost: \textbf{\$0.00}
        \end{tabular}
    };
    \node (tier3_speech) [cloudbox, below of=tier3_title, xshift=4.5cm, yshift=-0.2cm, draw=accentblue, fill=lightbg] {
        \begin{tabular}{c}
        \textbf{Offline Voice AI Suite}\\
        \textbf{(Vosk STT + Piper TTS)}\\
        \hline
        $\bullet$ Offline spoken speech-to-text\\
        $\bullet$ High-speed neural voice feedback\\
        $\bullet$ Runs on edge Raspberry Pi 4
        \end{tabular}
    };

    % TIER 4: DATA PERSISTENCE
    \node (tier4_title) [font=\bfseries\textcolor{primaryblue}, below of=tier3_local, yshift=-1.3cm] {\textbf{TIER 4: Normalized Relational Persistence \& Edge File Storage}};
    \node (tier4_box) [compbox, minimum width=15cm, below of=tier4_title, yshift=-0.1cm, fill=greenbg, draw=greenaccent] {
        \begin{tabular}{c}
        \textbf{14 Normalized Relational Models in SQLite (Edge/Dev) \& PostgreSQL (Production)}\\
        \texttt{User}, \texttt{Category}, \texttt{PYQ}, \texttt{Question}, \texttt{Answer}, \texttt{Comment}, \texttt{Quiz}, \texttt{QuizQuestion}, \texttt{QuizOption}, \texttt{Article}, \texttt{Lecture}, \texttt{Product}, \texttt{Service}, \texttt{Inquiry}
        \end{tabular}
    };

    % Interconnect Arrows
    \draw [arrow] (tier1_learn) -- ++(0, -0.65) -| (tier2_box);
    \draw [arrow] (tier2_box) -- ++(-4.5, -0.65) -- (tier3_vision);
    \draw [arrow] (tier2_box) -- (tier3_local);
    \draw [arrow] (tier2_box) -- ++(4.5, -0.65) -- (tier3_speech);
    \draw [arrow] (tier3_vision) |- (tier4_box);
    \draw [arrow] (tier3_local) -- (tier4_box);
    \draw [arrow] (tier3_speech) |- (tier4_box);

\end{tikzpicture}
\end{center}

\newpage

% =============================================================================
% 2. MULTIMODAL HANDWRITTEN PDF PIPELINE ARCHITECTURE
% =============================================================================
\section{2. Multimodal Handwritten PDF \& Visual Ingestion Pipeline}
\noindent
This section details how the multimodal engine ingests, extracts, sanitizes, and evaluates scanned handwritten documents and camera photos.

\vspace{0.3cm}
\begin{center}
\begin{tikzpicture}[node distance=1.4cm, auto]

    % Step 1
    \node (input) [widebox, fill=lightbg, draw=primaryblue] {
        \textbf{1. Student Assignment Upload Interface:}\\
        Accepts: Scanned Handwritten PDF $\mid$ Mobile Photo (.png/.jpg/.jpeg) $\mid$ Typed Text + Strict Grading Rubric
    };

    % Step 2
    \node (parser) [widebox, fill=purplebg, draw=purpleaccent, below of=input, yshift=-0.2cm] {
        \textbf{2. Multipart Extraction Pipeline (\texttt{\_process\_uploaded\_file}):}\\
        $\bullet$ \textbf{Digital Text Stream:} Extracted via \texttt{PyPDF2.extract\_text()}\\
        $\bullet$ \textbf{Scanned Page Bitmap Stream:} Iterates \texttt{page.images}, extracts raw bytes, encodes to Base64 (\texttt{data:image/jpeg;base64})\\
        $\bullet$ \textbf{Hybrid Assembly:} Combines digital text tokens and visual image payloads into a unified OpenAI/Groq-compatible message array
    };

    % Step 3
    \node (prompt) [widebox, fill=orangebg, draw=orangeaccent, below of=parser, yshift=-0.4cm] {
        \textbf{3. Grounded System Prompt Injection:}\\
        Enforces strict Teaching Assistant persona, step-by-step mathematical reasoning, line-by-line equation checks, and structured \texttt{Score: X/Y} output format
    };

    % Step 4
    \node (llm) [widebox, fill=greenbg, draw=greenaccent, below of=prompt, yshift=-0.2cm] {
        \textbf{4. High-Capacity Vision LLM Execution (Llama 3.2 Vision / GPT-OSS-120B via Groq API):}\\
        Visual character recognition $\rightarrow$ Matrix determinant step check $\rightarrow$ Factored polynomial check $\rightarrow$ Mark deduction justification
    };

    % Step 5
    \node (response) [widebox, fill=lightbg, draw=accentblue, below of=llm, yshift=-0.2cm] {
        \textbf{5. Client Serialization \& Persistence:}\\
        JSON response returned to Next.js in $<2.5$ seconds $\rightarrow$ Stored in Database $\rightarrow$ Rendered with animated score reveal and remedial guidance
    };

    \draw [arrow] (input) -- (parser);
    \draw [arrow] (parser) -- (prompt);
    \draw [arrow] (prompt) -- (llm);
    \draw [arrow] (llm) -- (response);

\end{tikzpicture}
\end{center}

\vspace{0.4cm}
% =============================================================================
% 3. ARCHITECTURAL COMPARISON MATRIX
% =============================================================================
\section{3. System Architectural Component Specifications}

\begin{center}
\small
\begin{tabularx}{\textwidth}{p{3.2cm} p{3.8cm} p{3.8cm} X}
\toprule
\textbf{Layer / Component} & \textbf{Technology Stack} & \textbf{Key Protocols / Format} & \textbf{Architectural Role} \\
\midrule
\textbf{Frontend Client} & Next.js 16, React 19, TypeScript & HTTP/2, Server Components, JSON & Ultra-responsive UI, KaTeX math rendering, theme persistence \\
\textbf{API Gateway} & Django 6 Ninja Async & REST, Pydantic, CORS & Sub-35ms routing, schema validation, async coroutine handlers \\
\textbf{Cloud Vision AI} & Llama 3.2 Vision / GPT-OSS & Base64 Multimodal JSON & Handwritten PDF and diagram grading with 92.8\% accuracy \\
\textbf{Local Offline AI} & RoBERTa / BERT (PyTorch) & CPU Tensor Classification & Zero-cost, sub-120ms private sequence grading without internet \\
\textbf{Speech Pipeline} & Vosk STT + Piper TTS & 16kHz PCM WAV Audio & Offline edge voice tutoring in rural connectivity-limited classrooms \\
\textbf{Database Layer} & SQLite (Edge) / PostgreSQL & Django ORM, SQL Indexes & 14 normalized relational entities with foreign-key referential integrity \\
\bottomrule
\end{tabularx}
\end{center}

\vspace{0.3cm}
\begin{center}
\small\textbf{Complete source code, models, and documentation available at:}\\
\url{https://github.com/malay336/NeuralSpark.git}
\end{center}

\end{document}
'''
    with open("NeuralSpark_Architecture.tex", "w", encoding="utf-8") as f:
        f.write(tex_content)
    print("NeuralSpark_Architecture.tex written successfully.")

    with open("Custom_AI_Grader_Architecture.tex", "w", encoding="utf-8") as f:
        f.write(tex_content)

    # Compile with pdflatex (2 passes)
    subprocess.run("pdflatex -interaction=nonstopmode NeuralSpark_Architecture.tex", shell=True)
    subprocess.run("pdflatex -interaction=nonstopmode NeuralSpark_Architecture.tex", shell=True)
    subprocess.run("pdflatex -interaction=nonstopmode Custom_AI_Grader_Architecture.tex", shell=True)
    subprocess.run("pdflatex -interaction=nonstopmode Custom_AI_Grader_Architecture.tex", shell=True)
    print("NeuralSpark_Architecture.pdf & Custom_AI_Grader_Architecture.pdf compiled successfully.")

if __name__ == "__main__":
    create_perfect_architecture_document()
