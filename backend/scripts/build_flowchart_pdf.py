import os
import subprocess

def create_flowchart_document():
    print("Generating comprehensive NeuralSpark Architectural & Multimodal Flowchart PDF...")
    
    tex_content = r'''\documentclass[11pt,a4paper]{article}
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage{mathptmx} % Times New Roman
\usepackage[margin=0.8in]{geometry}
\usepackage{setspace}
\setstretch{1.25}
\usepackage{xcolor}
\usepackage{fancyhdr}
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
\definecolor{grayborder}{RGB}{156, 163, 175}

\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\small\textit{NeuralSpark --- System Flowchart \& Multimodal Pipeline Architecture}}
\fancyhead[R]{\small\thepage}
\renewcommand{\headrulewidth}{0.4pt}

% TikZ Styles
\tikzset{
    startstop/.style={
        rectangle, rounded corners=6pt, minimum width=2.8cm, minimum height=0.9cm,
        text centered, draw=primaryblue, fill=lightbg, line width=1pt,
        font=\small\bfseries, drop shadow
    },
    process/.style={
        rectangle, rounded corners=3pt, minimum width=3.2cm, minimum height=0.9cm,
        text centered, draw=accentblue, fill=white, line width=0.8pt,
        font=\footnotesize, drop shadow
    },
    decision/.style={
        diamond, aspect=2, minimum width=3.2cm, minimum height=1.1cm,
        text centered, draw=purpleaccent, fill=purplebg, line width=1pt,
        font=\footnotesize\bfseries, drop shadow
    },
    cloudengine/.style={
        rectangle, rounded corners=5pt, minimum width=3.4cm, minimum height=1.1cm,
        text centered, draw=greenaccent, fill=greenbg, line width=1pt,
        font=\footnotesize, drop shadow
    },
    localengine/.style={
        rectangle, rounded corners=5pt, minimum width=3.4cm, minimum height=1.1cm,
        text centered, draw=orangeaccent, fill=orangebg, line width=1pt,
        font=\footnotesize, drop shadow
    },
    iobox/.style={
        trapezium, trapezium left angle=70, trapezium right angle=110,
        minimum width=3cm, minimum height=0.8cm, text centered,
        draw=redaccent, fill=redbg, line width=0.8pt, font=\footnotesize, drop shadow
    },
    arrow/.style={
        thick, ->, >=Stealth, color=primaryblue, line width=1.2pt
    },
    dasharrow/.style={
        thick, ->, >=Stealth, dashed, color=purpleaccent, line width=1pt
    }
}

\begin{document}

% -----------------------------------------------------------------------------
% TITLE & HEADER
% -----------------------------------------------------------------------------
\begin{center}
    {\Huge\bfseries\textcolor{primaryblue}{NEURALSPARK}}\\[0.15cm]
    {\Large\bfseries Architectural \& Multimodal Pipeline Flowcharts}\\[0.2cm]
    {\normalsize\textbf{Handwritten PDF Ingestion, Dual-Engine AI Assessment, and System Lifecycle}}\\[0.3cm]
    
    \textbf{Project Team:}\\
    \textbf{Malay Singh} (2303031249003) \quad \textbf{Prashant Nagre} (2303031240687)\\
    \textbf{Shreyansh Negi} (2303031241262) \quad \textbf{Nitesh Sukhwal} (2303031240866)\\[0.15cm]
    
    \textit{Project Guide:} \textbf{Prof. RASNA PATEL} (AI/DS Department, PIET)\\[0.05cm]
    \small Department of Artificial Intelligence and Data Sciences\\
    Parul Institute of Engineering and Technology, Parul University, Vadodara \quad (2025--2026)
\end{center}

\vspace{0.1cm}
\hrule
\vspace{0.3cm}

% =============================================================================
% FLOWCHART 1: MULTIMODAL HANDWRITTEN PDF GRADING PIPELINE
% =============================================================================
\section{Flowchart 1: Multimodal Handwritten PDF \& AI Grading Pipeline}
\noindent
This flowchart illustrates the complete multi-layer processing pipeline when a student submits an assignment containing scanned handwritten pages, mathematical derivations, photos, or digital text.

\vspace{0.3cm}
\begin{center}
\begin{tikzpicture}[node distance=1.3cm and 1.8cm, auto]

    % Row 1: Student Inputs
    \node (upload) [startstop] {Student Assignment Submission};
    \node (inputs) [process, below of=upload, yshift=-0.2cm] {
        \begin{tabular}{c}
        \textbf{Multimodal Upload Types}\\
        Scanned Handwritten PDF $\mid$ Mobile Photo (.png/.jpg)\\
        Typed PDF / Markdown $\mid$ Raw Text Form
        \end{tabular}
    };

    % Row 2: Ingestion & Extraction Layer
    \node (extract) [process, below of=inputs, yshift=-0.4cm] {
        \begin{tabular}{c}
        \textbf{Multi-Layer Ingestion \& Parser}\\
        1. Extract Digital Text via \texttt{PyPDF2.extract\_text()}\\
        2. Scan Bitmap Pages via \texttt{page.images}\\
        3. Base64 Multimodal Serializer (\texttt{data:image/jpeg;base64})
        \end{tabular}
    };

    % Row 3: Decision Router
    \node (router) [decision, below of=extract, yshift=-0.5cm] {
        \begin{tabular}{c}
        Selected Grading\\
        Engine Mode?
        \end{tabular}
    };

    % Row 4: Two Engines (Left: Mode A Cloud, Right: Mode B Local)
    \node (modeA) [cloudengine, below left of=router, xshift=-2.2cm, yshift=-1.1cm] {
        \begin{tabular}{c}
        \textbf{Mode A: Cloud Vision AI}\\
        \textbf{(Llama 3.2 Vision / GPT-OSS-120B)}\\
        \hline
        $\bullet$ Multimodal Visual Step Parser\\
        $\bullet$ Handwritten Formula \& Matrix Check\\
        $\bullet$ Rubric Point Deduction Engine\\
        $\bullet$ Latency: $\sim 2.15$s $\mid$ Accuracy: \textbf{92.8\%}
        \end{tabular}
    };

    \node (modeB) [localengine, below right of=router, xshift=2.2cm, yshift=-1.1cm] {
        \begin{tabular}{c}
        \textbf{Mode B: Local Custom AI}\\
        \textbf{(Fine-Tuned RoBERTa Sequence Model)}\\
        \hline
        $\bullet$ Offline CPU Transformer Model\\
        $\bullet$ Cross-Attention Semantic Match\\
        $\bullet$ Normalized Interval Score Regression\\
        $\bullet$ Latency: \textbf{115ms} $\mid$ Cost: \textbf{\$0.00 (Private)}
        \end{tabular}
    };

    % Row 5: Merge & Verification
    \node (eval) [process, below of=router, yshift=-3.5cm] {
        \begin{tabular}{c}
        \textbf{Structured Evaluation Synthesis}\\
        Score: $[Points]/[Total]$ $\mid$ Itemized Step Justifications\\
        Database Record Persistence (User, Submission, Mark Breakdown)
        \end{tabular}
    };

    % Row 6: Output
    \node (output) [startstop, below of=eval, yshift=-0.3cm] {
        \begin{tabular}{c}
        \textbf{Interactive Feedback Display in Next.js Client}\\
        Instant Grade, Animated Score Counter, Diagnostic Remedial Tips
        \end{tabular}
    };

    % Arrows
    \draw [arrow] (upload) -- (inputs);
    \draw [arrow] (inputs) -- (extract);
    \draw [arrow] (extract) -- (router);
    \draw [arrow] (router) -| node[above, near start] {\footnotesize Cloud Vision} (modeA);
    \draw [arrow] (router) -| node[above, near start] {\footnotesize Local Offline} (modeB);
    \draw [arrow] (modeA) |- (eval);
    \draw [arrow] (modeB) |- (eval);
    \draw [arrow] (eval) -- (output);

\end{tikzpicture}
\end{center}

\newpage

% =============================================================================
% FLOWCHART 2: FULL-STACK APPLICATION & OFFLINE SYSTEM LIFECYCLE
% =============================================================================
\section{Flowchart 2: Full-Stack Learning System \& Offline Architecture}
\noindent
This flowchart details the full-stack request lifecycle across the Next.js frontend, Django Ninja asynchronous API gateway, 8-subject curriculum modules, and the offline classroom deployment suite.

\vspace{0.4cm}
\begin{center}
\begin{tikzpicture}[node distance=1.2cm and 2.0cm, auto]

    % Frontend Layer
    \node (client) [startstop] {
        \begin{tabular}{c}
        \textbf{Next.js 16 + React 19 Client UI}\\
        (Framer Motion $\mid$ Tailwind CSS 4 $\mid$ Lucide Icons $\mid$ Dark/Light Theme)
        \end{tabular}
    };

    % Module Routers
    \node (modules) [process, below of=client, yshift=-0.3cm] {
        \begin{tabular}{ccccc}
        \textbf{PYQ Engine} & \textbf{Quizzes} & \textbf{Theory Notes} & \textbf{Video Hub} & \textbf{Doubt Forum}\\
        (4-MCQ + Sol) & (Timed Tests) & (LaTeX Math) & (Sequenced) & (Gamified Q\&A)
        \end{tabular}
    };

    % API Gateway
    \node (gateway) [process, below of=modules, yshift=-0.4cm] {
        \begin{tabular}{c}
        \textbf{Django 6 Ninja Async REST API Gateway (Port 8000)}\\
        Pydantic Strict Schema Validation $\mid$ CORS Security $\mid$ Async Coroutines
        \end{tabular}
    };

    % Database & Offline Mode
    \node (db) [cloudengine, below left of=gateway, xshift=-1.8cm, yshift=-1.2cm] {
        \begin{tabular}{c}
        \textbf{Normalized Relational DB}\\
        \textbf{(SQLite / PostgreSQL)}\\
        \hline
        14 Interconnected Tables\\
        Users, PYQs, Quizzes, Articles,\\
        Answers, Votes, Inquiries
        \end{tabular}
    };

    \node (offline) [localengine, below right of=gateway, xshift=1.8cm, yshift=-1.2cm] {
        \begin{tabular}{c}
        \textbf{Offline Classroom Suite}\\
        \textbf{(\texttt{run\_offline.bat})}\\
        \hline
        Local Wi-Fi Access Point\\
        Vosk Offline Speech-to-Text\\
        Piper High-Speed Neural TTS
        \end{tabular}
    };

    % Unified Response
    \node (response) [process, below of=gateway, yshift=-3.4cm] {
        \begin{tabular}{c}
        \textbf{Sub-35ms JSON Response Serialization}\\
        Client Component State Hydration $\mid$ Real-Time Score Updates
        \end{tabular}
    };

    \node (endnode) [startstop, below of=response, yshift=-0.2cm] {
        \textbf{Seamless, Zero-Latency Interactive Student Experience}
    };

    % Connections
    \draw [arrow] (client) -- (modules);
    \draw [arrow] (modules) -- (gateway);
    \draw [arrow] (gateway) -| node[above, near start] {\footnotesize Relational ORM} (db);
    \draw [arrow] (gateway) -| node[above, near start] {\footnotesize Offline Services} (offline);
    \draw [arrow] (db) |- (response);
    \draw [arrow] (offline) |- (response);
    \draw [arrow] (response) -- (endnode);

\end{tikzpicture}
\end{center}

\vspace{0.6cm}
\begin{center}
\colorbox{lightbg}{\parbox{0.95\textwidth}{\small
\textbf{Flowchart Architecture Summary:}
\begin{itemize}[leftmargin=*]
    \item \textbf{Multimodal Ingestion:} Automatically detects scanned handwritten PDFs, mobile camera snapshots, and typed text, converting them into high-resolution visual tokens for Vision-LLM verification.
    \item \textbf{Dual Assessment Strategy:} Blends deep multimodal cloud reasoning ($\kappa = 0.887$, 92.8\% accuracy) with local private CPU classification ($<120$ms latency, zero cloud cost).
    \item \textbf{Offline Resilience:} Enables uninterrupted education in connectivity-constrained rural schools via local LAN routing and edge speech AI.
\end{itemize}}}
\end{center}

\end{document}
'''
    with open("NeuralSpark_Flowchart.tex", "w", encoding="utf-8") as f:
        f.write(tex_content)
    print("NeuralSpark_Flowchart.tex written successfully.")

    # Also duplicate to NeuralSpark_Backend_Flow.tex for exact consistency
    with open("NeuralSpark_Backend_Flow.tex", "w", encoding="utf-8") as f:
        f.write(tex_content)

    # Compile with pdflatex (2 passes)
    subprocess.run("pdflatex -interaction=nonstopmode NeuralSpark_Flowchart.tex", shell=True)
    subprocess.run("pdflatex -interaction=nonstopmode NeuralSpark_Flowchart.tex", shell=True)
    subprocess.run("pdflatex -interaction=nonstopmode NeuralSpark_Backend_Flow.tex", shell=True)
    subprocess.run("pdflatex -interaction=nonstopmode NeuralSpark_Backend_Flow.tex", shell=True)
    print("NeuralSpark_Flowchart.pdf & NeuralSpark_Backend_Flow.pdf compiled successfully.")

if __name__ == "__main__":
    create_flowchart_document()
