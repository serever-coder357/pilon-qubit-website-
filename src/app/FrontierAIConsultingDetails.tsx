import Link from 'next/link';

export default function FrontierAIConsultingDetails() {
  return (
    <div className="text-center py-20">
      <h2 className="text-4xl font-bold text-white mb-6">Frontier AI Consulting</h2>
      <p className="text-cyan-100/70 text-lg mb-12 max-w-3xl mx-auto">
        From strategy to production — we build real frontier AI systems that scale.
      </p>
      <div className="text-6xl mb-8">Coming Soon — Custom Solutions</div>
      <Link href="/#contact" className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-semibold rounded-lg hover:from-blue-400 hover:to-purple-500 transition-all">
        Book a Free Strategy Call
      </Link>
    </div>
  );
}
