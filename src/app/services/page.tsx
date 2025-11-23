'use client';

import Image from 'next/image';
import { useState } from 'react';

type ServiceKey = 'marketing' | 'consulting' | 'webdev';

export default function ServicesPage() {
  const [selected, setSelected] = useState<ServiceKey>('marketing');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A2A] via-[#1A1A4A] to-[#0A0A2A]">
      <div className="container mx-auto px-6 py-16">
        {/* HERO WITH WORKSPACE IMAGE */}
        <section className="mb-16">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-cyan-400 mb-3">Services</p>
              <h1 className="text-4xl font-bold mb-4">
                AI & Web Services Built for Real Business Outcomes
              </h1>
              <p className="text-cyan-100/80 mb-4">
                From AI-powered marketing systems to custom web platforms, we design, build, and operate
                production-grade solutions that drive revenue, reduce costs, and unlock new capabilities.
              </p>
              <p className="text-cyan-100/60 text-sm">
                Based in San Antonio, working with founders, enterprises, and technical teams across North America.
              </p>
            </div>
            <div className="relative h-64 md:h-80">
              <Image
                src="/ai-workspace.jpg"
                alt="Workspace with AI dashboard and marketing analytics"
                fill
                className="object-cover rounded-2xl border border-cyan-700/40 shadow-xl"
                sizes="(max-width: 768px) 100vw, 600px"
                priority
              />
            </div>
          </div>
        </section>

        {/* SERVICE TABS */}
        <section className="mb-16">
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {[
              { key: 'marketing', label: 'AI Marketing Automation' },
              { key: 'consulting', label: 'Frontier AI Consulting' },
              { key: 'webdev', label: 'Web Development' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelected(tab.key as ServiceKey)}
                className={`px-4 py-2 rounded-full border text-sm transition ${
                  selected === tab.key
                    ? 'bg-cyan-500 text-black border-cyan-300'
                    : 'border-cyan-500/60 text-cyan-200 hover:bg-cyan-500/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {selected === 'marketing' && <MarketingSection />}
          {selected === 'consulting' && <ConsultingSection />}
          {selected === 'webdev' && <WebDevSection />}
        </section>

        {/* COMMON SECTIONS */}
        <TechnologyStackSection />
        <CustomPricingSection />
      </div>
    </div>
  );
}

function MarketingSection() {
  return (
    <div className="max-w-5xl mx-auto bg-[#0E1030]/70 border border-cyan-900/60 rounded-2xl p-8 shadow-xl">
      <h2 className="text-3xl font-bold mb-3 text-cyan-100">AI Marketing Automation</h2>
      <p className="text-cyan-100/80 mb-6">
        Always-on marketing operations powered by AI. We connect chat, voice, SMS, email, and CRM to create a
        single automated system that captures, nurtures, and converts leads 24/7.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-cyan-400 mb-3">Capabilities</h3>
          <ul className="text-cyan-100/80 space-y-1">
            <li>• AI Voice Assistant (24/7 phone)</li>
            <li>• Conversation AI (chat + SMS)</li>
            <li>• Review Management & reputation automation</li>
            <li>• Content Generation for campaigns & funnels</li>
            <li>• Funnel & journey builder</li>
            <li>• Workflow Automation across tools</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-cyan-400 mb-3">Sample Packages</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl border border-cyan-900/60 bg-[#090b25]/80 p-4">
              <div className="text-xs font-semibold text-cyan-300 mb-1 uppercase tracking-wide">
                Starter
              </div>
              <div className="text-2xl font-bold text-cyan-100 mb-1">$299</div>
              <div className="text-cyan-100/60 mb-3">per month</div>
              <ul className="text-cyan-100/80 space-y-1">
                <li>• Website chatbot</li>
                <li>• Basic email automation</li>
                <li>• Simple funnel & lead capture</li>
              </ul>
            </div>
            <div className="rounded-xl border border-cyan-500/60 bg-[#091028]/90 p-4">
              <div className="text-xs font-semibold text-cyan-300 mb-1 uppercase tracking-wide">
                Growth
              </div>
              <div className="text-2xl font-bold text-cyan-100 mb-1">$599</div>
              <div className="text-cyan-100/60 mb-3">per month</div>
              <ul className="text-cyan-100/80 space-y-1">
                <li>• Full AI assistant (voice, chat, SMS)</li>
                <li>• Advanced funnels & workflows</li>
                <li>• Appointment scheduling & reminders</li>
                <li>• Reputation & review automation</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-cyan-100/50 mt-3">
            Enterprise & custom plans available for high-volume and multi-brand deployments.
          </p>
        </div>
      </div>
    </div>
  );
}

function ConsultingSection() {
  return (
    <div className="max-w-5xl mx-auto bg-[#0E1030]/70 border border-cyan-900/60 rounded-2xl p-8 shadow-xl">
      <h2 className="text-3xl font-bold mb-3 text-cyan-100">Frontier AI Consulting</h2>
      <p className="text-cyan-100/80 mb-6">
        Partner with a team that has built and shipped AI systems, not just slideware. We help you define the
        right use cases, design architecture, and deliver production-ready solutions.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-cyan-400 mb-3">What We Cover</h3>
          <ul className="text-cyan-100/80 space-y-1">
            <li>• AI Strategy & Assessment</li>
            <li>• Implementation & Development</li>
            <li>• Security, Governance & risk controls</li>
            <li>• Growth Analytics & experimentation</li>
            <li>• 10x faster development by reusing battle-tested patterns</li>
            <li>• Up to 50% cost reduction vs. building from scratch</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-cyan-400 mb-3">Engagement Models</h3>
          <ul className="text-cyan-100/80 space-y-1">
            <li>• Discovery & architecture sprint (2–4 weeks)</li>
            <li>• Build & integrate (6–12 weeks)</li>
            <li>• Production hardening & rollout</li>
            <li>• Ongoing advisory & roadmap support</li>
          </ul>
          <p className="text-sm text-cyan-100/70 mt-4">
            We adapt to your team — from low-code integrations to deep work with your engineering org.
          </p>
        </div>
      </div>
    </div>
  );
}

function WebDevSection() {
  return (
    <div className="max-w-5xl mx-auto bg-[#0E1030]/70 border border-cyan-900/60 rounded-2xl p-8 shadow-xl">
      <h2 className="text-3xl font-bold mb-3 text-cyan-100">Web Development</h2>
      <p className="text-cyan-100/80 mb-6">
        Modern, fast, AI-ready websites and web applications built on the same stack we use for our own products.
        Designed for performance, conversions, and long-term maintainability.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-cyan-400 mb-3">What We Build</h3>
          <ul className="text-cyan-100/80 space-y-1">
            <li>• Custom marketing websites</li>
            <li>• Web applications & internal tools</li>
            <li>• Landing pages & funnels</li>
            <li>• AI-powered features (chatbots, copilots, personalization)</li>
            <li>• Analytics & event tracking</li>
            <li>• CMS-backed content systems</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-cyan-400 mb-3">Experience & Guarantees</h3>
          <ul className="text-cyan-100/80 space-y-1">
            <li>• React / Next.js, TypeScript, Tailwind CSS</li>
            <li>• Performance tuned for 95+ Lighthouse scores</li>
            <li>• SEO-ready structure and metadata</li>
            <li>• Mobile-first, responsive layouts</li>
            <li>• CI/CD, preview deployments, and rollback safety</li>
          </ul>
        </div>
      </div>

      {/* Grid similar to your original 6 cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            title: 'Custom Websites',
            bullets: [
              'Bespoke design aligned with your brand',
              'SEO-optimized from day one',
              'CMS integration for non-technical updates',
            ],
          },
          {
            title: 'Web Applications',
            bullets: [
              'React, Next.js, Node.js',
              'Authentication, dashboards, and APIs',
              'Database-backed functionality',
            ],
          },
          {
            title: 'Landing Pages',
            bullets: [
              'Conversion-optimized layouts',
              'A/B test ready',
              'Analytics and lead capture integrated',
            ],
          },
          {
            title: 'AI-Powered Features',
            bullets: [
              'Chatbots and assistants',
              'Content generation and personalization',
              'Recommendation systems',
            ],
          },
          {
            title: 'Performance & Security',
            bullets: [
              'SSL/HTTPS & basic hardening',
              'Performance budgets & monitoring',
              'Backups and uptime monitoring',
            ],
          },
          {
            title: 'Ongoing Support',
            bullets: [
              'Bug fixes and updates',
              'Performance optimization',
              'New features as you grow',
            ],
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-cyan-900/60 bg-[#090b25]/80 p-5"
          >
            <h4 className="text-lg font-semibold text-cyan-300 mb-3">{card.title}</h4>
            <ul className="text-sm text-cyan-100/80 space-y-1">
              {card.bullets.map((b) => (
                <li key={b}>• {b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function TechnologyStackSection() {
  return (
    <section className="mt-20">
      <div className="max-w-6xl mx-auto rounded-2xl border border-cyan-900/60 bg-[#090b25]/90 p-8">
        <h3 className="text-2xl font-bold text-cyan-100 mb-6">Technology Stack</h3>
        <div className="grid md:grid-cols-4 gap-6 text-sm">
          <div>
            <div className="font-semibold text-cyan-300 mb-2">Frontend</div>
            <ul className="text-cyan-100/80 space-y-1">
              <li>• React</li>
              <li>• Next.js</li>
              <li>• TypeScript</li>
              <li>• Tailwind CSS</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-cyan-300 mb-2">Backend</div>
            <ul className="text-cyan-100/80 space-y-1">
              <li>• Node.js</li>
              <li>• Express / tRPC</li>
              <li>• PostgreSQL</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-cyan-300 mb-2">AI Integration</div>
            <ul className="text-cyan-100/80 space-y-1">
              <li>• OpenAI GPT</li>
              <li>• Claude AI</li>
              <li>• Custom models</li>
              <li>• Vector databases</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-cyan-300 mb-2">Deployment</div>
            <ul className="text-cyan-100/80 space-y-1">
              <li>• Vercel</li>
              <li>• AWS</li>
              <li>• CI/CD pipelines</li>
              <li>• Auto-scaling</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function CustomPricingSection() {
  return (
    <section className="mt-16">
      <div className="max-w-6xl mx-auto rounded-2xl border border-cyan-900/60 bg-[#090b25]/90 p-8">
        <h3 className="text-2xl font-bold text-center text-cyan-100 mb-2">Custom Pricing</h3>
        <p className="text-center text-cyan-100/80 mb-8">
          Every project is unique. We provide tailored quotes based on your specific requirements, timeline, and
          features.
        </p>
        <div className="grid md:grid-cols-3 gap-6 text-center text-sm">
          <div className="rounded-2xl border border-cyan-900/60 bg-[#0E1030] p-5">
            <div className="font-semibold text-cyan-300 mb-2">Transparent Pricing</div>
            <p className="text-cyan-100/80">
              No hidden fees, clear breakdown of costs and assumptions.
            </p>
          </div>
          <div className="rounded-2xl border border-cyan-900/60 bg-[#0E1030] p-5">
            <div className="font-semibold text-cyan-300 mb-2">Flexible Timeline</div>
            <p className="text-cyan-100/80">
              Rush projects available, standard delivery in 2–8 weeks depending on scope.
            </p>
          </div>
          <div className="rounded-2xl border border-cyan-900/60 bg-[#0E1030] p-5">
            <div className="font-semibold text-cyan-300 mb-2">Iterative Process</div>
            <p className="text-cyan-100/80">
              Regular updates, demos, and the ability to adjust scope as we learn.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
