"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Lock, Mail, User, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function LoginPage() {
    const { login, isLoggedIn } = useAuth();
    const router = useRouter();

    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // If already logged in, redirect to dashboard
    if (isLoggedIn) {
        router.push("/dashboard");
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (!email || !password || (isSignUp && !name)) {
            setError("Please fill in all the required fields.");
            return;
        }

        setLoading(true);

        // Simulate an API delay
        setTimeout(() => {
            const displayName = isSignUp ? name : email.split("@")[0];
            const success = login(displayName, email);
            
            setLoading(false);
            if (success) {
                router.push("/dashboard");
            } else {
                setError("Invalid login credentials.");
            }
        }, 1200);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50/50 dark:bg-gray-950 flex items-center justify-center px-4 py-12 transition-colors duration-300">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 dark:bg-blue-900/10 blur-[80px] rounded-full pointer-events-none"></div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl relative z-10"
            >
                {/* Header Logo & Title */}
                <div className="text-center space-y-2 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xl shadow-md mx-auto">
                        N
                    </div>
                    <h2 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">
                        {isSignUp ? "Create an Account" : "Welcome Back"}
                    </h2>
                    <p className="text-gray-400 text-xs md:text-sm">
                        {isSignUp 
                            ? "Sign up to start tracking your ranks and earning cashback." 
                            : "Login to access your personalized learning dashboard."}
                    </p>
                </div>

                {/* Form Errors */}
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-4 bg-red-50 dark:bg-red-950/20 border border-red-150 dark:border-red-900/30 text-red-650 dark:text-red-400 p-3.5 rounded-xl text-xs font-semibold"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Main Auth Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignUp && (
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-400 uppercase">Your Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Arjun Singh"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-400 uppercase">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="arjun@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-bold text-gray-400 uppercase">Password</label>
                            {!isSignUp && (
                                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                                    Forgot Password?
                                </span>
                            )}
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl py-3.5 transition-colors shadow-lg shadow-blue-600/10 flex items-center justify-center gap-2 active:scale-[0.99] text-sm mt-6"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                {isSignUp ? "Sign Up" : "Log In"}
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                {/* Toggle tab links */}
                <div className="text-center mt-6 text-xs text-gray-400 font-medium">
                    {isSignUp ? (
                        <span>
                            Already have an account?{" "}
                            <button onClick={() => setIsSignUp(false)} className="text-blue-600 dark:text-blue-400 hover:underline font-bold">
                                Log In
                            </button>
                        </span>
                    ) : (
                        <span>
                            Don't have an account?{" "}
                            <button onClick={() => setIsSignUp(true)} className="text-blue-600 dark:text-blue-400 hover:underline font-bold">
                                Sign Up
                            </button>
                        </span>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
