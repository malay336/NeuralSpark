"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { HelpCircle, Filter, BookOpen, Award, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Category = {
    id: number;
    name: string;
    description: string;
};

type Quiz = {
    id: number;
    title: string;
    description: string;
    category: Category;
    question_count: number;
};

export default function QuizDashboard() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const { data } = await api.get("/quizzes/");
            setQuizzes(data);
        } catch (error) {
            console.error("Failed to fetch quizzes:", error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ["All", ...Array.from(new Set(quizzes.map(q => q.category.name)))];

    const filteredQuizzes = quizzes.filter(q => {
        return selectedCategory === "All" || q.category.name === selectedCategory;
    });

    // Parent stagger container variant
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    // Item fade-in variant
    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-100 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Loading quizzes...</p>
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
                        Interactive Quizzes
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
                        Assess your conceptual understanding of core computer science topics. Get instant feedback and explanations.
                    </p>
                </motion.div>

                {/* Filters */}
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
                        Showing {filteredQuizzes.length} {filteredQuizzes.length === 1 ? "Quiz" : "Quizzes"}
                    </div>
                </div>

                {/* Grid */}
                <AnimatePresence mode="popLayout">
                    {filteredQuizzes.length > 0 ? (
                        <motion.div 
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {filteredQuizzes.map((quiz) => (
                                <motion.div
                                    key={quiz.id}
                                    variants={item}
                                    layout
                                    className="group p-6 border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-gray-900/60 rounded-3xl hover:shadow-2xl dark:hover:shadow-2xl/20 hover:border-blue-200 dark:hover:border-blue-900/40 transition-all block h-full flex flex-col items-start shadow-sm relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-blue-50 dark:bg-blue-950/20 rounded-full opacity-50 pointer-events-none group-hover:scale-110 transition-transform"></div>
                                    
                                    <span className="inline-block px-3 py-1 text-xs font-bold rounded-lg mb-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 tracking-wide uppercase">
                                        {quiz.category.name}
                                    </span>
                                    
                                    <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {quiz.title}
                                    </h2>
                                    
                                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-6 flex-1">
                                        {quiz.description}
                                    </p>

                                    <div className="w-full flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                                            <BookOpen className="w-4 h-4 text-blue-500" />
                                            <span>{quiz.question_count} Questions</span>
                                        </div>
                                        <Link 
                                            href={`/learning/quizzes/${quiz.id}`}
                                            className="px-4 py-2 bg-gray-950 dark:bg-gray-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-all flex items-center gap-1.5 shadow-sm group-hover:translate-x-0.5"
                                        >
                                            Take Quiz <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16"
                        >
                            <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">No quizzes found</h3>
                            <p className="text-gray-500">Try changing your category filter.</p>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
