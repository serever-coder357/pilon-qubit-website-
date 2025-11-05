export type ConsentState = 'accept' | 'decline' | 'unknown';
const KEY = 'pqv-consent';

export function getConsentState(): ConsentState {
  if (typeof window === 'undefined') return 'unknown';
  const v = localStorage.getItem(KEY);
  return v === 'accept' ? 'accept' : v === 'decline' ? 'decline' : 'unknown';
}

export function setConsentState(state: ConsentState) {
  if (typeof window === 'undefined') return;
  if (state === 'unknown') localStorage.removeItem(KEY);
  else localStorage.setItem(KEY, state);
}

export function hasConsent() { return getConsentState() === 'accept'; }

export function withConsent<T extends (...args: any[]) => any>(fn: T): T {
  // @ts-ignore
  return ((...args: any[]) => { if (hasConsent()) return fn(...args); }) as T;
}
