import os

def expand_ch3():
    ch3_content = r'''\chapter{Project Methodology \& System Architecture}

\section{System Architectural Blueprint}
NeuralSpark is designed following a decoupled, four-tier microservices architecture engineered to deliver maximum scalability, sub-50ms API responsiveness, strict data validation, and complete resilience in both cloud-connected and offline classroom environments. The architectural topology comprises four distinct functional tiers:
\begin{enumerate}[leftmargin=*]
    \item \textbf{Presentation Layer (Frontend Client):} Built using Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS 4. Manages responsive client-side routing, state hydration, dynamic theme persistence (Dark/Light mode via \texttt{ThemeContext}), authentication state (\texttt{AuthContext}), and spring-physics micro-interactions via Framer Motion 12.
    \item \textbf{Application \& API Layer (Backend Core):} Built upon Django 6.0.2 and Django Ninja. Exposes high-throughput asynchronous REST API endpoints, performs strict payload parsing via Pydantic schemas, handles relational ORM transaction routing, and enforces role-based access control (RBAC).
    \item \textbf{AI Inference \& Assessment Engine Layer:} Implements a dual-engine architecture:
    \begin{itemize}
        \item \textit{Cloud Multimodal Vision-LLM Engine:} Processes scanned PDF assignments and handwritten images via Llama 3.2 Vision running on high-throughput Groq LPUs.
        \item \textit{Edge Fine-Tuned Transformer Engine:} A local PyTorch sequence classification model (fine-tuned BERT/RoBERTa) executing zero-latency, private on-device scoring for text-based short answers.
        \item \textit{Offline Voice Subsystem:} Local Vosk speech-to-text (STT) and Piper neural text-to-speech (TTS) engines.
    \end{itemize}
    \item \textbf{Data Persistence \& Storage Layer:} Utilizes SQLite3 for zero-configuration offline execution and PostgreSQL for cloud production deployments. Manages 14 relational database models with optimized indexes and foreign-key constraints.
\end{enumerate}

\begin{figure}[H]
    \centering
    \includegraphics[width=0.88\textwidth]{neuralspark_arch.png}
    \caption{NeuralSpark Complete Full-Stack System Architecture and Layered Topology}
    \label{fig:ch3_full_stack_arch}
\end{figure}

\section{Hardware Dependencies, Development Boards, and Edge Computing}
To ensure universal deployment across both modern university cloud servers and resource-constrained rural edge nodes, NeuralSpark was designed with flexible hardware requirements.

\subsection{Development Boards and Edge Hosting Platforms}
A development board is a physical computing platform equipped with a central processing unit, system memory, input/output peripherals, and hardware communication buses. When deployed in offline rural classrooms, NeuralSpark can be hosted directly on a single-board computer acting as a local classroom server.

\subsubsection{Raspberry Pi 4 Model B (8GB RAM)}
The Raspberry Pi 4 Model B represents the primary edge deployment target for NeuralSpark in off-grid rural schools. Key technical specifications include:
\begin{itemize}[leftmargin=*]
    \item \textbf{Processor:} Quad-core ARM Cortex-A72 (ARM v8) 64-bit SoC @ 1.5GHz (Broadcom BCM2711), delivering up to $3\times$ the computational throughput of prior generations.
    \item \textbf{Memory Subsystem:} 8GB LPDDR4-3200 SDRAM, providing sufficient headroom to concurrently host the Django API server, Next.js Node runtime, SQLite database, and quantized INT8 neural model weights in system memory.
    \item \textbf{Connectivity:} Dual-band 2.4GHz/5.0GHz IEEE 802.11ac wireless LAN, Bluetooth 5.0, BLE, Gigabit Ethernet, 2 $\times$ USB 3.0 ports, and 2 $\times$ USB 2.0 ports.
    \item \textbf{Video \& Display Output:} 2 $\times$ micro-HDMI ports supporting dual 4K displays at 60Hz.
    \item \textbf{GPIO Header:} Standard 40-pin GPIO header supporting UART, I2C, SPI, and PWM hardware buses.
\end{itemize}

\subsubsection{Local Wi-Fi Access Point (AP) Configuration}
In an off-grid rural classroom without an external internet router, the Raspberry Pi edge server is configured as a standalone wireless Access Point using \texttt{hostapd} and \texttt{dnsmasq}. The edge server broadcasts a local Wi-Fi SSID (e.g., \texttt{NeuralSpark-Classroom}). Up to 35 student client laptops, tablets, or smartphones can connect directly to the local LAN, accessing the full NeuralSpark web platform at \texttt{http://neuralspark.local:3000} with zero internet bandwidth consumption.

\subsection{Workstation and Cloud Server Hardware}
For cloud deployment and high-throughput multi-user institutional environments:
\begin{itemize}[leftmargin=*]
    \item \textbf{Processor:} 8-Core Intel Core i7 / AMD Ryzen 7 @ 3.8GHz or AWS EC2 \texttt{t3.xlarge} instance.
    \item \textbf{Memory:} 16GB--32GB DDR4/DDR5 RAM.
    \item \textbf{Accelerator (Optional for Local GPU Training):} NVIDIA RTX 3060 / 4070 (12GB VRAM) running CUDA 12.2 and PyTorch 2.4.
\end{itemize}

\section{Cloud Infrastructure and Provider Comparison}
In institutional deployments where cloud scalability, multi-region redundancy, and centralized analytics are required, NeuralSpark can be deployed across major public cloud providers.

\subsection{Comparative Analysis: AWS vs Google Cloud Platform (GCP) vs Microsoft Azure}
Table~\ref{tab:cloud_comparison_matrix} provides a detailed comparative evaluation of the three leading cloud platforms across compute, database, AI/ML inference, and storage dimensions.

\begin{table}[H]
\centering
\caption{Comprehensive Comparison of Cloud Services for AI-Powered E-Learning Platforms}
\label{tab:cloud_comparison_matrix}
\small
\begin{tabularx}{\textwidth}{p{3.2cm} p{3.6cm} p{3.6cm} X}
\toprule
\textbf{Service Dimension} & \textbf{Amazon Web Services (AWS)} & \textbf{Google Cloud Platform (GCP)} & \textbf{Microsoft Azure} \\
\midrule
\textbf{Serverless Compute} & AWS Lambda (Fast cold start, 15m timeout) & Google Cloud Functions & Azure Functions \\
\textbf{Relational Database} & Amazon RDS (PostgreSQL / Aurora) & Cloud SQL for PostgreSQL & Azure Database for PostgreSQL \\
\textbf{NoSQL Database} & Amazon DynamoDB (Single-digit ms latency) & Google Cloud Firestore & Azure Cosmos DB \\
\textbf{AI Model Inference} & Amazon SageMaker Serverless Endpoints & Vertex AI Prediction & Azure Machine Learning \\
\textbf{Object Storage} & Amazon S3 (Industry standard 99.999999999\% durability) & Google Cloud Storage & Azure Blob Storage \\
\textbf{Edge Computing} & AWS IoT Greengrass & Google Distributed Cloud Edge & Azure IoT Edge \\
\bottomrule
\end{tabularx}
\end{table}

\subsection{Cloud Architectural Services in NeuralSpark}
\begin{itemize}[leftmargin=*]
    \item \textbf{AWS Lambda / Container Services (ECS/Fargate):} Executes asynchronous microservices such as PDF text extraction and Base64 image rendering in isolated stateless containers.
    \item \textbf{Amazon S3 (Simple Storage Service):} Stores original scanned student assignment documents, lecture thumbnail images, and audio voice streams with granular IAM access policies.
    \item \textbf{Amazon RDS PostgreSQL:} Production relational database engine providing multi-AZ failover and automated daily snapshot backups.
\end{itemize}

\section{Software Dependencies and Technology Stack}

\subsection{Backend Framework: Django 6.0.2 \& Django Ninja}
The backend leverages Python 3.12+ and Django 6.0.2. Django provides a battle-tested relational Object-Relational Mapper (ORM), secure session authentication, and a built-in administrative Content Management System (CMS). To overcome the serialization overhead and synchronous performance limitations of legacy Django REST Framework (DRF), NeuralSpark integrates **Django Ninja**:
\begin{itemize}[leftmargin=*]
    \item \textbf{Type-Safe Asynchronous Handlers:} Native support for Python \texttt{async def} endpoint handlers, allowing non-blocking I/O operations during external API calls and database transactions.
    \item \textbf{Pydantic Validation:} Request payloads and response bodies are strictly parsed and validated against Pydantic schemas, eliminating invalid data writes and generating automatic OpenAPI / Swagger documentation at \texttt{/api/docs}.
    \item \textbf{High-Speed Serialization:} Up to $4\times$ faster JSON serialization compared to DRF serializers.
\end{itemize}

\subsection{Frontend Framework: Next.js 16 (App Router) \& React 19}
The user interface is constructed using Next.js 16 and React 19:
\begin{itemize}[leftmargin=*]
    \item \textbf{App Router Architecture:} Utilizes file-system based routing (\texttt{app/learning/pyqs}, \texttt{app/learning/theory}, \texttt{app/learning/quizzes}, \texttt{app/upload}) with React Server Components (RSC) for lightning-fast initial rendering.
    \item \textbf{Tailwind CSS 4:} Utility-first styling engine with customized dark/light mode color tokens and zero runtime CSS overhead.
    \item \textbf{Framer Motion 12:} Physics-based spring animations for page transitions, interactive quiz choice selections, and animated score counters.
    \item \textbf{Axios HTTP Client:} Centralized API client configured with global request timeouts and automatic JSON parsing.
\end{itemize}

\begin{figure}[H]
    \centering
    \includegraphics[width=0.88\textwidth]{neuralspark_backend_flow.png}
    \caption{NeuralSpark Asynchronous Backend Data Flow and Request Processing Pipeline}
    \label{fig:ch3_backend_flow_diagram}
\end{figure}

\section{Artificial Intelligence \& Machine Learning Subsystems}

\subsection{Deep Learning Foundations in Automated Assessment}
Neural network architectures process hierarchical representations of textual and visual data. For a sequence of input token embeddings $\mathbf{X} = [\mathbf{x}_1, \dots, \mathbf{x}_n] \in \mathbb{R}^{n \times d}$, a multi-layer Transformer computes contextual representations through repeated applications of multi-head self-attention and position-wise feed-forward networks:
\begin{align}
    \mathbf{Z}^{(l)} &= \text{LayerNorm}\left( \mathbf{X}^{(l-1)} + \text{MultiHeadAttention}(\mathbf{X}^{(l-1)}) \right) \\
    \mathbf{X}^{(l)} &= \text{LayerNorm}\left( \mathbf{Z}^{(l)} + \text{FFN}(\mathbf{Z}^{(l)}) \right)
\end{align}
where $\text{FFN}(\mathbf{Z}) = \max(0, \mathbf{Z}\mathbf{W}_1 + \mathbf{b}_1)\mathbf{W}_2 + \mathbf{b}_2$.

\subsection{Dual-Engine Automated Assessment Architecture}
NeuralSpark addresses the trade-off between deep multimodal reasoning and zero-latency private execution through an adaptive dual-engine grading architecture:

\subsubsection{Mode A: Cloud Multimodal Vision-LLM Engine}
When a student uploads a scanned assignment containing handwritten proofs, mathematical derivations, or architectural diagrams:
\begin{enumerate}[leftmargin=*]
    \item \textbf{Document Preprocessing:} If a PDF file is submitted, \texttt{PyPDF2} extracts embedded text lines, while \texttt{pdf2image} renders each page as a high-resolution 300 DPI image stream.
    \item \textbf{Base64 Image Encoding:} Image pages are compressed using \texttt{Pillow} and encoded into standard Base64 data URIs.
    \item \textbf{Rubric Prompt Construction:} A multi-part prompt payload is assembled combining:
    \begin{itemize}
        \item The assignment problem statement $Q$.
        \item The instructor's reference solution and marking rubric $R$.
        \item The extracted text and Base64 visual images of the student's submission.
        \item System instructions mandating objective evaluation across four core dimensions: (1) Technical Correctness, (2) Mathematical Derivation Steps, (3) Logical Coherence, and (4) Notation \& Diagrams.
    \end{itemize}
    \item \textbf{Inference Execution:} Dispatched to \textbf{Llama 3.2 Vision} via Groq LPU endpoints. The model outputs structured JSON with numerical scores and itemized explanations.
\end{enumerate}

\subsubsection{Mode B: Local Fine-Tuned Transformer Sequence Classifier}
For text-based short answers and offline environments:
\begin{enumerate}[leftmargin=*]
    \item \textbf{Cross-Encoder Concatenation:} The prompt $Q$, reference answer $R$, and student response $S$ are concatenated:
    \begin{equation}
        \text{Input} = \texttt{[CLS]} \circ Q \circ \texttt{[SEP]} \circ R \circ \texttt{[SEP]} \circ S \circ \texttt{[SEP]}
    \end{equation}
    \item \textbf{Sequence Classification Head:} The pooled embedding $\mathbf{h}_{\texttt{[CLS]}} \in \mathbb{R}^{d}$ is passed through a dense layer with dropout ($p=0.1$):
    \begin{equation}
        \mathbf{z} = \mathbf{W}_c \mathbf{h}_{\texttt{[CLS]}} + \mathbf{b}_c \in \mathbb{R}^{K}
    \end{equation}
    where $K$ represents discrete score intervals ($0, 1, 2, \dots, K$).
    \item \textbf{Loss Optimization:} The model is trained using Cross-Entropy Loss combined with a smooth Mean Squared Error (MSE) penalty to enforce ordinal consistency across score grades:
    \begin{equation}
        \mathcal{L}_{\text{Total}} = -\sum_{k=1}^K y_k \log(\hat{y}_k) + \lambda \sum_{k=1}^K (\hat{y}_k - y_k)^2
    \end{equation}
\end{enumerate}

\begin{figure}[H]
    \centering
    \includegraphics[width=0.88\textwidth]{custom_ai_grader_arch.png}
    \caption{Deep Neural Pipeline of NeuralSpark's Local Fine-Tuned Transformer AI Grader}
    \label{fig:ch3_custom_grader}
\end{figure}

\subsection{Deep Reinforcement Learning (DRL) and Proximal Policy Optimization (PPO)}
In addition to automated grading, NeuralSpark incorporates Reinforcement Learning principles to adaptively recommend practice questions based on real-time student mastery trajectories. The system models student learning as a Markov Decision Process (MDP) defined by the tuple $\langle \mathcal{S}, \mathcal{A}, \mathcal{P}, \mathcal{R}, \gamma \rangle$:
\begin{itemize}[leftmargin=*]
    \item \textbf{State Space $\mathcal{S}$:} A continuous vector representation of the student's historical accuracy across the 8 subjects, recent quiz scores, and question difficulty levels.
    \item \textbf{Action Space $\mathcal{A}$:} Selecting the next educational content item (e.g., intermediate practice problem, video lecture, or advanced derivation quiz).
    \item \textbf{Reward Function $\mathcal{R}$:} Positive rewards awarded for student conceptual mastery improvements and balanced practice distributions across weak topics.
\end{itemize}

NeuralSpark utilizes \textbf{Proximal Policy Optimization (PPO)} with clipped surrogate objective to train the recommendation policy $\pi_\theta$:
\begin{equation}
    L^{\text{CLIP}}(\theta) = \hat{\mathbb{E}}_t \left[ \min\left( r_t(\theta) \hat{A}_t, \, \text{clip}(r_t(\theta), 1 - \epsilon, 1 + \epsilon) \hat{A}_t \right) \right]
\end{equation}
where $r_t(\theta) = \frac{\pi_\theta(a_t \mid s_t)}{\pi_{\theta_{\text{old}}}(a_t \mid s_t)}$ is the probability ratio and $\hat{A}_t$ is the generalized advantage estimator. PPO guarantees stable policy updates, preventing sudden erratic shifts in content difficulty.

\subsection{Offline Voice Subsystem (Vosk STT \& Piper TTS)}
To enable voice-driven interactive tutoring in offline classrooms, NeuralSpark integrates:
\begin{itemize}[leftmargin=*]
    \item \textbf{Speech-to-Text (STT):} The \textbf{Vosk} engine processes client microphone audio streams (16kHz, 16-bit PCM) using an on-device Kaldi acoustic model, decoding spoken queries with sub-180ms latency.
    \item \textbf{Text-to-Speech (TTS):} The \textbf{Piper} neural synthesis engine converts generated text responses into natural-sounding speech audio via an ONNX-quantized VITS model.
\end{itemize}

\section{Hardware Communication Protocols}
In physical classroom laboratory setups where interactive LED indicators, physical buzzers, or external electronic quiz submission pads are utilized, NeuralSpark supports multiple hardware communication protocols:

\subsection{Comparison of Serial Protocols: UART vs I2C vs SPI}
Table~\ref{tab:serial_protocols_comparison} compares the three primary serial communication protocols supported by microcontroller edge interfaces.

\begin{table}[H]
\centering
\caption{Comparison of Serial Communication Protocols for Educational IoT Hardware}
\label{tab:serial_protocols_comparison}
\small
\begin{tabularx}{\textwidth}{p{3.2cm} p{3.0cm} p{3.5cm} X}
\toprule
\textbf{Protocol Feature} & \textbf{UART} & \textbf{I2C} & \textbf{SPI} \\
\midrule
\textbf{Pin Count / Lines} & 2 (Tx, Rx) & 2 (SDA, SCL) & 4 (MOSI, MISO, SCK, CS) \\
\textbf{Communication Mode} & Asynchronous Full-Duplex & Synchronous Half-Duplex & Synchronous Full-Duplex \\
\textbf{Data Throughput} & Up to 115.2 kbps (typical) & 100 kbps (Std) / 400 kbps (Fast) & Up to 10--50 Mbps \\
\textbf{Multi-Device Support} & Point-to-Point (1 to 1) & Multi-Master / Multi-Slave (7-bit address) & Single-Master / Multi-Slave (via Chip Select) \\
\textbf{Hardware Complexity} & Very Low & Low (Requires pull-up resistors) & Moderate \\
\bottomrule
\end{tabularx}
\end{table}

\subsection{Networking Protocols: HTTP/2, WebSockets, and MQTT}
\begin{itemize}[leftmargin=*]
    \item \textbf{HTTP/2 REST API:} Utilized for standard CRUD data exchange between Next.js frontend and Django Ninja backend with multiplexed TCP streams.
    \item \textbf{WebSockets:} Full-duplex persistent connections used for live leaderboard updates, real-time typing indicators, and streaming AI assistant token outputs.
    \item \textbf{MQTT (Message Queuing Telemetry Transport):} Lightweight publish-subscribe protocol used in laboratory hardware deployments for broadcasting live quiz timestamps to classroom IoT displays.
\end{itemize}

\section{Database Architecture and Relational Models}
NeuralSpark's persistence layer is engineered around 14 relational database models in Django ORM. The relational structure is detailed in Table~\ref{tab:detailed_models}.

\begin{table}[H]
\centering
\caption{NeuralSpark Relational Database Models and Attribute Specifications}
\label{tab:detailed_models}
\small
\begin{tabularx}{\textwidth}{p{3.2cm} p{4.0cm} X}
\toprule
\textbf{Model Entity} & \textbf{Foreign Keys / Links} & \textbf{Key Attributes \& Schema Purpose} \\
\midrule
\texttt{User} & \texttt{AbstractUser} & \texttt{username}, \texttt{email}, \texttt{reputation}, \texttt{is\_staff}, \texttt{bio}, \texttt{avatar\_url}. Handles authentication and gamification. \\
\texttt{Category} & Standalone & \texttt{name}, \texttt{description}, \texttt{icon\_slug}. Standardizes the 8 official subject curricular domains. \\
\texttt{PYQ} & FK $\rightarrow$ \texttt{Category} & \texttt{question\_text}, \texttt{option\_a}, \texttt{option\_b}, \texttt{option\_c}, \texttt{option\_d}, \texttt{correct\_option}, \texttt{answer\_text}, \texttt{year}, \texttt{is\_pyq}. Practice MCQ repository. \\
\texttt{Question} & FK $\rightarrow$ \texttt{User}, \texttt{Category} & \texttt{title}, \texttt{body}, \texttt{views}, \texttt{votes}, \texttt{video\_url}, \texttt{created\_at}. Community forum query threads. \\
\texttt{Answer} & FK $\rightarrow$ \texttt{Question}, \texttt{User} & \texttt{content}, \texttt{votes}, \texttt{is\_approved}, \texttt{created\_at}. Student and instructor peer solutions. \\
\texttt{Comment} & FK $\rightarrow$ \texttt{Answer}, \texttt{User} & \texttt{text}, \texttt{created\_at}. Micro-discussions attached to specific solutions. \\
\texttt{Quiz} & FK $\rightarrow$ \texttt{Category} & \texttt{title}, \texttt{description}, \texttt{created\_at}. Summative and diagnostic quiz containers. \\
\texttt{QuizQuestion} & FK $\rightarrow$ \texttt{Quiz} & \texttt{question\_text}, \texttt{explanation}. Individual quiz question items. \\
\texttt{QuizOption} & FK $\rightarrow$ \texttt{QuizQuestion} & \texttt{option\_text}, \texttt{is\_correct}. Selectable MCQ option records with correctness flags. \\
\texttt{Article} & FK $\rightarrow$ \texttt{Category} & \texttt{title}, \texttt{summary}, \texttt{content}, \texttt{created\_at}. Markdown theoretical guides with LaTeX math equations. \\
\texttt{Lecture} & FK $\rightarrow$ \texttt{Category} & \texttt{title}, \texttt{description}, \texttt{video\_url}, \texttt{order}. Sequenced video lecture units. \\
\texttt{Product} & FK $\rightarrow$ \texttt{Category} & \texttt{name}, \texttt{price}, \texttt{description}, \texttt{is\_active}. Digital learning materials and test series. \\
\texttt{Service} & FK $\rightarrow$ \texttt{Category} & \texttt{title}, \texttt{description}, \texttt{price}. Specialized 1-on-1 mentorship services. \\
\texttt{Inquiry} & Standalone & \texttt{name}, \texttt{email}, \texttt{message}, \texttt{created\_at}. User support queries from the About page. \\
\bottomrule
\end{tabularx}
\end{table}

\section{Content Management System (CMS) \& Administrative Capabilities}
NeuralSpark integrates an enterprise-grade Content Management System via Django Admin. Instructors and academic administrators can:
\begin{itemize}[leftmargin=*]
    \item Create, update, format, and delete practice questions, theory articles, and quizzes across all 8 subjects.
    \item Manage user accounts, moderate community forum threads, and approve student answers.
    \item Seed and reset curriculum datasets using built-in automation scripts.
\end{itemize}

\section{Formal Algorithmic Formulations}
The core operational logic of NeuralSpark is formalized in Algorithms \ref{alg:ch3_dual_grader}, \ref{alg:ch3_offline_launcher}, and \ref{alg:ch3_voice_pipeline}.

\begin{algorithm}[H]
\caption{Dual-Engine Automated Assignment Grading and Fallback Pipeline}
\label{alg:ch3_dual_grader}
\begin{algorithmic}[1]
\REQUIRE Student file submission $F$ or raw text $T$, Question prompt $Q$, Rubric criteria $R$, Network connectivity status $N$
\ENSURE Structured Evaluation Record $E = \{\text{score}, \text{max\_score}, \text{feedback}, \text{criteria\_breakdown}\}$
\IF{$F \neq \emptyset$ \AND $N == \text{ONLINE}$}
    \STATE $MIME \leftarrow \text{DetectMimeType}(F)$
    \IF{$MIME == \text{'application/pdf'}$}
        \STATE $T_{\text{pdf}} \leftarrow \text{ExtractTextPyPDF2}(F)$
        \STATE $Img_{\text{pages}} \leftarrow \text{RenderPDFPagesToImages}(F, \text{DPI}=300)$
    \ELSE
        \STATE $Img_{\text{pages}} \leftarrow [\text{ReadImageBytes}(F)]$
    \ENDIF
    \STATE $Payload \leftarrow \text{ConstructMultimodalJSON}(Q, R, T_{\text{pdf}}, Img_{\text{pages}})$
    \STATE $RawResponse \leftarrow \text{CallGroqVisionLLM}(Payload)$
    \STATE $E \leftarrow \text{ValidatePydanticSchema}(RawResponse)$
    \RETURN $E$
\ELSE
    \STATE $T_{\text{input}} \leftarrow \text{Coalesce}(T, \text{ExtractText}(F))$
    \STATE $Tokens \leftarrow \text{TokenizeConcatSequence}(Q, R, T_{\text{input}})$
    \STATE $Logits \leftarrow \text{TransformerClassifierForward}(Tokens)$
    \STATE $\hat{y} \leftarrow \arg\max(Logits)$
    \STATE $E \leftarrow \text{FormatLocalEvaluationReport}(\hat{y}, Q, R)$
    \RETURN $E$
\ENDIF
\end{algorithmic}
\end{algorithm}

\begin{algorithm}[H]
\caption{NeuralSpark Offline Execution and Environment Orchestration Pipeline}
\label{alg:ch3_offline_launcher}
\begin{algorithmic}[1]
\REQUIRE Root project directory path $P$
\ENSURE Active local Django API ($:8000$) and Next.js ($:3000$) server processes
\STATE $\text{SetCurrentWorkingDirectory}(P)$
\IF{\textbf{not} $\text{FileExists}(\text{"backend/venv/Scripts/python.exe"})$}
    \STATE $\text{ExecuteCommand}("python -m venv backend/venv")$
    \STATE $\text{ExecuteCommand}("pip install -r backend/requirements.txt")$
\ENDIF
\STATE $\text{ExecuteCommand}("python backend/manage.py migrate --noinput")$
\STATE $\text{ExecuteCommand}("python backend/scripts/create\_superuser.py")$
\IF{\textbf{not} $\text{DirectoryExists}(\text{"frontend/node\_modules"})$}
    \STATE $\text{ExecuteCommand}("cd frontend \&\& npm install")$
\ENDIF
\STATE $\text{SpawnProcess}("title Django\_API \&\& python backend/manage.py runserver 0.0.0.0:8000")$
\STATE $\text{Sleep}(3 \text{ seconds})$
\STATE $\text{SpawnProcess}("title NextJS\_Frontend \&\& cd frontend \&\& npm run dev")$
\STATE $\text{Sleep}(4 \text{ seconds})$
\STATE $\text{LaunchDefaultBrowser}("http://localhost:3000")$
\STATE $\text{DisplayInteractiveConsoleMenu}()$
\end{algorithmic}
\end{algorithm}

\begin{algorithm}[H]
\caption{Offline Speech Recognition and Neural Voice Tutoring Pipeline}
\label{alg:ch3_voice_pipeline}
\begin{algorithmic}[1]
\REQUIRE Audio stream buffer $A_{\text{mic}}$ from client microphone
\ENSURE Synthesized audio response stream $A_{\text{out}}$
\STATE $AudioFrames \leftarrow \text{ResamplePCM}(A_{\text{mic}}, \text{SampleRate}=16000\text{Hz})$
\STATE $RecognizedText \leftarrow \text{VoskKaldiDecoder}(AudioFrames)$
\STATE $IntentRecord \leftarrow \text{SemanticIntentParser}(RecognizedText)$
\STATE $ResponseText \leftarrow \text{QueryCurriculumDatabase}(IntentRecord)$
\STATE $A_{\text{out}} \leftarrow \text{PiperVITSNeuralSynthesizer}(ResponseText)$
\STATE $\text{StreamAudioToClientBrowser}(A_{\text{out}})$
\end{algorithmic}
\end{algorithm}
'''
    with open("ch3_methodology.tex", "w", encoding="utf-8") as f:
        f.write(ch3_content)
    print("Chapter 3 expanded successfully.")

if __name__ == "__main__":
    expand_ch3()
