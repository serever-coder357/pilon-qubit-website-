import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI ROI Calculator',
  description: 'Calculate the financial impact of your AI project with our interactive ROI calculator. Get CFO-ready business cases with detailed cost-benefit analysis and payback period estimation.',
  alternates: {
    canonical: '/roi-calculator',
  },
};

export default function ROICalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
