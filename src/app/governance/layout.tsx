import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Governance Templates',
  description: 'Production-ready AI governance frameworks, policies, and templates for ethics, model management, data governance, risk assessment, and compliance.',
  alternates: {
    canonical: '/governance',
  },
};

export default function GovernanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
