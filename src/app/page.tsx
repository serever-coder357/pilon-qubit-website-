'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<'marketing' | 'consulting' | 'webdev' | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A2A] via-[#1A1A4A] to-[#0A0A2A]">
      {/* Header */}
      <header className="border-b border-cyan-500/20 bg-[#0A0A2A]/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">PQ</span>
            </div>
            <span className="text-white font-bold text-xl">PILON Qubit Ventures</span>
          </Link>
          <nav className="flex gap-8">
            <Link href="/services" className="text-cyan-400 font-semibold">Services</Link>
            <Link href="/#about" className="text-white/80 hover:text-white transition-colors">About</Link>
            <Link href="/#contact" className="text-white/80 hover:text-white transition-colors">Contact</Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-6 py-16">
        {/* Video Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            See <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">PILON Qubit</span> in Action
          </h2>
          <p className="text-cyan-100/70 text-lg mb-8">
            Discover how we transform frontier technology into production-ready solutions
          </p>
          <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-cyan-500/30">
            <video className="w-full" controls loop autoPlay muted poster="/ai-consulting-hero.webp">
              <source src="/pqv-new.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </motion.div>

        {/* Two-Column Service Selection */}
        <AnimatePresence mode="wait">
          {!selectedService ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
            >
              {/* Marketing Automation Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedService('marketing')}
                className="bg-gradient-to-br from-[#1A1A4A] to-[#0A0A2A] border border-cyan-500/50 rounded-2xl p-8 cursor-pointer hover:border-cyan-400 transition-all group"
              >
                <div className="text-5xl mb-4">AI Marketing Automation</div>
                <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
                  AI Marketing Automation
                </h3>
                <p className="text-cyan-100/70 text-lg mb-6">
                  Complete marketing automation platform powered by AI. Save $3K/mo on marketing staff with 24/7 automated operations.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-cyan-100/80"><span className="text-cyan-400">24/7 AI Voice Assistant</span></li>
                  <li className="flex items-center gap-3 text-cyan-100/80"><span className="text-cyan-400">Conversation AI (chat + SMS)</span></li>
                  <li className="flex items-center gap-3 text-cyan-100/80"><span className="text-cyan-400">Review Management</span></li>
                  <li className="flex items-center gap-3 text-cyan-100/80"><span className="text-cyan-400">Content Generation</span></li>
                  <li className="flex items-center gap-3 text-cyan-100/80"><span className="text-cyan-400">Funnel Builder</span></li>
                  <li className="flex items-center gap-3 text-cyan-100/80"><span className="text-cyan-400">Workflow Automation</span></li>
                </ul>
                <div className="text-center">
                  <div className="text-cyan-400 font-bold text-xl mb-2">Starting at $299/mo</div>
                  <div className="text-cyan-100/60 text-sm">Month-to-month • No contracts • Setup determined case by case</div>
                </div>
                <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all">
                  View Pricing & Features →
                </button>
              </motion.div>

              {/* Frontier AI Consulting Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedService('consulting')}
                className="bg-gradient-to-br from-[#1A1A4A] to-[#0A0A2A] border border-blue-500/50 rounded-2xl p-8 cursor-pointer hover:border-blue-400 transition-all group"
              >
                <div className="text-5xl mb-4">Frontier AI Consulting</div>
                <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                  Frontier AI Consulting
                </h3>
                <p className="text-cyan-100/70 text-lg mb-6">
                  Custom AI development and strategic consulting for frontier technology companies.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-cyan-100/80"><span className="text-blue-400">AI Strategy & Assessment</span></li>
                  <li className="flex items-center gap-3 text-cyan-100/80"><span className="text-blue-400">Implementation & Development</span></li>
                  <li className="flex items-center gap-3 text-cyan-100/80"><span className="text-blue-400">Security & Governance</span></li>
                  <li className="flex items-center gap-3 text-cyan-100/80"><span className="text-blue-400">Growth & Analytics</span></li>
                  <li className="flex items-center gap-3 text-cyan-100/80"><span className="text-blue-400">10x faster development</span></li>
                  <li className="flex items-center gap-3 text-cyan-100/80"><span className="text-blue-400">50% cost reduction</span></li>
                </ul>
                <div className="text-center">
                  <div className="text-blue-400 font-bold text-xl mb-2">Custom Pricing</div>
                  <div className="text-cyan-100/60 text-sm">Contact us for a tailored quote</div>
                </div>
                <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-400 hover:to-purple-500 transition-all">
                  View Services →
                </button>
              </motion.div>

              {/* Web Development Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedService('webdev')}
                className="bg-gradient-to-br from-[#1A1A4A] to-[#0A0A2A] border border-purple-500/50 rounded-2xl p-8 cursor-pointer hover:border-purple-400 transition-all group"
              >
                <div className="text-5xl mb-4">Web Development</div>
                <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">
                  Web Development
                </h3>
                <p className="text-cyan-100/70 text-lg mb-6">
                  Custom websites and web applications built with cutting-edge technology.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-cyan-100/80"><span className="text-purple-400">Custom Websites</span></li>
                  <li className="flex items-center gap-3 text-cyan-100/80"><span className="text-purple-400">Web Applications</span></li>
                  <li className="flex items-center gap-3 text-cyan-100/80"><span className="text-purple-400">Landing Pages</span></li>
                  <li className="flex items-center gap-3 text-cyan-100/80"><span className="text-purple-400">AI Integration</span></li>
                  <li className="flex items-center gap-3 text-cyan-100/80"><span className="text-purple-400">Performance Optimized</span></li>
                  <li className="flex items-center gap-3 text-cyan-100/80"><span className="text-purple-400">Mobile Responsive</span></li>
                </ul>
                <div className="text-center">
                  <div className="text-purple-400 font-bold text-xl mb-2">Custom Quotes</div>
                  <div className="text-cyan-100/60 text-sm">Tailored pricing for your project</div>
                </div>
                <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-400 hover:to-pink-500 transition-all">
                  View Details →
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="details" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <button
                onClick={() => setSelectedService(null)}
                className="mb-8 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Services
              </button>
              {selectedService === 'marketing' ? (
                <MarketingAutomationDetails />
              ) : selectedService === 'consulting' ? (
                <FrontierAIConsultingDetails />
              ) : (
                <WebDevelopmentDetails />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ──────────────────────────────── CONTACT SECTION (UPDATED) ──────────────────────────────── */
function WebDevelopmentDetails() {
  return (
    <div id="contact" className="container mx-auto px-6 py-24">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Touch</span>
        </h2>
        <p className="text-cyan-100/70 text-lg mb-12">
          Ready to transform your AI vision into reality? Contact us today.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Email */}
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/30 rounded-2xl p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Email Us</h3>
            <a href="mailto:hello@pilonqubitventures.com" className="text-cyan-400 hover:text-cyan-300 transition-colors text-lg">
              hello@pilonqubitventures.com
            </a>
          </div>

          {/* Phone */}
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-500/30 rounded-2xl p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Call Us</h3>
            <a href="tel:+12104600912" className="text-purple-400 hover:text-purple-300 transition-colors text-xl font-semibold">
              210-460-0912
            </a>
          </div>

          {/* Address */}
          <div className="bg-gradient-to-br from-green-500/10 to-teal-600/10 border border-green-500/30 rounded-2xl p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Visit Us</h3>
            <p className="text-green-400 leading-relaxed">
              401 E Sonterra Blvd<br />
              Ste 375<br />
              San Antonio, TX 78258
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Keep the rest of your existing functions unchanged below (MarketingAutomationDetails, FrontierAIConsultingDetails, etc.) */
// ... (everything else stays exactly the same – just scroll down and leave it)
