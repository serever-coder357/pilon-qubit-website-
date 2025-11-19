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
  other: {
    'google-site-verification': 'e-HUgyjiGUVB1730GQFZCWLyH5k4rJMQspg',
  },
};

import StructuredData from './structured-data';
import Script from 'next/script';
import AIChatbotWidget from './components/AIChatbotWidget';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData />
        
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PJB9M2T5');`}
        </Script>
        
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
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PJB9M2T5"
            height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        
        {children}
        <AIChatbotWidget />
      </body>
    </html>
  );
}
// Force rebuild Tue Nov 18 22:29:44 EST 2025
