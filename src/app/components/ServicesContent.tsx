'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import WebDevelopmentDetails from '../WebDevelopmentDetails';

type Service = {
  id: string;
  name: string;
  icon: string;
  description: string;
  highlights: string[];
  priceHeadline: string;
  priceSubtext: string;
  ctaLabel: string;
  theme: 'cyan' | 'blue' | 'purple';
  status: 'expanded' | 'comingSoon';
};

const services: Service[] = [
  {
    id: 'marketing',
    name: 'AI Marketing Automation',
    icon: '🤖',
    description:
      'Complete marketing automation platform powered by AI. Save $3K/mo on marketing staff with 24/7 automated operations.',
    highlights: [
      'AI Voice Assistant (24/7 phone)',
      'Conversation AI (chat + SMS)',
      'Review Management',
      'Content Generation',
      'Funnel Builder',
      'Workflow Automation',
    ],
    priceHeadline: 'Starting at $299/mo',
    priceSubtext: 'Month-to-month • No contracts • Setup determined case by case',
    ctaLabel: 'View Pricing & Features →',
    theme: 'cyan',
    status: 'expanded',
  },
  {
    id: 'consulting',
    name: 'Frontier AI Consulting',
    icon: '🚀',
    description:
      'Custom AI development and strategic consulting for frontier technology companies. From LLM integrations to production infrastructure.',
    highlights: [
      'AI Strategy & Assessment',
      'Implementation & Development',
      'Security & Governance',
      'Growth & Analytics',
      '10x faster development',
      '50% cost reduction',
    ],
    priceHeadline: 'Custom Pricing',
    priceSubtext: 'Contact us for a tailored quote',
    ctaLabel: 'View Services →',
    theme: 'blue',
    status: 'expanded',
  },
  {
    id: 'webdev',
    name: 'Web Development',
    icon: '💻',
    description: 'Custom websites and applications built for performance and scale.',
    highlights: ['Landing pages that convert', 'Full-stack apps', 'AI-native experiences'],
    priceHeadline: 'Custom Projects',
    priceSubtext: 'Performance-first, SEO-ready, analytics from day one',
    ctaLabel: 'View Details →',
    theme: 'purple',
    status: 'expanded',
  },
  {
    id: 'agents',
    name: 'Agentic Automation Lab',
    icon: '🧠',
    description: 'Industry-tuned autonomous agent frameworks and tooling.',
    highlights: ['Workflow orchestration', 'Evaluation harnesses', 'Tool integration blueprints'],
    priceHeadline: 'Coming Soon',
    priceSubtext: 'Join the waitlist for early access',
    ctaLabel: 'Notify Me',
    theme: 'cyan',
    status: 'comingSoon',
  },
];

