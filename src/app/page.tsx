'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A2A] via-[#1A1A4A] to-[#0A0A2A] text-white">
      {/* Top nav (simple, matches brand) */}
      <header className="border-b border-cyan-500/20 bg-[#0A0A2A]/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">PQ</span>
            </div>
            <span className="text-white font-bold text-xl">
              PILON Qubit Ventures
            </span>
          </Link>
          <nav className="flex gap-8">
            <Link
              href="/services"
              className="text-white/80 hover:text-white transition-colors"
            >
              Services
            </Link>
            <Link
              href="/#contact-card"
              className="text-white/80 hover:text-white transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        {/* HERO – text + video side by side */}
        <section className="grid gap-12 md:grid-cols-2 items-center mb-16">
          {/* Left: copy */}
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Where Frontier
              <br />
              Technology Meets
              <br />
              Operator{' '}
              <span className="text-cyan-400">
                Grit
              </span>
            </h1>
            <p className="text-cyan-100/80 text-lg mb-8 max-w-xl">
              We partner with visionary founders and forward-thinking
              enterprises to transform bold ideas into market-ready products.
              Combining venture perspective with hands-on engineering, we
              deliver AI and quantum solutions that ship fast, scale reliably,
              and drive measurable business impact.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 font-semibold text-sm md:text-base"
              >
                Start Building
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-cyan-400/70 hover:border-cyan-300 text-cyan-200 hover:text-white font-semibold text-sm md:text-base"
              >
                See Our Approach
              </Link>
            </div>
          </div>

          {/* Right: hero video */}
          <div className="rounded-3xl overflow-hidden border border-cyan-500/40 shadow-2xl bg-black/40">
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              controls
              poster="/ai-consulting-hero.webp"
            >
              {/* If you host the video at /pqv-new.mp4 in /public */}
              <source src="/pqv-new.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>

        {/* 3 SERVICE CARDS – like your screenshot */}
        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            {/* AI Marketing Automation */}
            <div className="bg-gradient-to-br from-[#15153A] to-[#0B0B2E] border border-cyan-500/40 rounded-3xl p-8 flex flex-col">
              <h3 className="text-2xl font-bold mb-4">
                AI Marketing Automation
              </h3>
              <p className="text-cyan-100/80 mb-6 text-sm">
                Complete marketing automation platform powered by AI. Save
                ~$3K/mo on marketing staff with 24/7 automated operations.
              </p>
              <ul className="space-y-2 text-sm text-cyan-100/85 mb-6">
                <li>✓ AI Voice Assistant (24/7 phone)</li>
                <li>✓ Conversation AI (chat + SMS)</li>
                <li>✓ Review Management</li>
                <li>✓ Content Generation</li>
                <li>✓ Funnel Builder</li>
                <li>✓ Workflow Automation</li>
              </ul>
              <div className="mt-auto">
                <div className="text-cyan-400 font-semibold text-base mb-1">
                  Starting at $299/mo
                </div>
                <div className="text-cyan-100/60 text-xs mb-4">
                  Month-to-month • No contracts • Setup determined case by case
                </div>
                <Link
                  href="/services"
                  className="inline-flex w-full items-center justify-center px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-sm font-semibold"
                >
                  View Pricing &amp; Features →
                </Link>
              </div>
            </div>

            {/* Frontier AI Consulting */}
            <div className="bg-gradient-to-br from-[#15153A] to-[#0B0B2E] border border-blue-500/40 rounded-3xl p-8 flex flex-col">
              <h3 className="text-2xl font-bold mb-4">
                Frontier AI Consulting
              </h3>
              <p className="text-cyan-100/80 mb-6 text-sm">
                Custom AI development and strategic consulting for frontier
                technology companies. From LLM integrations to production
                infrastructure.
              </p>
              <ul className="space-y-2 text-sm text-cyan-100/85 mb-6">
                <li>✓ AI Strategy &amp; Assessment</li>
                <li>✓ Implementation &amp; Development</li>
                <li>✓ Security &amp; Governance</li>
                <li>✓ Growth &amp; Analytics</li>
                <li>✓ 10x faster development</li>
                <li>✓ 50% cost reduction</li>
              </ul>
              <div className="mt-auto">
                <div className="text-blue-400 font-semibold text-base mb-1">
                  Custom Pricing
                </div>
                <div className="text-cyan-100/60 text-xs mb-4">
                  Contact us for a tailored quote
                </div>
                <Link
                  href="/services"
                  className="inline-flex w-full items-center justify-center px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-sm font-semibold"
                >
                  View Services →
                </Link>
              </div>
            </div>

            {/* Web Development */}
            <div className="bg-gradient-to-br from-[#15153A] to-[#0B0B2E] border border-purple-500/40 rounded-3xl p-8 flex flex-col">
              <h3 className="text-2xl font-bold mb-4">Web Development</h3>
              <p className="text-cyan-100/80 mb-6 text-sm">
                Custom websites and web applications built with cutting-edge
                technology. Fast, responsive, and AI-powered.
              </p>
              <ul className="space-y-2 text-sm text-cyan-100/85 mb-6">
                <li>✓ Custom Websites</li>
                <li>✓ Web Applications</li>
                <li>✓ Landing Pages</li>
                <li>✓ AI Integration</li>
                <li>✓ Performance Optimized</li>
                <li>✓ Mobile Responsive</li>
              </ul>
              <div className="mt-auto">
                <div className="text-purple-300 font-semibold text-base mb-1">
                  Custom Quotes
                </div>
                <div className="text-cyan-100/60 text-xs mb-4">
                  Tailored pricing for your project
                </div>
                <Link
                  href="/services"
                  className="inline-flex w-full items-center justify-center px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-sm font-semibold"
                >
                  View Details →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT CARD AT BOTTOM OF HOME */}
        <section id="contact-card" className="max-w-4xl mx-auto mt-8">
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">
              Prefer to Talk to a Human?
            </h2>
            <p className="text-cyan-100/80 mb-5 text-sm md:text-base">
              Tell us what you&apos;re trying to build or improve, and we&apos;ll
              share a tailored plan within 24 hours. No pressure, no jargon.
            </p>
            <Link
              href="/contact"
              className="inline-flex px-8 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 font-semibold text-sm md:text-base"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
