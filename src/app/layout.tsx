import type { Metadata } from "next";
import "./globals.css";

import AIChatWidget from "./components/AIChatWidget";

export const metadata: Metadata = {
  title: "PILON Qubit Ventures",
  description: "PILON Qubit Ventures official website",
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
        {/* Existing AI assistant widget you already had */}
        <AIChatWidget />
      </body>
    </html>
  );
}
