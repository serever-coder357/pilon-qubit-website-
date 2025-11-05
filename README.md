# PILON Qubit Ventures Website

A modern, responsive Next.js website for PILON Qubit Ventures featuring quantum-grade strategy and product acceleration services.

## Features

- **Next.js 14** with App Router and TypeScript
- **Tailwind CSS** for styling with custom gradient backgrounds
- **Framer Motion** for smooth animations
- **Contact Form** with Cloudflare Turnstile verification
- **Email Integration** via Resend API
- **Consent-gated Analytics** using Segment
- **Security Headers** and CSP middleware
- **Conversion API Endpoints** for Meta, LinkedIn, and TikTok
- **Playwright Tests** for E2E and accessibility testing

## Project Structure

```
pilon-qubit-website/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── contact/          # Contact form API
│   │   │   └── capi/             # Conversion API endpoints
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Homepage
│   │   ├── robots.txt/           # Robots.txt route
│   │   └── sitemap.xml/          # Sitemap route
│   └── lib/
│       ├── analytics.ts          # Segment analytics
│       └── consent.ts            # Cookie consent management
├── public/
│   ├── pilonqubit.jpg           # Brand image
│   └── og.jpg                   # OpenGraph image
├── tests/                       # Playwright tests
├── middleware.ts                # Security headers
├── next-seo.config.ts          # SEO configuration
└── .env.local                  # Environment variables

```

## Prerequisites

- Node.js 18+ (recommend 20)
- npm, pnpm, or yarn

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   
   Edit `.env.local` and replace the placeholder values:
   
   ```env
   # Cloudflare Turnstile (for contact form verification)
   TURNSTILE_SECRET_KEY=your_secret_key
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key
   
   # Segment Analytics
   NEXT_PUBLIC_SEGMENT_WRITE_KEY=your_write_key
   SEGMENT_WRITE_KEY_SERVER=your_server_key
   
   # Resend Email API
   RESEND_API_KEY=your_resend_api_key
   CONTACT_TO_EMAIL=hello@pilonqubitventures.com
   CONTACT_FROM_EMAIL=website@pilonqubitventures.com
   
   # Optional: Sentry Error Tracking
   NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
   ```

## Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

Build the optimized production bundle:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Testing

### E2E Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install --with-deps

# Run E2E tests
npm run test:e2e
```

### Accessibility Tests

```bash
npm run test:accessibility
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The website can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render
- Self-hosted with Docker

## API Endpoints

- `POST /api/contact` - Contact form submission
- `POST /api/capi/meta` - Meta Conversion API
- `POST /api/capi/linkedin` - LinkedIn Conversion API
- `POST /api/capi/tiktok` - TikTok Conversion API

## Security Features

- Content Security Policy (CSP)
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- HTTPS enforcement
- Cloudflare Turnstile bot protection
- Cookie consent management

## Performance

The website is optimized for performance:
- Static page generation
- Image optimization with Next.js Image component
- Code splitting
- CSS optimization with Tailwind

Target Lighthouse scores: 100/100/100/100

## Customization

### Changing Colors

Edit `src/app/globals.css` to modify the color scheme:

```css
:root {
  --background: #0A0A2A;
  --foreground: #ffffff;
}
```

### Updating Content

Main content is in `src/app/page.tsx`. Edit the JSX to update:
- Hero section text
- Service descriptions
- About section
- Contact form

### Adding Pages

Create new routes by adding folders in `src/app/`:

```
src/app/
├── about/
│   └── page.tsx
└── services/
    └── page.tsx
```

## License

All rights reserved © 2025 PILON Qubit Ventures

## Support

For questions or issues, contact: hello@pilonqubitventures.com
