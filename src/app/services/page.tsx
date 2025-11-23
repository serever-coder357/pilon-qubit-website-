'use client';

import Image from 'next/image';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A2A] via-[#1A1A4A] to-[#0A0A2A] text-white">

      {/* HERO SECTION */}
      <section className="w-full border-b border-cyan-900/40">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">

          {/* Text */}
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-white mb-6">
              Advanced AI & Engineering Services
            </h1>
            <p className="text-cyan-100/80 text-lg leading-relaxed">
              We build high-performance AI systems, mission-critical software,
              and modern digital infrastructure designed for scale, reliability,
              and measurable business impact.
            </p>
          </div>

          {/* Hero Image */}
          <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden border border-cyan-900/50 shadow-xl">
            <Image
              src="/ai-workspace.jpg"
              alt="AI Engineering Workspace"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-6 py-20 space-y-16">

        {/* ROW 1 */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-[#0E1030]/70 border border-cyan-900/40 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-cyan-400">Custom Websites</h3>
            <ul className="space-y-1 text-cyan-100/80">
              <li>Modern responsive design</li>
              <li>SEO optimized</li>
              <li>Lightning-fast performance</li>
              <li>CMS integration</li>
              <li>Analytics tracking</li>
              <li>Mobile-first development</li>
            </ul>
          </div>

          <div className="p-6 bg-[#0E1030]/70 border border-cyan-900/40 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-cyan-400">Web Applications</h3>
            <ul className="space-y-1 text-cyan-100/80">
              <li>React, Next.js, Node.js</li>
              <li>Real-time functionality</li>
              <li>Database integration</li>
              <li>User authentication</li>
              <li>API development</li>
              <li>Cloud deployment</li>
            </ul>
          </div>

          <div className="p-6 bg-[#0E1030]/70 border border-cyan-900/40 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-cyan-400">Landing Pages</h3>
            <ul className="space-y-1 text-cyan-100/80">
              <li>High-conversion design</li>
              <li>A/B testing ready</li>
              <li>Fast load speeds &lt;2 sec</li>
              <li>Lead capture forms</li>
              <li>Analytics tracking</li>
              <li>Mobile optimized</li>
            </ul>
          </div>
        </div>

        {/* ROW 2 */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-[#0E1030]/70 border border-cyan-900/40 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-cyan-400">AI-Powered Features</h3>
            <ul className="space-y-1 text-cyan-100/80">
              <li>AI chatbots</li>
              <li>Content generation</li>
              <li>Personalization engines</li>
              <li>Voice interfaces</li>
              <li>Smart recommendations</li>
              <li>Image recognition</li>
            </ul>
          </div>

          <div className="p-6 bg-[#0E1030]/70 border border-cyan-900/40 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-cyan-400">Performance & Security</h3>
            <ul className="space-y-1 text-cyan-100/80">
              <li>95+ Lighthouse scores</li>
              <li>SSL/HTTPS encryption</li>
              <li>DDoS protection</li>
              <li>Backups & monitoring</li>
              <li>Security audits</li>
            </ul>
          </div>

          <div className="p-6 bg-[#0E1030]/70 border border-cyan-900/40 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-cyan-400">Ongoing Support</h3>
            <ul className="space-y-1 text-cyan-100/80">
              <li>Bug fixes & updates</li>
              <li>Performance optimization</li>
              <li>Content updates</li>
              <li>New features</li>
              <li>Technical support</li>
              <li>Monthly reports</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
