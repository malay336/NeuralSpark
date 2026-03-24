export default function ContactPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-6 text-gray-900">Contact Us</h1>
            <p className="text-gray-600 mb-8">We would love to hear from you!</p>

            <form className="space-y-4 max-w-md">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-black" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-black" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-black"></textarea>
                </div>
                <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Send Message</button>
            </form>
        </div>
    );
}
