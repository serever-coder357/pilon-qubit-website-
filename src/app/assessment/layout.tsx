import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Readiness Assessment',
  description: 'Evaluate your organization\'s AI maturity with our comprehensive 25-question assessment. Get personalized recommendations and a downloadable PDF report.',
  alternates: {
    canonical: '/assessment',
  },
};

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
