"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, Flame, BookOpen, Video, ArrowUpRight, Gift, CheckCircle, Clock } from "lucide-react";
import Link from 'next/link';

// Mock Data for the Wallet
const balance = 250.00;

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

export default function WalletDashboard() {
    const [claimedMilestones, setClaimedMilestones] = useState<number[]>([]);

    const claimReward = (id: number) => {
        setClaimedMilestones([...claimedMilestones, id]);
        // Simulate a balance update or confetti animation here
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
                
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-4"
                >
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            My Wallet & Rewards
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
                            Earn cashback by consistently crushing your learning goals.
                        </p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Balance & Transactions */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Balance Card */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden"
                        >
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-6 opacity-90">
                                    <Wallet className="w-5 h-5" />
                                    <span className="font-medium tracking-wide uppercase text-sm">Available Cashback</span>
                                </div>
                                <h2 className="text-5xl font-extrabold mb-1">
                                    ₹{balance.toFixed(2)}
                                </h2>
                                <p className="text-blue-100 text-sm mb-8">Equals to 250 Neural Points</p>

                                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2">
                                    Redeem Rewards <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>

                        {/* Recent Transactions */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm"
                        >
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-gray-400" />
                                History
                            </h3>
                            <div className="space-y-6">
                                {transactions.map((tx) => (
                                    <div key={tx.id} className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{tx.description}</p>
                                            <p className="text-xs text-gray-500 mt-1">{tx.date}</p>
                                        </div>
                                        <span className={`font-bold ${tx.positive ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
                                            {tx.amount}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Milestones */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-sm h-full"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Active Milestones</h2>
                                    <p className="text-gray-500 text-sm mt-1">Push yourself. The more you learn, the more you earn.</p>
                                </div>
                                <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-500">
                                    <Gift className="w-6 h-6" />
                                </div>
                            </div>

                            <div className="space-y-8">
                                {milestones.map((milestone, index) => {
                                    const progress = (milestone.current / milestone.target) * 100;
                                    const isComplete = milestone.current >= milestone.target;
                                    const isClaimed = claimedMilestones.includes(milestone.id);

                                    return (
                                        <motion.div 
                                            key={milestone.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + (index * 0.1) }}
                                            className="group relative"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={`mt-1 flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center bg-${milestone.color}-50 dark:bg-${milestone.color}-900/20 ring-1 ring-${milestone.color}-100 dark:ring-${milestone.color}-900/40`}>
                                                    {isComplete ? <CheckCircle className="w-6 h-6 text-green-500" /> : milestone.icon}
                                                </div>
                                                
                                                <div className="flex-1">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                                        <div>
                                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-blue-600 transition-colors">
                                                                {milestone.title}
                                                            </h3>
                                                            <p className="text-gray-500 text-sm">{milestone.description}</p>
                                                        </div>
                                                        <div className="font-black text-lg text-green-500 flex items-center gap-1">
                                                            +₹{milestone.reward}
                                                        </div>
                                                    </div>

                                                    {/* Progress Bar Area */}
                                                    <div className="mt-4 flex items-center gap-4">
                                                        <div className="flex-1 h-3 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                                            <motion.div 
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${progress}%` }}
                                                                transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                                                                className={`h-full rounded-full ${isComplete ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300 min-w-[3rem] text-right">
                                                            {milestone.current} / {milestone.target}
                                                        </span>
                                                    </div>

                                                    {/* Claim Action */}
                                                    {isComplete && !isClaimed && (
                                                        <motion.button 
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            onClick={() => claimReward(milestone.id)}
                                                            className="mt-4 px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 shadow-lg"
                                                        >
                                                            Claim Reward
                                                        </motion.button>
                                                    )}
                                                    {isClaimed && (
                                                        <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-sm font-bold">
                                                            <CheckCircle className="w-4 h-4" /> Reward Claimed
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
}
