"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import api from "@/lib/api";
import { MessageSquare, Eye, ArrowUpCircle } from "lucide-react";

type Question = {
    id: number;
    title: string;
    body: string;
    views: number;
    votes: number;
    created_at: string;
    tags: { id: number; name: string }[];
    author: { id: number; username: string; reputation: number };
};

export default function QuestionsFeed() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const { data } = await api.get("/questions");
            setQuestions(data);
        } catch (error) {
            console.error("Failed to fetch questions:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-3 space-y-6">
                <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                    <h1 className="text-2xl font-bold text-gray-900">Community Q&A</h1>
                    <div className="flex gap-2 items-center">
                        <Link href="/ask" className="mr-2 px-4 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-md shadow hover:bg-blue-500 transition-colors">
                            Ask Question
                        </Link>
                        <button className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md font-medium text-gray-700">Newest</button>
                        <button className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-md font-medium">Active</button>
                        <button className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md font-medium text-gray-700">Unanswered</button>
                    </div>
                </div>

                <div className="space-y-4">
                    {questions.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-500">
                            No questions found. Be the first to ask!
                        </div>
                    ) : (
                        questions.map((q) => (
                            <div key={q.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 transition-colors">
                                <div className="flex gap-6">
                                    {/* Stats Sidebar */}
                                    <div className="flex flex-col items-end gap-3 text-sm flex-shrink-0 w-24">
                                        <div className="flex items-center gap-1 font-medium text-gray-900">
                                            <span>{q.votes}</span>
                                            <ArrowUpCircle className="w-4 h-4 text-gray-500" />
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-500">
                                            <span>0</span>
                                            <MessageSquare className="w-4 h-4" />
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-500">
                                            <span>{q.views}</span>
                                            <Eye className="w-4 h-4" />
                                        </div>
                                    </div>

                                    {/* Question Content */}
                                    <div className="flex-1 min-w-0 flex flex-col">
                                        <Link href={`/question/${q.id}`} className="text-lg font-medium text-blue-600 hover:text-blue-800 hover:underline line-clamp-2 mb-2">
                                            {q.title}
                                        </Link>
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                            {q.body}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between">
                                            {/* Tags */}
                                            <div className="flex gap-2 flex-wrap">
                                                {q.tags?.map((tag) => (
                                                    <span key={tag.id} className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 cursor-pointer">
                                                        {tag.name}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Author */}
                                            <div className="flex items-center gap-2 text-xs">
                                                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-400 to-indigo-500 text-white flex items-center justify-center font-bold">
                                                    {q.author?.username?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-blue-600 hover:underline cursor-pointer">{q.author?.username || 'Unknown'}</span>
                                                    <span className="text-gray-500">
                                                        asked {formatDistanceToNow(new Date(q.created_at), { addSuffix: true })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="hidden lg:block space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
                    <div className="p-4 border-b border-yellow-200 font-bold text-yellow-800 text-sm uppercase tracking-wider">
                        NeuralSpark Guidelines
                    </div>
                    <ul className="p-4 space-y-3 text-sm text-yellow-900">
                        <li className="flex items-start gap-2">
                            <span className="text-yellow-600 mt-0.5">•</span>
                            <span>Be respectful to all members.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-yellow-600 mt-0.5">•</span>
                            <span>Search for existing questions before asking.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
