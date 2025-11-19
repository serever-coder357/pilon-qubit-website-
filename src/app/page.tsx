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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            See <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">PILON Qubit</span> in Action
          </h2>
          <p className="text-cyan-100/70 text-lg mb-8">
            Discover how we transform frontier technology into production-ready solutions
          </p>
          <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-cyan-500/30">
            <video
              className="w-full"
              controls
              loop
              autoPlay
              muted
              poster="/ai-consulting-hero.webp"
            >
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
                <div className="text-5xl mb-4">🤖</div>
                <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
                  AI Marketing Automation
                </h3>
                <p className="text-cyan-100/70 text-lg mb-6">
                  Complete marketing automation platform powered by AI. Save $3K/mo on marketing staff with 24/7 automated operations.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-cyan-100/80">
                    <span className="text-cyan-400">✓</span>
                    <span>AI Voice Assistant (24/7 phone)</span>
                  </li>
                  <li className="flex items-center gap-3 text-cyan-100/80">
                    <span className="text-cyan-400">✓</span>
                    <span>Conversation AI (chat + SMS)</span>
                  </li>
                  <li className="flex items-center gap-3 text-cyan-100/80">
                    <span className="text-cyan-400">✓</span>
                    <span>Review Management</span>
                  </li>
                  <li className="flex items-center gap-3 text-cyan-100/80">
                    <span className="text-cyan-400">✓</span>
                    <span>Content Generation</span>
                  </li>
                  <li className="flex items-center gap-3 text-cyan-100/80">
                    <span className="text-cyan-400">✓</span>
                    <span>Funnel Builder</span>
                  </li>
                  <li className="flex items-center gap-3 text-cyan-100/80">
                    <span className="text-cyan-400">✓</span>
                    <span>Workflow Automation</span>
                  </li>
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
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                  Frontier AI Consulting
                </h3>
                <p className="text-cyan-100/70 text-lg mb-6">
                  Custom AI development and strategic consulting for frontier technology companies. From LLM integrations to production infrastructure.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-cyan-100/80">
                    <span className="text-blue-400">✓</span>
                    <span>AI Strategy & Assessment</span>
                  </li>
                  <li className="flex items-center gap-3 text-cyan-100/80">
                    <span className="text-blue-400">✓</span>
                    <span>Implementation & Development</span>
                  </li>
                  <li className="flex items-center gap-3 text-cyan-100/80">
                    <span className="text-blue-400">✓</span>
                    <span>Security & Governance</span>
                  </li>
                  <li className="flex items-center gap-3 text-cyan-100/80">
                    <span className="text-blue-400">✓</span>
                    <span>Growth & Analytics</span>
                  </li>
                  <li className="flex items-center gap-3 text-cyan-100/80">
                    <span className="text-blue-400">✓</span>
                    <span>10x faster development</span>
                  </li>
                  <li className="flex items-center gap-3 text-cyan-100/80">
                    <span className="text-blue-400">✓</span>
                    <span>50% cost reduction</span>
                  </li>
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
                <div className="text-5xl mb-4">💻</div>
                <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">
                  Web Development
                </h3>
                <p className="text-cyan-100/70 text-lg mb-6">
                  Custom websites and web applications built with cutting-edge technology. Fast, responsive, and AI-powered.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-cyan-100/80">
                    <span className="text-purple-400">✓</span>
                    <span>Custom Websites</span>
                  </li>
                  <li className="flex items-center gap-3 text-cyan-100/80">
                    <span className="text-purple-400">✓</span>
                    <span>Web Applications</span>
                  </li>
                  <li className="flex items-center gap-3 text-cyan-100/80">
                    <span className="text-purple-400">✓</span>
                    <span>Landing Pages</span>
                  </li>
                  <li className="flex items-center gap-3 text-cyan-100/80">
                    <span className="text-purple-400">✓</span>
                    <span>AI Integration</span>
                  </li>
                  <li className="flex items-center gap-3 text-cyan-100/80">
                    <span className="text-purple-400">✓</span>
                    <span>Performance Optimized</span>
                  </li>
                  <li className="flex items-center gap-3 text-cyan-100/80">
                    <span className="text-purple-400">✓</span>
                    <span>Mobile Responsive</span>
                  </li>
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
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
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

