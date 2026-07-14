"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { PlayCircle, Clock, ArrowRight, BookOpen } from "lucide-react";


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

/**
 * Lectures List Page
 * 
 * Fetches and displays all available video lectures in a responsive grid.
 * Uses local state for loading indicators while calling the Django backend.
 */
export default function LecturesPage() {
    const [lectures, setLectures] = useState<Lecture[]>([]);
    const [loading, setLoading] = useState(true);

    // Load lectures from the API when the component first mounts
    useEffect(() => {
        const fetchLectures = async () => {
            try {
                const { data } = await api.get("/lectures");
                setLectures(data);
            } catch (error) {
                console.error("Failed to fetch lectures", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLectures();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 px-4 py-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Video Lectures</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-3xl">
                    Master core concepts with our premium curated lecture series. Handpicked for deep learning.
                </p>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                ) : lectures.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 border-2 border-dashed rounded-xl">
                        No lectures available right now.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {lectures.map((lecture) => (
                            <Link key={lecture.id} href={`/learning/lectures/${lecture.id}`} className="group bg-white rounded-3xl border border-gray-100 p-6 flex flex-col hover:shadow-2xl hover:border-blue-200 transition-all">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-gray-950 group-hover:text-blue-600 transition-colors">
                                    {lecture.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                                    {lecture.description}
                                </p>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                    <div className="flex items-center text-sm text-gray-400 font-medium">
                                        <Clock className="w-4 h-4 mr-1.5" />
                                        Lecture {lecture.order}
                                    </div>
                                    <span className="flex items-center text-sm font-bold text-blue-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                        Watch <ArrowRight className="w-4 h-4 ml-1" />
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
