'use client';

import { useState } from 'react';

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<
    'marketing' | 'consulting' | 'webdev' | null
  >(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A2A] via-[#1A1A4A] to-[#0A0A2A]">
      <div className="container mx-auto px-6 py-16">
        {/* HERO */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold">
            <span className="text-cyan-400">See PILON Qubit</span> in Action
          </h1>
          <p className="text-md text-cyan-100/80 mt-3">
            Discover how we transform frontier technology into production-ready solutions.
          </p>
        </header>

        {/* HERO VIDEO */}
        <div className="rounded-2xl overflow-hidden shadow-xl border border-cyan-700/20 mb-16 max-w-5xl mx-auto">
          <video
            src="/pilonqubitvideo.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-auto object-cover"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* IN-PAGE NAVIGATION */}
        <nav className="flex flex-wrap justify-center gap-4 mb-12" aria-label="Service navigation">
          <button
            type="button"
            onClick={() => setSelectedService('marketing')}
            className={`px-4 py-2 rounded-full border text-sm transition ${
              selectedService === 'marketing'
                ? 'bg-cyan-500 text-black border-cyan-400'
                : 'border-cyan-500 text-cyan-400 hover:bg-cyan-500/10'
            }`}
          >
            AI Marketing Automation
          </button>

          <button
            type="button"
            onClick={() => setSelectedService('consulting')}
            className={`px-4 py-2 rounded-full border text-sm transition ${
              selectedService === 'consulting'
                ? 'bg-cyan-500 text-black border-cyan-400'
                : 'border-cyan-500 text-cyan-400 hover:bg-cyan-500/10'
            }`}
          >
            Frontier AI Consulting
          </button>

          <button
            type="button"
            onClick={() => setSelectedService('webdev')}
            className={`px-4 py-2 rounded-full border text-sm transition ${
              selectedService === 'webdev'
                ? 'bg-cyan-500 text-black border-cyan-400'
                : 'border-cyan-500 text-cyan-400 hover:bg-cyan-500/10'
            }`}
          >
            Web Development
          </button>
        </nav>

        {/* SERVICE DETAILS */}
        <section className="max-w-3xl mx-auto text-center text-cyan-100">
          {selectedService === null && (
            <p className="text-cyan-200">
              Select a service above to view details.
            </p>
          )}

          {selectedService === 'marketing' && (
            <article>
              <h2 className="text-3xl font-bold mb-4">AI Marketing Automation</h2>
              <p className="text-cyan-200 mb-4">
                Complete marketing automation powered by AI. Save on marketing staff with 24/7 automated operations
                across chat, voice, SMS, and email.
              </p>
              <ul className="text-cyan-100/80 space-y-1 text-left max-w-xl mx-auto">
                <li>• AI Voice Assistant (24/7 phone)</li>
                <li>• Conversation AI (chat + SMS)</li>
                <li>• Review Management</li>
                <li>• Content Generation</li>
                <li>• Funnel Builder</li>
                <li>• Workflow Automation</li>
              </ul>
            </article>
          )}

          {selectedService === 'consulting' && (
            <article>
              <h2 className="text-3xl font-bold mb-4">Frontier AI Consulting</h2>
              <p className="text-cyan-200 mb-4">
                Strategy and implementation for frontier AI systems—from LLM integrations to production infrastructure.
              </p>
              <ul className="text-cyan-100/80 space-y-1 text-left max-w-xl mx-auto">
                <li>• AI Strategy & Assessment</li>
                <li>• Implementation & Development</li>
                <li>• Security & Governance</li>
                <li>• Growth & Analytics</li>
                <li>• 10x faster development</li>
                <li>• Up to 50% cost reduction</li>
              </ul>
            </article>
          )}

          {selectedService === 'webdev' && (
            <article>
              <h2 className="text-3xl font-bold mb-4">Web Development</h2>
              <p className="text-cyan-200 mb-4">
                Fast, modern, AI-integrated websites & applications tailored for scale and conversion.
              </p>
              <ul className="text-cyan-100/80 space-y-1 text-left max-w-xl mx-auto">
                <li>• Custom Websites & Landing Pages</li>
                <li>• Web Applications with AI features</li>
                <li>• Analytics & performance optimization</li>
                <li>• Mobile-responsive, SEO-ready builds</li>
              </ul>
            </article>
          )}
        </section>
      </div>
    </div>
  );
}
