import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const self = "'self'";
const unsafeInline = "'unsafe-inline'";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const csp = [
    `default-src ${self}`,
    `script-src ${self} https://cdn.segment.com https://challenges.cloudflare.com ${unsafeInline}`,
    `connect-src ${self} https://api.segment.io https://challenges.cloudflare.com`,
    `img-src ${self} data: blob:`,
    `style-src ${self} ${unsafeInline}`,
    `font-src ${self} data:`,
    `frame-src https://challenges.cloudflare.com`,
    `upgrade-insecure-requests`,
  ].join('; ');

  res.headers.set('Content-Security-Policy', csp);
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  res.headers.set('X-XSS-Protection', '0');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
