"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import api from "@/lib/api";
import { BookOpen, Calendar, Tag, ArrowRight, Search, Filter, HelpCircle, Layers, Users, Sparkles, UploadCloud } from "lucide-react";

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
    const categories = ["All", ...Array.from(new Set(questions.map(q => q.subject?.name).filter(Boolean)))];
    
    // Apply filters (search, category, and type tab)
    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.question_text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             (q.subject?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || q.subject?.name === selectedCategory;
        
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
                    className="mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-black text-gray-905 dark:text-white mb-4 tracking-tight uppercase">
                        PRACTICE & TEST
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl leading-relaxed">
                        Access exam previous year questions (PYQs) and curated practice problems to master computer science concepts.
                    </p>
                </motion.div>

                {/* Sub-navigation option links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                   {/* Card 1: Community Q&A */}
                   <Link href="/learning/questions" className="group p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/30 transition-all flex items-start gap-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                         <Users className="w-5 h-5" />
                      </div>
                      <div>
                         <h3 className="font-bold text-gray-950 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Community Q&A</h3>
                         <p className="text-gray-400 text-xs mt-1">Discuss doubts and peer solutions.</p>
                      </div>
                   </Link>

                   {/* Card 2: Interactive Quiz */}
                   <Link href="/learning/quizzes" className="group p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/30 transition-all flex items-start gap-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                         <HelpCircle className="w-5 h-5" />
                      </div>
                      <div>
                         <h3 className="font-bold text-gray-950 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Quizzes</h3>
                         <p className="text-gray-400 text-xs mt-1">Subject-wise quick challenge sets.</p>
                      </div>
                   </Link>

                   {/* Card 3: Theory & Study Notes */}
                   <Link href="/learning/theory" className="group p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/30 transition-all flex items-start gap-4 cursor-pointer">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                         <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                         <h3 className="font-bold text-gray-950 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Theory Notes</h3>
                         <p className="text-gray-400 text-xs mt-1">Deep dive articles & reference guides.</p>
                      </div>
                   </Link>

                   {/* Card 4: Backend Admin CMS (Create / Edit / Format / Delete) */}
                   <a href="http://127.0.0.1:8000/admin/core/pyq/" target="_blank" rel="noopener noreferrer" className="group p-5 bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200/60 dark:border-blue-800/40 rounded-2xl hover:shadow-md hover:border-blue-400 transition-all flex items-start gap-4">
                      <div className="p-3 bg-blue-600 text-white rounded-xl group-hover:scale-105 transition-transform shrink-0 shadow-sm">
                         <UploadCloud className="w-5 h-5" />
                      </div>
                      <div>
                         <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-gray-950 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Admin CMS Portal</h3>
                            <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white text-[9px] font-black uppercase">Admin</span>
                         </div>
                         <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Create, edit, format & delete questions.</p>
                      </div>
                   </a>
                </div>


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
                            {categories.map((cat, idx) => (
                                <button
                                    key={`${cat}-${idx}`}
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
                            className="flex flex-col gap-5"
                        >
                            {filteredQuestions.map((p, idx) => (
                                <motion.div
                                    key={p.id}
                                    variants={item}
                                    layout
                                >
                                    <Link href={`/learning/pyqs/${p.id}`} className="block group">
                                        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 md:p-6 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-900/30 transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center gap-6 active:scale-[0.995]">
                                            
                                            {/* Big Numeric Index */}
                                            <div className="text-3xl md:text-4xl font-black text-blue-600/30 dark:text-blue-400/20 w-12 shrink-0 select-none">
                                                {String(idx + 1).padStart(2, '0')}
                                            </div>

                                            {/* Details & Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2.5 mb-2">
                                                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 tracking-wider uppercase">
                                                        {p.subject.name}
                                                    </span>
                                                    <div className="flex items-center gap-2 text-[11px] text-gray-400">
                                                        {p.is_pyq ? (
                                                            <>
                                                                <Calendar className="w-3.5 h-3.5" />
                                                                <span>GATE {p.year} Exam</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <HelpCircle className="w-3.5 h-3.5 text-purple-500" />
                                                                <span className="text-purple-600 dark:text-purple-400">General Practice</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <h2 className="text-base md:text-lg font-bold text-gray-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight mb-1 line-clamp-1">
                                                    {p.subject.name} - {p.is_pyq ? `GATE ${p.year} Exam Question` : "Practice Problem"}
                                                </h2>
                                                
                                                <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm line-clamp-2 leading-relaxed">
                                                    {p.question_text}
                                                </p>
                                            </div>

                                            {/* Link Action */}
                                            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-bold group-hover:translate-x-1 transition-all shrink-0">
                                                Solve & Discuss <ArrowRight className="w-4 h-4" />
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