export default function ServicesContent() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<'expanded' | 'comingSoon'>('expanded');

  const expandedServices = services.filter((service) => service.status === 'expanded');
  const comingSoonServices = services.filter((service) => service.status === 'comingSoon');

  const scrollToSection = useCallback((id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash !== '#services' && pathname !== '/services') {
      return;
    }

    let timeout: number | undefined;

    const frame = requestAnimationFrame(() => {
      timeout = window.setTimeout(() => {
        scrollToSection('services');
      }, 0);
    });

    return () => {
      cancelAnimationFrame(frame);
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [pathname, scrollToSection]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A2A] via-[#1A1A4A] to-[#0A0A2A]">
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

        {/* Service overview cards that jump to details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {expandedServices.map((service) => (
              <motion.button
                key={service.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => scrollToSection(service.id)}
                className={`text-left bg-gradient-to-br from-[#1A1A4A] to-[#0A0A2A] border rounded-2xl p-8 cursor-pointer transition-all group focus:outline-none focus-visible:ring-2 ${
                  service.theme === 'cyan'
                    ? 'border-cyan-500/50 hover:border-cyan-400 focus-visible:ring-cyan-400'
                    : service.theme === 'blue'
                      ? 'border-blue-500/50 hover:border-blue-400 focus-visible:ring-blue-400'
                      : 'border-purple-500/50 hover:border-purple-400 focus-visible:ring-purple-400'
                }`}
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3
                  className={`text-3xl font-bold text-white mb-4 transition-colors ${
                    service.theme === 'cyan'
                      ? 'group-hover:text-cyan-400'
                      : service.theme === 'blue'
                        ? 'group-hover:text-blue-400'
                        : 'group-hover:text-purple-400'
                  }`}
                >
                  {service.name}
                </h3>
                <p className="text-cyan-100/70 text-lg mb-6">{service.description}</p>
                <ul className="space-y-3 mb-8">
                  {service.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-center gap-3 text-cyan-100/80">
                      <span
                        className={
                          service.theme === 'cyan'
                            ? 'text-cyan-400'
                            : service.theme === 'blue'
                              ? 'text-blue-400'
                              : 'text-purple-400'
                        }
                      >
                        ✓
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-center">
                  <div
                    className={`${
                      service.theme === 'cyan'
                        ? 'text-cyan-400'
                        : service.theme === 'blue'
                          ? 'text-blue-400'
                          : 'text-purple-400'
                    } font-bold text-xl mb-2`}
                  >
                    {service.priceHeadline}
                  </div>
                  <div className="text-cyan-100/60 text-sm">{service.priceSubtext}</div>
                </div>
                <span
                  className={`block w-full mt-6 px-6 py-3 text-white font-semibold rounded-lg transition-all text-center ${
                    service.theme === 'cyan'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 group-hover:from-cyan-400 group-hover:to-blue-500'
                      : service.theme === 'blue'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 group-hover:from-blue-400 group-hover:to-purple-500'
                        : 'bg-gradient-to-r from-purple-500 to-pink-600 group-hover:from-purple-400 group-hover:to-pink-500'
                  }`}
                >
                  {service.ctaLabel}
                </span>
              </motion.button>
            ))}
        </motion.div>

        {/* Services tabs */}
        <div className="max-w-6xl mx-auto mt-14">
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { key: 'expanded', label: 'Expanded services' },
              { key: 'comingSoon', label: 'Coming Soon' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'expanded' | 'comingSoon')}
                className={`px-4 py-2 rounded-full border text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  activeTab === tab.key
                    ? 'bg-cyan-500/20 border-cyan-400 text-white'
                    : 'bg-[#0A0A2A] border-white/10 text-cyan-100/80 hover:border-cyan-400/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {(activeTab === 'expanded' ? expandedServices : comingSoonServices).map((service) => (
                <div
                  key={`${activeTab}-${service.id}`}
                  className={`rounded-2xl border p-6 bg-gradient-to-br from-[#1A1A4A] to-[#0A0A2A] transition-colors ${
                    service.theme === 'cyan'
                      ? 'border-cyan-500/40'
                      : service.theme === 'blue'
                        ? 'border-blue-500/40'
                        : 'border-purple-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">{service.icon}</div>
                    <div className="text-xl font-semibold text-white">{service.name}</div>
                  </div>
                  <p className="text-cyan-100/70 text-sm mb-4">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.highlights.slice(0, 3).map((highlight) => (
                      <li key={highlight} className="flex items-center gap-2 text-cyan-100/80 text-sm">
                        <span
                          className={
                            service.theme === 'cyan'
                              ? 'text-cyan-400'
                              : service.theme === 'blue'
                                ? 'text-blue-400'
                                : 'text-purple-400'
                          }
                        >
                          •
                        </span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-sm text-cyan-100/60 mb-4">{service.priceSubtext}</div>
                  {service.status === 'expanded' ? (
                    <button
                      onClick={() => scrollToSection(service.id)}
                      className={`w-full py-3 rounded-lg font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A2A] ${
                        service.theme === 'cyan'
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 focus-visible:ring-cyan-400'
                          : service.theme === 'blue'
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-400 hover:to-purple-500 focus-visible:ring-blue-400'
                            : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-400 hover:to-pink-500 focus-visible:ring-purple-400'
                      }`}
                    >
                      View details
                    </button>
                  ) : (
                    <div className="w-full py-3 rounded-lg border border-white/10 text-center text-cyan-100/60">Coming soon</div>
                  )}
                </div>
              ))}

            {activeTab === 'comingSoon' && comingSoonServices.length === 0 && (
                <div className="col-span-1 md:col-span-3 text-center text-cyan-100/70 border border-white/10 rounded-2xl p-6 bg-[#0A0A2A]/60">
                  No coming soon services right now.
                </div>
              )}
          </div>
        </div>

        {/* Full service details are always visible */}
        <div id="services" className="max-w-6xl mx-auto mt-16 space-y-20">
          <section id="marketing">
            <MarketingAutomationDetails />
          </section>

          <section id="consulting" className="pt-4 border-t border-white/5" aria-label="Frontier AI Consulting">
            <FrontierAIConsultingDetails />
          </section>

          <section id="webdev" className="pt-4 border-t border-white/5" aria-label="Web Development">
            <WebDevelopmentDetails />
          </section>
        </div>
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
