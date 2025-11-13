import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Case Studies',
  description: 'Real results from real clients. See how PILON Qubit delivers 10x faster development, 50% cost reduction, and measurable business impact across industries.',
  alternates: {
    canonical: '/case-studies',
  },
};

export default function CaseStudiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
