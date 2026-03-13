"use client";

import { useEffect, useState, use } from "react";
import { formatDistanceToNow } from "date-fns";
import api from "@/lib/api";
import { ArrowUpCircle, MessageSquare } from "lucide-react";
import Link from 'next/link';

type Question = {
    id: number;
    title: string;
    body: string;
    views: number;
    votes: number;
    created_at: string;
    video_url?: string | null;
    is_video_approved: boolean;
    tags: { id: number; name: string }[];
    author: { id: number; username: string; reputation: number };
};

type Answer = {
    id: number;
    body: string;
    votes: number;
    is_approved: boolean;
    created_at: string;
    author: { id: number; username: string; reputation: number };
};

/**
 * Question Detail Page
 * 
 * Displays a single community question along with its answers.
 * Implements interactive features like upvoting/downvoting answers, handling 
 * complex state for submitting forms, and embedding third-party video players.
 */
export default function QuestionDetail({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap the dynamic Next.js route parameter to get the question ID
    const unwrappedParams = use(params);
    const q_id = unwrappedParams.id;

    // React State configurations
    const [question, setQuestion] = useState<Question | null>(null);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [loading, setLoading] = useState(true);
    const [answerBody, setAnswerBody] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Initial data fetch on component mount
    useEffect(() => {
        fetchData();
    }, [q_id]);

    const fetchData = async () => {
        try {
            const [qRes, aRes] = await Promise.all([
                api.get(`/questions/${q_id}`),
                api.get(`/questions/${q_id}/answers`),
            ]);
            setQuestion(qRes.data);
            setAnswers(aRes.data);
        } catch (error) {
            console.error("Failed to fetch:", error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handles the submission of a new answer.
     * Prevents default form reload, sends POST request to backend, 
     * and optimistically updates the local answers array.
     */
    const submitAnswer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!answerBody.trim()) return;

        setSubmitting(true);
        try {
            const { data } = await api.post(`/questions/${q_id}/answers`, { body: answerBody });
            setAnswers([data, ...answers]);
            setAnswerBody("");
        } catch (error) {
            console.error("Failed to submit answer:", error);
        } finally {
            setSubmitting(false);
        }
    };

    /**
     * Interactive Voting Logic.
     * Hits the backend upvote endpoint and instantly updates the UI state 
     * for snappy feedback without requiring a full page reload.
     */
    const handleUpvote = async (a_id: number) => {
        try {
            const { data } = await api.post(`/answers/${a_id}/upvote`);
            setAnswers(answers.map(ans => ans.id === a_id ? data : ans));
        } catch (error) {
            console.error("Failed to upvote:", error);
        }
    };

    const handleDownvote = async (a_id: number) => {
        try {
            const { data } = await api.post(`/answers/${a_id}/downvote`);
            setAnswers(answers.map(ans => ans.id === a_id ? data : ans));
        } catch (error) {
            console.error("Failed to downvote:", error);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!question) return <div className="p-8">Question not found.</div>;

    return (
        <div className="max-w-4xl space-y-8">
            {/* Question Header */}
            <div>
                <h1 className="text-3xl font-normal text-gray-900 mb-4">{question.title}</h1>
                <div className="flex gap-4 text-sm text-gray-500 border-b border-gray-200 pb-4">
                    <span>Asked <span className="text-gray-900">{formatDistanceToNow(new Date(question.created_at))} ago</span></span>
                    <span>Viewed <span className="text-gray-900">{question.views} times</span></span>
                </div>
            </div>

            {/* Question Body Area */}
            <div className="flex gap-6">
                {/* Votes */}
                <div className="flex flex-col items-center gap-2 text-gray-400">
                    <button className="hover:text-blue-600"><ArrowUpCircle className="w-8 h-8" /></button>
                    <span className="text-xl font-medium text-gray-900">{question.votes}</span>
                    <button className="hover:text-red-500"><ArrowUpCircle className="w-8 h-8 rotate-180" /></button>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-6">
                    <div className="prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {question.body}
                    </div>

                    <div className="flex gap-2">
                        {question.tags?.map((t) => (
                            <span key={t.id} className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-md">{t.name}</span>
                        ))}
                    </div>

                    <div className="flex justify-end">
                        <div className="bg-blue-50 p-4 rounded-md w-64 text-sm text-gray-600">
                            <div className="mb-1 text-gray-500">asked {formatDistanceToNow(new Date(question.created_at))} ago</div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-400 to-indigo-500 text-white flex items-center justify-center font-bold">
                                    {question.author?.username?.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-blue-600 hover:underline cursor-pointer">{question.author?.username}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Section */}
            {question.video_url && !question.is_video_approved && (
                <div className="pt-8 border-t border-gray-200 mt-8">
                    <h2 className="text-xl font-normal text-gray-900 mb-4">Video Explanation</h2>
                    <div className="bg-amber-50 text-amber-800 p-4 rounded-md text-sm border border-amber-200 flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        This video is currently pending moderator approval and is only visible to you.
                    </div>
                </div>
            )}
            {question.video_url && question.is_video_approved && (
                <div className="pt-8 border-t border-gray-200 mt-8">
                    <h2 className="text-xl font-normal text-gray-900 mb-4">Video Explanation</h2>
                    <div className="aspect-video w-full max-w-2xl bg-gray-900 rounded-lg overflow-hidden shadow-md">
                        {question.video_url.includes("youtube.com") || question.video_url.includes("youtu.be") ? (
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${question.video_url.includes('v=') ? question.video_url.split('v=')[1].split('&')[0] : question.video_url.split('/').pop()}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen>
                            </iframe>
                        ) : question.video_url.includes("vimeo.com") ? (
                            <iframe
                                className="w-full h-full"
                                src={`https://player.vimeo.com/video/${question.video_url.split('/').pop()}`}
                                frameBorder="0"
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen>
                            </iframe>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                <a href={question.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 flex flex-col items-center gap-2">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                    <span>Watch Video Externally</span>
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Answers Section */}
            <div className="pt-8 border-t border-gray-200 mt-8">
                <h2 className="text-xl font-normal text-gray-900 mb-6">{answers.length} Answers</h2>

                <div className="space-y-8">
                    {answers.map(ans => (
                        <div key={ans.id} className="flex gap-6 border-b border-gray-200 pb-8">
                            <div className="flex flex-col items-center gap-2 text-gray-400">
                                <button onClick={() => handleUpvote(ans.id)} className="hover:text-blue-600 transition-colors"><ArrowUpCircle className="w-8 h-8" /></button>
                                <span className={`text-xl font-medium ${ans.votes > 0 ? 'text-green-600' : ans.votes < 0 ? 'text-red-600' : 'text-gray-900'}`}>{ans.votes}</span>
                                <button onClick={() => handleDownvote(ans.id)} className="hover:text-red-500 transition-colors"><ArrowUpCircle className="w-8 h-8 rotate-180" /></button>
                            </div>
                            <div className="flex-1 space-y-6">
                                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {ans.body}
                                </div>

                                {!ans.is_approved && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        Pending Moderator Approval
                                    </div>
                                )}

                                <div className="flex justify-end">
                                    <div className="bg-gray-50 p-4 rounded-md w-64 text-sm text-gray-600">
                                        <div className="mb-1 text-gray-500">answered {formatDistanceToNow(new Date(ans.created_at))} ago</div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-blue-600 hover:underline cursor-pointer">{ans.author?.username}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Your Answer */}
            <div className="pt-8">
                <h2 className="text-xl font-normal text-gray-900 mb-4">Your Answer</h2>
                <form onSubmit={submitAnswer} className="space-y-4">
                    <textarea
                        value={answerBody}
                        onChange={(e) => setAnswerBody(e.target.value)}
                        className="w-full h-48 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-y"
                        placeholder="Write your detailed answer here..."
                        required
                    />
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 font-medium disabled:opacity-50"
                    >
                        {submitting ? 'Submitting...' : 'Post Your Answer'}
                    </button>
                </form>
            </div>

        </div>
    );
}
