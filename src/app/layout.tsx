import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import RealtimeConciergeWidget from "./components/RealtimeConciergeWidget";

const ENABLE_REALTIME_CONCIERGE = false; // leave false while we focus on the new widget

export const metadata: Metadata = {
  title: "Pilon Qubit Ventures",
  description:
    "Pilon Qubit Ventures helps small and medium businesses with modern web, marketing, and AI-powered growth systems.",
  metadataBase: new URL("https://pilonqubitventures.com"),
  openGraph: {
    title: "Pilon Qubit Ventures",
    description:
      "Modern web, marketing, and AI systems to help small and medium businesses grow.",
    url: "https://pilonqubitventures.com",
    siteName: "Pilon Qubit Ventures",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pilon Qubit Ventures",
    description:
      "Modern web, marketing, and AI systems to help small and medium businesses grow.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-950 text-slate-50 antialiased">
        {children}

        {/* Old realtime concierge (turned off for now) */}
        {ENABLE_REALTIME_CONCIERGE && <RealtimeConciergeWidget />}

        {/* PQV Customer Chat Widget (text + voice) */}
        <Script
          src="/widget.js"
          strategy="afterInteractive"
          data-widget-id="pilonqubit-main"
          data-api-url={process.env.NEXT_PUBLIC_WIDGET_API_URL || ""}
        />
      </body>
    </html>
  );
}
