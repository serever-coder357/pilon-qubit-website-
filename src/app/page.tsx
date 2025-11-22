import ServicesContent from './components/ServicesContent';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return <ServicesContent />;
}
