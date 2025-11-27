/**
 * Intelligent Content Personalization
 * Detects visitor type and provides personalized content
 */

export type VisitorType = 'founder' | 'enterprise' | 'developer' | 'unknown';

export interface PersonalizedContent {
  heroTitle: string;
  heroSubtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  serviceHighlight: string;
  testimonialFocus: string;
}

/**
 * Detect visitor type based on various signals
 */
export function detectVisitorType(): VisitorType {
  if (typeof window === 'undefined') return 'unknown';

  // Check localStorage for previous detection
  const stored = localStorage.getItem('pqv-visitor-type');
  if (stored && ['founder', 'enterprise', 'developer'].includes(stored)) {
    return stored as VisitorType;
  }

  // Detect based on various signals
  const signals = {
    founder: 0,
    enterprise: 0,
    developer: 0,
  };

  // Check referrer
  const referrer = document.referrer.toLowerCase();
  if (referrer.includes('ycombinator') || referrer.includes('techcrunch') || referrer.includes('producthunt')) {
    signals.founder += 3;
  }
  if (referrer.includes('linkedin') || referrer.includes('glassdoor')) {
    signals.enterprise += 2;
  }
  if (referrer.includes('github') || referrer.includes('stackoverflow') || referrer.includes('dev.to')) {
    signals.developer += 3;
  }

  // Check time of day (developers tend to browse late)
  const hour = new Date().getHours();
  if (hour >= 22 || hour <= 6) {
    signals.developer += 1;
  }
  if (hour >= 9 && hour <= 17) {
    signals.enterprise += 1;
  }

  // Check user agent for developer tools
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('linux') || ua.includes('ubuntu')) {
    signals.developer += 1;
  }

  // Check screen resolution (developers often have larger screens)
  if (window.screen.width >= 2560) {
    signals.developer += 1;
  }

  // Determine type based on highest signal
  const maxSignal = Math.max(signals.founder, signals.enterprise, signals.developer);
  
  if (maxSignal === 0) return 'unknown';

  let detectedType: VisitorType = 'unknown';
  if (signals.founder === maxSignal) detectedType = 'founder';
  else if (signals.enterprise === maxSignal) detectedType = 'enterprise';
  else if (signals.developer === maxSignal) detectedType = 'developer';

  // Store for future visits
  localStorage.setItem('pqv-visitor-type', detectedType);

  return detectedType;
}

/**
 * Get personalized content based on visitor type
 */
export function getPersonalizedContent(type: VisitorType): PersonalizedContent {
  const content: Record<VisitorType, PersonalizedContent> = {
    founder: {
      heroTitle: 'Ship Your Vision at Quantum Velocity',
      heroSubtitle: 'Transform your bold idea into a market-ready product in weeks, not months. We combine venture insight with hands-on engineering to deliver AI solutions that scale fast and win funding rounds.',
      ctaPrimary: 'Start Building',
      ctaSecondary: 'See Our Approach',
      serviceHighlight: 'AI & Product Acceleration',
      testimonialFocus: 'startup',
    },
    enterprise: {
      heroTitle: 'Where Frontier Technology Meets Operator Grit',
      heroSubtitle:
        'We partner with visionary founders and forward-thinking enterprises to transform bold ideas into market-ready products. Combining venture perspective with hands-on engineering, we deliver AI and quantum solutions that ship fast, scale reliably, and drive measurable business impact.',
      ctaPrimary: 'Start Building',
      ctaSecondary: 'See Our Approach',
      serviceHighlight: 'Security & Reliability',
      testimonialFocus: 'enterprise',
    },
    developer: {
      heroTitle: 'Build AI Systems That Actually Scale',
      heroSubtitle: 'From LLM integrations and agentic workflows to production infrastructure, we deliver battle-tested architectures that handle millions of requests. No theory—just code that ships.',
      ctaPrimary: 'Start Building',
      ctaSecondary: 'See Our Approach',
      serviceHighlight: 'AI & Product Acceleration',
      testimonialFocus: 'technical',
    },
    unknown: {
      heroTitle: 'Where Frontier Technology Meets Operator Grit',
      heroSubtitle: 'We partner with visionary founders and forward-thinking enterprises to transform bold ideas into market-ready products. Combining venture perspective with hands-on engineering, we deliver AI and quantum solutions that ship fast, scale reliably, and drive measurable business impact.',
      ctaPrimary: 'Start Building',
      ctaSecondary: 'See Our Approach',
      serviceHighlight: 'all',
      testimonialFocus: 'general',
    },
  };

  return content[type];
}

/**
 * Set visitor type manually (for testing or user selection)
 */
export function setVisitorType(type: VisitorType): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('pqv-visitor-type', type);
}

/**
 * Get visitor type label for display
 */
export function getVisitorTypeLabel(type: VisitorType): string {
  const labels: Record<VisitorType, string> = {
    founder: 'Founder / Startup',
    enterprise: 'Enterprise',
    developer: 'Developer / Technical',
    unknown: 'General Visitor',
  };
  return labels[type];
}

/**
 * Track personalization event
 */
export function trackPersonalization(type: VisitorType, action: string): void {
  if (typeof window === 'undefined') return;
  
  // Track with analytics if available
  if ((window as any).analytics?.track) {
    (window as any).analytics.track('personalization_event', {
      visitor_type: type,
      action,
      timestamp: new Date().toISOString(),
    });
  }
}
