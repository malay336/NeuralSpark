"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { ArrowLeft, PlayCircle, Clock, BookOpen } from "lucide-react";

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
 * Video Player Page (Dynamic Route)
 * 
 * Renders an individual lecture based on the `[id]` parameter in the URL.
 * It determines whether to embed a YouTube iframe, Vimeo iframe, 
 * or a raw HTML5 `<video>` tag depending on the provided URL structure.
 */
export default function LectureVideoPlayer() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [lecture, setLecture] = useState<Lecture | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        // Using the existing lectures list endpoint, then finding the specific one.
        // In a real app we'd have a specific /lectures/{id} endpoint, but this works for MVP.
        const fetchLecture = async () => {
            try {
                const { data } = await api.get("/lectures");
                const found = data.find((l: Lecture) => l.id.toString() === id);
                if (found) {
                    setLecture(found);
                } else {
                    router.push("/learning/lectures");
                }
            } catch (error) {
                console.error("Failed to fetch lecture", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLecture();
    }, [id, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!lecture) return null;

    // Helper function that dynamically parses the `video_url`
    // and returns the appropriate securely embedded iframe component.
    const renderVideo = (url: string) => {
        try {
            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                // Extract video ID safely
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                const match = url.match(regExp);
                const videoId = (match && match[2].length === 11) ? match[2] : null;

                if (videoId) {
                    return (
                        <iframe
                            className="w-full h-full rounded-xl shadow-lg border border-gray-200"
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
                            title={lecture.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    );
                }
            }
        } catch (e) {
            console.error(e);
        }

        // Fallback for direct MP4 links or other formats
        return (
            <video controls className="w-full h-full rounded-xl shadow-lg border border-gray-200 bg-black">
                <source src={url} />
                Your browser does not support HTML video.
            </video>
        );
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <Link href="/learning/lectures" className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-6 group font-medium transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Syllabus
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Video Player Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="aspect-video w-full bg-gray-900 rounded-xl overflow-hidden shadow-xl ring-1 ring-gray-900/5">
                        {renderVideo(lecture.video_url)}
                    </div>
                </div>

                {/* Details Column */}
                <div className="lg:col-span-1 border-l lg:pl-8 border-gray-200">
                    <div className="sticky top-24 space-y-6">
                        <div>
                            {lecture.category && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-4 border border-indigo-100">
                                    <BookOpen className="w-3 h-3 mr-1" />
                                    {lecture.category.name}
                                </span>
                            )}
                            <h1 className="text-3xl font-extrabold text-gray-900 mb-2 leading-tight">
                                {lecture.title}
                            </h1>
                            <div className="flex items-center text-sm text-gray-500 gap-4 mb-6">
                                <span className="flex items-center"><PlayCircle className="w-4 h-4 mr-1" /> Lecture {lecture.order}</span>
                                <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {new Date(lecture.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <h3 className="font-semibold text-gray-900 mb-3 text-lg">About this Lecture</h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                {lecture.description || "No description provided for this lecture."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
