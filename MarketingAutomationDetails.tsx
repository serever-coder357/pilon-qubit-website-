import Link from 'next/link';
import { motion } from 'framer-motion';

export default function MarketingAutomationDetails() {
  const tiers = [
    { name: "Starter", price: "$299", popular: false, features: ["Chatbot", "Email automation", "Basic CRM", "Landing pages"] },
    { name: "Growth", price: "$599", popular: true, features: ["Everything in Starter", "24/7 AI Phone", "SMS", "Funnels", "Reputation"] },
    { name: "Pro", price: "$999", popular: false, features: ["Full AI suite", "Advanced integrations", "Dedicated manager"] },
    { name: "Enterprise", price: "Custom", popular: false, features: ["Custom AI training", "API access", "SLA", "Dedicated infrastructure"] }
  ];

  return (
    <div>
      <h2 className="text-4xl font-bold text-white mb-6">AI Marketing Automation</h2>
      <p className="text-cyan-100/70 text-lg mb-12 max-w-3xl">
        Save $3K+/mo on marketing staff. 24/7 AI that never sleeps.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((tier) => (
          <motion.div
            key={tier.name}
            whileHover={{ scale: 1.02 }}
            className={`relative bg-gradient-to-br from-[#1A1A4A] to-[#0A0A2A] border rounded-2xl p-6 ${tier.popular ? 'border-cyan-400 ring-2 ring-cyan-400/50' : 'border-cyan-500/30'}`}
          >
            {tier.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-400 text-black text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>}
            <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
            <div className="text-4xl font-bold text-cyan-400 mb-6">{tier.price}<span className="text-xl text-cyan-100/70">/mo</span></div>
            <ul className="space-y-3 mb-8 text-cyan-100/80 text-sm">
              {tier.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-cyan-400">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link href="/#contact" className={`block text-center px-6 py-3 rounded-lg font-semibold transition-all ${tier.popular ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
              {tier.popular ? 'Start Growing' : 'Get Started'}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
