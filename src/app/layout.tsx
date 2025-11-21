import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import ContactDropdown from './ContactDropdown';
import ChatbotButton from './ChatbotButton';

export const metadata: Metadata = {
  title: 'PILON Qubit Ventures – AI & Frontier Tech Consulting',
  description: 'AI & frontier tech consulting in San Antonio, TX',
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
      </head>
      <body className="font-sans bg-[#0A0A2A] text-white min-h-screen">
        {/* Header */}
        <header className="border-b border-cyan-500/20 bg-[#0A0A2A]/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">PQ</span>
              </div>
              <span className="text-white font-bold text-xl">PILON Qubit Ventures</span>
            </Link>

            <nav className="flex items-center gap-8">
              <Link href="/services#services" className="text-cyan-400 font-semibold hover:text-cyan-300">
                Services
              </Link>
              <Link href="/#about" className="text-white/80 hover:text-white transition-colors">
                About
              </Link>
              <ContactDropdown />
            </nav>
          </div>
        </header>

        <main>{children}</main>

        {/* AI Chatbot */}
        <ChatbotButton />
      </body>
    </html>
  );
}
