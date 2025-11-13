'use client';

import { useState, useEffect, useRef } from 'react';

const aboutData = [
  {
    k: 'Venture Insight',
    v: 'Build for funding',
    desc: 'We understand what investors look for and help you build products that attract capital while maintaining technical excellence.'
  },
  {
    k: 'Operator Grit',
    v: 'Ship with speed',
    desc: 'Battle-tested experience shipping products at scale. We know how to move fast without breaking things.'
  },
  {
    k: 'Technical Excellence',
    v: 'Scale to millions',
    desc: 'Built systems handling millions of users. We architect for scale from day one, not as an afterthought.'
  },
  {
    k: 'Speed & Agility',
    v: 'Weeks not months',
    desc: 'Rapid prototyping and iterative development. See results in weeks, not quarters.'
  }
];

function AboutCard({ item }: { item: typeof aboutData[0] }) {
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
      className="p-6 rounded-2xl border border-cyan-900/40 bg-white/5 hover:border-cyan-500/40 transition-all cursor-pointer"
      onClick={() => setExpanded(!expanded)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="text-cyan-400 text-sm mb-2">{item.k}</div>
      <div className="text-lg font-semibold mb-2">{item.v}</div>
      {expanded && (
        <div className="text-sm text-cyan-100/70 mt-3 pt-3 border-t border-cyan-900/30 animate-fadeIn">
          {item.desc}
        </div>
      )}
    </div>
  );
}

export default function AboutCards() {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      {aboutData.map((item) => (
        <AboutCard key={item.k} item={item} />
      ))}
    </div>
  );
}
