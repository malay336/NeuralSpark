"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { PlayCircle, Clock, ArrowRight, BookOpen, Filter, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Category = {
    id: number;
    name: string;
};

type Lecture = {
    id: number;
    title: string;
    description: string;
    video_url: string;
    order: number;
    created_at: string;
    category: Category | null;
};

export default function LecturesPage() {
    const [lectures, setLectures] = useState<Lecture[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        const fetchLectures = async () => {
            try {
                const { data } = await api.get("/lectures/");
                setLectures(data);
            } catch (error) {
                console.error("Failed to fetch lectures", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLectures();
    }, []);

    const categories = ["All", ...Array.from(new Set(lectures.map(l => l.category?.name).filter(Boolean)))];

    const filteredLectures = lectures.filter(l => {
        return selectedCategory === "All" || l.category?.name === selectedCategory;
    });

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 px-4 py-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-black mb-4 text-gray-900 dark:text-white uppercase tracking-tight">
                        Video Lectures
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
                        Master core computer science & AI concepts with our handpicked video lecture series organized strictly across 8 core subjects.
                    </p>
                </motion.div>

                {/* Subject Filter Pills */}
                <div className="flex items-center gap-3 w-full overflow-x-auto pb-4 mb-10 scrollbar-hide bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs">
                    <Filter className="w-5 h-5 text-gray-400 shrink-0 ml-1" />
                    <div className="flex gap-2">
                        {categories.map((cat: any) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide whitespace-nowrap transition-all ${
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

                {loading ? (
                    <div className="flex flex-col justify-center items-center h-[50vh] gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="text-gray-500 text-sm font-medium">Loading video lectures...</p>
                    </div>
                ) : filteredLectures.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 bg-white dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-800">
                        <Video className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">No lectures found</h3>
                        <p className="text-xs text-gray-500 mt-1">Try selecting another subject filter.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredLectures.map((lecture) => (
                            <Link key={lecture.id} href={`/learning/lectures/${lecture.id}`} className="group bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 flex flex-col hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900/30 transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <PlayCircle className="w-6 h-6" />
                                    </div>
                                    {lecture.category && (
                                        <span className="px-2.5 py-1 text-[10px] font-extrabold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg uppercase tracking-wider">
                                            {lecture.category.name}
                                        </span>
                                    )}
                                </div>
                                
                                <h3 className="text-lg font-bold mb-2 text-gray-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                    {lecture.title}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed mb-6 line-clamp-3">
                                    {lecture.description}
                                </p>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center text-xs text-gray-400 font-semibold">
                                        <Clock className="w-3.5 h-3.5 mr-1" />
                                        Lecture #{lecture.order}
                                    </div>
                                    <span className="flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-all">
                                        Watch Video <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
