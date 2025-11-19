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
    icon: '/pilonqubit.webp',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'PILON Qubit Ventures | AI & Frontier Tech Consulting',
    description: 'Transform your AI vision into production-ready solutions. Expert consulting in AI/ML, product acceleration, and go-to-market strategy.',
    url: 'https://pilonqubitventures.com',
    siteName: 'PILON Qubit Ventures',
    images: [{
      url: '/ai-consulting-hero.webp',
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
    images: ['/ai-consulting-hero.webp'],
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
    google: 'eHUgyjiXGuPVB1e730OgQ-Fz7CLwYh5Kkn4frJMQSpg',
  },
};

import StructuredData from './structured-data';
import GHLVoiceWidget from './components/GHLVoiceWidget';
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="eHUgyjiXGuPVB1e730OgQ-Fz7CLwYh5Kkn4frJMQSpg" />
        <StructuredData />
        
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-41LM56V1T8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-41LM56V1T8');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        {children}
        <GHLVoiceWidget />
        
        {/* PILON Qubit AI Chat Widget - Embeddable */}
        <Script 
          src="https://3000-iasvrsgqjeisyxnlw8690-372ee70e.manusvm.computer/chat-widget.js" 
          strategy="afterInteractive"
        />
        <Script id="pilon-chat-init" strategy="afterInteractive">
          {`
            window.PilonChatConfig = {
              apiUrl: 'https://3000-iasvrsgqjeisyxnlw8690-372ee70e.manusvm.computer/api/trpc',
              primaryColor: '#6366f1',
              position: 'bottom-left',
              companyName: 'PILON Qubit'
            };
            if (window.PilonChat) {
              window.PilonChat.init(window.PilonChatConfig);
            }
          `}
        </Script>
      </body>
    </html>
  );
}