function MarketingAutomationDetails() {
  const tiers = [
    {
      name: 'Starter',
      price: '$299',
      description: 'Perfect for small businesses getting started with AI automation',
      features: [
        'Website chatbot (AI-powered)',
        'Email marketing automation',
        'Basic CRM & contact management',
        'Landing page builder',
        'Form builder',
        'Email support',
        '1 user included'
      ],
      cta: 'Get Started',
      highlight: false
    },
    {
      name: 'Growth',
      price: '$599',
      description: 'For growing businesses ready to scale with AI',
      features: [
        'Everything in Starter, plus:',
        'AI phone assistant (24/7)',
        'SMS marketing automation',
        'Advanced funnel builder',
        'Appointment scheduling',
        'Reputation management',
        'Priority support',
        '3 users included'
      ],
      cta: 'Start Growing',
      highlight: true
    },
    {
      name: 'Pro',
      price: '$999',
      description: 'Full AI suite for established businesses',
      features: [
        'Everything in Growth, plus:',
        'Full AI suite (voice, chat, SMS)',
        'Advanced integrations',
        'Custom workflows',
        'Dedicated account manager',
        '24/7 phone support',
        '10 users included'
      ],
      cta: 'Go Pro',
      highlight: false
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Tailored solutions for large organizations',
      features: [
        'Everything in Pro, plus:',
        'Custom AI model training',
        'API access',
        'Unlimited users',
        'SLA guarantee',
        'Dedicated infrastructure',
        'Custom integrations',
        'Strategic consulting'
      ],
      cta: 'Contact Sales',
      highlight: false
    }
  ];

  return (
    <div>
      <h2 className="text-4xl font-bold text-white mb-4">AI Marketing Automation</h2>
      <p className="text-cyan-100/70 text-lg mb-12 max-w-3xl">
        Save $3K/mo on marketing staff with our complete AI-powered automation platform. 24/7 operation, no contracts, setup determined case by case.
      </p>

      {/* Pricing Tiers */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {tiers.map((tier) => (
          <motion.div
            key={tier.name}
            whileHover={{ scale: 1.02 }}
            className={`bg-gradient-to-br from-[#1A1A4A] to-[#0A0A2A] border rounded-2xl p-6 ${
              tier.highlight ? 'border-cyan-400 ring-2 ring-cyan-400/50' : 'border-cyan-500/30'
            }`}
          >
            {tier.highlight && (
              <div className="text-cyan-400 text-sm font-semibold mb-2">MOST POPULAR</div>
            )}
            <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
            <div className="text-3xl font-bold text-cyan-400 mb-2">{tier.price}</div>
            {tier.price !== 'Custom' && <div className="text-cyan-100/60 text-sm mb-4">per month</div>}
            <p className="text-cyan-100/70 text-sm mb-6">{tier.description}</p>
            <ul className="space-y-3 mb-6">
              {tier.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-cyan-100/80 text-sm">
                  <span className="text-cyan-400 mt-0.5">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/#contact"
              className={`block w-full text-center px-4 py-3 rounded-lg font-semibold transition-all ${
                tier.highlight
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {tier.cta}
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Value Props */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#1A1A4A] to-[#0A0A2A] border border-cyan-500/30 rounded-xl p-6">
          <div className="text-3xl mb-3">💰</div>
          <h4 className="text-xl font-bold text-white mb-2">Save $3K/mo</h4>
          <p className="text-cyan-100/70">Replace expensive marketing staff with AI automation</p>
        </div>
        <div className="bg-gradient-to-br from-[#1A1A4A] to-[#0A0A2A] border border-cyan-500/30 rounded-xl p-6">
          <div className="text-3xl mb-3">🤖</div>
          <h4 className="text-xl font-bold text-white mb-2">24/7 Operation</h4>
          <p className="text-cyan-100/70">AI never sleeps - capture leads around the clock</p>
        </div>
        <div className="bg-gradient-to-br from-[#1A1A4A] to-[#0A0A2A] border border-cyan-500/30 rounded-xl p-6">
          <div className="text-3xl mb-3">🚀</div>
          <h4 className="text-xl font-bold text-white mb-2">No Contracts</h4>
          <p className="text-cyan-100/70">Month-to-month pricing, cancel anytime</p>
        </div>
      </div>

      {/* Contact Us Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/50 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Prefer to Talk to a Human?</h3>
        <p className="text-cyan-100/70 mb-6">
          We understand that choosing the right solution is important. Our team is here to answer your questions and help you find the perfect fit for your business.
        </p>
        <Link
          href="/#contact"
          className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-400 hover:to-purple-500 transition-all"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}

function FrontierAIConsultingDetails() {
  const services = [
    {
      category: "AI Strategy & Assessment",
      icon: "🎯",
      items: [
        {
          title: "AI Readiness Assessment",
          description: "Comprehensive evaluation of your organization's AI maturity",
          features: ["25-question assessment", "Real-time scoring", "Personalized recommendations"]
        },
        {
          title: "AI Strategy Development",
          description: "Create a comprehensive AI strategy aligned with business goals",
          features: ["Strategic alignment", "Technology selection", "Resource planning"]
        }
      ]
    },
    {
      category: "Implementation & Development",
      icon: "🚀",
      items: [
        {
          title: "Frontier AI & Product Acceleration",
          description: "Build and deploy cutting-edge AI solutions",
          features: ["10x faster development", "50% cost reduction", "Production-ready code"]
        },
        {
          title: "Agentic AI Systems",
          description: "Design and deploy autonomous AI agents",
          features: ["Multi-agent orchestration", "Custom development", "Tool integration"]
        }
      ]
    },
    {
      category: "Security & Governance",
      icon: "🛡️",
      items: [
        {
          title: "Strategic Security & Reliability",
          description: "Embed security and resilience from day one",
          features: ["99.99% uptime", "Zero-trust security", "Compliance frameworks"]
        },
        {
          title: "AI Governance Framework",
          description: "Build customized AI governance policies",
          features: ["Policy templates", "Risk assessment", "Compliance checklists"]
        }
      ]
    },
    {
      category: "Growth & Analytics",
      icon: "📈",
      items: [
        {
          title: "Growth & GTM Intelligence",
          description: "Find product-market fit and scale user base",
          features: ["40% more users", "30% better retention", "Conversion optimization"]
        },
        {
          title: "AI Benchmarking Service",
          description: "Compare capabilities against industry peers",
          features: ["Industry benchmarks", "Gap analysis", "Trend tracking"]
        }
      ]
    }
  ];

  return (
    <div>
      <h2 className="text-4xl font-bold text-white mb-4">Frontier AI Consulting</h2>
      <p className="text-cyan-100/70 text-lg mb-12 max-w-3xl">
        From strategy to deployment, we deliver end-to-end AI solutions that drive real business impact. 10x faster development, 50% cost reduction.
      </p>

      <div className="space-y-8">
        {services.map((service) => (
          <div key={service.category}>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">{service.icon}</span>
              {service.category}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {service.items.map((item) => (
                <div
                  key={item.title}
                  className="bg-gradient-to-br from-[#1A1A4A] to-[#0A0A2A] border border-blue-500/30 rounded-xl p-6 hover:border-blue-400 transition-all"
                >
                  <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-cyan-100/70 mb-4">{item.description}</p>
                  <ul className="space-y-2">
                    {item.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-cyan-100/80 text-sm">
                        <span className="text-blue-400">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/50 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Business with AI?</h3>
        <p className="text-cyan-100/70 mb-6">
          Let&apos;s discuss how our services can help you achieve your goals. Book a free consultation today.
        </p>
        <Link
          href="/#contact"
          className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-400 hover:to-purple-500 transition-all"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
function WebDevelopmentDetails() {
  const services = [
    {
      title: "Custom Websites",
      description: "Bespoke websites tailored to your brand and business goals",
      features: [
        "Modern, responsive design",
        "SEO optimized",
        "Lightning-fast performance",
        "Content management system",
        "Analytics integration",
        "Mobile-first approach"
      ]
    },
    {
      title: "Web Applications",
      description: "Powerful web apps built with cutting-edge frameworks",
      features: [
        "React, Next.js, Node.js",
        "Real-time functionality",
        "Database integration",
        "User authentication",
        "API development",
        "Cloud deployment"
      ]
    },
    {
      title: "Landing Pages",
      description: "High-converting pages designed to capture leads",
      features: [
        "Conversion-optimized design",
        "A/B testing ready",
        "Fast load times (<2s)",
        "Lead capture forms",
        "Analytics tracking",
        "Mobile responsive"
      ]
    },
    {
      title: "AI-Powered Features",
      description: "Integrate AI capabilities into your website",
      features: [
        "AI chatbots",
        "Content generation",
        "Personalization",
        "Smart recommendations",
        "Voice interfaces",
        "Image recognition"
      ]
    },
    {
      title: "Performance & Security",
      description: "Enterprise-grade performance and security",
      features: [
        "95+ Lighthouse scores",
        "SSL/HTTPS encryption",
        "DDoS protection",
        "Regular backups",
        "Uptime monitoring",
        "Security audits"
      ]
    },
    {
      title: "Ongoing Support",
      description: "Continuous maintenance and updates",
      features: [
        "Bug fixes & updates",
        "Performance optimization",
        "Content updates",
        "Feature additions",
        "Technical support",
        "Monthly reports"
      ]
    }
  ];

  return (
    <div>
      <h2 className="text-4xl font-bold text-white mb-4">Web Development</h2>
      <p className="text-cyan-100/70 text-lg mb-12 max-w-3xl">
        Custom websites and web applications built with cutting-edge technology. Every project is tailored to your specific needs with modern frameworks, AI integration, and performance optimization.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {services.map((service) => (
          <div
            key={service.title}
            className="bg-gradient-to-br from-[#1A1A4A] to-[#0A0A2A] border border-purple-500/30 rounded-xl p-6 hover:border-purple-400 transition-all"
          >
            <h4 className="text-xl font-bold text-white mb-2">{service.title}</h4>
            <p className="text-cyan-100/70 mb-4 text-sm">{service.description}</p>
            <ul className="space-y-2">
              {service.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-cyan-100/80 text-sm">
                  <span className="text-purple-400">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Technology Stack */}
      <div className="bg-gradient-to-br from-[#1A1A4A] to-[#0A0A2A] border border-purple-500/30 rounded-xl p-8 mb-12">
        <h3 className="text-2xl font-bold text-white mb-6">Technology Stack</h3>
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <h4 className="text-purple-400 font-semibold mb-3">Frontend</h4>
            <ul className="space-y-2 text-cyan-100/70 text-sm">
              <li>• React 19</li>
              <li>• Next.js 15</li>
              <li>• TypeScript</li>
              <li>• Tailwind CSS</li>
            </ul>
          </div>
          <div>
            <h4 className="text-purple-400 font-semibold mb-3">Backend</h4>
            <ul className="space-y-2 text-cyan-100/70 text-sm">
              <li>• Node.js</li>
              <li>• Express</li>
              <li>• tRPC</li>
              <li>• PostgreSQL</li>
            </ul>
          </div>
          <div>
            <h4 className="text-purple-400 font-semibold mb-3">AI Integration</h4>
            <ul className="space-y-2 text-cyan-100/70 text-sm">
              <li>• OpenAI GPT</li>
              <li>• Claude AI</li>
              <li>• Custom models</li>
              <li>• Vector databases</li>
            </ul>
          </div>
          <div>
            <h4 className="text-purple-400 font-semibold mb-3">Deployment</h4>
            <ul className="space-y-2 text-cyan-100/70 text-sm">
              <li>• Vercel</li>
              <li>• AWS</li>
              <li>• CI/CD pipelines</li>
              <li>• Auto-scaling</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-2xl p-8 mb-12">
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Custom Pricing</h3>
        <p className="text-cyan-100/70 text-center mb-6">
          Every project is unique. We provide tailored quotes based on your specific requirements, timeline, and features.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2">💰</div>
            <h4 className="text-purple-400 font-semibold mb-2">Transparent Pricing</h4>
            <p className="text-cyan-100/70 text-sm">No hidden fees, clear breakdown of costs</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">⏱️</div>
            <h4 className="text-purple-400 font-semibold mb-2">Flexible Timeline</h4>
            <p className="text-cyan-100/70 text-sm">Rush projects available, standard 2-8 weeks</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🔄</div>
            <h4 className="text-purple-400 font-semibold mb-2">Iterative Process</h4>
            <p className="text-cyan-100/70 text-sm">Regular updates, unlimited revisions</p>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Ready to Build Your Website?</h3>
        <p className="text-cyan-100/70 mb-6">
          Let&apos;s discuss your project and create a custom quote. Free consultation, no obligations.
        </p>
        <Link
          href="/#contact"
          className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-400 hover:to-pink-500 transition-all"
        >
          Get a Quote
        </Link>
      </div>

      {/* Contact Section */}
      <div id="contact" className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Touch</span>
          </h2>
          <p className="text-cyan-100/70 text-lg mb-12">
            Ready to transform your AI vision into reality? Contact us today.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Email */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/30 rounded-2xl p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Email Us</h3>
              <a href="mailto:hello@pilonqubitventures.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
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
              <a href="tel:+12108385034" className="text-purple-400 hover:text-purple-300 transition-colors text-xl font-semibold">
                (210) 838-5034
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Force deployment Sat Nov 15 14:56:19 EST 2025
