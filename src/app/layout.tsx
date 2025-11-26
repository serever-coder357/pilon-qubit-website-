// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import AIWidget from "@/app/components/AIWidget";

export const metadata: Metadata = {
  title: "Pilon Qubit Ventures",
  description:
    "Pilon Qubit Ventures — building and scaling AI-native products, web platforms, and growth systems.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased">
        <div className="flex min-h-screen flex-col">{children}</div>
        <AIWidget />
      </body>
    </html>
  );
}
