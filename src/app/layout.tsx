import type { Metadata } from 'next';
import './globals.css';

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: 'PILON Qubit Ventures | AI & Frontier Tech Consulting',
    template: '%s | PILON Qubit Ventures',
  },
  description: 'Transform your AI vision into production-ready solutions. Expert consulting in AI/ML, product acceleration, security, and go-to-market strategy for frontier technology companies.',
  keywords: ['AI consulting', 'machine learning', 'frontier tech', 'product acceleration', 'AI strategy', 'ML engineering', 'tech consulting', 'LLM integration', 'AI agents', 'security consulting'],
  authors: [{ name: 'PILON Qubit Ventures' }],
  creator: 'PILON Qubit Ventures',
  publisher: 'PILON Qubit Ventures',
  metadataBase: new URL('https://pilonqubitventures.com'),
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/pilonqubit.jpg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'PILON Qubit Ventures | AI & Frontier Tech Consulting',
    description: 'Transform your AI vision into production-ready solutions. Expert consulting in AI/ML, product acceleration, and go-to-market strategy.',
    url: 'https://pilonqubitventures.com',
    siteName: 'PILON Qubit Ventures',
    images: [{
      url: '/ai-consulting-hero.jpg',
      width: 1200,
      height: 630,
      alt: 'PILON Qubit Ventures - AI and Frontier Technology Consulting',
    }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PILON Qubit Ventures | AI & Frontier Tech Consulting',
    description: 'Transform your AI vision into production-ready solutions.',
    images: ['/ai-consulting-hero.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification_token',
  },
};

import StructuredData from './structured-data';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
