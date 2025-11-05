'use client';

import { useEffect, useState } from 'react';
import AIChatbot from './components/AIChatbot';
import SmartContactForm from './components/SmartContactForm';
import ProjectScopeGenerator from './components/ProjectScopeGenerator';
import PersonalizationSelector from './components/PersonalizationSelector';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { initAnalytics, page } from '@/lib/analytics';
import { setConsentState } from '@/lib/consent';
import { detectVisitorType, getPersonalizedContent, trackPersonalization, type VisitorType } from '@/lib/personalization';

function Button(props: any){ return <button {...props} className={(props.className||'') + ' px-4 py-2 rounded bg-cyan-500 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400'} /> }
function Input(props: any){ return <input {...props} className={(props.className||'') + ' px-3 py-2 rounded text-black'}/>} 
function Textarea(props: any){ return <textarea {...props} className={(props.className||'') + ' px-3 py-2 rounded text-black'}/>} 

export default function Home(){
  const [consented, setConsented] = useState<boolean>(()=> typeof window!=='undefined' && localStorage.getItem('pqv-consent')==='accept');
  const [visitorType, setVisitorTypeState] = useState<VisitorType>('unknown');
  const [personalizedContent, setPersonalizedContent] = useState(getPersonalizedContent('unknown'));
  const prefersReducedMotion = useReducedMotion();

  useEffect(()=>{ if(consented){ initAnalytics(); page(); } },[consented]);

  useEffect(() => {
    // Detect visitor type and load personalized content
    const detected = detectVisitorType();
    setVisitorTypeState(detected);
    setPersonalizedContent(getPersonalizedContent(detected));
    trackPersonalization(detected, 'page_view');
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get('name')||''),
      email: String(fd.get('email')||''),
      company: String(fd.get('company')||''),
      message: String(fd.get('message')||''),
      turnstileToken: undefined,
    };
    const res = await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    const data = await res.json();
    if(!res.ok || !data.ok){ alert(data.error || 'Something went wrong.'); return; }
    (window as any).analytics?.track?.('contact_submitted_success');
    (e.currentTarget as HTMLFormElement).reset();
    alert("Thanks! We'll be in touch shortly.");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A2A] to-[#1A1A4A] text-white">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-cyan-700 px-3 py-2 rounded">Skip to content</a>

      {(!consented) && (
        <div className="fixed inset-x-0 bottom-0 z-50">
          <div className="mx-auto max-w-5xl m-4 rounded-2xl border border-cyan-900/50 bg-[#0a0a2a]/95 p-4 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <p className="text-sm text-cyan-100/80">We use cookies/tech for analytics and advertising. By accepting, you allow measurement and conversion APIs.</p>
              <div className="flex gap-2">
                <Button onClick={()=>{ localStorage.setItem('pqv-consent','decline'); }}>Decline</Button>
                <Button onClick={()=>{ localStorage.setItem('pqv-consent','accept'); setConsented(true); setConsentState('accept'); initAnalytics(); page(); }}>Accept</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="fixed top-0 w-full bg-opacity-80 bg-[#0A0A2A] z-10 backdrop-blur-sm border-b border-cyan-900">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center" aria-label="Primary">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 rounded-md overflow-hidden border border-cyan-900/50">
              <Image src="/pilonqubit.jpg" fill alt="PILON Qubit Ventures mark" sizes="40px" />
            </div>
            <h1 className="text-2xl font-bold text-cyan-400 tracking-tight">PILON Qubit Ventures</h1>
          </div>
          <ul className="flex space-x-6 text-sm md:text-base">
            <li><a href="#services">Services</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main id="main" className="pt-24">
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
                {personalizedContent.heroTitle.split(' ').map((word, i, arr) => 
                  i === arr.length - 1 ? <span key={i} className="text-cyan-400">{word}</span> : word + ' '
                )}
              </h2>
              <p className="mt-4 text-cyan-100/80 max-w-prose">{personalizedContent.heroSubtitle}</p>
              <div className="mt-8 flex gap-3">
                <Button onClick={()=>document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}>{personalizedContent.ctaPrimary}</Button>
                <Button onClick={()=>document.getElementById('about')?.scrollIntoView({behavior:'smooth'})}>{personalizedContent.ctaSecondary}</Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative w-full aspect-[3/4] md:aspect-[4/5] rounded-2xl overflow-hidden border border-cyan-400/20 shadow-xl">
                <Image
                  src="/pilonqubit.jpg"
                  alt="PILON Qubit Ventures — brand poster"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover"
                />
              </div>
              {!prefersReducedMotion && (
                <motion.div
                  aria-hidden
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.25 }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                  className="absolute -inset-6 -z-10 rounded-3xl bg-cyan-500 blur-3xl"
                />
              )}
            </div>
          </div>
        </section>

        <section id="services" className="py-20 border-t border-cyan-900/40 bg-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <h3 className="text-3xl font-bold mb-4 text-center">From Vision to Velocity</h3>
            <p className="text-cyan-100/80 mb-10 max-w-2xl mx-auto text-center">End-to-end capabilities to accelerate your journey from idea to impact. Our solutions are designed for speed, scale, and strategic advantage.</p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border border-cyan-900/40 bg-[#0E1030]/60 backdrop-blur hover:border-cyan-500/40 transition-all">
                <div className="font-semibold mb-3 text-lg text-cyan-400">Frontier AI & Product Acceleration</div>
                <div className="text-cyan-100/80 mb-4">Build and deploy cutting-edge AI solutions that give you a competitive edge. From LLM integrations and agentic workflows to scalable infrastructure, we deliver production-ready systems that perform.</div>
                <div className="text-sm text-cyan-100/60">10x faster development • 50% cost reduction</div>
              </div>
              <div className="p-6 rounded-2xl border border-cyan-900/40 bg-[#0E1030]/60 backdrop-blur hover:border-cyan-500/40 transition-all">
                <div className="font-semibold mb-3 text-lg text-cyan-400">Strategic Security & Reliability</div>
                <div className="text-cyan-100/80 mb-4">Embed security and resilience into your products from day one. Our approach combines threat modeling, privacy-by-design principles, and robust QA automation to protect your assets and build user trust.</div>
                <div className="text-sm text-cyan-100/60">99.99% uptime • Zero-trust security</div>
              </div>
              <div className="p-6 rounded-2xl border border-cyan-900/40 bg-[#0E1030]/60 backdrop-blur hover:border-cyan-500/40 transition-all">
                <div className="font-semibold mb-3 text-lg text-cyan-400">Growth & GTM Intelligence</div>
                <div className="text-cyan-100/80 mb-4">Find product-market fit and scale your user base with data-driven precision. From instrumentation and funnel analysis to A/B testing and conversion optimization, we build the engine for sustainable growth.</div>
                <div className="text-sm text-cyan-100/60">40% more users • 30% better retention</div>
              </div>
            </div>
          </div>
        </section>

        <section id="scope-generator" className="py-20 border-t border-cyan-900/40">
          <div className="max-w-7xl mx-auto px-6">
            <h3 className="text-3xl font-bold mb-6 text-center">Define Your Project</h3>
            <p className="text-cyan-100/80 mb-10 max-w-2xl mx-auto text-center">
              Not sure where to start? Our AI-powered project scope generator will help you define your requirements and get a comprehensive project brief in minutes.
            </p>
            <ProjectScopeGenerator />
          </div>
        </section>

        <section id="about" className="py-20 border-t border-cyan-900/40">
          <div className="max-w-5xl mx-auto px-6">
            <h3 className="text-3xl font-bold mb-6 text-center">Your Unfair Advantage in Frontier Tech</h3>
            <p className="text-cyan-100/80 mb-10 max-w-3xl mx-auto text-center">Born from the intersection of venture capital and hands-on engineering, PILON Qubit brings a unique perspective to frontier technology. Our team has scaled products at leading startups and built critical systems at major tech companies. We understand both the strategic vision needed to raise capital and the technical execution required to ship products that users love. This dual expertise means we don&apos;t just advise—we build alongside you, ensuring every recommendation is grounded in real-world experience and designed for sustainable growth.</p>
            <div className="grid md:grid-cols-4 gap-6">
              {[{k:'Venture Insight',v:'Build for funding'},{k:'Operator Grit',v:'Ship with speed'},{k:'Technical Excellence',v:'Scale to millions'},{k:'Speed & Agility',v:'Weeks not months'}].map(i=> (
                <div key={i.k} className="p-6 rounded-2xl border border-cyan-900/40 bg-white/5 hover:border-cyan-500/40 transition-all"><div className="text-cyan-400 text-sm mb-2">{i.k}</div><div className="text-lg font-semibold">{i.v}</div></div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 border-t border-cyan-900/40 bg-white/5">
          <SmartContactForm />
        </section>
      </main>

      <footer className="border-t border-cyan-900/40 py-8 text-center text-cyan-100/60">© {new Date().getFullYear()} PILON Qubit Ventures — All rights reserved.</footer>
      
      <AIChatbot />
      <PersonalizationSelector />
    </div>
  );
}
