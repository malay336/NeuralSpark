"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { BookOpen, Calendar, Filter, ArrowRight, Layers, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Category = {
    id: number;
    name: string;
    description: string;
};

type Article = {
    id: number;
    title: string;
    summary: string;
    subject: Category;
    created_at: string;
};

export default function TheoryDashboard() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const { data } = await api.get("/articles/");
            setArticles(data);
        } catch (error) {
            console.error("Failed to fetch articles:", error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ["All", ...Array.from(new Set(articles.map(a => a.subject.name)))];

    const filteredArticles = articles.filter(a => {
        return selectedCategory === "All" || a.subject.name === selectedCategory;
    });

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } }
    };


    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-[65vh] gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-100 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Loading study notes...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 px-4 py-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
                        Theory & Study Notes
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
                        Read high-quality, comprehensive theory articles and reference guides compiled specifically for GATE Data Science & AI.
                    </p>
                </motion.div>

                {/* Filter Switcher */}
                <div className="flex flex-col sm:flex-row gap-4 mb-10 items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                        <Filter className="w-5 h-5 text-gray-400 shrink-0" />
                        <div className="flex gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                                        selectedCategory === cat
                                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0">
                        Showing {filteredArticles.length} {filteredArticles.length === 1 ? "article" : "articles"}
                    </div>
                </div>

                {/* Grid */}
                <AnimatePresence mode="popLayout">
                    {filteredArticles.length > 0 ? (
                        <motion.div 
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="flex flex-col gap-5"
                        >
                            {filteredArticles.map((art, idx) => (
                                <motion.div
                                    key={art.id}
                                    variants={item}
                                    layout
                                >
                                    <Link href={`/learning/theory/${art.id}`} className="block group">
                                        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 md:p-6 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-900/30 transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center gap-6 active:scale-[0.995]">
                                            
                                            {/* Big Numeric Index */}
                                            <div className="text-3xl md:text-4xl font-black text-blue-600/30 dark:text-blue-400/20 w-12 shrink-0 select-none">
                                                {String(idx + 1).padStart(2, '0')}
                                            </div>

                                            {/* Details & Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2.5 mb-2">
                                                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 tracking-wider uppercase">
                                                        {art.subject.name}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-[11px] text-gray-400">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{new Date(art.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                
                                                <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight mb-1">
                                                    {art.title}
                                                </h2>
                                                
                                                <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm line-clamp-2">
                                                    {art.summary}
                                                </p>
                                            </div>

                                            {/* Link Action */}
                                            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-bold group-hover:translate-x-1 transition-all shrink-0">
                                                Read <ArrowRight className="w-4 h-4" />
                                            </div>

                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>

                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16"
                        >
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">No articles found</h3>
                            <p className="text-gray-500">Try changing your category filters.</p>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
