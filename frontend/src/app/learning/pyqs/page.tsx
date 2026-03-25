"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import api from "@/lib/api";
import { BookOpen, Calendar, Tag, ArrowRight, Search, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type PYQ = {
    id: number;
    year: number;
    question_text: string;
    answer_text: string;
    video_url?: string;
    created_at: string;
    subject: { id: number; name: string };
};

export default function PYQFeed() {
    const [pyqs, setPyqs] = useState<PYQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        fetchPYQs();
    }, []);

    const fetchPYQs = async () => {
        try {
            // Added trailing slash to match backend NinjaAPI requirements
            const { data } = await api.get("/pyqs/");
            setPyqs(data);
        } catch (error) {
            console.error("Failed to fetch PYQs:", error);
        } finally {
            setLoading(false);
        }
    };

    // Derived values for filtering
    const categories = ["All", ...Array.from(new Set(pyqs.map(p => p.subject.name)))];
    
    const filteredPyqs = pyqs.filter(p => {
        const matchesSearch = p.question_text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             p.subject.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || p.subject.name === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-100 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-gray-500 font-medium animate-pulse">Loading amazing content...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 px-4 py-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
                        Previous Year Questions
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
                        Access over {pyqs.length} curated GATE questions from past years, categorized by subject.
                    </p>
                </motion.div>

                {/* Filter Bar */}
                <div className="flex flex-col lg:flex-row gap-6 mb-8 items-center bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="text"
                            placeholder="Search questions or topics..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all outline-none"
                        />
                    </div>
                    
                    <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                        <Filter className="w-5 h-5 text-gray-400 hidden lg:block" />
                        <div className="flex gap-2">
                            {categories.slice(0, 6).map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                                        selectedCategory === cat 
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/20" 
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex gap-4 mb-6 text-sm text-gray-500 font-medium">
                    <span>Showing {filteredPyqs.length} results</span>
                    {selectedCategory !== "All" && (
                        <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">in {selectedCategory}</span>
                    )}
                </div>

                {/* Grid Feed */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredPyqs.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full py-20 text-center bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800"
                            >
                                <div className="text-gray-400 mb-4 flex justify-center">
                                    <BookOpen className="w-12 h-12" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No matching questions</h3>
                                <p className="text-gray-500">Try adjusting your search or category filters.</p>
                            </motion.div>
                        ) : (
                            filteredPyqs.map((p, index) => (
                                <motion.div
                                    key={p.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                    className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-100 dark:hover:shadow-blue-900/10 transition-all cursor-pointer flex flex-col h-full active:scale-[0.98]"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold">
                                            <Tag className="w-3 h-3" />
                                            {p.subject.name}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {p.year}
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                                        {p.subject.name} - Sample Question
                                    </h3>
                                    
                                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-4 leading-relaxed mb-6 flex-1">
                                        {p.question_text}
                                    </p>

                                    <div className="pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                                        <span className="text-xs text-gray-400">
                                            Added {formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}
                                        </span>
                                        <button className="flex items-center gap-1.5 text-blue-600 text-sm font-bold group-hover:gap-2.5 transition-all">
                                            View Details <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

