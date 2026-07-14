"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, Info, Users, BookOpen, Award, CheckCircle } from "lucide-react";

export default function AboutPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !message) return;
        
        // Mocking submission
        setSubmitted(true);
        setName("");
        setEmail("");
        setMessage("");
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 px-4 py-12 md:py-16 transition-colors duration-300">
            <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">
                
                {/* Hero Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                >
                    <h1 className="text-4xl md:text-5xl font-black text-gray-950 dark:text-white tracking-tight leading-tight">
                        Transforming GATE Learning With <span className="text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">NeuralSpark</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        NeuralSpark is a revolutionary next-generation learning platform built for GATE Data Science & Artificial Intelligence aspirants. We blend premium interactive lessons, peer discussions, and AI evaluation to maximize performance.
                    </p>
                </motion.div>

                {/* Stats Counters Grid */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-6"
                >
                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-2xl shadow-sm text-center space-y-2">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl w-fit mx-auto">
                            <Users className="w-6 h-6" />
                        </div>
                        <h3 className="text-3xl font-extrabold text-gray-950 dark:text-white">10k+</h3>
                        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Active Students</p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-2xl shadow-sm text-center space-y-2">
                        <div className="p-3 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-xl w-fit mx-auto">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <h3 className="text-3xl font-extrabold text-gray-950 dark:text-white">5,000+</h3>
                        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Practice Problems</p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-2xl shadow-sm text-center space-y-2">
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit mx-auto">
                            <Award className="w-6 h-6" />
                        </div>
                        <h3 className="text-3xl font-extrabold text-gray-950 dark:text-white">98%</h3>
                        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Satisfaction Rate</p>
                    </div>
                </motion.div>

                {/* Main Split Content: Info & Contact Form */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    
                    {/* Left Column: Mission, Vision, and details */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="space-y-3">
                            <h2 className="text-2xl font-bold text-gray-950 dark:text-white flex items-center gap-2">
                                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                Our Mission & Goal
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm md:text-base">
                                GATE exams are notoriously competitive, and high-quality study materials for Data Science and Artificial Intelligence can be hard to track down. We created NeuralSpark to democratize top-tier coaching, offering clean study interfaces, interactive practice labs, and on-demand AI explanations.
                            </p>
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-850 pt-6 space-y-4">
                            <h3 className="font-bold text-gray-950 dark:text-white text-lg">Platform Offices</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                                    <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                                    <span className="text-sm">Sector 62, Noida, Uttar Pradesh, India</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                                    <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                                    <span className="text-sm">support@neuralspark.app</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                                    <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                                    <span className="text-sm">+91 98765 43210</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Premium Contact Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden"
                    >
                        <div className="relative z-10 space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-950 dark:text-white">Get in Touch</h3>
                                <p className="text-gray-400 text-sm mt-1">Have a doubt or feedback? Message our support team directly.</p>
                            </div>

                            {submitted && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400 p-4 rounded-xl flex items-center gap-2 text-sm"
                                >
                                    <CheckCircle className="w-5 h-5 shrink-0 text-green-500" />
                                    <span>Thank you! Your message was received successfully. We'll reply within 24 hours.</span>
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Your Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="Arjun Singh"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email Address</label>
                                    <input 
                                        type="email" 
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="arjun@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Message Description</label>
                                    <textarea 
                                        rows={4}
                                        required
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                        placeholder="How can we help you improve?"
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl py-3.5 transition-colors shadow-lg shadow-blue-600/10 flex items-center justify-center gap-2 active:scale-[0.99]"
                                >
                                    Submit Message
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
