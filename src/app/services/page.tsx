'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ServicesPage() {
  const services = [
    {
      category: "AI Strategy & Assessment",
      icon: "🎯",
      items: [
        {
          title: "AI Readiness Assessment",
          description: "Comprehensive evaluation of your organization's AI maturity across data, infrastructure, talent, and governance. Get actionable insights in minutes.",
          features: ["25-question assessment", "Real-time scoring", "Personalized recommendations", "Downloadable PDF report"],
          cta: "Take Assessment",
          link: "/assessment"
        },
        {
          title: "Use Case Discovery Workshop",
          description: "Structured facilitated workshop to identify and prioritize AI opportunities specific to your business with ROI estimation.",
          features: ["Collaborative brainstorming", "Prioritization matrix", "ROI calculator", "Implementation roadmap"],
          cta: "Book Workshop",
          link: "/contact"
        },
        {
          title: "AI Strategy Development",
          description: "Create a comprehensive AI strategy aligned with your business goals, complete with roadmap, resource requirements, and success metrics.",
          features: ["Strategic alignment", "Technology selection", "Resource planning", "Risk assessment"],
          cta: "Learn More",
          link: "/contact"
        }
      ]
    },
    {
      category: "Implementation & Development",
      icon: "🚀",
      items: [
        {
          title: "Frontier AI & Product Acceleration",
          description: "Build and deploy cutting-edge AI solutions from LLM integrations and agentic workflows to scalable production infrastructure.",
          features: ["10x faster development", "50% cost reduction", "Battle-tested architectures", "Production-ready code"],
          cta: "Start Building",
          link: "/contact"
        },
        {
          title: "Agentic AI Systems",
          description: "Design and deploy autonomous AI agents that can perform complex tasks, make decisions, and collaborate to achieve business objectives.",
          features: ["Multi-agent orchestration", "Custom agent development", "Tool integration", "Human-in-the-loop controls"],
          cta: "Explore Agents",
          link: "/contact"
        },
        {
          title: "AI Labs & Innovation Center",
          description: "Access our virtual innovation lab to experiment with AI technologies, develop proofs of concept, and collaborate with our experts.",
          features: ["Sandbox environment", "Pre-built demos", "Expert collaboration", "Rapid prototyping"],
          cta: "Join Labs",
          link: "/contact"
        }
      ]
    },
    {
      category: "Security & Governance",
      icon: "🛡️",
      items: [
        {
          title: "Strategic Security & Reliability",
          description: "Embed security and resilience into your AI products from day one with threat modeling, privacy-by-design, and robust QA automation.",
          features: ["99.99% uptime", "Zero-trust security", "Compliance frameworks", "Continuous monitoring"],
          cta: "Secure Your AI",
          link: "/contact"
        },
        {
          title: "AI Governance Framework",
          description: "Build customized AI governance policies, ethical guidelines, and compliance frameworks tailored to your industry and risk profile.",
          features: ["Policy templates", "Risk assessment", "Compliance checklists", "Audit trails"],
          cta: "Build Framework",
          link: "/contact"
        },
        {
          title: "AI Ethics & Bias Detection",
          description: "Audit your AI systems for bias, fairness issues, and ethical concerns with recommendations for improvement and certification.",
          features: ["Automated bias detection", "Fairness metrics", "Explainability analysis", "Certification program"],
          cta: "Request Audit",
          link: "/contact"
        }
      ]
    },
    {
      category: "Growth & Analytics",
      icon: "📈",
      items: [
        {
          title: "Growth & GTM Intelligence",
          description: "Find product-market fit and scale your user base with data-driven precision through instrumentation, funnel analysis, and A/B testing.",
          features: ["40% more users", "30% better retention", "Conversion optimization", "Analytics infrastructure"],
          cta: "Accelerate Growth",
          link: "/contact"
        },
        {
          title: "AI Benchmarking Service",
          description: "Compare your AI capabilities against industry peers with comprehensive maturity assessment and actionable improvement roadmap.",
          features: ["Industry benchmarks", "Peer comparison", "Gap analysis", "Trend tracking"],
          cta: "Get Benchmarked",
          link: "/contact"
        },
        {
          title: "AI ROI Calculator",
          description: "Quantify the financial impact of AI initiatives with cost-benefit analysis, payback period estimation, and risk assessment.",
          features: ["Industry templates", "Sensitivity analysis", "Business case generation", "CFO-ready reports"],
          cta: "Calculate ROI",
          link: "/roi-calculator"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A2A] via-[#1A1A4A] to-[#0A0A2A] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A2A]/95 backdrop-blur-sm border-b border-cyan-900/40">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/pilonqubit.webp" alt="PILON Qubit Ventures" className="h-10 w-10 rounded object-cover" />
            <span className="text-xl font-bold">PILON Qubit Ventures</span>
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/#services" className="hover:text-cyan-400 transition-colors">Services</Link>
            <Link href="/#about" className="hover:text-cyan-400 transition-colors">About</Link>
            <Link href="/#contact" className="hover:text-cyan-400 transition-colors">Contact</Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our <span className="text-cyan-400">Services</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-cyan-100/80 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            From strategy to deployment, we deliver end-to-end AI solutions that drive real business impact. 
            Our services combine deep technical expertise with strategic thinking to help you build, deploy, and scale AI systems that actually work.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      {services.map((category, catIndex) => (
        <section key={catIndex} className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-4xl">{category.icon}</span>
              <h2 className="text-3xl font-bold">{category.category}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {category.items.map((service, serviceIndex) => (
                <motion.div
                  key={serviceIndex}
                  className="bg-white/5 backdrop-blur-sm border border-cyan-900/40 rounded-xl p-6 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: serviceIndex * 0.1 }}
                >
                  <h3 className="text-xl font-bold mb-3 text-cyan-400">{service.title}</h3>
                  <p className="text-cyan-100/70 mb-4 text-sm leading-relaxed">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 text-sm text-cyan-100/60">
                        <span className="text-cyan-400 mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link 
                    href={service.link}
                    className="inline-block w-full text-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all"
                  >
                    {service.cta}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-y border-cyan-900/40">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Business with AI?</h2>
          <p className="text-xl text-cyan-100/80 mb-8">
            Let&apos;s discuss how our services can help you achieve your goals. Book a free consultation today.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              href="/assessment"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold text-lg hover:from-cyan-400 hover:to-blue-500 transition-all"
            >
              Take Free Assessment
            </Link>
            <Link 
              href="/#contact"
              className="px-8 py-4 bg-white/10 border border-cyan-500 rounded-lg font-bold text-lg hover:bg-white/20 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-cyan-900/40">
        <div className="max-w-7xl mx-auto text-center text-cyan-100/60 text-sm">
          <p>&copy; 2025 PILON Qubit Ventures. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
