import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Benchmarking Tool',
  description: 'Compare your AI maturity against industry peers. Get actionable insights across data infrastructure, ML capabilities, talent, governance, and business impact.',
  alternates: {
    canonical: '/benchmarking',
  },
};

export default function BenchmarkingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
