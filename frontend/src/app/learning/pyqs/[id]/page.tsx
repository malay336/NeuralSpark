"use client";

import { useEffect, useState, use } from "react";
import { formatDistanceToNow } from "date-fns";
import api from "@/lib/api";
import { BookOpen, Calendar, Tag, ArrowLeft, PlayCircle, FileText } from "lucide-react";
import Link from 'next/link';

type PYQ = {
    id: number;
    year: number;
    question_text: string;
    answer_text: string;
    video_url?: string | null;
    created_at: string;
    subject: { id: number; name: string };
};

export default function PYQDetail({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const pyq_id = unwrappedParams.id;

    const [pyq, setPyq] = useState<PYQ | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [pyq_id]);

    const fetchData = async () => {
        try {
            const { data } = await api.get(`pyqs/${pyq_id}/`);
            setPyq(data);
        } catch (error) {
            console.error("Failed to fetch PYQ:", error);
        } finally {
            setLoading(false);
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
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Question not found</h1>
                <Link href="/learning/pyqs" className="text-blue-600 hover:underline">
                    Back to all questions
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 py-12">
                
                {/* Back Button */}
                <Link 
                    href="/learning/pyqs" 
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-10 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Practice Questions
                </Link>

                {/* Header Section */}
                <div className="mb-12">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full text-sm font-bold">
                            <Tag className="w-4 h-4" />
                            {pyq.subject.name}
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm font-bold">
                            <Calendar className="w-4 h-4" />
                            Year {pyq.year}
                        </div>
                    </div>
                    
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
                        {pyq.subject.name} - Detailed Analysis
                    </h1>
                </div>

                {/* Question Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 text-gray-400 uppercase tracking-widest text-xs font-bold mb-4">
                        <FileText className="w-4 h-4" />
                        Question Statement
                    </div>
                    <div className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                        {pyq.question_text}
                    </div>
                </div>

                {/* Answer Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 text-green-500 uppercase tracking-widest text-xs font-bold mb-4">
                        <BookOpen className="w-4 h-4" />
                        Detailed Solution
                    </div>
                    <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {pyq.answer_text || "Solution is being prepared by our expert educators."}
                    </div>
                </div>

                {/* Video Explanation Section */}
                {pyq.video_url && (
                    <div className="mt-12 pt-12 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2 text-red-500 uppercase tracking-widest text-xs font-bold mb-6">
                            <PlayCircle className="w-4 h-4" />
                            Video Explanation
                        </div>
                        <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-2xl bg-black border-8 border-gray-100 dark:border-gray-800">
                            {pyq.video_url.includes("youtube.com") || pyq.video_url.includes("youtu.be") ? (
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${pyq.video_url.includes('v=') ? pyq.video_url.split('v=')[1].split('&')[0] : pyq.video_url.split('/').pop()}`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen>
                                </iframe>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                                    <p>Watch full video on official platform</p>
                                    <a 
                                        href={pyq.video_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
                                    >
                                        Open Link
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
