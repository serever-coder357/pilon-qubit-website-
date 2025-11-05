import type { Metadata } from 'next';
import './globals.css';

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'PILON Qubit Ventures',
  description: 'Quantum-grade strategy and product acceleration for AI and frontier tech.',
  metadataBase: new URL('https://pilonqubitventures.com'),
  openGraph: {
    title: 'PILON Qubit Ventures',
    description: 'Quantum-grade strategy and product acceleration for AI and frontier tech.',
    images: ['/og.jpg'],
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
