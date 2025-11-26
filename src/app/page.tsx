'use client';

import { useEffect, useState } from 'react';

import SmartContactForm from './components/SmartContactForm';
import ProjectScopeGenerator from './components/ProjectScopeGenerator';
import AboutCards from './components/AboutCards';

import { initAnalytics, page } from '@/lib/analytics';
import { setConsentState } from '@/lib/consent';

function Button(props: any) {
  return (
    <button
      {...props}
      className={`${props.className || ''} px-4 py-2 rounded bg-cyan-500 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400`}
    />
  );
}

export default function Home() {
  const [consented, setConsented] = useState<boolean>(
    () => typeof window !== 'undefined' && localStorage.getItem('pqv-consent') === 'accept',
  );

  useEffect(() => {
    if (consented) {
      initAnalytics();
      page();
    }
  }, [consented]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A2A] to-[#1A1A4A] text-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-cyan-700 px-3 py-2 rounded"
      >
        Skip to content
      </a>

      {!consented && (
        <div className="fixed inset-x-0 bottom-0 z-50">
          <div className="mx-auto max-w-5xl m-4 rounded-2xl border border-cyan-900/50 bg-[#0a0a2a]/95 p-4 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <p className="text-sm text-cyan-100/80">
                We use cookies/tech for analytics and advertising. By accepting, you allow measurement and
                conversion APIs.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    localStorage.setItem('pqv-consent', 'decline');
                    setConsented(false);
                    setConsentState('decline');
                  }}
                >
                  Decline
                </Button>
                <Button
                  onClick={() => {
                    localStorage.setItem('pqv-consent', 'accept');
                    setConsented(true);
                    setConsentState('accept');
                  }}
                >
                  Accept
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main id="main" className="pt-16">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-cyan-900/40" aria-labelledby="hero-heading">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
              {/* Left column */}
              <div className="max-w-xl space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">
                  Operator-ready AI builds
                </div>
                <h1
                  id="hero-heading"
                  className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
                >
                  Where Frontier Technology Meets <span className="text-cyan-400">Operator Grit</span>
                </h1>
                <p className="text-base text-slate-200 sm:text-lg">
                  We partner with visionary founders and forward-thinking enterprises to transform bold ideas into
                  market-ready products. Combining venture perspective with hands-on engineering, we deliver AI and
                  quantum solutions that ship fast, scale reliably, and drive measurable business impact.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="rounded-md bg-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A2A]"
                  >
                    Start Building
                  </button>
                  <a
                    href="/services"
                    className="rounded-md border border-cyan-500 px-6 py-3 text-sm font-semibold text-cyan-300 hover:bg-cyan-900/40"
                  >
                    See Our Approach
                  </a>
                </div>
                <div className="grid gap-4 text-sm text-cyan-100/70 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" aria-hidden />
                    <div>
                      <div className="font-semibold text-white">Enterprise-grade delivery</div>
                      <div>Security, compliance, and reliability baked into every build.</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" aria-hidden />
                    <div>
                      <div className="font-semibold text-white">Outcomes-first partnership</div>
                      <div>Co-created roadmaps that tie AI delivery to business impact.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="w-full lg:max-w-xl">
                <div className="relative w-full overflow-hidden rounded-3xl border border-cyan-500/30 bg-[#0C1230] shadow-2xl aspect-[16/9]">
                  <div className="absolute -inset-8 rounded-3xl bg-cyan-500/20 blur-3xl" aria-hidden />
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-600/10" aria-hidden />
                  <video
                    className="relative z-10 h-full w-full object-cover"
                    width={960}
                    height={540}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                  >
                    <source src="/pilonqubitvideo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES PREVIEW */}
        <section
          id="services"
          className="py-20 border-t border-cyan-900/40 bg-white/5"
          aria-labelledby="services-heading"
        >
          <div className="max-w-7xl mx-auto px-6">
            <h3 id="services-heading" className="text-3xl font-bold mb-4 text-center">
              From Vision to Velocity
            </h3>
            <p className="text-cyan-100/80 mb-10 max-w-2xl mx-auto text-center">
              End-to-end capabilities to accelerate your journey from idea to impact. Our solutions are designed for
              speed, scale, and strategic advantage.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'AI-Powered Features',
                  summary:
                    'Chatbots, content generation, and voice assistants built into your product experience with seamless AI-native workflows.',
                  metrics: 'LLMs • Agents • Automation',
                  details: ['Chatbots', 'Content generation', 'Voice assistants', 'Process automation'],
                },
                {
                  title: 'Performance & Security',
                  summary:
                    'High-performing, secure foundations that deliver Lighthouse 95+ scores with the right safeguards in place.',
                  metrics: '95+ Lighthouse • Hardened by design',
                  details: ['95+ Lighthouse scores', 'SSL/HTTPS setup', 'DDoS protection', 'Security audits'],
                },
                {
                  title: 'Ongoing Support',
                  summary:
                    'Dedicated partnership for maintenance, optimizations, and the continuous improvements your roadmap needs.',
                  metrics: 'Maintenance • Optimization • Updates',
                  details: ['Bug fixes & maintenance', 'Performance optimization', 'Content updates', 'Feature additions'],
                },
              ].map((service, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-cyan-900/40 bg-[#0E1030]/60 backdrop-blur hover:border-cyan-500/40 transition-all"
                >
                  <div className="font-semibold mb-3 text-lg text-cyan-400">{service.title}</div>
                  <div className="text-cyan-100/80 mb-4">{service.summary}</div>
                  <div className="text-sm text-cyan-100/60 mb-4">{service.metrics}</div>
                  <div className="mt-4 pt-4 border-t border-cyan-900/40">
                    <div className="text-sm font-semibold text-cyan-400 mb-2">What We Deliver:</div>
                    <ul className="text-sm text-cyan-100/70 space-y-1">
                      {service.details.map((detail, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-cyan-400 mr-2">•</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROJECT SCOPE GENERATOR */}
        <section id="scope-generator" className="py-20 border-t border-cyan-900/40">
          <div className="max-w-7xl mx-auto px-6">
            <h3 className="text-3xl font-bold mb-6 text-center">Define Your Project</h3>
            <p className="text-cyan-100/80 mb-10 max-w-2xl mx-auto text-center">
              Use the AI-assisted project scope generator to outline your requirements and get a clear,
              investor-ready project brief in minutes.
            </p>
            <ProjectScopeGenerator />
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="py-20 border-t border-cyan-900/40" aria-labelledby="about-heading">
          <div className="max-w-5xl mx-auto px-6">
            <h3 id="about-heading" className="text-3xl font-bold mb-6 text-center">
              Your Unfair Advantage in Frontier Tech
            </h3>
            <p className="text-cyan-100/80 mb-10 max-w-3xl mx-auto text-center">
              Born from the intersection of venture capital and hands-on engineering, PILON Qubit brings a unique
              perspective to frontier technology. Our team has scaled products at leading startups and built critical
              systems at major tech companies. We understand both the strategic vision needed to raise capital and the
              technical execution required to ship products that users love. This dual expertise means we don&apos;t
              just advise—we build alongside you, ensuring every recommendation is grounded in real-world experience and
              designed for sustainable growth.
            </p>
            <AboutCards />
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="py-20 border-t border-cyan-900/40 bg-white/5">
          <SmartContactForm />
        </section>
      </main>

      <footer className="border-t border-cyan-900/40 py-8 text-center text-cyan-100/60">
        © {new Date().getFullYear()} PILON Qubit Ventures — All rights reserved.
      </footer>
    </div>
  );
}
