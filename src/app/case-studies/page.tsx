'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, CheckCircle } from 'lucide-react';
import { caseStudies } from '../data/case-studies';

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A2A] via-[#1A1A4A] to-[#0A0A2A] text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4">Case Studies</h1>
          <p className="text-xl text-cyan-100/70 max-w-3xl mx-auto">
            Real results from real clients. See how PILON Qubit accelerates AI product development and delivers measurable business impact.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white/5 backdrop-blur-sm border border-cyan-900/40 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-cyan-400 mb-2">10x</div>
            <div className="text-sm text-cyan-100/70">Average Development Acceleration</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-cyan-900/40 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">50%</div>
            <div className="text-sm text-cyan-100/70">Typical Cost Reduction</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-cyan-900/40 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">3-6</div>
            <div className="text-sm text-cyan-100/70">Months to ROI</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-cyan-900/40 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">99.9%</div>
            <div className="text-sm text-cyan-100/70">Production Uptime</div>
          </div>
        </div>

        {/* Case Studies */}
        <div className="space-y-12">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-cyan-900/40 rounded-xl overflow-hidden"
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-sm font-semibold text-cyan-400">
                        {study.industry}
                      </span>
                      <span className="text-sm text-cyan-100/50">{study.client}</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-3">{study.title}</h2>
                    <div className="flex flex-wrap gap-2">
                      {study.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-white/5 border border-cyan-900/40 rounded text-xs text-cyan-100/70">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Challenge & Solution */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-400 mb-3">The Challenge</h3>
                    <p className="text-cyan-100/70 leading-relaxed">{study.challenge}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-400 mb-3">Our Solution</h3>
                    <p className="text-cyan-100/70 leading-relaxed">{study.solution}</p>
                  </div>
                </div>

                {/* Results */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-4">Results</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    {study.results.map((result) => (
                      <div key={result.metric} className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-cyan-400" />
                          <div className="text-2xl font-bold text-cyan-400">{result.value}</div>
                        </div>
                        <div className="text-sm font-semibold mb-1">{result.metric}</div>
                        <div className="text-xs text-cyan-100/60">{result.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Testimonial */}
                {study.testimonial && (
                  <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl text-cyan-400 leading-none">&ldquo;</div>
                      <div className="flex-1">
                        <p className="text-lg text-cyan-100/90 mb-4 italic">{study.testimonial.quote}</p>
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl font-bold">
                            {study.testimonial.author.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-semibold">{study.testimonial.author}</div>
                            <div className="text-sm text-cyan-100/60">{study.testimonial.role}, {study.client}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-900/40 rounded-xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Write Your Success Story?</h2>
          <p className="text-xl text-cyan-100/70 mb-8 max-w-2xl mx-auto">
            Join these industry leaders who accelerated their AI journey with PILON Qubit. Let&apos;s discuss how we can help you achieve similar results.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/assessment"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold text-lg hover:from-cyan-400 hover:to-blue-500 transition-all inline-flex items-center gap-2"
            >
              <TrendingUp className="h-5 w-5" />
              Take Free Assessment
            </Link>
            <Link
              href="/#contact"
              className="px-8 py-4 bg-white/10 border border-cyan-500 rounded-lg font-bold text-lg hover:bg-white/20 transition-all"
            >
              Schedule Consultation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
