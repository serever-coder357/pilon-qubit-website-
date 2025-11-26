'use client';

import { useEffect, useState } from 'react';
import SmartContactForm from './components/SmartContactForm';
import ProjectScopeGenerator from './components/ProjectScopeGenerator';
import PersonalizationSelector from './components/PersonalizationSelector';
import AboutCards from './components/AboutCards';
import ServiceCards from './components/ServiceCards';
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
    const isSuccess = res.ok && (data?.ok === true || data?.success === true);
    if(!isSuccess){ alert(data.error || 'Something went wrong.'); return; }
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
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center" aria-label="Primary navigation">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-md overflow-hidden border border-cyan-900/50">
              <Image src="/pilonqubit.webp" fill alt="PILON Qubit Ventures - AI and Frontier Technology Consulting" sizes="40px" priority />
            </div>
            <h1 className="text-base sm:text-xl md:text-2xl font-bold text-cyan-400 tracking-tight">PILON Qubit</h1>
          </div>
          <ul className="flex space-x-3 sm:space-x-4 md:space-x-6 text-xs sm:text-sm md:text-base" role="menubar">
            <li role="none"><a href="#services" role="menuitem" aria-label="View our services" className="hover:text-cyan-400 transition-colors">Services</a></li>
            <li role="none"><a href="/case-studies" role="menuitem" aria-label="View case studies" className="hover:text-cyan-400 transition-colors">Cases</a></li>
            <li role="none"><a href="#about" role="menuitem" aria-label="Learn about us" className="hover:text-cyan-400 transition-colors">About</a></li>
            <li role="none"><a href="#contact" role="menuitem" aria-label="Contact us" className="hover:text-cyan-400 transition-colors">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main id="main" className="pt-24">
        <section className="relative overflow-hidden" aria-labelledby="hero-heading">
          <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 id="hero-heading" className="text-4xl md:text-5xl font-extrabold leading-tight">
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
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-cyan-400/20 shadow-xl">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  poster="/ai-consulting-hero.webp"
                >
                  <source src="/pqv-new.mp4" type="video/mp4" />
                  <Image
                    src="/ai-consulting-hero.webp"
                    alt="PILON Qubit Ventures AI Consulting Services"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover"
                  />
                </video>
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

        {/* Video Section */}
        <section className="py-8 bg-gradient-to-b from-[#0A0A2A] to-[#1A1A4A]">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                See <span className="text-cyan-400">PILON Qubit</span> in Action
              </h2>
              <p className="text-cyan-100/80 text-sm md:text-base max-w-2xl mx-auto">
                Discover how we transform frontier technology into production-ready solutions
              </p>
            </div>
            <div className="relative rounded-xl overflow-hidden border border-cyan-900/50 shadow-2xl bg-black aspect-video">
              <video 
                className="w-full h-full object-cover"
                width="1920"
                height="1080"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              >
                <source src="/pilonqubitvideo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </section>

        <section id="services" className="py-20 border-t border-cyan-900/40 bg-white/5" aria-labelledby="services-heading">
          <div className="max-w-7xl mx-auto px-6">
            <h3 id="services-heading" className="text-3xl font-bold mb-4 text-center">From Vision to Velocity</h3>
            <p className="text-cyan-100/80 mb-10 max-w-2xl mx-auto text-center">End-to-end capabilities to accelerate your journey from idea to impact. Our solutions are designed for speed, scale, and strategic advantage.</p>
            <ServiceCards />
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

        <section id="about" className="py-20 border-t border-cyan-900/40" aria-labelledby="about-heading">
          <div className="max-w-5xl mx-auto px-6">
            <h3 id="about-heading" className="text-3xl font-bold mb-6 text-center">Your Unfair Advantage in Frontier Tech</h3>
            <p className="text-cyan-100/80 mb-10 max-w-3xl mx-auto text-center">Born from the intersection of venture capital and hands-on engineering, PILON Qubit brings a unique perspective to frontier technology. Our team has scaled products at leading startups and built critical systems at major tech companies. We understand both the strategic vision needed to raise capital and the technical execution required to ship products that users love. This dual expertise means we don&apos;t just advise—we build alongside you, ensuring every recommendation is grounded in real-world experience and designed for sustainable growth.</p>
            <AboutCards />
          </div>
        </section>

        <section id="contact" className="py-20 border-t border-cyan-900/40 bg-white/5">
          <SmartContactForm />
        </section>
      </main>

      <footer className="border-t border-cyan-900/40 py-8 text-center text-cyan-100/60">© {new Date().getFullYear()} PILON Qubit Ventures — All rights reserved.</footer>
      
      <PersonalizationSelector />
    </div>
  );
}
