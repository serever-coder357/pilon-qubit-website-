// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

import AdvancedVoiceAssistant from "./components/AdvancedVoiceAssistant";

export const metadata: Metadata = {
  title: "PILON Qubit Ventures",
  description:
    "PILON Qubit Ventures – AI-driven web, growth, and automation studio for ambitious SMBs and founders.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Advanced AI voice assistant fixed in bottom-right */}
        <AdvancedVoiceAssistant />
      </body>
    </html>
  );
}
