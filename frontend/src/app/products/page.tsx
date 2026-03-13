import Link from "next/link";

export default function ProductsPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-6 text-gray-900">Store & Products</h1>
            <p className="text-gray-600 mb-8">Premium study materials and e-books.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/products/ai-grader" className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-all bg-white group hover:border-blue-300 flex flex-col items-start block">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-gray-900">AI Assignment Grader</h2>
                    <p className="text-gray-600 text-sm">Automate grading with Groq Llama 3.1 using custom rubrics.</p>
                </Link>
                <Link href="/products/ai-grader-customized" className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-all bg-white group hover:border-blue-300 flex flex-col items-start block">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-gray-900">Customized AI Grader</h2>
                    <p className="text-gray-600 text-sm">Automate grading with a natively loaded local fine-tuned model.</p>
                </Link>
            </div>
        </div>
    );
}
