"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
    Wallet, Flame, BookOpen, Video, ArrowUpRight, Gift, 
    CheckCircle, Clock, Trophy, Sparkles, Target, ArrowRight 
} from "lucide-react";
import Link from 'next/link';

// Mock data for the live student profile metrics
const initialBalance = 250.00;
const neuralPoints = 250;
const currentStreak = 4;
const totalStreakTarget = 7;
const globalRank = 142;
const level = 4;

const milestones = [
    {
        id: 1,
        title: "Practice Makes Perfect",
        description: "Complete 5 Practice Questions (PYQs)",
        current: 3,
        target: 5,
        reward: 50,
        icon: <BookOpen className="w-5 h-5 text-blue-500" />,
        color: "blue"
    },
    {
        id: 2,
        title: "Consistency is Key",
        description: "Maintain a 7-Day Login Streak",
        current: 4,
        target: 7,
        reward: 100,
        icon: <Flame className="w-5 h-5 text-orange-500" />,
        color: "orange"
    },
    {
        id: 3,
        title: "Visual Learner",
        description: "Watch 3 Video Explanations fully",
        current: 3,
        target: 3,
        reward: 30,
        icon: <Video className="w-5 h-5 text-purple-500" />,
        color: "purple",
        completed: true
    }
];

const transactions = [
    {
        id: 1,
        type: "Cashback Reward",
        description: "Claimed: Visual Learner Milestone",
        date: "Today, 10:45 AM",
        amount: "+₹30.00",
        positive: true
    },
    {
        id: 2,
        type: "Cashback Reward",
        description: "First Login Bonus",
        date: "Yesterday, 09:00 AM",
        amount: "+₹20.00",
        positive: true
    },
    {
        id: 3,
        type: "Redemption",
        description: "Unlock Premium Course Material",
        date: "Mar 30, 02:15 PM",
        amount: "-₹50.00",
        positive: false
    },
];

