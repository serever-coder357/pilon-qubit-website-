import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ContactDropdown from './ContactDropdown';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PILON Qubit Ventures – AI & Frontier Tech Consulting',
  description: 'AI & frontier tech consulting in San Antonio, TX',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0A0A2A] text-white min-h-screen`}>
        <header className="border-b border-cyan-500/20 bg-[#0A0A2A]/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">PQ</span>
              </div>
              <span className="text-white font-bold text-xl">PILON Qubit Ventures</span>
            </a>

            {/* Navigation */}
            <nav className="flex items-center gap-8">
              <a href="/services" className="text-cyan-400 font-semibold hover:text-cyan-300">
                Services
              </a>
              <a href="/#about" className="text-white/80 hover:text-white transition-colors">
                About
              </a>
              <ContactDropdown />   {/* ← Dropdown lives here */}
            </nav>
          </div>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}
