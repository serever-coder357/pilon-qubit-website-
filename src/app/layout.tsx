import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import StructuredData from './structured-data';
import Script from 'next/script';
import AIChatbotWidget from './components/AIChatbotWidget';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const viewport = { width: 'device-width', initialScale: 1, maximumScale: 5 };

export const metadata: Metadata = {
  title: { default: 'PILON Qubit Ventures | AI & Frontier Tech Consulting', template: '%s | PILON Qubit Ventures' },
  description: 'Transform your AI vision into production-ready solutions. Expert consulting in AI/ML, product acceleration, security, and go-to-market strategy.',
  metadataBase: new URL('https://pilonqubitventures.com'),
  openGraph: { title: 'PILON Qubit Ventures | AI & Frontier Tech Consulting', url: 'https://pilonqubitventures.com', siteName: 'PILON Qubit Ventures', locale: 'en_US', type: 'website' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <meta name="google-site-verification" content="e-HUgyjiGUVB1730GQFZCWLyH5k4rJMQspg" />
      </Head>

      <head>
        <StructuredData />
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-PJB9M2T5');`}
        </Script>
      </head>

      <body className={inter.className}>
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PJB9M2T5" height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>
        {children}
        <AIChatbotWidget />
      </body>
    </html>
  );
}
