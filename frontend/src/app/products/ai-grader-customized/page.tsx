"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Cpu, FileUp, CheckCircle, RefreshCw, Sparkles } from "lucide-react";

/**
 * Customized AI Assignment Grader Page (Local Fine-Tuned Offline AI Engine)
 */
export default function AICustomGraderPage() {
    const [question, setQuestion] = useState("");
    const [questionFile, setQuestionFile] = useState<File | null>(null);
    const [rubric, setRubric] = useState("");
    const [rubricFile, setRubricFile] = useState<File | null>(null);
    const [studentAnswer, setStudentAnswer] = useState("");
    const [studentAnswerFile, setStudentAnswerFile] = useState<File | null>(null);
    const [evaluation, setEvaluation] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGrade = async () => {
        if ((!question && !questionFile) || (!rubric && !rubricFile) || (!studentAnswer && !studentAnswerFile)) {
            alert("Please provide text or attach a file for all fields.");
            return;
        }

        setLoading(true);
        setEvaluation("");

        try {
            const formData = new FormData();
            formData.append("question", question);
            formData.append("rubric", rubric);
            formData.append("student_answer", studentAnswer);

            if (questionFile) formData.append("question_file", questionFile);
            if (rubricFile) formData.append("rubric_file", rubricFile);
            if (studentAnswerFile) formData.append("student_answer_file", studentAnswerFile);

            const { data } = await api.post("products/ai-grader-customized/", formData);
            const raw = data.evaluation || "";
            const cleaned = raw
                .replace(/<think>[\s\S]*?<\/think>/gi, "")
                .replace(/<\/?think>/gi, "")
                .replace(/\\lambda_(\d+)/g, "lambda_$1")
                .replace(/\\lambda/g, "lambda")
                .replace(/\\Theta/g, "Theta")
                .replace(/\\Omega/g, "Omega")
                .replace(/\\hat\s*y|\\hat\{y\}/g, "y_hat")
                .replace(/\\sigma/g, "sigma")
                .replace(/\\in/g, "in")
                .replace(/\\cdot|\\times/g, "*")
                .replace(/\\text\{([^}]+)\}/g, "$1")
                .replace(/\\mathbf\{([^}]+)\}/g, "$1")
                .replace(/\\mathit\{([^}]+)\}/g, "$1")
                .replace(/\$\$?/g, "")
                .replace(/\\\(|\\\)|\\\[|\\\]/g, "")
                .trim();
            setEvaluation(cleaned);
        } catch (error: any) {
            console.error("Custom Grader Error:", error);
            const serverMsg = error.response?.data?.error || error.response?.data?.message || error.message;
            setEvaluation(`An error occurred while grading: ${serverMsg}. Please ensure the backend server is running.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            {/* Header with High-Contrast Crisp Typography */}
            <div className="mb-10 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
                    <Cpu className="w-3.5 h-3.5" />
                    Offline Local Fine-Tuned Transformer Engine
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
                    Customized AI <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Grader</span>
                </h1>
                <p className="text-base md:text-lg text-slate-300 max-w-2xl">
                    Powered by your custom locally fine-tuned RoBERTa transformer running at sub-120ms latency with zero cloud API dependencies.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Input Form Column */}
                <div className="lg:col-span-6 space-y-6 bg-slate-900/90 p-6 md:p-8 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-sm">
                    {/* 1. Question Field */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-bold text-slate-100 flex items-center gap-2">
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-bold">1</span>
                                Question Statement
                            </label>
                            {questionFile && (
                                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> {questionFile.name}
                                </span>
                            )}
                        </div>
                        <textarea
                            className="w-full p-3.5 bg-slate-950/80 border border-slate-700/80 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none h-24 mb-2.5 text-slate-100 placeholder-slate-500 text-sm transition-all"
                            placeholder="e.g. What is the time complexity of MergeSort?..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                        <div className="flex items-center gap-3">
                            <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors">
                                <FileUp className="w-3.5 h-3.5 text-emerald-400" />
                                {questionFile ? "Replace Question File" : "Attach Question File"}
                                <input
                                    type="file"
                                    accept=".pdf, image/*"
                                    onChange={(e) => setQuestionFile(e.target.files?.[0] || null)}
                                    className="hidden"
                                />
                            </label>
                            {questionFile && (
                                <button
                                    onClick={() => setQuestionFile(null)}
                                    className="text-xs text-rose-400 hover:text-rose-300 underline"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>

                    {/* 2. Rubric Field */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-bold text-slate-100 flex items-center gap-2">
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-bold">2</span>
                                Official Grading Rubric
                            </label>
                            {rubricFile && (
                                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> {rubricFile.name}
                                </span>
                            )}
                        </div>
                        <textarea
                            className="w-full p-3.5 bg-slate-950/80 border border-slate-700/80 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none h-24 mb-2.5 text-slate-100 placeholder-slate-500 text-sm transition-all"
                            placeholder="e.g. 5 points for stating O(n log n) and divide-and-conquer steps..."
                            value={rubric}
                            onChange={(e) => setRubric(e.target.value)}
                        />
                        <div className="flex items-center gap-3">
                            <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors">
                                <FileUp className="w-3.5 h-3.5 text-emerald-400" />
                                {rubricFile ? "Replace Rubric File" : "Attach Rubric File"}
                                <input
                                    type="file"
                                    accept=".pdf, image/*"
                                    onChange={(e) => setRubricFile(e.target.files?.[0] || null)}
                                    className="hidden"
                                />
                            </label>
                            {rubricFile && (
                                <button
                                    onClick={() => setRubricFile(null)}
                                    className="text-xs text-rose-400 hover:text-rose-300 underline"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>

                    {/* 3. Student Answer Field */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-bold text-slate-100 flex items-center gap-2">
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-bold">3</span>
                                Student Submission
                            </label>
                            {studentAnswerFile && (
                                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> {studentAnswerFile.name}
                                </span>
                            )}
                        </div>
                        <textarea
                            className="w-full p-3.5 bg-slate-950/80 border border-slate-700/80 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none h-28 mb-2.5 text-slate-100 placeholder-slate-500 text-sm transition-all"
                            placeholder="Paste student answer text or attach submission document..."
                            value={studentAnswer}
                            onChange={(e) => setStudentAnswer(e.target.value)}
                        />
                        <div className="flex items-center gap-3">
                            <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-all">
                                <FileUp className="w-4 h-4 text-emerald-400" />
                                {studentAnswerFile ? "Replace Student Document" : "Upload Student Document"}
                                <input
                                    type="file"
                                    accept=".pdf, image/*"
                                    onChange={(e) => setStudentAnswerFile(e.target.files?.[0] || null)}
                                    className="hidden"
                                />
                            </label>
                            {studentAnswerFile && (
                                <button
                                    onClick={() => setStudentAnswerFile(null)}
                                    className="text-xs text-rose-400 hover:text-rose-300 underline"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleGrade}
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-bold text-white text-base transition-all shadow-lg flex items-center justify-center gap-2 ${loading 
                            ? "bg-emerald-600/50 cursor-not-allowed opacity-80" 
                            : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/25 active:scale-[0.99]"
                        }`}
                    >
                        {loading ? (
                            <>
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                Inferencing on Local Transformer...
                            </>
                        ) : (
                            <>
                                <Cpu className="w-5 h-5 text-emerald-300" />
                                Evaluate with Local Custom AI
                            </>
                        )}
                    </button>
                </div>

                {/* Output Section Column */}
                <div className="lg:col-span-6 bg-slate-900/90 p-6 md:p-8 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-sm sticky top-24">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                            <Cpu className="w-5 h-5 text-emerald-400" />
                            Local AI Score & Feedback
                        </h2>
                        {loading && (
                            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                                Inferencing on CPU...
                            </span>
                        )}
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 min-h-[380px] max-h-[540px] overflow-y-auto whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed text-slate-100">
                        {evaluation ? (
                            <div className="space-y-3">
                                {evaluation}
                            </div>
                        ) : (
                            <div className="text-slate-500 text-center flex flex-col items-center justify-center h-[340px] space-y-3">
                                <Cpu className="w-12 h-12 text-slate-700" />
                                <p className="font-medium text-slate-400">Ready for local offline inference.</p>
                                <p className="text-xs text-slate-600 max-w-xs">
                                    Provide question, rubric, and student answer to evaluate using the local PyTorch model.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
