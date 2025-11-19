import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Labs - Interactive Sandbox',
  description: 'Experiment with cutting-edge AI capabilities including conversational AI, text analysis, image understanding, data insights, and code generation.',
  alternates: { canonical: '/labs' },
};

export default function LabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
