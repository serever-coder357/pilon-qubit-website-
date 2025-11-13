'use client';

import { useState, useEffect, useRef } from 'react';

const servicesData = [
  {
    title: 'Frontier AI & Product Acceleration',
    summary: 'Build and deploy cutting-edge AI solutions that give you a competitive edge. From LLM integrations and agentic workflows to scalable infrastructure, we deliver production-ready systems that perform.',
    metrics: '10x faster development • 50% cost reduction',
    details: [
      'LLM Integration & Fine-tuning',
      'Agentic Workflow Development',
      'RAG & Vector Database Implementation',
      'Model Evaluation & Testing',
      'Production Infrastructure & Scaling',
      'AI Product Strategy & Roadmapping'
    ]
  },
  {
    title: 'Strategic Security & Reliability',
    summary: 'Embed security and resilience into your products from day one. Our approach combines threat modeling, privacy-by-design principles, and robust QA automation to protect your assets and build user trust.',
    metrics: '99.99% uptime • Zero-trust security',
    details: [
      'Threat Modeling & Risk Assessment',
      'Privacy-by-Design Architecture',
      'Security Audits & Penetration Testing',
      'Compliance (SOC 2, GDPR, HIPAA)',
      'Automated QA & Testing Harnesses',
      'Incident Response Planning'
    ]
  },
  {
    title: 'Growth & GTM Intelligence',
    summary: 'Find product-market fit and scale your user base with data-driven precision. From instrumentation and funnel analysis to A/B testing and conversion optimization, we build the engine for sustainable growth.',
    metrics: '40% more users • 30% better retention',
    details: [
      'Analytics Instrumentation & Tracking',
      'Conversion Funnel Optimization',
      'A/B Testing & Experimentation',
      'User Segmentation & Personalization',
      'Growth Model Development',
      'Go-to-Market Strategy'
    ]
  }
];

function ServiceCard({ service, index }: { service: typeof servicesData[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Auto-expand on scroll into view
  useEffect(() => {
    const element = cardRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            // Card is more than 50% visible
            setExpanded(true);
          }
        });
      },
      {
        threshold: [0.5], // Trigger when 50% visible
        rootMargin: '0px'
      }
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  // Auto-expand on hover
  useEffect(() => {
    if (isHovered) {
      setExpanded(true);
    }
  }, [isHovered]);

  return (
    <div
      ref={cardRef}
      className="p-6 rounded-2xl border border-cyan-900/40 bg-[#0E1030]/60 backdrop-blur hover:border-cyan-500/40 transition-all cursor-pointer group"
      onClick={() => setExpanded(!expanded)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="font-semibold mb-3 text-lg text-cyan-400 flex items-center justify-between">
        {service.title}
        <span className="text-sm opacity-50 group-hover:opacity-100 transition-opacity">▼</span>
      </div>
      <div className="text-cyan-100/80 mb-4">{service.summary}</div>
      <div className="text-sm text-cyan-100/60 mb-4">{service.metrics}</div>
      {expanded && (
        <div className="mt-4 pt-4 border-t border-cyan-900/40 animate-fadeIn">
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
      )}
    </div>
  );
}

export default function ServiceCards() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {servicesData.map((service, idx) => (
        <ServiceCard key={idx} service={service} index={idx} />
      ))}
    </div>
  );
}
