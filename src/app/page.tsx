'use client';

import { useState } from 'react';
import Link from 'next/link';
import SmartContactForm from './components/SmartContactForm';

type ServiceKey = 'marketing' | 'consulting' | 'webdev' | null;

export default function HomePage() {
  const [selectedService, setSelectedService] = useState<ServiceKey>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A2A] via-[#1A1A4A] to-[#0A0A2A] text-white">
      {/* Top nav */}
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
            <a
              href="#services-section"
              className="text-white/80 hover:text-white transition-colors"
            >
              Services
            </a>
            <a
              href="#contact"
              className="text-white/80 hover:text-white transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        {/* HERO: text + video, NO CTA buttons */}
        <section className="grid gap-12 md:grid-cols-2 items-center mb-16">
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
            <p className="text-cyan-100/80 text-lg mb-2 max-w-xl">
              We partner with visionary founders and forward-thinking
              enterprises to transform bold ideas into market-ready products.
            </p>
            <p className="text-cyan-100/80 text-lg max-w-xl">
              Combining venture perspective with hands-on engineering, we
              deliver AI and quantum solutions that ship fast, scale reliably,
              and drive measurable business impact.
            </p>
          </div>

          <div className="rounded-3xl overflow-hidden border border-cyan-500/40 shadow-2xl bg-black/40">
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              controls
              poster="/ai-consulting-hero.webp"
            >
              {/* Hosted video in /public */}
              <source src="/pqv-new.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>

        {/* SERVICES SUMMARY CARDS */}
        <section id="services-section" className="mb-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* AI Marketing Automation */}
            <button
              type="button"
              onClick={() => setSelectedService('marketing')}
              className="text-left bg-gradient-to-br from-[#15153A] to-[#0B0B2E] border border-cyan-500/40 rounded-3xl p-8 flex flex-col hover:border-cyan-300 transition-all cursor-pointer"
            >
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
                <div className="text-cyan-100/60 text-xs mb-2">
                  Month-to-month • No contracts • Setup case by case
                </div>
                <div className="text-cyan-200 text-xs">
                  Click to view pricing →
                </div>
              </div>
            </button>

            {/* Frontier AI Consulting */}
            <button
              type="button"
              onClick={() => setSelectedService('consulting')}
              className="text-left bg-gradient-to-br from-[#15153A] to-[#0B0B2E] border border-blue-500/40 rounded-3xl p-8 flex flex-col hover:border-blue-300 transition-all cursor-pointer"
            >
              <h3 className="text-2xl font-bold mb-4">
                Frontier AI Consulting
              </h3>
              <p className="text-cyan-100/80 mb-6 text-sm">
                Custom AI development and strategic consulting for frontier
                technology companies – from LLM integrations to production
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
                <div className="text-cyan-100/60 text-xs mb-2">
                  Contact us for a tailored quote
                </div>
                <div className="text-cyan-200 text-xs">
                  Click to view details →
                </div>
              </div>
            </button>

            {/* Web Development */}
            <button
              type="button"
              onClick={() => setSelectedService('webdev')}
              className="text-left bg-gradient-to-br from-[#15153A] to-[#0B0B2E] border border-purple-500/40 rounded-3xl p-8 flex flex-col hover:border-purple-300 transition-all cursor-pointer"
            >
              <h3 className="text-2xl font-bold mb-4">Web Development</h3>
              <p className="text-cyan-100/80 mb-6 text-sm">
                Custom websites and web apps built with cutting-edge
                technology. Fast, responsive, secure, and AI-powered.
              </p>
              <ul className="space-y-2 text-sm text-cyan-100/85 mb-6">
                <li>✓ Custom Websites &amp; Landing Pages</li>
                <li>✓ Web Applications</li>
                <li>✓ AI Integration</li>
                <li>✓ Performance Optimized</li>
                <li>✓ Mobile Responsive</li>
              </ul>
              <div className="mt-auto">
                <div className="text-purple-300 font-semibold text-base mb-1">
                  Custom Quotes
                </div>
                <div className="text-cyan-100/60 text-xs mb-2">
                  Tailored pricing for your project
                </div>
                <div className="text-cyan-200 text-xs">
                  Click to view details →
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* DETAIL SECTIONS */}
        {selectedService === null && (
          <p className="text-center text-cyan-100/70 mb-16">
            Select one of the services above to see detailed options and
            pricing.
          </p>
        )}

        {selectedService === 'marketing' && <MarketingDetail />}
        {selectedService === 'consulting' && <ConsultingDetail />}
        {selectedService === 'webdev' && <WebDevelopmentDetail />}

        {/* CONTACT FORM (shared target for all CTAs) */}
        <section id="contact" className="mt-20 mb-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Contact PILON Qubit
          </h2>
          <p className="text-center text-cyan-100/80 mb-8">
            Tell us what you&apos;re trying to build or improve. We&apos;ll
            reply with a tailored plan and next steps.
          </p>
          <SmartContactForm />
        </section>
      </main>
    </div>
  );
}

