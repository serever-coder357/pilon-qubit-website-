import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Public Analytics Dashboard',
  description: 'Real-time website analytics showing visitor metrics, engagement data, conversion funnels, and geographic distribution. Full transparency in action.',
  alternates: {
    canonical: '/analytics',
  },
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
