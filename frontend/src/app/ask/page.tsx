"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function AskQuestion() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [tagsInput, setTagsInput] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        // Parse comma-separated tags
        const tags = tagsInput.split(",").map(t => t.trim()).filter(t => t.length > 0);

        try {
            const { data } = await api.post("questions/", {
                title,
                body,
                tags,
                video_url: videoUrl || null
            });
            router.push(`/question/${data.id}`);
        } catch (error) {
            console.error("Failed to post question:", error);
            alert("Error posting question");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Ask a public question</h1>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-sm text-gray-700">
                <h2 className="font-bold text-gray-900 mb-2">Writing a good question</h2>
                <p className="mb-4">You’re ready to ask a programming-related question and this form will help guide you through the process.</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Summarize your problem in a one-line title.</li>
                    <li>Describe your problem in more detail.</li>
                    <li>Describe what you tried and what you expected to happen.</li>
                    <li>Add an optional video explanation via YouTube/Vimeo.</li>
                    <li>Add tags which help surface your question to members of the community.</li>
                </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg border border-gray-200 shadow-sm">

                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1">Title</label>
                    <p className="text-xs text-gray-500 mb-2">Be specific and imagine you’re asking a question to another person.</p>
                    <input
                        type="text"
                        required
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-black"
                        placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1">What are the details of your problem?</label>
                    <p className="text-xs text-gray-500 mb-2">Introduce the problem and expand on what you put in the title.</p>
                    <textarea
                        required
                        rows={10}
                        value={body}
                        onChange={e => setBody(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-y text-black"
                        placeholder="Include all the information someone would need to answer your question"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1">Video Output (Optional)</label>
                    <p className="text-xs text-gray-500 mb-2">Link a YouTube or Vimeo video demonstrating your issue.</p>
                    <input
                        type="url"
                        value={videoUrl}
                        onChange={e => setVideoUrl(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-black"
                        placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1">Tags</label>
                    <p className="text-xs text-gray-500 mb-2">Add up to 5 tags to describe what your question is about (comma separated).</p>
                    <input
                        type="text"
                        value={tagsInput}
                        onChange={e => setTagsInput(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-black"
                        placeholder="e.g. django, python, machine-learning"
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 font-medium disabled:opacity-50"
                >
                    {submitting ? 'Posting...' : 'Post your question'}
                </button>

            </form>
        </div>
    );
}
