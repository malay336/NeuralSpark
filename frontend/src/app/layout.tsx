import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AIAssistantWidget from "@/components/AIAssistantWidget";

import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 dark:bg-black min-h-screen flex flex-col transition-colors duration-300`}>
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 w-full">
            {children}
          </main>

          <AIAssistantWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}