/* ===========================
   DETAIL COMPONENTS
   =========================== */

function MarketingDetail() {
  return (
    <section className="mb-20">
      {/* Hero image */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          AI Marketing Automation
        </h2>
        <p className="text-cyan-100/80 mb-6 max-w-2xl mx-auto">
          Save ~$3K/mo on marketing staff with our complete AI-powered
          automation platform. 24/7 operation, no contracts.
        </p>
        <div className="rounded-3xl overflow-hidden border border-cyan-500/40 shadow-xl max-w-4xl mx-auto">
          <img
            src="/pilonqubit.webp"
            alt="AI Marketing Automation"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Pricing tiers */}
      <div className="grid lg:grid-cols-4 gap-6 mb-8">
        {/* Starter */}
        <div className="bg-gradient-to-br from-[#15153A] to-[#0B0B2E] border border-cyan-500/40 rounded-2xl p-6 flex flex-col">
          <h3 className="text-xl font-bold mb-1">Starter</h3>
          <div className="text-cyan-400 text-3xl font-extrabold mb-1">
            $299
          </div>
          <div className="text-cyan-100/60 text-sm mb-4">per month</div>
          <p className="text-cyan-100/75 text-sm mb-4">
            Perfect for small businesses getting started with AI automation.
          </p>
          <ul className="text-sm text-cyan-100/85 space-y-2 mb-4">
            <li>• Website chatbot (AI-powered)</li>
            <li>• Email marketing automation</li>
            <li>• Basic CRM &amp; contact management</li>
            <li>• Landing page builder</li>
            <li>• Email support</li>
            <li>• 1 user included</li>
          </ul>
          <button className="mt-auto px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-sm font-semibold">
            Get Started
          </button>
        </div>

        {/* Growth */}
        <div className="bg-gradient-to-br from-[#1F2152] to-[#181A40] border border-cyan-500 rounded-2xl p-6 flex flex-col relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-xs font-semibold px-3 py-1 rounded-full">
            MOST POPULAR
          </div>
          <h3 className="text-xl font-bold mt-2 mb-1">Growth</h3>
          <div className="text-cyan-400 text-3xl font-extrabold mb-1">
            $599
          </div>
          <div className="text-cyan-100/60 text-sm mb-4">per month</div>
          <p className="text-cyan-100/75 text-sm mb-4">
            For growing businesses ready to scale with AI.
          </p>
          <ul className="text-sm text-cyan-100/85 space-y-2 mb-4">
            <li>• Everything in Starter</li>
            <li>• AI phone assistant (24/7)</li>
            <li>• Advanced funnel builder</li>
            <li>• Appointment scheduling</li>
            <li>• Reputation management</li>
            <li>• Priority support</li>
            <li>• 3 users included</li>
          </ul>
          <button className="mt-auto px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-sm font-semibold">
            Start Growing
          </button>
        </div>

        {/* Pro */}
        <div className="bg-gradient-to-br from-[#15153A] to-[#0B0B2E] border border-cyan-500/40 rounded-2xl p-6 flex flex-col">
          <h3 className="text-xl font-bold mb-1">Pro</h3>
          <div className="text-cyan-400 text-3xl font-extrabold mb-1">
            $999
          </div>
          <div className="text-cyan-100/60 text-sm mb-4">per month</div>
          <p className="text-cyan-100/75 text-sm mb-4">
            Full AI suite for established businesses.
          </p>
          <ul className="text-sm text-cyan-100/85 space-y-2 mb-4">
            <li>• Everything in Growth</li>
            <li>• Full AI suite (voice, chat, SMS)</li>
            <li>• Advanced integrations &amp; workflows</li>
            <li>• Dedicated account manager</li>
            <li>• 24/7 phone support</li>
            <li>• 10 users included</li>
          </ul>
          <button className="mt-auto px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-sm font-semibold">
            Go Pro
          </button>
        </div>

        {/* Enterprise */}
        <div className="bg-gradient-to-br from-[#15153A] to-[#0B0B2E] border border-cyan-500/40 rounded-2xl p-6 flex flex-col">
          <h3 className="text-xl font-bold mb-1">Enterprise</h3>
          <div className="text-cyan-100 text-3xl font-extrabold mb-1">
            Custom
          </div>
          <div className="text-cyan-100/60 text-sm mb-4">
            tailored solutions
          </div>
          <p className="text-cyan-100/75 text-sm mb-4">
            Designed for large organizations with complex needs.
          </p>
          <ul className="text-sm text-cyan-100/85 space-y-2 mb-4">
            <li>• Everything in Pro</li>
            <li>• Custom AI model training</li>
            <li>• API access</li>
            <li>• Unlimited users</li>
            <li>• SLA guarantee</li>
            <li>• Strategic consulting</li>
          </ul>
          <a
            href="#contact"
            className="mt-auto inline-flex justify-center px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-sm font-semibold"
          >
            Contact Sales
          </a>
        </div>
      </div>

      {/* Value props */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-br from-[#1A1A4A] to-[#0A0A2A] border border-cyan-500/30 rounded-xl p-6">
          <div className="text-3xl mb-3">💰</div>
          <h4 className="text-xl font-bold mb-2">Save $3K/mo</h4>
          <p className="text-cyan-100/70">
            Replace expensive marketing staff with AI automation.
          </p>
        </div>
        <div className="bg-gradient-to-br from-[#1A1A4A] to-[#0A0A2A] border border-cyan-500/30 rounded-xl p-6">
          <div className="text-3xl mb-3">🤖</div>
          <h4 className="text-xl font-bold mb-2">24/7 Operation</h4>
          <p className="text-cyan-100/70">
            AI never sleeps – capture leads around the clock.
          </p>
        </div>
        <div className="bg-gradient-to-br from-[#1A1A4A] to-[#0A0A2A] border border-cyan-500/30 rounded-xl p-6">
          <div className="text-3xl mb-3">📄</div>
          <h4 className="text-xl font-bold mb-2">No Contracts</h4>
          <p className="text-cyan-100/70">
            Month-to-month pricing. Cancel anytime.
          </p>
        </div>
      </div>

      {/* Contact CTA to form */}
      <div className="bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/40 rounded-2xl p-8 text-center mb-4">
        <h3 className="text-2xl font-semibold mb-3">
          Prefer to Talk to a Human?
        </h3>
        <p className="text-cyan-100/80 mb-4">
          Our team can help you choose the right plan and design a rollout.
        </p>
        <a
          href="#contact"
          className="inline-flex px-8 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 font-semibold text-sm"
        >
          Contact Us
        </a>
      </div>
    </section>
  );
}

function ConsultingDetail() {
  return (
    <section className="mb-20">
      {/* Hero image */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Frontier AI Consulting
        </h2>
        <p className="text-cyan-100/80 mb-6 max-w-2xl mx-auto">
          From strategy to deployment, we deliver end-to-end AI solutions that
          drive real business impact. 10x faster development, 50% cost
          reduction.
        </p>
        <div className="rounded-3xl overflow-hidden border border-cyan-500/40 shadow-xl max-w-4xl mx-auto">
          <img
            src="/ai-consulting-hero.webp"
            alt="Frontier AI Consulting"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Capability grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <CapabilityCard
          title="AI Strategy & Assessment"
          items={[
            'AI Readiness Assessment',
            'Use-case discovery',
            'Roadmap & prioritization',
            'Executive strategy sessions',
          ]}
        />
        <CapabilityCard
          title="AI Strategy Development"
          items={[
            'Comprehensive AI strategy',
            'Technology & vendor selection',
            'Data strategy & governance',
            'Investment planning',
          ]}
        />
        <CapabilityCard
          title="Implementation & Development"
          items={[
            'Custom LLM integrations',
            'End-to-end AI product builds',
            'Agents & workflows',
            'MLOps & pipelines',
          ]}
        />
        <CapabilityCard
          title="AI Systems & Agents"
          items={[
            'Multi-agent orchestration',
            'Custom agents for ops & GTM',
            'Tool and API integration',
            'Monitoring & evaluation',
          ]}
        />
        <CapabilityCard
          title="Security & Reliability"
          items={[
            'Zero-trust security patterns',
            'Data privacy & access control',
            'Resilience & observability',
            'Incident response playbooks',
          ]}
        />
        <CapabilityCard
          title="AI Governance Framework"
          items={[
            'Policy templates',
            'Risk assessment',
            'Compliance checklists',
            'Human-in-the-loop design',
          ]}
        />
        <CapabilityCard
          title="Growth & GTM Intelligence"
          items={[
            'Market and competitor analysis',
            'AI-driven customer insights',
            'Experiment design',
            'Growth analytics',
          ]}
        />
        <CapabilityCard
          title="AI Benchmarking Service"
          items={[
            'Capability benchmarking',
            'Gap analysis vs peers',
            'Tooling comparison',
            'Executive reporting',
          ]}
        />
      </div>

      {/* Contact CTA */}
      <div className="bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/40 rounded-2xl p-8 text-center mb-4">
        <h3 className="text-2xl font-semibold mb-3">
          Ready to Transform Your Business with AI?
        </h3>
        <p className="text-cyan-100/80 mb-4">
          Let&apos;s discuss how our consulting services can help you hit your
          goals. Free consultation, no obligation.
        </p>
        <a
          href="#contact"
          className="inline-flex px-8 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 font-semibold text-sm"
        >
          Contact Us
        </a>
      </div>
    </section>
  );
}

function WebDevelopmentDetail() {
  return (
    <section className="mb-20">
      {/* Hero video */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Web Development</h2>
        <p className="text-cyan-100/80 mb-6 max-w-2xl mx-auto">
          Custom websites and web applications built with cutting-edge
          technology and AI integration. Fast, secure, and designed to convert.
        </p>
        <div className="rounded-3xl overflow-hidden border border-cyan-500/40 shadow-xl max-w-4xl mx-auto">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            controls
          >
            <source src="/pilonqubitvideo-original.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Capability grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <CapabilityCard
          title="Custom Websites"
          items={[
            'Modern, responsive design',
            'SEO-optimized architecture',
            'Headless CMS integration',
            'Brand-aligned visuals',
          ]}
        />
        <CapabilityCard
          title="Web Applications"
          items={[
            'React / Next.js frontends',
            'Node.js / API backends',
            'Real-time features',
            'Authentication & authz',
          ]}
        />
        <CapabilityCard
          title="Landing Pages"
          items={[
            'Conversion-optimized layouts',
            'A/B testing ready',
            'Fast load times (<2s)',
            'Lead capture forms',
          ]}
        />
        <CapabilityCard
          title="AI-Powered Features"
          items={[
            'AI chatbots & copilots',
            'Personalized content',
            'Recommendation systems',
            'Voice & image interfaces',
          ]}
        />
        <CapabilityCard
          title="Performance & Security"
          items={[
            '95+ Lighthouse scores',
            'CDN & caching strategy',
            'TLS/HTTPS everywhere',
            'DDoS & WAF integration',
          ]}
        />
        <CapabilityCard
          title="Ongoing Support"
          items={[
            'Continuous deployment',
            'Feature additions',
            'Performance tuning',
            'Monthly reporting',
          ]}
        />
      </div>

      {/* Tech stack & pricing summary */}
      <div className="bg-gradient-to-br from-[#15153A] to-[#0B0B2E] border border-cyan-500/40 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold mb-4">Technology Stack</h3>
        <div className="grid md:grid-cols-4 gap-6 text-sm text-cyan-100/85">
          <div>
            <h4 className="font-semibold mb-2">Frontend</h4>
            <ul className="space-y-1">
              <li>• React / Next.js</li>
              <li>• TypeScript</li>
              <li>• Tailwind CSS</li>
              <li>• Responsive design</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Backend</h4>
            <ul className="space-y-1">
              <li>• Node.js / Express</li>
              <li>• REST / GraphQL APIs</li>
              <li>• PostgreSQL / SQL</li>
              <li>• Authentication</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">AI Integration</h4>
            <ul className="space-y-1">
              <li>• OpenAI / Claude</li>
              <li>• Custom models</li>
              <li>• Vector databases</li>
              <li>• Semantic search</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Deployment</h4>
            <ul className="space-y-1">
              <li>• Vercel / AWS</li>
              <li>• CI/CD pipelines</li>
              <li>• Auto-scaling</li>
              <li>• Monitoring & alerts</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/40 rounded-2xl p-8 text-center mb-4">
        <h3 className="text-2xl font-semibold mb-3">
          Ready to Build Your Website?
        </h3>
        <p className="text-cyan-100/80 mb-4">
          Let&apos;s scope your project and create a custom quote. Free
          consultation, no obligations.
        </p>
        <a
          href="#contact"
          className="inline-flex px-8 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 font-semibold text-sm"
        >
          Get a Quote
        </a>
      </div>
    </section>
  );
}

interface CapabilityCardProps {
  title: string;
  items: string[];
}

function CapabilityCard({ title, items }: CapabilityCardProps) {
  return (
    <div className="bg-gradient-to-br from-[#15153A] to-[#0B0B2E] border border-cyan-500/40 rounded-2xl p-6">
      <h4 className="text-xl font-semibold mb-3">{title}</h4>
      <ul className="space-y-2 text-sm text-cyan-100/85">
        {items.map((item) => (
          <li key={item}>✓ {item}</li>
        ))}
      </ul>
    </div>
  );
}
