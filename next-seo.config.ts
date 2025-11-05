import { DefaultSeoProps } from 'next-seo';

const config: DefaultSeoProps = {
  titleTemplate: '%s | PILON Qubit Ventures',
  defaultTitle: 'PILON Qubit Ventures',
  description: 'Quantum-grade strategy and product acceleration for AI and frontier tech.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pilonqubitventures.com',
    siteName: 'PILON Qubit Ventures',
  },
  twitter: { cardType: 'summary_large_image' },
};
export default config;
