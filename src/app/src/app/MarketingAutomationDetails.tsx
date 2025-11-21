import Link from 'next/link';

export default function MarketingAutomationDetails() {
  return (
    <div>
      <h2 className="text-4xl font-bold text-white mb-6">AI Marketing Automation</h2>
      <p className="text-cyan-100/70 text-lg mb-12 max-w-3xl">
        Save $3K+/mo on marketing staff with our complete AI-powered platform. 24/7 operation, no contracts.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {/* Starter */}
        <div className="bg-gradient-to-br from-[#1A1A4A] to-[#0A0A2A] border border-cyan-500/30 rounded-2xl p-6">
          <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
          <div className="text-3xl font-bold text-cyan-400 mb-2">$299</div>
          <div className="text-cyan-100/60 text-sm mb-4">per month</div>
          <ul className="space-y-3 mb-6 text-sm text-cyan-100/80">
            <li>Website chatbot</li>
            <li>Email automation</li>
            <li>Basic CRM</li>
            <li>Landing pages</li>
          </ul>
          <Link href="/#contact" className="block text-center px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20">
            Get Started
          </Link>
        </div>

        {/* Growth — Highlighted */}
        <div className="bg-gradient-to-br from-[#1A1A4A] to-[#0A0A2A] border-2 border-cyan-400 ring-2 ring-cyan-400/50 rounded-2xl p-6">
          <div className="text-cyan-400 text-sm font-semibold mb-2">MOST POPULAR</div>
          <h3 className="text-2xl font-bold text-white mb-2">Growth</h3>
          <div className="text-3xl font-bold text-cyan-400 mb-2">$599</div>
          <div className="text-cyan-100/60 text-sm mb-4">per month</div>
          <ul className="space-y-3 mb-6 text-sm text-cyan-100/80">
            <li>Everything in Starter +</li>
            <li>24/7 AI phone assistant</li>
            <li>SMS marketing</li>
            <li>Advanced funnels</li>
            <li>Reputation management</li>
          </ul>
          <Link href="/#contact" className="block text-center px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400">
            Start Growing
          </Link>
        </div>

        {/* Pro & Enterprise — simplified for brevity */}
        <div className="bg-gradient-to-br from-[#1A1A4A] to-[#0A0A2A] border border-cyan-500/30 rounded-2xl p-6">
          <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
          <div className="text-3xl font-bold text-cyan-400 mb-2">$999</div>
          <Link href="/#contact" className="block text-center mt-8 px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20">
            Go Pro
          </Link>
        </div>

        <div className="bg-gradient-to-br from-[#1A1A4A] to-[#0A0A2A] border border-cyan-500/30 rounded-2xl p-6">
          <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
          <div className="text-3xl font-bold text-cyan-400 mb-2">Custom</div>
          <Link href="/#contact" className="block text-center mt-8 px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20">
            Contact Sales
          </Link>
        </div>
      </div>
    </div>
  );
}
