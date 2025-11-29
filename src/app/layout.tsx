import type { Metadata } from "next";
import "./globals.css";

import AIContactBubble from "./components/AIContactBubble";

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
        <AIContactBubble />
      </body>
    </html>
  );
}
