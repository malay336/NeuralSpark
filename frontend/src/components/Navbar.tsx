"use client";

import Link from 'next/link';
import { Search, UserCircle, Menu, Sun, Moon, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

/**
 * Navbar Component (Global Navigation)
 * 
 * Reusable top navigation bar for the platform.
 * It uses Framer Motion for a smooth drop-down entry animation on initial load,
 * and backdrop-blur for a modern glassmorphism aesthetic over scrolling content.
 */
export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { user, logout, isLoggedIn } = useAuth();

    return (
        <motion.nav
            // Animation config: slides down from -100px (off viewport) to 0.
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800/60 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md text-gray-900 dark:text-white shadow-sm transition-colors duration-300"
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Logo and Mobile Menu Toggle */}
                <div className="flex items-center gap-4">
                    <button className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white rounded-md">
                        <Menu className="h-6 w-6" />
                    </button>
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 font-bold text-white shadow-sm">
                            N
                        </div>
                        <span className="hidden text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:block">
                            NeuralSpark
                        </span>
                    </Link>
                </div>

                {/* Navigation Links (Desktop) */}
                <div className="hidden lg:flex flex-1 items-center justify-center gap-3 px-4">
                    <Link href="/learning" className="px-3 lg:px-4 py-2 rounded-xl bg-gray-50/60 dark:bg-white/5 border border-gray-150 dark:border-white/5 text-[10px] lg:text-xs font-black tracking-wider text-gray-700 dark:text-gray-200 hover:bg-blue-650 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white hover:border-transparent dark:hover:border-transparent hover:shadow-md transition-all duration-200 active:scale-[0.97] text-center flex flex-col items-center justify-center leading-tight w-28 lg:w-32 h-11">
                        <span>LEARNING</span>
                    </Link>
                    <Link href="/learning/pyqs" className="px-3 lg:px-4 py-2 rounded-xl bg-gray-50/60 dark:bg-white/5 border border-gray-150 dark:border-white/5 text-[10px] lg:text-xs font-black tracking-wider text-gray-700 dark:text-gray-200 hover:bg-blue-650 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white hover:border-transparent dark:hover:border-transparent hover:shadow-md transition-all duration-200 active:scale-[0.97] text-center flex flex-col items-center justify-center leading-tight w-28 lg:w-32 h-11">
                        <span>PRACTICE &</span>
                        <span>TEST</span>
                    </Link>
                    <Link href="/learning/ai-assistant" className="px-3 lg:px-4 py-2 rounded-xl bg-gray-50/60 dark:bg-white/5 border border-gray-150 dark:border-white/5 text-[10px] lg:text-xs font-black tracking-wider text-gray-700 dark:text-gray-200 hover:bg-blue-650 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white hover:border-transparent dark:hover:border-transparent hover:shadow-md transition-all duration-200 active:scale-[0.97] text-center flex flex-col items-center justify-center leading-tight w-28 lg:w-32 h-11">
                        <span>AI</span>
                        <span>ASSISTANT</span>
                    </Link>
                    <Link href="/products" className="px-3 lg:px-4 py-2 rounded-xl bg-gray-50/60 dark:bg-white/5 border border-gray-150 dark:border-white/5 text-[10px] lg:text-xs font-black tracking-wider text-gray-700 dark:text-gray-200 hover:bg-blue-650 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white hover:border-transparent dark:hover:border-transparent hover:shadow-md transition-all duration-200 active:scale-[0.97] text-center flex flex-col items-center justify-center leading-tight w-28 lg:w-32 h-11">
                        <span>PRODUCTS &</span>
                        <span>SERVICES</span>
                    </Link>
                    <Link href="/dashboard" className="px-3 lg:px-4 py-2 rounded-xl bg-gray-50/60 dark:bg-white/5 border border-gray-150 dark:border-white/5 text-[10px] lg:text-xs font-black tracking-wider text-gray-700 dark:text-gray-200 hover:bg-blue-650 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white hover:border-transparent dark:hover:border-transparent hover:shadow-md transition-all duration-200 active:scale-[0.97] text-center flex flex-col items-center justify-center leading-tight w-28 lg:w-32 h-11">
                        <span>LIVE</span>
                        <span>DASHBOARD</span>
                    </Link>
                    <Link href="/about" className="px-3 lg:px-4 py-2 rounded-xl bg-gray-50/60 dark:bg-white/5 border border-gray-150 dark:border-white/5 text-[10px] lg:text-xs font-black tracking-wider text-gray-700 dark:text-gray-200 hover:bg-blue-650 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white hover:border-transparent dark:hover:border-transparent hover:shadow-md transition-all duration-200 active:scale-[0.97] text-center flex flex-col items-center justify-center leading-tight w-28 lg:w-32 h-11">
                        <span>CONTACT</span>
                        <span>US</span>
                    </Link>
                </div>


                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white rounded-full transition-colors"
                        aria-label="Toggle Theme"
                    >
                        {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </button>
                    <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white rounded-full transition-colors">
                        <Search className="h-5 w-5" />
                    </button>
                    <Link href="/dashboard" className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 rounded-full transition-colors flex items-center gap-1.5 bg-green-50 dark:bg-green-900/10 px-3 border border-green-100 dark:border-green-900/30">
                        <Wallet className="h-4 w-4 text-green-600 dark:text-green-500" />
                        <span className="text-sm font-bold text-green-700 dark:text-green-400 hidden sm:block">₹250</span>
                    </Link>

                    {isLoggedIn ? (
                        <div className="relative group">
                            <button className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 p-1 pr-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center font-black text-xs">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    {user?.name}
                                </span>
                            </button>
                            
                            {/* Dropdown Menu */}
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg p-2 hidden group-hover:block z-50">
                                <Link href="/dashboard" className="w-full text-left block px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-850 text-xs font-bold text-gray-700 dark:text-gray-300 rounded-lg">
                                    Dashboard
                                </Link>
                                <a href="http://127.0.0.1:8000/admin/" target="_blank" rel="noopener noreferrer" className="w-full text-left block px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-xs font-bold text-blue-600 dark:text-blue-400 rounded-lg">
                                    Backend Admin CMS Portal
                                </a>
                                <button onClick={logout} className="w-full text-left block px-3 py-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-bold text-red-650 dark:text-red-450 rounded-lg">
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link href="/login" className="flex items-center gap-2 rounded-full border border-gray-205 dark:border-gray-700 p-1 pr-3 hover:bg-gray-105 dark:hover:bg-gray-800 transition-colors">
                            <UserCircle className="h-7 w-7 text-gray-400" />
                            <span className="text-sm font-medium text-gray-650 dark:text-gray-300">Login</span>
                        </Link>
                    )}
                </div>

            </div>
        </motion.nav>
    );
}