export default function LiveDashboard() {
    const [claimedMilestones, setClaimedMilestones] = useState<number[]>([]);
    const [balance, setBalance] = useState(initialBalance);

    const claimReward = (id: number, rewardAmt: number) => {
        if (claimedMilestones.includes(id)) return;
        setClaimedMilestones([...claimedMilestones, id]);
        setBalance(prev => prev + rewardAmt);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 px-4 py-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Dashboard Header Banner */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 rounded-full bg-blue-500/5 blur-3xl"></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-2xl shadow-md">
                            AS
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-950 dark:text-white">Welcome back, Arjun!</h1>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                    Level {level}
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm mt-0.5">Let's check your learning stats and reward balance today.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 relative z-10">
                        {/* Streak Metric */}
                        <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-950/20 px-4 py-2.5 rounded-2xl border border-orange-100 dark:border-orange-950/40">
                            <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
                            <div>
                                <div className="text-sm font-black text-gray-950 dark:text-white leading-none">{currentStreak} Days</div>
                                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Active Streak</span>
                            </div>
                        </div>

                        {/* Leaderboard Rank */}
                        <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/20 px-4 py-2.5 rounded-2xl border border-indigo-100 dark:border-indigo-950/40">
                            <Trophy className="w-6 h-6 text-indigo-500" />
                            <div>
                                <div className="text-sm font-black text-gray-950 dark:text-white leading-none">#{globalRank}</div>
                                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Global Rank</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Dashboard Metrics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Wallet & Balance */}
                    <div className="lg:col-span-1 space-y-6">
                        
                        {/* Balance Card */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-36 h-36 rounded-full bg-white/10 blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-28 h-28 rounded-full bg-white/10 blur-2xl"></div>

                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-xs md:text-sm font-bold tracking-wide uppercase opacity-90">
                                        <Wallet className="w-4 h-4" /> Live Wallet Earnings
                                    </span>
                                    <span className="px-2 py-0.5 bg-white/20 text-[10px] font-bold rounded uppercase">
                                        Live Balance
                                    </span>
                                </div>
                                
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-black">₹{balance.toFixed(2)}</h2>
                                    <p className="text-blue-100 text-xs mt-1.5 font-medium">Equates to {neuralPoints} Neural Points (1 pt = ₹1)</p>
                                </div>

                                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-[0.99] text-sm">
                                    Claim Cashback / Redeem <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>

                        {/* Recent History */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-4 border-b border-gray-50 dark:border-gray-800 pb-3">
                                <h3 className="text-base font-bold text-gray-950 dark:text-white flex items-center gap-2">
                                    <Clock className="w-4.5 h-4.5 text-gray-400" />
                                    Rewards Log
                                </h3>
                            </div>
                            <div className="space-y-4">
                                {transactions.map((tx) => (
                                    <div key={tx.id} className="flex items-center justify-between text-sm">
                                        <div>
                                            <p className="font-bold text-gray-950 dark:text-white">{tx.description}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{tx.date}</p>
                                        </div>
                                        <span className={`font-black ${tx.positive ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
                                            {tx.amount}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Milestones Progress */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Milestones Card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-950 dark:text-white">Active Milestones</h2>
                                    <p className="text-gray-400 text-xs md:text-sm mt-0.5">Solve questions, watch explanations, and earn instant cashback payouts.</p>
                                </div>
                                <div className="p-3 bg-orange-50 dark:bg-orange-950/20 text-orange-500 rounded-2xl w-fit shrink-0">
                                    <Gift className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                {milestones.map((milestone) => {
                                    const progress = (milestone.current / milestone.target) * 100;
                                    const isComplete = milestone.current >= milestone.target;
                                    const isClaimed = claimedMilestones.includes(milestone.id);

                                    return (
                                        <div key={milestone.id} className="flex gap-4">
                                            <div className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center bg-${milestone.color}-50 dark:bg-${milestone.color}-900/10 text-${milestone.color}-600 dark:text-${milestone.color}-400 border border-${milestone.color}-100/50 dark:border-${milestone.color}-900/20`}>
                                                {isComplete ? <CheckCircle className="w-5 h-5 text-green-500" /> : milestone.icon}
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                                    <div>
                                                        <h4 className="font-bold text-gray-950 dark:text-white text-base leading-tight">
                                                            {milestone.title}
                                                        </h4>
                                                        <p className="text-gray-400 text-xs mt-0.5">{milestone.description}</p>
                                                    </div>
                                                    <span className="font-black text-sm text-green-500 shrink-0">
                                                        +₹{milestone.reward}
                                                    </span>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="mt-3 flex items-center gap-3">
                                                    <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${progress}%` }}
                                                            transition={{ duration: 0.8 }}
                                                            className={`h-full rounded-full ${isComplete ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}
                                                        />
                                                    </div>
                                                    <span className="text-[11px] font-bold text-gray-500 shrink-0">
                                                        {milestone.current}/{milestone.target}
                                                    </span>
                                                </div>

                                                {/* Claim Action Row */}
                                                {isComplete && !isClaimed && (
                                                    <button 
                                                        onClick={() => claimReward(milestone.id, milestone.reward)}
                                                        className="mt-3.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-colors shadow active:scale-95 flex items-center gap-1.5"
                                                    >
                                                        Claim Reward <Sparkles className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                                {isClaimed && (
                                                    <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 rounded-lg text-xs font-bold border border-green-100 dark:border-green-900/30">
                                                        <CheckCircle className="w-3.5 h-3.5" /> Reward Transferred
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                        
                        {/* Quick Navigation Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Link href="/learning" className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-blue-200 hover:shadow transition-all flex items-center justify-between group">
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm font-bold text-gray-950 dark:text-white">Learn Syllabus</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-all" />
                            </Link>

                            <Link href="/learning/pyqs" className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-blue-200 hover:shadow transition-all flex items-center justify-between group">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-green-500" />
                                    <span className="text-sm font-bold text-gray-950 dark:text-white">Practice PYQs</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-all" />
                            </Link>

                            <Link href="/learning/ai-assistant" className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-blue-200 hover:shadow transition-all flex items-center justify-between group">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                    <span className="text-sm font-bold text-gray-950 dark:text-white">Ask AI Guide</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-all" />
                            </Link>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
