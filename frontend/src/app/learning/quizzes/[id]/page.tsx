"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, ChevronRight, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Option = {
    id: number;
    option_text: string;
};

type Question = {
    id: number;
    question_text: string;
    options: Option[];
};

type Quiz = {
    id: number;
    title: string;
    description: string;
    category: { id: number; name: string };
    questions: Question[];
};

type QuestionResult = {
    question_id: number;
    correct_option_id: number;
    is_correct: bool;
    explanation: string;
};

type QuizSubmissionResponse = {
    quiz_id: number;
    score: number;
    total_questions: number;
    results: QuestionResult[];
};

export default function QuizPlayPage() {
    const params = useParams();
    const router = useRouter();
    const quizId = params.id;

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    
    // Submission results
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<QuizSubmissionResponse | null>(null);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (quizId) {
            fetchQuiz();
        }
    }, [quizId]);

    const fetchQuiz = async () => {
        try {
            const { data } = await api.get(`/quizzes/${quizId}/`);
            setQuiz(data);
        } catch (error) {
            console.error("Failed to fetch quiz:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (questionId: number, optionId: number) => {
        if (submitted) return; // Disable changes after submission
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionId
        }));
    };

    const handleSubmitQuiz = async () => {
        if (!quiz) return;
        setSubmitting(true);
        try {
            const payload = {
                answers: quiz.questions.map(q => ({
                    question_id: q.id,
                    selected_option_id: answers[q.id] || -1
                }))
            };
            const { data } = await api.post(`/quizzes/${quizId}/submit/`, payload);
            setResult(data);
            setSubmitted(true);
        } catch (error) {
            console.error("Failed to submit quiz:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleRetakeQuiz = () => {
        setAnswers({});
        setCurrentQuestionIndex(0);
        setResult(null);
        setSubmitted(false);
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-[65vh] gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-100 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-gray-500 font-medium">Loading practice questions...</p>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="flex flex-col items-center justify-center h-[65vh] text-center px-4">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Quiz not found</h2>
                <p className="text-gray-500 mb-6">We couldn't retrieve details for this quiz.</p>
                <button 
                    onClick={() => router.push("/learning/quizzes")}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl"
                >
                    Back to Quizzes
                </button>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const progressPercentage = quiz.questions.length > 0 
        ? ((currentQuestionIndex + 1) / quiz.questions.length) * 100 
        : 0;

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 px-4 py-12 transition-colors duration-300">
            <div className="max-w-3xl mx-auto">
                
                {/* Back Button */}
                <button
                    onClick={() => router.push("/learning/quizzes")}
                    className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to List
                </button>

                {!submitted ? (
                    /* QUIZ INTERACTIVE VIEW */
                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-xl">
                        
                        {/* Header Details */}
                        <div className="mb-6">
                            <span className="inline-block px-3 py-1 text-xs font-bold rounded-lg mb-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                {quiz.category.name}
                            </span>
                            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
                                {quiz.title}
                            </h1>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-8">
                            <div className="flex justify-between text-sm font-semibold text-gray-500 mb-2">
                                <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                                <span>{Math.round(progressPercentage)}% Complete</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                                <motion.div 
                                    className="bg-blue-600 h-full rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercentage}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        </div>

                        {/* Active Question Panel */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQuestion.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="mb-8"
                            >
                                <h2 className="text-xl md:text-2xl font-bold text-gray-850 dark:text-white mb-6 leading-snug">
                                    {currentQuestion.question_text}
                                </h2>

                                <div className="space-y-4">
                                    {currentQuestion.options.map((opt) => {
                                        const isSelected = answers[currentQuestion.id] === opt.id;
                                        return (
                                            <button
                                                key={opt.id}
                                                onClick={() => handleOptionSelect(currentQuestion.id, opt.id)}
                                                className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center justify-between font-medium group hover:-translate-y-0.5 ${
                                                    isSelected
                                                        ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 shadow-md"
                                                        : "border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-800 bg-gray-50/30 dark:bg-gray-900/40 text-gray-700 dark:text-gray-300"
                                                }`}
                                            >
                                                <span>{opt.option_text}</span>
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                                                    isSelected
                                                        ? "border-blue-600 bg-blue-600 text-white"
                                                        : "border-gray-300 dark:border-gray-600"
                                                }`}>
                                                    {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Panel */}
                        <div className="flex justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                            <button
                                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentQuestionIndex === 0}
                                className="px-5 py-3 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 rounded-xl transition-all"
                            >
                                Previous
                            </button>

                            {currentQuestionIndex < quiz.questions.length - 1 ? (
                                <button
                                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                    className="px-6 py-3 bg-gray-950 dark:bg-gray-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-white font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                                >
                                    Next <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmitQuiz}
                                    disabled={submitting}
                                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-blue-500/10 disabled:opacity-50"
                                >
                                    {submitting ? "Grading..." : "Submit Answers"}
                                </button>
                            )}
                        </div>

                    </div>
                ) : (
                    /* QUIZ EVALUATION RESULTS VIEW */
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8"
                    >
                        {/* Score Card */}
                        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-xl text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2.5 bg-blue-600" />
                            
                            <Award className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Quiz Complete!</h2>
                            <p className="text-gray-500 mb-6">Subject: {quiz.category.name}</p>

                            <div className="inline-flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-950/20 px-8 py-6 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                                <span className="text-5xl font-black text-blue-600 dark:text-blue-400">
                                    {result?.score} / {result?.total_questions}
                                </span>
                                <span className="text-sm font-bold text-blue-500 dark:text-blue-500 mt-1 uppercase tracking-wider">
                                    Final Score ({result && Math.round((result.score / result.total_questions) * 100)}%)
                                </span>
                            </div>

                            <div className="mt-8 flex justify-center gap-4">
                                <button
                                    onClick={handleRetakeQuiz}
                                    className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-bold rounded-xl flex items-center gap-1.5 transition-all"
                                >
                                    <RefreshCw className="w-4 h-4" /> Retake Quiz
                                </button>
                                <button
                                    onClick={() => router.push("/learning/quizzes")}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md transition-all"
                                >
                                    More Quizzes
                                </button>
                            </div>
                        </div>

                        {/* Questions Explanations List */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Review Explanations</h3>
                            {quiz.questions.map((q, idx) => {
                                const questionRes = result?.results.find(r => r.question_id === q.id);
                                const isCorrect = questionRes?.is_correct;
                                const correctOptId = questionRes?.correct_option_id;
                                const selectedOptId = answers[q.id];

                                return (
                                    <div 
                                        key={q.id}
                                        className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-md"
                                    >
                                        <div className="flex gap-3 items-start mb-4">
                                            <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-sm ${
                                                isCorrect
                                                    ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                                                    : "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                                            }`}>
                                                {idx + 1}
                                            </div>
                                            <h4 className="text-lg font-bold text-gray-900 dark:text-white pt-0.5">
                                                {q.question_text}
                                            </h4>
                                        </div>

                                        <div className="space-y-3 mb-5 pl-11">
                                            {q.options.map(opt => {
                                                const isSelected = selectedOptId === opt.id;
                                                const isCorrectOpt = correctOptId === opt.id;

                                                let cardStyles = "border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-400 bg-gray-50/20 dark:bg-gray-900/20";
                                                if (isSelected) {
                                                    cardStyles = isCorrect 
                                                        ? "border-green-600 bg-green-50/30 dark:bg-green-950/15 text-green-700 dark:text-green-400 font-bold" 
                                                        : "border-red-600 bg-red-50/30 dark:bg-red-950/15 text-red-700 dark:text-red-400 font-bold";
                                                } else if (isCorrectOpt) {
                                                    cardStyles = "border-green-600 bg-green-50/20 dark:bg-green-950/10 text-green-700 dark:text-green-400 font-medium";
                                                }

                                                return (
                                                    <div 
                                                        key={opt.id}
                                                        className={`p-4 rounded-xl border flex items-center justify-between text-sm ${cardStyles}`}
                                                    >
                                                        <span>{opt.option_text}</span>
                                                        {isCorrectOpt && <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500" />}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Concept Explanation Box */}
                                        {questionRes?.explanation && (
                                            <div className="ml-11 p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100/60 dark:border-blue-900/20">
                                                <h5 className="text-sm font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wider mb-2">
                                                    Key Concept Explanation
                                                </h5>
                                                <p className="text-sm text-gray-650 dark:text-gray-300 leading-relaxed">
                                                    {questionRes.explanation}
                                                </p>
                                            </div>
                                        )}

                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

            </div>
        </div>
    );
}
