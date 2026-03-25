"use client";

import { useState } from "react";
import api from "@/lib/api";

/**
 * AI Assignment Grader Page
 * 
 * Provides a UI for teachers/students to evaluate answers using an LLM.
 * Crucially handles multi-part form data (files + text) to support 
 * Multimodal Evaluation (PDFs and Images) alongside plain text.
 */
export default function AIGraderPage() {
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
            // FormData is required here to send binary files (Pdfs/Images) 
            // over HTTP natively to the Django API, rather than JSON.
            const formData = new FormData();
            formData.append("question", question);
            formData.append("rubric", rubric);
            formData.append("student_answer", studentAnswer);

            if (questionFile) formData.append("question_file", questionFile);
            if (rubricFile) formData.append("rubric_file", rubricFile);
            if (studentAnswerFile) formData.append("student_answer_file", studentAnswerFile);

            const { data } = await api.post("products/ai-grader/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setEvaluation(data.evaluation);
        } catch (error) {
            console.error(error);
            setEvaluation("An error occurred while grading. Please check the backend connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Assignment Grader</h1>
                <p className="text-gray-600">
                    Powered by Llama 3.1. Instantly evaluate student submissions against your rubric.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                        <textarea
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-24 mb-2 text-black"
                            placeholder="e.g. Explain how the Binary Search algorithm works..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                        <input
                            type="file"
                            accept=".pdf, image/*"
                            onChange={(e) => setQuestionFile(e.target.files?.[0] || null)}
                            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rubric</label>
                        <textarea
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-24 mb-2 text-black"
                            placeholder="e.g. 5 points for logic, 5 for time complexity..."
                            value={rubric}
                            onChange={(e) => setRubric(e.target.value)}
                        />
                        <input
                            type="file"
                            accept=".pdf, image/*"
                            onChange={(e) => setRubricFile(e.target.files?.[0] || null)}
                            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Student Answer</label>
                        <textarea
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-32 mb-2 text-black"
                            placeholder="Paste the student's submission here..."
                            value={studentAnswer}
                            onChange={(e) => setStudentAnswer(e.target.value)}
                        />
                        <input
                            type="file"
                            accept=".pdf, image/*"
                            onChange={(e) => setStudentAnswerFile(e.target.files?.[0] || null)}
                            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>

                    <button
                        onClick={handleGrade}
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-bold text-white transition-all ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 shadow-md"
                            }`}
                    >
                        {loading ? "Grading Submission..." : "Grade Submission"}
                    </button>
                </div>

                {/* Output Section */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        AI Evaluation
                        {loading && (
                            <span className="flex h-3 w-3 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                            </span>
                        )}
                    </h2>

                    <div className="bg-white p-4 rounded-lg border h-[min(100%,400px)] overflow-y-auto whitespace-pre-wrap">
                        {evaluation ? (
                            <div className="text-gray-800">{evaluation}</div>
                        ) : (
                            <div className="text-gray-400 text-center flex flex-col items-center justify-center h-full">
                                <p>Run the grader to see feedback here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
