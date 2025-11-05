import { hasConsent } from './consent';

declare global { interface Window { analytics?: any } }
let initialized = false;

export function initAnalytics() {
  if (typeof window === 'undefined') return;
  if (initialized || !hasConsent()) return; // only init after consent
  const KEY = process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY;
  if (!KEY) return;
  (function(){
    const analytics: any = (window as any).analytics = (window as any).analytics || [];
    if (!analytics.initialize) {
      if (analytics.invoked) return;
      analytics.invoked = true;
      analytics.methods = ['track','page','identify','group','reset','on','once'];
      analytics.factory = function(method: string){ return function(){ const args = Array.prototype.slice.call(arguments); args.unshift(method); analytics.push(args); return analytics; }; };
      for (let i = 0; i < analytics.methods.length; i++) { const k = analytics.methods[i]; analytics[k] = analytics.factory(k); }
      analytics.load = function(key: string){ const s = document.createElement('script'); s.async = true; s.src = 'https://cdn.segment.com/analytics.js/v1/' + key + '/analytics.min.js'; const x = document.getElementsByTagName('script')[0]; x.parentNode?.insertBefore(s, x); };
      analytics._writeKey = KEY; analytics.SNIPPET_VERSION = '4.15.3';
      analytics.load(KEY);
      analytics.page();
      initialized = true;
    }
  })();
}

export const page = (...args: any[]) => (window as any).analytics?.page?.(...args);
export const track = (...args: any[]) => (window as any).analytics?.track?.(...args);
export const identify = (...args: any[]) => (window as any).analytics?.identify?.(...args);
