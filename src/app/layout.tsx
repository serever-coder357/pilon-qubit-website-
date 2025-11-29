import type { Metadata } from "next";
import "./globals.css";
import { VoiceAssistantWidget } from "@/app/components/VoiceAssistantWidget";

export const metadata: Metadata = {
  title: "Pilon Qubit Ventures – AI Consulting & Development",
  description:
    "Pilon Qubit Ventures partners with visionary founders and operators to build AI-powered products, marketing systems, and web experiences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50 antialiased">
        {children}
        <VoiceAssistantWidget />
      </body>
    </html>
  );
}
