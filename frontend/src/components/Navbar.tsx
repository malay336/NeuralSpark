"use client";

import Link from 'next/link';
import { Search, UserCircle, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Navbar Component (Global Navigation)
 * 
 * Reusable top navigation bar for the platform.
 * It uses Framer Motion for a smooth drop-down entry animation on initial load,
 * and backdrop-blur for a modern glassmorphism aesthetic over scrolling content.
 */
export default function Navbar() {
    return (
        <motion.nav
            // Animation config: slides down from -100px (off viewport) to 0.
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="sticky top-0 z-50 w-full border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-md text-white shadow-sm"
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Logo and Mobile Menu Toggle */}
                <div className="flex items-center gap-4">
                    <button className="md:hidden p-2 text-gray-400 hover:text-white rounded-md">
                        <Menu className="h-6 w-6" />
                    </button>
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 font-bold text-white">
                            N
                        </div>
                        <span className="hidden text-xl font-bold tracking-tight text-white sm:block">
                            NeuralSpark
                        </span>
                    </Link>
                </div>

                {/* Navigation Links (Desktop) */}
                <div className="hidden md:flex flex-1 items-center justify-center gap-8 px-4">
                    <Link href="/learning" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Learning
                    </Link>
                    <Link href="/practice-questions" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Practice Questions
                    </Link>
                    <Link href="/products" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Products
                    </Link>
                    <Link href="/services" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Services
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        About Us
                    </Link>
                    <Link href="/contact" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Contact Us
                    </Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <button className="p-2 text-gray-400 hover:text-white rounded-full">
                        <Search className="h-5 w-5" />
                    </button>
                    <button className="flex items-center gap-2 rounded-full border border-gray-700 p-1 pr-3 hover:bg-gray-800 transition-colors">
                        <UserCircle className="h-7 w-7 text-gray-400" />
                        <span className="text-sm font-medium text-gray-300">Login</span>
                    </button>
                </div>

            </div>
        </motion.nav>
    );
}
