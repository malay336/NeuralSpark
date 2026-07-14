"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { ArrowLeft, BookOpen, Calendar, Tag, Layers, Share2 } from "lucide-react";
import { motion } from "framer-motion";

type Category = {
    id: number;
    name: string;
};

type Article = {
    id: number;
    title: string;
    summary: string;
    content: string;
    subject: Category;
    created_at: string;
};

export default function ArticleReaderPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const unwrappedParams = use(params);
    const articleId = unwrappedParams.id;

    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (articleId) {
            fetchArticle();
        }
    }, [articleId]);

    const fetchArticle = async () => {
        try {
            const { data } = await api.get(`/articles/${articleId}/`);
            setArticle(data);
        } catch (error) {
            console.error("Failed to fetch article:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-100 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-gray-500 font-medium">Opening notes...</p>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="max-w-3xl mx-auto py-16 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h2>
                <button
                    onClick={() => router.push("/learning/theory")}
                    className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl"
                >
                    Back to Theory
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/30 dark:bg-gray-950/20 px-4 py-12 transition-colors duration-300">
            <div className="max-w-3xl mx-auto">
                
                {/* Back Button */}
                <button
                    onClick={() => router.push("/learning/theory")}
                    className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Theory Notes
                </button>

                {/* Main Article Container */}
                <motion.article 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-10 shadow-xl"
                >
                    {/* Categories and details */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold uppercase tracking-wider">
                                <Tag className="w-3.5 h-3.5" />
                                {article.subject.name}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 font-bold uppercase">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(article.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                alert("Link copied to clipboard!");
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                            title="Share Article"
                        >
                            <Share2 className="w-4.5 h-4.5" />
                        </button>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
                        {article.title}
                    </h1>

                    {/* Summary */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-950/20 border-l-4 border-blue-500 text-gray-600 dark:text-gray-400 text-sm leading-relaxed rounded-r-2xl mb-8 font-medium italic">
                        {article.summary}
                    </div>

                    {/* Markdown Body Content */}
                    <div className="prose prose-blue dark:prose-invert max-w-none text-gray-800 dark:text-gray-250 leading-relaxed whitespace-pre-wrap space-y-6">
                        {/* 
                          A clean parser rendering:
                          - Subheadings starting with ###
                          - Lists starting with 1. or -
                          - Math notations wrapped in $$
                        */}
                        {article.content.split("\n\n").map((block, idx) => {
                            if (block.startsWith("###")) {
                                return (
                                    <h3 key={idx} className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4 border-b border-gray-50 dark:border-gray-800/80 pb-2">
                                        {block.replace("###", "").trim()}
                                    </h3>
                                );
                            }
                            if (block.startsWith("$$")) {
                                return (
                                    <div key={idx} className="my-6 p-4 bg-gray-50 dark:bg-gray-950/10 border border-gray-100 dark:border-gray-800 rounded-2xl text-center font-mono text-blue-600 dark:text-blue-400 overflow-x-auto text-base">
                                        {block.replaceAll("$$", "").trim()}
                                    </div>
                                );
                            }
                            if (block.startsWith("1.") || block.startsWith("-")) {
                                return (
                                    <div key={idx} className="pl-6 space-y-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                                        {block.split("\n").map((line, lIdx) => (
                                            <p key={lIdx} className="relative before:content-['•'] before:absolute before:-left-4 before:text-blue-500 font-medium">
                                                {line.replace(/^\d+\.\s*/, "").replace(/^-\s*/, "").trim()}
                                            </p>
                                        ))}
                                    </div>
                                );
                            }
                            return (
                                <p key={idx} className="text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-350 font-medium">
                                    {block}
                                </p>
                            );
                        })}
                    </div>

                </motion.article>

            </div>
        </div>
    );
}
