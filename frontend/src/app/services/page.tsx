"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Send, CheckCircle } from "lucide-react";

type Service = {
    id: number;
    name: string;
    description: string;
    price: string | null;
};

/**
 * Services and Contact Form Page
 * 
 * Lists premium services fetched from the backend and provides a dynamic 
 * contact form. Demonstrates complex React state management for form data, 
 * loading states, error handling, and success notifications.
 */
export default function ServicesPage() {
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
                const { data } = await api.get("services");
                setServices(data);
            } catch (err) {
                console.error("Failed to fetch services", err);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    /**
     * Handles the contact form submission.
     * Prevents default page reload, validates inputs, and sends a POST request 
     * to the Django API to create a new Inquiry record.
     */
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
            await api.post("inquiries", {
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
        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 drop-shadow-sm">
                    Premium Services & Mentorship
                </h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Accelerate your career with customized 1-on-1 mentorship, intensive resume reviews, and expert career guidance from industry veterans.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left Side: Services List */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Offer</h2>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                        </div>
                    ) : services.length === 0 ? (
                        <div className="bg-gray-50 border border-gray-100 p-8 rounded-2xl text-center text-gray-500">
                            No specific services listed at the moment. Feel free to send a general inquiry!
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {services.map((svc) => (
                                <div key={svc.id} className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-gray-900">{svc.name}</h3>
                                        {svc.price && (
                                            <span className="bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full text-sm">
                                                ${svc.price}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                        {svc.description}
                                    </p>
                                    <button
                                        onClick={() => {
                                            setServiceId(svc.id.toString());
                                            document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors"
                                    >
                                        Inquire about this \u2192
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Side: Inquiry Form */}
                <div id="inquiry-form" className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
                    {/* Decorative background element */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-gradient-to-br from-blue-100 to-indigo-50 rounded-full opacity-50 pointer-events-none"></div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2 relative z-10">Send an Inquiry</h2>
                    <p className="text-gray-500 mb-8 relative z-10 w-11/12">
                        Get in touch! We typically respond within 24 hours.
                    </p>

                    {success ? (
                        <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-xl text-center flex flex-col items-center">
                            <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
                            <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                            <p className="text-sm">Thank you for reaching out. We'll be in touch shortly.</p>
                            <button
                                onClick={() => setSuccess(false)}
                                className="mt-6 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg text-sm font-semibold transition-colors"
                            >
                                Send another inquiry
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-300 text-black"
                                        placeholder="Jane Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-300 text-black"
                                        placeholder="jane@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Service (Optional)</label>
                                <select
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-black"
                                    value={serviceId}
                                    onChange={(e) => setServiceId(e.target.value)}
                                >
                                    <option value="">General Inquiry</option>
                                    {services.map(svc => (
                                        <option key={svc.id} value={svc.id}>{svc.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message <span className="text-red-500">*</span></label>
                                <textarea
                                    required
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-300 h-32 resize-none text-black"
                                    placeholder="How can we help you achieve your goals?"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-md ${submitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:-translate-y-0.5"
                                    }`}
                            >
                                {submitting ? "Sending..." : "Send Inquiry"}
                                {!submitting && <Send className="w-5 h-5" />}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
