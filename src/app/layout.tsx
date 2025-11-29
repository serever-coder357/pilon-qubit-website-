import type { Metadata } from "next";
import "./globals.css";

import VoiceAssistantWidget from "./components/VoiceAssistantWidget";

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

        {/* Fixed voice AI assistant in bottom-right */}
        <div
          style={{
            position: "fixed",
            right: "1.5rem",
            bottom: "1.5rem",
            width: "360px",
            maxWidth: "90vw",
            zIndex: 40,
          }}
        >
          <VoiceAssistantWidget />
        </div>
      </body>
    </html>
  );
}
