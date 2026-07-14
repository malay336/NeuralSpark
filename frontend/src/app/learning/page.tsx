"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlayCircle, FileText, Users, ArrowRight, HelpCircle, Sparkles, BookOpen } from 'lucide-react';

/**
 * Learning Hub Dashboard Page
 * 
 * Serves as the central navigation point for students to access Video Lectures, 
 * Previous Year Questions, the Community Forum, Interactive Quizzes, AI Assistant, and Theory Notes.
 * Implements Framer Motion staggered grid animations for a polished load experience.
 */
export default function LearningHub() {
    // Defines the parent container animation: children will appear one by one
    // with a 0.1 second delay between each (staggerChildren).
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    // Defines the individual item animation: fade in and slide up from y: 20px
    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-16 min-h-[calc(100vh-4rem)]">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-6"
            >
                <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight drop-shadow-sm">Learning Hub</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">Select a category to start learning and tracking your progress.</p>
                </div>
                <Link href="/ask" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-500 hover:-translate-y-0.5 transition-all flex items-center gap-2 w-fit">
                    Ask Question <ArrowRight className="w-4 h-4" />
                </Link>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                <motion.div variants={item}>
                    <Link href="/learning/lectures" className="group p-8 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-3xl hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-900/40 transition-all block h-full flex flex-col items-start shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-50 dark:bg-blue-950/20 rounded-full opacity-50 pointer-events-none group-hover:scale-110 transition-transform"></div>
                        <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl mb-6 relative z-10 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <PlayCircle className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white relative z-10">Video Lectures</h2>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-6 flex-1 relative z-10">High quality curated video lectures designed for deep understanding.</p>
                        <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm flex items-center decoration-2 group-hover:underline relative z-10">Explore Lectures <ArrowRight className="w-4 h-4 ml-1" /></span>
                    </Link>
                </motion.div>

                <motion.div variants={item}>
                    <Link href="/learning/pyqs" className="group p-8 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-3xl hover:shadow-2xl hover:border-green-200 dark:hover:border-green-900/40 transition-all block h-full flex flex-col items-start shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-green-50 dark:bg-green-950/20 rounded-full opacity-50 pointer-events-none group-hover:scale-110 transition-transform"></div>
                        <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl mb-6 relative z-10 group-hover:bg-green-600 group-hover:text-white transition-colors">
                            <FileText className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white relative z-10">Previous Year Q's</h2>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-6 flex-1 relative z-10">Practice with real PYQs and comprehensive video explanations.</p>
                        <span className="text-green-600 dark:text-green-400 font-semibold text-sm flex items-center decoration-2 group-hover:underline relative z-10">Start Practicing <ArrowRight className="w-4 h-4 ml-1" /></span>
                    </Link>
                </motion.div>

                <motion.div variants={item}>
                    <Link href="/learning/questions" className="group p-8 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-3xl hover:shadow-2xl hover:border-indigo-200 dark:hover:border-indigo-900/40 transition-all block h-full flex flex-col items-start shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-50 dark:bg-indigo-950/20 rounded-full opacity-50 pointer-events-none group-hover:scale-110 transition-transform"></div>
                        <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl mb-6 relative z-10 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <Users className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white relative z-10">Community Q&A</h2>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-6 flex-1 relative z-10">Ask your doubts, share knowledge, and help others in the forum.</p>
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm flex items-center decoration-2 group-hover:underline relative z-10">Join Discussion <ArrowRight className="w-4 h-4 ml-1" /></span>
                    </Link>
                </motion.div>

                <motion.div variants={item}>
                    <Link href="/learning/quizzes" className="group p-8 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-3xl hover:shadow-2xl hover:border-purple-200 dark:hover:border-purple-900/40 transition-all block h-full flex flex-col items-start shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-purple-50 dark:bg-purple-950/20 rounded-full opacity-50 pointer-events-none group-hover:scale-110 transition-transform"></div>
                        <div className="p-4 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl mb-6 relative z-10 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <HelpCircle className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white relative z-10">Interactive Quizzes</h2>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-6 flex-1 relative z-10">Test your mastery of core subjects and get instant explanations.</p>
                        <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm flex items-center decoration-2 group-hover:underline relative z-10">Start Quizzes <ArrowRight className="w-4 h-4 ml-1" /></span>
                    </Link>
                </motion.div>

                <motion.div variants={item}>
                    <Link href="/learning/ai-assistant" className="group p-8 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-3xl hover:shadow-2xl hover:border-amber-200 dark:hover:border-amber-900/40 transition-all block h-full flex flex-col items-start shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-amber-50 dark:bg-amber-950/20 rounded-full opacity-50 pointer-events-none group-hover:scale-110 transition-transform"></div>
                        <div className="p-4 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl mb-6 relative z-10 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white relative z-10">AI Companion</h2>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-6 flex-1 relative z-10">Ask computer science questions and get detailed, structured solutions.</p>
                        <span className="text-amber-600 dark:text-amber-400 font-semibold text-sm flex items-center decoration-2 group-hover:underline relative z-10">Ask Assistant <ArrowRight className="w-4 h-4 ml-1" /></span>
                    </Link>
                </motion.div>

                <motion.div variants={item}>
                    <Link href="/learning/theory" className="group p-8 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-3xl hover:shadow-2xl hover:border-teal-200 dark:hover:border-teal-900/40 transition-all block h-full flex flex-col items-start shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-teal-50 dark:bg-teal-950/20 rounded-full opacity-50 pointer-events-none group-hover:scale-110 transition-transform"></div>
                        <div className="p-4 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-2xl mb-6 relative z-10 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white relative z-10">Theory Notes</h2>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-6 flex-1 relative z-10">Read comprehensive study guides for GATE Data Science & AI topics.</p>
                        <span className="text-teal-600 dark:text-teal-400 font-semibold text-sm flex items-center decoration-2 group-hover:underline relative z-10">Read Theory <ArrowRight className="w-4 h-4 ml-1" /></span>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}

