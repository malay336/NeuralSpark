"use client";

import { useState, useRef, useEffect } from "react";
import api from "@/lib/api";
import { Send, Bot, User, Sparkles, HelpCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type Message = {
    id: string;
    sender: "user" | "ai";
    text: string;
    timestamp: Date;
};

const SUGGESTED_PROMPTS = [
    {
        title: "Explain Normalization",
        desc: "What is BCNF and how does it differ from 3NF?",
        prompt: "Explain BCNF (Boyce-Codd Normal Form) in Database Management Systems and highlight the key differences between 3NF and BCNF with a simple example."
    },
    {
        title: "Dijkstra's Algorithm",
        desc: "Explain shortest path logic with a trace.",
        prompt: "Explain how Dijkstra's algorithm works step-by-step. Provide a simple trace on a graph with 3 nodes (A, B, C) and edge weights."
    },
    {
        title: "Transformer Attention",
        desc: "What is GQA in modern LLMs?",
        prompt: "What is Grouped-Query Attention (GQA) in Large Language Models like Qwen/Llama? Compare it with Multi-Head Attention (MHA) and explain why it is efficient for edge deployment."
    }
];

export default function AIAssistantPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            sender: "ai",
            text: "Hello! I am your NeuralSpark Study Companion. Ask me any question related to Data Structures, Algorithms, Databases, AI, or general computer science, and I will provide a detailed conceptual explanation.",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const handleSend = async (textToSend: string) => {
        if (!textToSend.trim()) return;

        const userMsgId = Math.random().toString();
        const userMsg: Message = {
            id: userMsgId,
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
            console.error("AI Assistant query failed:", error);
            const errorMsg: Message = {
                id: Math.random().toString(),
                sender: "ai",
                text: "I encountered an error querying the model. Please make sure the Groq API key is configured correctly in the backend environment.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearChat = () => {
        setMessages([
            {
                id: "welcome",
                sender: "ai",
                text: "Hello! I am your NeuralSpark Study Companion. Ask me any question related to Data Structures, Algorithms, Databases, AI, or general computer science, and I will provide a detailed conceptual explanation.",
                timestamp: new Date()
            }
        ]);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 px-4 py-8 transition-colors duration-300">
            <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
                
                {/* Header Navbar */}
                <div className="flex items-center justify-between mb-6 shrink-0 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl shadow-sm">
                    <button
                        onClick={() => router.push("/learning")}
                        className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Learning Hub
                    </button>
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-extrabold text-gray-900 dark:text-white">AI Study Companion</span>
                    </div>
                    <button
                        onClick={handleClearChat}
                        className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                        title="Clear Conversation"
                    >
                        <RefreshCw className="w-4.5 h-4.5" />
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 min-h-0 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                    
                    {/* Chat Messages Log */}
                    <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                        
                        {/* Prompt Suggestions (only show if there is only the welcome message) */}
                        {messages.length === 1 && (
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                                    <HelpCircle className="w-4 h-4" /> Try asking about
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {SUGGESTED_PROMPTS.map((p, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSend(p.prompt)}
                                            className="text-left p-5 border border-gray-100 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-900/40 hover:border-blue-300 dark:hover:border-blue-800/80 rounded-2xl hover:shadow-md transition-all active:scale-[0.98]"
                                        >
                                            <h4 className="font-bold text-gray-850 dark:text-white text-sm mb-1.5 group-hover:text-blue-600">
                                                {p.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                                {p.desc}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Dialogue Bubbles */}
                        <div className="space-y-6">
                            <AnimatePresence initial={false}>
                                {messages.map((msg) => {
                                    const isAI = msg.sender === "ai";
                                    return (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className={`flex gap-3 items-start ${!isAI ? "flex-row-reverse" : ""}`}
                                        >
                                            {/* Avatar */}
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                                                isAI 
                                                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-200/30" 
                                                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                                            }`}>
                                                {isAI ? <Bot className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
                                            </div>

                                            {/* Text Bubble */}
                                            <div className={`max-w-[75%] p-4 rounded-2xl border leading-relaxed text-sm ${
                                                isAI
                                                    ? "bg-gray-50/40 dark:bg-gray-950/20 border-gray-100 dark:border-gray-800/80 text-gray-800 dark:text-gray-200"
                                                    : "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10"
                                            }`}>
                                                <p className="whitespace-pre-wrap font-medium leading-relaxed">
                                                    {msg.text}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>

                            {/* Typing Indicator */}
                            {loading && (
                                <div className="flex gap-3 items-start">
                                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center border border-blue-200/30">
                                        <Bot className="w-4.5 h-4.5 animate-pulse" />
                                    </div>
                                    <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-gray-50/40 dark:bg-gray-950/20 flex gap-1.5 items-center">
                                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                    </div>

                    {/* Chat Input Board */}
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 shrink-0">
                        <form 
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSend(input);
                            }}
                            className="flex gap-2"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your programming or GATE question here..."
                                disabled={loading}
                                className="flex-1 px-5 py-3.5 bg-gray-50/50 dark:bg-gray-800/40 border border-gray-250 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all outline-none text-sm font-semibold disabled:opacity-55"
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="px-5 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center"
                            >
                                <Send className="w-4.5 h-4.5" />
                            </button>
                        </form>
                    </div>

                </div>

            </div>
        </div>
    );
}
