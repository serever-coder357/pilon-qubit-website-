import Link from 'next/link';

export default function WebDevelopmentDetails() {
  return (
    <div className="py-24">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold text-white mb-6">Web Development</h2>
        <p className="text-2xl text-cyan-100/80 max-w-4xl mx-auto">
          Fast, modern, AI-integrated websites & apps built for scale
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {["Landing pages that convert", "Full-stack apps", "AI-native experiences"].map((highlight) => (
          <div
            key={highlight}
            className="bg-gradient-to-br from-[#1A1A4A] to-[#0A0A2A] border border-purple-500/40 rounded-2xl p-6 text-center"
          >
            <h3 className="text-xl font-semibold text-white mb-3">{highlight}</h3>
            <p className="text-cyan-100/70">
              Performance, accessibility, and DX-first builds using modern frameworks.
            </p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-[#1A1A4A] to-[#0A0A2A] border border-purple-500/50 rounded-2xl p-10 mb-16">
        <h3 className="text-3xl font-bold text-white mb-8 text-center">Technology Stack</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[{ title: 'Frontend', items: ['React 19', 'TypeScript', 'Tailwind CSS'] }, { title: 'Backend', items: ['Node.js', 'Express', 'Redis', 'PostgreSQL'] }, { title: 'AI Integration', items: ['OpenAI GPT-4o', 'LangChain', 'Vector databases'] }, { title: 'Deployment', items: ['Vercel', 'AWS', 'CI/CD pipelines', 'Auto-scaling'] }].map((stack) => (
            <div key={stack.title} className="bg-[#0A0A2A]/70 border border-purple-500/30 rounded-xl p-5">
              <h4 className="text-xl font-semibold text-white mb-3">{stack.title}</h4>
              <ul className="space-y-2 text-cyan-100/80">
                {stack.items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="text-purple-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {[
          {
            title: 'Custom Websites',
            items: ['Modern, responsive design', 'SEO optimization', 'Content management system', 'AI integration ready'],
          },
          {
            title: 'Web Applications',
            items: ['React, Next.js, Node.js', 'Real-time functionality', 'Database integration', 'User authentication'],
          },
          {
            title: 'Landing Pages',
            items: ['Conversion-optimized design', 'Lead capture forms', 'Analytics integration', 'Mobile responsive'],
          },
          {
            title: 'AI-Powered Features',
            items: ['Chatbots', 'Content generation', 'Voice assistants', 'Process automation'],
          },
          {
            title: 'Performance & Security',
            items: ['95+ Lighthouse scores', 'SSL/HTTPS setup', 'DDoS protection', 'Security audits'],
          },
          {
            title: 'Ongoing Support',
            items: ['Bug fixes & maintenance', 'Performance optimization', 'Content updates', 'Feature additions'],
          },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-gradient-to-br from-[#1A1A4A] to-[#0A0A2A] border border-purple-500/40 rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4">{card.title}</h3>
            <ul className="space-y-2 text-cyan-100/80 text-sm text-left">
              {card.items.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-2xl p-10 text-center">
        <div className="text-3xl font-bold text-white mb-4">Custom Projects — Let’s Build Yours</div>
        <p className="text-cyan-100/80 mb-8 max-w-3xl mx-auto">
          Every project is unique. We provide tailored quotes based on your specific requirements, timeline, and features.
        </p>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[{ title: 'Transparent Pricing', description: 'No hidden fees; clear breakdown of costs' }, { title: 'Flexible Timeline', description: 'Rush projects available, standard 2-8 weeks' }, { title: 'Iterative Process', description: 'Regular updates, validation, revision rounds' }].map((item) => (
            <div key={item.title} className="bg-[#0A0A2A]/60 border border-white/10 rounded-xl p-5">
              <h4 className="text-lg font-semibold text-white mb-2 text-center">{item.title}</h4>
              <p className="text-cyan-100/70 text-sm text-center">{item.description}</p>
            </div>
          ))}
        </div>
        <Link
          href="/#contact"
          className="inline-block px-12 py-5 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xl font-bold rounded-xl hover:from-purple-400 hover:to-pink-500 transition-all"
        >
          Get Your Custom Quote
        </Link>
      </div>
    </div>
  );
}
