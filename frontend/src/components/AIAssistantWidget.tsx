"use client";

import { useState, useRef, useEffect } from "react";
import api from "@/lib/api";
import { MessageSquare, X, Send, Bot, Sparkles, User, RefreshCw, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
    id: string;
    sender: "user" | "ai";
    text: string;
    timestamp: Date;
};

const SUGGESTED_PROMPTS = [
    {
        title: "BCNF vs 3NF",
        prompt: "Explain the difference between BCNF and 3NF database normalization."
    },
    {
        title: "Dijkstra Algorithm",
        prompt: "Explain how Dijkstra's algorithm works."
    }
];

export default function AIAssistantWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            sender: "ai",
            text: "Hi! Ask me any CS or GATE query here, and I'll explain it.",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, loading, isOpen]);

    const handleSend = async (textToSend: string) => {
        if (!textToSend.trim()) return;

        const userMsg: Message = {
            id: Math.random().toString(),
            sender: "user",
            text: textToSend,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const { data } = await api.post("ai-assistant/ask/", { question: textToSend });
            const aiMsg: Message = {
                id: Math.random().toString(),
                sender: "ai",
                text: data.response,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("Widget query failed:", error);
            const errorMsg: Message = {
                id: Math.random().toString(),
                sender: "ai",
                text: "Failed to connect to AI assistant. Please check backend settings.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setMessages([
            {
                id: "welcome",
                sender: "ai",
                text: "Hi! Ask me any CS or GATE query here, and I'll explain it.",
                timestamp: new Date()
            }
        ]);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            
            {/* Pop-up Chat Overlay Box */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 50 }}
                        transition={{ type: "spring", stiffness: 260, damping: 25 }}
                        className="w-[calc(100vw-2rem)] sm:w-96 h-[500px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden mb-4 mr-0 sm:mr-2"
                    >
                        {/* Header */}
                        <div className="px-5 py-4 bg-gray-50 dark:bg-gray-950/60 border-b border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <span className="font-extrabold text-sm text-gray-900 dark:text-white">AI Study Companion</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handleReset}
                                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                    title="Reset Chat"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Message Log */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-150 dark:scrollbar-thumb-gray-800">
                            
                            {messages.length === 1 && (
                                <div className="p-3 bg-gray-50 dark:bg-gray-950/20 border border-gray-100 dark:border-gray-800 rounded-2xl">
                                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-2">Suggested queries</span>
                                    <div className="flex flex-col gap-2">
                                        {SUGGESTED_PROMPTS.map((p, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSend(p.prompt)}
                                                className="text-left text-xs p-2.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-850 hover:border-blue-300 dark:hover:border-blue-800 rounded-xl transition-all font-semibold"
                                            >
                                                {p.title}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {messages.map((msg) => {
                                const isAI = msg.sender === "ai";
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex gap-2 items-start ${!isAI ? "flex-row-reverse" : ""}`}
                                    >
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                                            isAI 
                                                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400" 
                                                : "bg-gray-100 text-gray-600 dark:bg-gray-800"
                                        }`}>
                                            {isAI ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                                        </div>
                                        <div className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                                            isAI 
                                                ? "bg-gray-50/40 dark:bg-gray-950/20 border border-gray-100 dark:border-gray-850 text-gray-800 dark:text-gray-200" 
                                                : "bg-blue-600 border border-blue-600 text-white shadow-sm"
                                        }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                );
                            })}

                            {loading && (
                                <div className="flex gap-2 items-start">
                                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center">
                                        <Bot className="w-3.5 h-3.5 animate-pulse" />
                                    </div>
                                    <div className="p-3 rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-gray-50/40 dark:bg-gray-950/20 flex gap-1 items-center shrink-0">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Board */}
                        <div className="p-3 border-t border-gray-100 dark:border-gray-800">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSend(input);
                                }}
                                className="flex gap-1.5"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about normal forms, logic..."
                                    disabled={loading}
                                    className="flex-1 px-3.5 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white outline-none text-xs font-semibold disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !input.trim()}
                                    className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl disabled:opacity-50 flex items-center justify-center shadow-md shadow-blue-500/10"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Action Button Widget */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:shadow-blue-500/10 transition-all border border-blue-500/20"
                aria-label="Ask AI Assistant"
            >
                {isOpen ? <X className="w-6 h-6 animate-spin-once" /> : <Bot className="w-6 h-6" />}
            </motion.button>

        </div>
    );
}
