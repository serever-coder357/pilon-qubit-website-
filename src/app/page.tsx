'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import the detail components (they exist)
import MarketingAutomationDetails from './MarketingAutomationDetails';
import FrontierAIConsultingDetails from './FrontierAIConsultingDetails';
import WebDevelopmentDetails from './WebDevelopmentDetails';

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<'marketing' | 'consulting' | 'webdev' | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A2A] via-[#1A1A4A] to-[#0A0A2A]">
      <div className="container mx-auto px-6 py-16">
        {/* Hero Video */}
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

        {/* Service Cards */}
        <AnimatePresence mode="wait">
          {!selectedService ? (
            <motion.div
              key="cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
            >
              {/* AI Marketing Automation */}
              <motion.div whileHover={{ scale: 1.02 }} onClick={() => setSelectedService('marketing')} className="bg-gradient-to-br from-[#1A1A4A] to-[#0A0A2A] border border-cyan-500/50 rounded-2xl p-8 cursor-pointer hover:border-cyan-400 transition-all group">
                <div className="text-5xl mb-4">🤖</div>
                <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">AI Marketing Automation</h3>
                <p className="text-cyan-100/70 text-lg mb-6">Complete marketing automation platform powered by AI. Save $3K/mo on marketing staff with 24/7 automated operations.</p>
                <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all">
                  View Pricing & Features →
                </button>
              </motion.div>

              {/* Frontier AI Consulting */}
              <motion.div whileHover={{ scale: 1.02 }} onClick={() => setSelectedService('consulting')} className="bg-gradient-to-br from-[#1A1A4A] to-[#0A0A2A] border border-blue-500/50 rounded-2xl p-8 cursor-pointer hover:border-blue-400 transition-all group">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">Frontier AI Consulting</h3>
                <p className="text-cyan-100/70 text-lg mb-6">Custom AI development and strategic consulting for frontier technology companies. From LLM integrations to production infrastructure.</p>
                <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-400 hover:to-purple-500 transition-all">
                  View Services →
                </button>
              </motion.div>

              {/* Web Development */}
              <motion.div whileHover={{ scale: 1.02 }} onClick={() => setSelectedService('webdev')} className="bg-gradient-to-br from-[#1A1A4A] to-[#0A0A2A] border border-purple-500/50 rounded-2xl p-8 cursor-pointer hover:border-purple-400 transition-all group">
                <div className="text-5xl mb-4">💻</div>
                <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">Web Development</h3>
                <p className="text-cyan-100/70 text-lg mb-6">Custom websites and web applications built with cutting-edge technology. Fast, responsive, and AI-powered.</p>
                <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-400 hover:to-pink-500 transition-all">
                  View Details →
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="details" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <button onClick={() => setSelectedService(null)} className="mb-8 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
                ← Back to Services
              </button>
              {selectedService === 'marketing' && <MarketingAutomationDetails />}
              {selectedService === 'consulting' && <FrontierAIConsultingDetails />}
              {selectedService === 'webdev' && <WebDevelopmentDetails />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
