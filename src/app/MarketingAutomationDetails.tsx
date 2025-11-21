import Link from 'next/link';

export default function MarketingAutomationDetails() {
  return (
    <div className="py-20 text-center">
      <h2 className="text-5xl font-bold text-white mb-8">AI Marketing Automation</h2>
      <p className="text-2xl text-cyan-100/80 mb-12 max-w-4xl mx-auto">
        Save $3K+/mo on marketing staff. Full AI platform — 24/7 operation, no contracts.
      </p>

      <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {[
          { name: "Starter", price: "$299", popular: false },
          { name: "Growth", price: "$599", popular: true },
          { name: "Pro", price: "$999", popular: false },
          { name: "Enterprise", price: "Custom", popular: false },
        ].map((tier) => (
          <div key={tier.name} className={`relative rounded-2xl p-8 border ${tier.popular ? 'border-cyan-400 ring-4 ring-cyan-400/50' : 'border-cyan-500/30'} bg-gradient-to-br from-[#1A1A4A] to-[#0A0A2A]`}>
            {tier.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-400 text-black text-sm font-bold px-4 py-1 rounded-full">MOST POPULAR</div>}
            <h3 className="text-2xl font-bold text-white mb-4">{tier.name}</h3>
            <div className="text-4xl font-bold text-cyan-400 mb-8">{tier.price}<span className="text-2xl text-cyan-100/70">/mo</span></div>
            <Link href="/#contact" className={`block text-center py-4 rounded-lg font-bold transition-all ${tier.popular ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
              {tier.popular ? 'Start Growing' : 'Get Started'}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
