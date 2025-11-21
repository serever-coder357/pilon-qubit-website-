import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

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
      <head>
        {/* Forces instant updates on live */}
        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} bg-[#0A0A2A] text-white min-h-screen`}>
        {/* Header */}
        <header className="border-b border-cyan-500/20 bg-[#0A0A2A]/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">PQ</span>
              </div>
              <span className="text-white font-bold text-xl">PILON Qubit Ventures</span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-8">
              <Link href="/services" className="text-cyan-400 font-semibold hover:text-cyan-300">
                Services
              </Link>
              <Link href="/#about" className="text-white/80 hover:text-white transition-colors">
                About
              </Link>

              {/* Hover Contact Dropdown */}
              <div className="relative group">
                <button className="text-white/80 hover:text-white transition-colors font-medium">
                  Contact
                </button>

                <div className="absolute right-0 mt-3 w-80 bg-[#1A1A4A] border border-cyan-500/50 rounded-xl shadow-2xl p-6 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
                  <h3 className="text-xl font-bold text-cyan-400 mb-4">Get in Touch</h3>
                                   <div className="space-y-4 text-sm">
                    <a href="tel:+12104600912" className="flex items-center gap-3 text-cyan-300 hover:text-cyan-100 block">
                      Phone 210-460-0912
                    </a>
                    <a href="mailto:hello@pilonqubitventures.com" className="flex items-center gap-3 text-cyan-300 hover:text-cyan-100 block">
                      Email hello@pilonqubitventures.com
                    </a>
                    <div className="text-cyan-200 pt-3 border-t border-cyan-500/30">
                      <p className="font-semibold">Visit Us</p>
                      <p className="text-cyan-300 leading-tight">
                        401 E Sonterra Blvd<br />
                        Ste 375<br />
                        San Antonio, TX 78258
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}
