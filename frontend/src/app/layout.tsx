import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AIAssistantWidget from "@/components/AIAssistantWidget";

import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "NeuralSpark",
  description: "E-learning and Q&A platform for students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="font-sans bg-gray-50 dark:bg-black min-h-screen flex flex-col transition-colors duration-300">
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            <main className="flex-1 w-full">
              {children}
            </main>

            <AIAssistantWidget />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

