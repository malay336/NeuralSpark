"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { PlayCircle, Clock, ArrowRight } from "lucide-react";

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
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-6 text-gray-900">Video Lectures</h1>
            <p className="text-gray-600 mb-8 max-w-3xl">
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
                        <Link
                            key={lecture.id}
                            href={`/learning/lectures/${lecture.id}`}
                            className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
                        >
                            <div className="aspect-video bg-gray-900 relative flex items-center justify-center">
                                {/* Simple placeholder for video thumbnail */}
                                <div className="absolute inset-0 opacity-40 bg-gradient-to-tr from-blue-900 to-transparent"></div>
                                <PlayCircle className="w-16 h-16 text-white opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all z-10" />
                                {lecture.category && (
                                    <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white backdrop px-3 py-1 rounded-full text-xs font-medium z-10">
                                        {lecture.category.name}
                                    </span>
                                )}
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {lecture.title}
                                </h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
                                    {lecture.description || "No description provided."}
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
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
