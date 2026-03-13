"use client";

import Link from "next/link";
import { BookOpen, HelpCircle, Package, Briefcase, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Home Component (Landing Page)
 * 
 * This is the main entry point for the NeuralSpark platform. 
 * It utilizes Framer Motion to create a highly polished, interactive experience 
 * with staggered entry animations and scroll reveals, demonstrating modern UI/UX principles.
 */
export default function Home() {
  // Define animation variants for the feature grid container.
  // 'staggerChildren: 0.15' ensures each card drops in sequentially rather than all at once.
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  // Define animation variants for individual cards within the grid.
  // The spring transition adds a natural, bouncy feel to the entrance.
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-gray-50 overflow-hidden">
      {/* Hero Section */}
      {/* 
        This section uses absolute positioning for background effects (like the blurred blue circle) 
        and relative positioning for the interactive text to create depth.
      */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-32 bg-gray-950 text-white overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>

        {/* Main Title Animation Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="relative z-10"
        >
          {/* Animated Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8 inline-flex items-center px-4 py-1.5 rounded-full border border-gray-700/50 bg-gray-800/30 backdrop-blur-md text-sm text-gray-300 shadow-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
            Welcome to the future of learning
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-blue-100 to-indigo-400 drop-shadow-sm">
            NeuralSpark
          </h1>
          <p className="text-lg md:text-xl text-blue-200/80 max-w-3xl mb-12 font-medium tracking-wide uppercase mx-auto">
            ALL IN ONE TECH SOLUTION AT ONE PLACE
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link href="/learning" className="group px-8 py-4 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-all text-lg font-bold shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] flex items-center justify-center gap-2 hover:-translate-y-1">
              Start Learning <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/services" className="group px-8 py-4 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all text-lg font-bold flex items-center justify-center gap-2 hover:-translate-y-1">
              Explore Services
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      {/* 
        This section reveals itself as the user scrolls down the page,
        utilizing Framer Motion's `whileInView` and `viewport` props.
      */}
      <section className="py-24 px-4 max-w-7xl mx-auto w-full relative z-20 -mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Everything You Need</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">Explore our comprehensive suites designed to accelerate your technical growth.</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {/* Learning Card */}
          <motion.div variants={itemVariants} className="h-full">
            <Link href="/learning" className="group h-full rounded-3xl border border-gray-200/60 bg-white/70 backdrop-blur-xl p-8 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Learning Hub</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Access curated video lectures, notes, and study material safely.</p>
            </Link>
          </motion.div>

          {/* Practice Questions Card */}
          <motion.div variants={itemVariants} className="h-full">
            <Link href="/practice-questions" className="group h-full rounded-3xl border border-gray-200/60 bg-white/70 backdrop-blur-xl p-8 shadow-sm hover:shadow-xl hover:border-green-300 transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 11-6 6v3h9l3-3" /><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Practice Q's</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Solve topic-wise questions to test and solidify your knowledge.</p>
            </Link>
          </motion.div>

          {/* Q&A Card */}
          <motion.div variants={itemVariants} className="h-full">
            <Link href="/learning/questions" className="group h-full rounded-3xl border border-gray-200/60 bg-white/70 backdrop-blur-xl p-8 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Ask doubts, solve problems, and collaborate with peers.</p>
            </Link>
          </motion.div>

          {/* Products Card */}
          <motion.div variants={itemVariants} className="h-full">
            <Link href="/products" className="group h-full rounded-3xl border border-gray-200/60 bg-white/70 backdrop-blur-xl p-8 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Store</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Discover premium tools like the AI grader and mock tests.</p>
            </Link>
          </motion.div>

          {/* Services Card */}
          <motion.div variants={itemVariants} className="h-full">
            <Link href="/services" className="group h-full rounded-3xl border border-gray-200/60 bg-white/70 backdrop-blur-xl p-8 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Services</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Book 1-on-1 mentorship, reviews, and guidance sessions.</p>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
