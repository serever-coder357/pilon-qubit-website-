'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import AIChatbot from './components/AIChatbot';
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
  const prefersReducedMotion = useReducedMotion();

  const heroTitle = 'Enterprise AI That Drives Real ROI';
  const heroSubtitle =
    'Secure, scalable, and compliant AI systems built for mission-critical operations. We deliver production-ready solutions that reduce costs, accelerate innovation, and build competitive advantage.';

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
        <section className="relative overflow-hidden" aria-labelledby="hero-heading">
          <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center text-center gap-10">
            <div className="max-w-3xl mx-auto">
              <h2 id="hero-heading" className="text-4xl md:text-5xl font-extrabold leading-tight">
                {heroTitle.split(' ').map((word, i, arr) =>
                  i === arr.length - 1 ? (
                    <span key={i} className="text-cyan-400">
                      {word}
                    </span>
                  ) : (
                    word + ' '
                  ),
                )}
              </h2>
              <p className="mt-4 text-cyan-100/80 max-w-3xl mx-auto">{heroSubtitle}</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                  Start Building
                </Button>
                <a
                  href="/services"
                  className="px-4 py-2 rounded border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-[#0A0A2A] transition-colors font-semibold"
                >
                  See our approach
                </a>
                <a
                  href="#services"
                  className="px-4 py-2 rounded border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-[#0A0A2A] transition-colors font-semibold"
                >
                  Services
                </a>
              </div>
            </div>

            <div className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden border border-cyan-400/20 shadow-xl aspect-video">
              <video
                src="/pqv-new.mp4"
                className="h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
              {!prefersReducedMotion && (
                <motion.div
                  aria-hidden
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.25 }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                  className="absolute -inset-6 -z-10 rounded-3xl bg-cyan-500 blur-3xl"
                />
              )}
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

      <AIChatbot />
    </div>
  );
}
