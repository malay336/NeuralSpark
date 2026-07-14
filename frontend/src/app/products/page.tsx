"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Send, CheckCircle, HelpCircle, Package, Briefcase, Award, ShieldCheck, Mail, User } from "lucide-react";
import { motion } from "framer-motion";


type Service = {
    id: number;
    name: string;
    description: string;
    price: string | null;
};

export default function ProductsPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [serviceId, setServiceId] = useState("");
    const [message, setMessage] = useState("");

    // Form submission states
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    // Fetch the list of services to populate the dropdown on mount
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data } = await api.get("services/");
                setServices(data);
            } catch (err) {
                console.error("Failed to fetch services", err);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !message) {
            setError("Please fill out all required fields.");
            return;
        }

        setSubmitting(true);
        setError("");
        setSuccess(false);

        try {
            await api.post("inquiries/", {
                name,
                email,
                service_id: serviceId ? parseInt(serviceId) : null,
                message,
            });
            setSuccess(true);
            setName("");
            setEmail("");
            setServiceId("");
            setMessage("");
        } catch (err) {
            setError("Something went wrong. Please try again later.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 px-4 py-12 md:py-16 transition-colors duration-300">
            <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">
                
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-950 dark:text-white tracking-tight uppercase">
                        Products & Services
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        Boost your career with custom AI tools, 1-on-1 mentorship, resume feedback, and personalized GATE preparation guidance.
                    </p>
                </div>

                {/* Section 1: AI Tools Store */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-850 pb-3">
                        <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h2 className="text-2xl font-bold text-gray-950 dark:text-white">AI Tools Store</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link href="/products/ai-grader" className="group p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900/30 transition-all flex flex-col items-start active:scale-[0.995]">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shrink-0">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                AI Assignment Grader
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
                                Automate answer grading using Groq Llama 3.1 with customized marking rubrics.
                            </p>
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:underline mt-auto">
                                Explore Grader &rarr;
                            </span>
                        </Link>

                        <Link href="/products/ai-grader-customized" className="group p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900/30 transition-all flex flex-col items-start active:scale-[0.995]">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shrink-0">
                                <Award className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                Customized AI Grader
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
                                Secure assignment evaluation natively integrated with local, fine-tuned LLMs.
                            </p>
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:underline mt-auto">
                                Explore Customized &rarr;
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Section 2: Mentorship & Premium Services */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-850 pb-3">
                        <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h2 className="text-2xl font-bold text-gray-950 dark:text-white">Mentorship & Services</h2>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                        </div>
                    ) : services.length === 0 ? (
                        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-2xl text-center text-gray-500">
                            No specific services listed at the moment. Feel free to send a general inquiry below!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {services.map((svc) => (
                                <div key={svc.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-3 gap-4">
                                            <h3 className="text-lg font-bold text-gray-950 dark:text-white leading-tight">{svc.name}</h3>
                                            {svc.price && (
                                                <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-extrabold px-3 py-1 rounded-full text-xs shrink-0 tracking-wider">
                                                    ₹{svc.price}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
                                            {svc.description}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setServiceId(svc.id.toString());
                                            document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="text-blue-600 dark:text-blue-400 hover:underline font-bold text-xs w-fit flex items-center gap-1.5"
                                    >
                                        Inquire about this &rarr;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Section 3: Premium Inquiry Form */}
                <div id="inquiry-form" className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800/80 relative overflow-hidden max-w-3xl mx-auto">
                    <div className="relative z-10 space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-950 dark:text-white">Send an Inquiry</h2>
                            <p className="text-gray-400 text-xs md:text-sm mt-1">
                                Interested in booking mentorship or a premium tool license? Fill in details below.
                            </p>
                        </div>

                        {success ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400 p-6 rounded-2xl text-center flex flex-col items-center"
                            >
                                <CheckCircle className="w-12 h-12 text-green-500 mb-3 animate-bounce" />
                                <h3 className="text-xl font-bold mb-1">Inquiry Sent Successfully!</h3>
                                <p className="text-sm text-gray-500">Thank you for reaching out. We will get back to you within 24 hours.</p>
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="mt-5 px-5 py-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-800 dark:text-green-400 rounded-xl text-xs font-bold transition-colors"
                                >
                                    Send another inquiry
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="bg-red-50 text-red-650 p-3 rounded-lg text-sm border border-red-150">
                                        {error}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Your Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-450 focus:outline-none focus:border-blue-500 transition-colors"
                                            placeholder="Arjun Singh"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-450 focus:outline-none focus:border-blue-500 transition-colors"
                                            placeholder="arjun@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Service category</label>
                                    <select
                                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors bg-white"
                                        value={serviceId}
                                        onChange={(e) => setServiceId(e.target.value)}
                                    >
                                        <option value="">General Inquiry / Custom Order</option>
                                        {services.map(svc => (
                                            <option key={svc.id} value={svc.id}>{svc.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Message Detail</label>
                                    <textarea
                                        required
                                        rows={4}
                                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-450 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                        placeholder="Explain your goals or mentorship requests..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-md ${
                                        submitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 hover:-translate-y-0.5"
                                    }`}
                                >
                                    {submitting ? "Sending..." : "Submit Inquiry"}
                                    {!submitting && <Send className="w-4 h-4" />}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
