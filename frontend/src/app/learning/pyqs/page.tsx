"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import api from "@/lib/api";
import { BookOpen, Calendar, Tag, ArrowRight, Search, Filter, HelpCircle, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Category = {
    id: number;
    name: string;
};

type PYQ = {
    id: number;
    year?: number | null;
    is_pyq: boolean;
    question_text: string;
    answer_text: string;
    video_url?: string | null;
    created_at: string;
    subject: Category;
};

export default function PracticeFeed() {
    const [questions, setQuestions] = useState<PYQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    
    // Type Filter State: "All", "PYQ", "Practice"
    const [activeTab, setActiveTab] = useState<"All" | "PYQ" | "Practice">("All");

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const { data } = await api.get("/pyqs/");
            setQuestions(data);
        } catch (error) {
            console.error("Failed to fetch questions:", error);
        } finally {
            setLoading(false);
        }
    };

    // Derived values for category filters
    const categories = ["All", ...Array.from(new Set(questions.map(q => q.subject.name)))];
    
    // Apply filters (search, category, and type tab)
    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.question_text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             q.subject.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || q.subject.name === selectedCategory;
        
        let matchesTab = true;
        if (activeTab === "PYQ") {
            matchesTab = q.is_pyq === true;
        } else if (activeTab === "Practice") {
            matchesTab = q.is_pyq === false;
        }

        return matchesSearch && matchesCategory && matchesTab;
    });

    // Parent stagger container variant
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    // Item variant
    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } }
    };


    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-[65vh] gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-100 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-gray-500 font-medium animate-pulse">Loading practice questions...</p>
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
                        Practice Center
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
                        Access exam previous year questions (PYQs) and curated practice problems to master computer science concepts.
                    </p>
                </motion.div>

                {/* Sub-section Tab Selector */}
                <div className="flex border-b border-gray-200 dark:border-gray-800 mb-8 gap-6 text-sm font-semibold">
                    <button 
                        onClick={() => setActiveTab("All")}
                        className={`pb-3 relative transition-all ${
                            activeTab === "All" 
                                ? "text-blue-600 dark:text-blue-400 font-bold" 
                                : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                        }`}
                    >
                        All Questions
                        {activeTab === "All" && (
                            <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                        )}
                    </button>
                    <button 
                        onClick={() => setActiveTab("PYQ")}
                        className={`pb-3 relative transition-all ${
                            activeTab === "PYQ" 
                                ? "text-blue-600 dark:text-blue-400 font-bold" 
                                : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                        }`}
                    >
                        GATE PYQs
                        {activeTab === "PYQ" && (
                            <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                        )}
                    </button>
                    <button 
                        onClick={() => setActiveTab("Practice")}
                        className={`pb-3 relative transition-all ${
                            activeTab === "Practice" 
                                ? "text-blue-600 dark:text-blue-400 font-bold" 
                                : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                        }`}
                    >
                        General Practice
                        {activeTab === "Practice" && (
                            <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                        )}
                    </button>
                </div>

                {/* Search and Category Filters */}
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
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
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
                </div>

                {/* Counter */}
                <div className="flex gap-4 mb-6 text-sm text-gray-500 font-medium">
                    <span>Showing {filteredQuestions.length} results</span>
                    {selectedCategory !== "All" && (
                        <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-lg">in {selectedCategory}</span>
                    )}
                </div>

                {/* Grid Feed */}
                <AnimatePresence mode="popLayout">
                    {filteredQuestions.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-20 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-800 shadow-sm"
                        >
                            <div className="text-gray-400 mb-4 flex justify-center">
                                <BookOpen className="w-12 h-12" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No matching questions</h3>
                            <p className="text-gray-500">Try adjusting your filters or category choice.</p>
                        </motion.div>
                    ) : (
                        <motion.div 
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {filteredQuestions.map((p) => (
                                <motion.div
                                    key={p.id}
                                    variants={item}
                                    layout
                                >
                                    <Link href={`/learning/pyqs/${p.id}`} className="block h-full group">
                                        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-900/40 transition-all cursor-pointer flex flex-col h-full active:scale-[0.99] relative overflow-hidden">
                                            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-28 h-28 bg-blue-50 dark:bg-blue-950/20 rounded-full opacity-50 pointer-events-none group-hover:scale-110 transition-transform"></div>

                                            <div className="flex items-center justify-between mb-4 relative z-10">
                                                <div className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold uppercase tracking-wider">
                                                    <Tag className="w-3 h-3" />
                                                    {p.subject.name}
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">
                                                    {p.is_pyq ? (
                                                        <>
                                                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                            <span>GATE {p.year}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <HelpCircle className="w-3.5 h-3.5 text-purple-500" />
                                                            <span className="text-purple-600 dark:text-purple-400">Practice</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors relative z-10">
                                                {p.subject.name} - {p.is_pyq ? `GATE ${p.year} Exam` : "Practice Problem"}
                                            </h3>
                                            
                                            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-4 leading-relaxed mb-6 flex-1 relative z-10">
                                                {p.question_text}
                                            </p>

                                            <div className="pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between relative z-10">
                                                <span className="text-xs text-gray-400">
                                                    {p.is_pyq ? "Exam Question" : "Practice Question"}
                                                </span>
                                                <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-bold group-hover:translate-x-0.5 transition-all outline-none">
                                                    Solve & Discuss <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
