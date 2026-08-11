"use client";

import { useEffect, useState, use } from "react";
import { formatDistanceToNow } from "date-fns";
import api from "@/lib/api";
import { 
    BookOpen, Calendar, Tag, ArrowLeft, PlayCircle, FileText, 
    MessageSquare, Send, ArrowUpCircle, Award, CheckCircle, 
    AlertCircle, MessageCircle 
} from "lucide-react";
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";

type Category = {
    id: number;
    name: string;
};

type User = {
    id: number;
    username: string;
    reputation: number;
};

type PYQ = {
    id: number;
    year?: number | null;
    question_text: string;
    option_a?: string | null;
    option_b?: string | null;
    option_c?: string | null;
    option_d?: string | null;
    correct_option?: string | null;
    answer_text: string;
    video_url?: string | null;
    created_at: string;
    subject: Category;
};

type Answer = {
    id: number;
    body: string;
    votes: number;
    is_approved: boolean;
    created_at: string;
    author: User;
};

type Comment = {
    id: number;
    body: string;
    created_at: string;
    author: User;
};

export default function PYQDiscussionForum({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const pyqId = unwrappedParams.id;

    // Component State
    const [pyq, setPyq] = useState<PYQ | null>(null);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    // Form inputs State
    const [newAnswer, setNewAnswer] = useState("");
    const [newComment, setNewComment] = useState("");
    const [submittingAnswer, setSubmittingAnswer] = useState(false);
    const [submittingComment, setSubmittingComment] = useState(false);
    const [showComments, setShowComments] = useState(false);

    // Interactive MCQ State
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [showSolution, setShowSolution] = useState<boolean>(false);

    useEffect(() => {
        if (pyqId) {
            fetchPYQData();
        }
    }, [pyqId]);

    const fetchPYQData = async () => {
        try {
            const pyqRes = await api.get(`pyqs/${pyqId}/`);
            setPyq(pyqRes.data);

            try {
                const [answersRes, commentsRes] = await Promise.all([
                    api.get(`pyqs/${pyqId}/answers/`),
                    api.get(`pyqs/${pyqId}/comments/`)
                ]);
                setAnswers(answersRes.data || []);
                setComments(commentsRes.data || []);
            } catch (subErr) {
                console.warn("Could not load community answers/comments:", subErr);
            }
        } catch (error) {
            console.error("Failed to fetch PYQ data (question may not exist):", error);
            setPyq(null);
        } finally {
            setLoading(false);
        }
    };

    // Submitting a new explanation/answer
    const handlePostAnswer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAnswer.trim()) return;

        setSubmittingAnswer(true);
        try {
            const { data } = await api.post(`pyqs/${pyqId}/answers/`, { body: newAnswer });
            // Since new answers require moderation, show an alert/toast indicator
            alert("Your explanation has been posted successfully! It will appear publicly once approved by moderators.");
            setNewAnswer("");
        } catch (error) {
            console.error("Failed to submit answer:", error);
        } finally {
            setSubmittingAnswer(false);
        }
    };

    // Submitting a comment on the question
    const handlePostComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmittingComment(true);
        try {
            const { data } = await api.post(`pyqs/${pyqId}/comments/`, { body: newComment });
            setComments(prev => [...prev, data]);
            setNewComment("");
        } catch (error) {
            console.error("Failed to submit comment:", error);
        } finally {
            setSubmittingComment(false);
        }
    };

    // Upvote and Downvote on community answers
    const handleUpvoteAnswer = async (answerId: number) => {
        try {
            const { data } = await api.post(`answers/${answerId}/upvote/`);
            setAnswers(prev => prev.map(ans => ans.id === answerId ? { ...ans, votes: data.votes } : ans));
        } catch (error) {
            console.error("Failed to upvote answer:", error);
        }
    };

    const handleDownvoteAnswer = async (answerId: number) => {
        try {
            const { data } = await api.post(`answers/${answerId}/downvote/`);
            setAnswers(prev => prev.map(ans => ans.id === answerId ? { ...ans, votes: data.votes } : ans));
        } catch (error) {
            console.error("Failed to downvote answer:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!pyq) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Question not found</h1>
                <Link href="/learning/pyqs" className="text-blue-600 hover:underline">
                    Back to all questions
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 px-4 py-12 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                
                {/* Back Button */}
                <Link 
                    href="/learning/pyqs" 
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors group text-sm font-semibold"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Practice Questions
                </Link>

                {/* Question Details Card */}
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-xl mb-8">
                    {/* Header Tags */}
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold uppercase tracking-wider">
                            <Tag className="w-3.5 h-3.5" />
                            {pyq.subject.name}
                        </span>
                        <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-xs font-bold uppercase tracking-wider">
                            <Calendar className="w-3.5 h-3.5" />
                            GATE {pyq.year}
                        </span>
                    </div>

                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                        {pyq.subject.name} - Question {pyq.id}
                    </h1>

                    {/* Question Statement */}
                    <div className="mb-6">
                        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                            <FileText className="w-4 h-4" /> Question Statement
                        </h3>
                        <div className="text-gray-850 dark:text-gray-200 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                            {pyq.question_text}
                        </div>
                    </div>

                    {/* Interactive Multiple Choice Options (MCQ) */}
                    {(pyq.option_a || pyq.option_b || pyq.option_c || pyq.option_d) && (
                        <div className="mb-8 p-6 rounded-2xl bg-gray-50/70 dark:bg-gray-950/60 border border-gray-200 dark:border-gray-800 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Multiple Choice Options (Select One Answer)
                                </h3>
                                {isSubmitted && (
                                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                                        Answer Submitted
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    { key: "A", label: pyq.option_a },
                                    { key: "B", label: pyq.option_b },
                                    { key: "C", label: pyq.option_c },
                                    { key: "D", label: pyq.option_d },
                                ].filter(opt => opt.label).map((opt) => {
                                    const isSelected = selectedOption === opt.key;
                                    const isCorrect = (pyq.correct_option || "").toUpperCase() === opt.key;

                                    let cardStyle = "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white hover:border-blue-400";
                                    
                                    if (isSubmitted) {
                                        if (isCorrect) {
                                            cardStyle = "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/20";
                                        } else if (isSelected && !isCorrect) {
                                            cardStyle = "bg-rose-50 dark:bg-rose-950/30 border-rose-500 text-rose-900 dark:text-rose-300";
                                        } else {
                                            cardStyle = "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 opacity-60";
                                        }
                                    } else if (isSelected) {
                                        cardStyle = "bg-blue-50/80 dark:bg-blue-950/40 border-blue-600 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20";
                                    }

                                    return (
                                        <button
                                            key={opt.key}
                                            disabled={isSubmitted}
                                            onClick={() => setSelectedOption(opt.key)}
                                            className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${cardStyle}`}
                                        >
                                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-xs shrink-0 ${
                                                isSelected || (isSubmitted && isCorrect) 
                                                    ? "bg-blue-600 text-white" 
                                                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                                            }`}>
                                                {opt.key}
                                            </span>
                                            <span className="text-sm font-semibold leading-relaxed pt-0.5">
                                                {opt.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Submit & Result Feedback */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                                {!isSubmitted ? (
                                    <button
                                        disabled={!selectedOption}
                                        onClick={() => {
                                            setIsSubmitted(true);
                                            setShowSolution(true);
                                        }}
                                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                                    >
                                        Check Answer
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-3 w-full justify-between">
                                        <div className="flex items-center gap-2">
                                            {selectedOption === (pyq.correct_option || "").toUpperCase() ? (
                                                <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-sm bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                                                    <CheckCircle className="w-5 h-5" /> Correct Answer! Great Job 🎉
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-rose-600 font-extrabold text-sm bg-rose-50 dark:bg-rose-950/30 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-800">
                                                    <AlertCircle className="w-5 h-5" /> Incorrect! Correct Option is ({pyq.correct_option})
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => {
                                                setIsSubmitted(false);
                                                setSelectedOption(null);
                                            }}
                                            className="text-xs font-bold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 underline"
                                        >
                                            Reset Selection
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Official Solution */}
                    <div className="p-6 rounded-2xl bg-green-50/40 dark:bg-green-950/10 border border-green-100/60 dark:border-green-900/20 mb-6">
                        <h3 className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4" /> Official Solution & Explanation
                        </h3>
                        <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-sm font-medium">
                            {pyq.answer_text || "Detailed step-by-step solution is provided by NeuralSpark educators."}
                        </div>
                    </div>

                    {/* Video explanation */}
                    {pyq.video_url && (
                        <div className="mb-6">
                            <h3 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                <PlayCircle className="w-4 h-4" /> Video Walkthrough
                            </h3>
                            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-md bg-black border border-gray-100 dark:border-gray-800">
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${pyq.video_url.includes('v=') ? pyq.video_url.split('v=')[1].split('&')[0] : pyq.video_url.split('/').pop()}`}
                                    title="Explanation video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen>
                                </iframe>
                            </div>
                        </div>
                    )}

                    {/* Question Comments Button Toggle */}
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        <button 
                            onClick={() => setShowComments(!showComments)}
                            className="text-sm font-bold text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 transition-colors"
                        >
                            <MessageSquare className="w-4 h-4" />
                            {showComments ? "Hide Comments" : `Show Comments (${comments.length})`}
                        </button>
                    </div>

                    {/* Question Comments Section */}
                    <AnimatePresence>
                        {showComments && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-6 space-y-4 overflow-hidden"
                            >
                                <div className="space-y-3 bg-gray-50/50 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                                    {comments.length === 0 ? (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">No comments on this question yet. Be the first!</p>
                                    ) : (
                                        comments.map(c => (
                                            <div key={c.id} className="text-sm border-b border-gray-100 dark:border-gray-800 last:border-0 pb-3 last:pb-0">
                                                <div className="flex justify-between items-center mb-1 text-gray-400">
                                                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                                                        {c.author.username} <span className="text-xs text-gray-500 dark:text-gray-500">(Rep: {c.author.reputation})</span>
                                                    </span>
                                                    <span className="text-xs">{formatDistanceToNow(new Date(c.created_at))} ago</span>
                                                </div>
                                                <p className="text-gray-700 dark:text-gray-300">{c.body}</p>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <form onSubmit={handlePostComment} className="flex gap-2">
                                    <input 
                                        type="text"
                                        placeholder="Add a comment to the question..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 text-sm border border-gray-250 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all outline-none"
                                        required
                                    />
                                    <button 
                                        type="submit"
                                        disabled={submittingComment}
                                        className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl transition-all shadow-md shadow-blue-500/10"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Community Answers & Explanations Portal */}
                <div className="space-y-6 mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <MessageCircle className="w-6 h-6 text-purple-500" />
                        Community Explanations ({answers.length})
                    </h2>

                    {answers.length === 0 ? (
                        <div className="text-center py-10 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl text-gray-500">
                            No community solutions posted yet. Share your alternative explanation below!
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {answers.map(ans => (
                                <div 
                                    key={ans.id} 
                                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-md flex gap-4 md:gap-6"
                                >
                                    {/* Voting Pillar */}
                                    <div className="flex flex-col items-center gap-2 text-gray-400 shrink-0">
                                        <button 
                                            onClick={() => handleUpvoteAnswer(ans.id)}
                                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        >
                                            <ArrowUpCircle className="w-7 h-7" />
                                        </button>
                                        <span className={`text-lg font-bold ${
                                            ans.votes > 0 
                                                ? "text-green-600 dark:text-green-400" 
                                                : ans.votes < 0 
                                                    ? "text-red-600 dark:text-red-400" 
                                                    : "text-gray-900 dark:text-white"
                                        }`}>
                                            {ans.votes}
                                        </span>
                                        <button 
                                            onClick={() => handleDownvoteAnswer(ans.id)}
                                            className="hover:text-red-500 dark:hover:text-red-400 transition-colors rotate-180"
                                        >
                                            <ArrowUpCircle className="w-7 h-7" />
                                        </button>
                                    </div>

                                    {/* Explanation Content */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap mb-4">
                                            {ans.body}
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-bold text-gray-900 dark:text-white">{ans.author.username}</span>
                                                <span>(Reputation: {ans.author.reputation})</span>
                                            </div>
                                            <span>answered {formatDistanceToNow(new Date(ans.created_at))} ago</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submitting a New Answer Form */}
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-xl">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
                        <Award className="w-5 h-5 text-blue-500" /> Share Your Explanation
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Provide your detailed step-by-step reasoning, mathematical proof, or alternative approach to help other students.
                    </p>

                    <form onSubmit={handlePostAnswer} className="space-y-4">
                        <textarea
                            value={newAnswer}
                            onChange={(e) => setNewAnswer(e.target.value)}
                            className="w-full h-44 p-4 border border-gray-250 dark:border-gray-750 bg-gray-50/40 dark:bg-gray-900/40 focus:bg-white dark:focus:bg-gray-900 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-y text-gray-900 dark:text-white transition-all font-medium"
                            placeholder="Write your explanation statement here..."
                            required
                        />
                        <button
                            type="submit"
                            disabled={submittingAnswer}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-1.5"
                        >
                            {submittingAnswer ? "Posting..." : "Post Solution"}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}
