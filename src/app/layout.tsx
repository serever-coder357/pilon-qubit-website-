// src/app/layout.tsx

import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { VoiceAssistantWidget } from "./components/VoiceAssistantWidget";

// FONT (adjust if you’re using something else)
const inter = Inter({ subsets: ["latin"] });

// SEO METADATA (customize later)
export const metadata: Metadata = {
  title: "PILON Qubit Ventures",
  description: "AI & Frontier Tech Consulting | San Antonio, TX",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Main App Content */}
        {children}

        {/* GLOBAL VOICE ASSISTANT */}
        <VoiceAssistantWidget />
      </body>
    </html>
  );
}
