# PILON Qubit Ventures - Deployment Guide

## Quick Start: Deploy to Vercel (Recommended)

Vercel is the recommended platform for Next.js applications. It provides automatic deployments, global CDN, and zero-configuration setup.

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Create a Vercel Account**
   - Go to https://vercel.com/signup
   - Sign up with GitHub, GitLab, or Bitbucket

2. **Import Project**
   - Click "Add New Project"
   - Import from Git repository OR upload the project folder
   - Vercel will auto-detect Next.js configuration

3. **Configure Environment Variables**
   - Add the following environment variables in Vercel dashboard:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   RESEND_API_KEY=your_resend_api_key_here
   TURNSTILE_SECRET_KEY=your_cloudflare_turnstile_secret_here
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_cloudflare_turnstile_site_key_here
   NEXT_PUBLIC_SEGMENT_WRITE_KEY=your_segment_write_key_here (optional)
   SENTRY_DSN=your_sentry_dsn_here (optional)
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your site will be live at `https://your-project.vercel.app`

5. **Add Custom Domain**
   - Go to Project Settings → Domains
   - Add `pilonqubitventures.com` (or your domain)
   - Follow DNS configuration instructions

---

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd /path/to/pilon-qubit-website
   vercel --prod
   ```

4. **Follow prompts**
   - Set up and deploy: Yes
   - Which scope: Your account
   - Link to existing project: No
   - Project name: pilon-qubit-ventures
   - Directory: ./
   - Override settings: No

5. **Add Environment Variables**
   ```bash
   vercel env add OPENAI_API_KEY production
   vercel env add RESEND_API_KEY production
   vercel env add TURNSTILE_SECRET_KEY production
   vercel env add NEXT_PUBLIC_TURNSTILE_SITE_KEY production
   ```

6. **Redeploy with environment variables**
   ```bash
   vercel --prod
   ```

---

### Option 3: Deploy via GitHub + Vercel (Best for Teams)

1. **Push to GitHub**
   ```bash
   # Create a new repository on GitHub first
   git remote add origin https://github.com/your-username/pilon-qubit-ventures.git
   git branch -M main
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/new
   - Select "Import Git Repository"
   - Choose your GitHub repository
   - Configure environment variables
   - Deploy

3. **Automatic Deployments**
   - Every push to `main` branch will auto-deploy to production
   - Pull requests will create preview deployments

---

## Alternative Platforms

### Deploy to Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   cd /path/to/pilon-qubit-website
   netlify deploy --prod
   ```

4. **Configure**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Add environment variables in Netlify dashboard

### Deploy to AWS Amplify

1. **Install Amplify CLI**
   ```bash
   npm install -g @aws-amplify/cli
   ```

2. **Initialize**
   ```bash
   amplify init
   ```

3. **Add hosting**
   ```bash
   amplify add hosting
   ```

4. **Deploy**
   ```bash
   amplify publish
   ```

---

## Environment Variables Reference

### Required Variables

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `OPENAI_API_KEY` | OpenAI API key for chatbot | https://platform.openai.com/api-keys |
| `RESEND_API_KEY` | Resend API key for email | https://resend.com/api-keys |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret | https://dash.cloudflare.com/turnstile |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key | https://dash.cloudflare.com/turnstile |

### Optional Variables

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `NEXT_PUBLIC_SEGMENT_WRITE_KEY` | Segment analytics key | https://app.segment.com/settings/api-keys |
| `SENTRY_DSN` | Sentry error tracking | https://sentry.io/settings/projects |
| `META_CAPI_ACCESS_TOKEN` | Meta Conversion API | https://business.facebook.com/events_manager |
| `LINKEDIN_CAPI_ACCESS_TOKEN` | LinkedIn Conversion API | https://www.linkedin.com/developers |
| `TIKTOK_CAPI_ACCESS_TOKEN` | TikTok Conversion API | https://ads.tiktok.com/marketing_api |

---

## Post-Deployment Checklist

### 1. Verify Functionality
- [ ] Website loads correctly
- [ ] All pages accessible (Home, Services, About, Contact)
- [ ] AI Chatbot works
- [ ] Project Scope Generator works
- [ ] Contact form submits successfully
- [ ] Personalization selector works
- [ ] Mobile responsive design works

### 2. Configure DNS
- [ ] Add A record or CNAME for custom domain
- [ ] Configure SSL certificate (automatic with Vercel)
- [ ] Set up www redirect if needed

### 3. SEO Setup
- [ ] Submit sitemap to Google Search Console
- [ ] Verify robots.txt is accessible
- [ ] Check meta tags and Open Graph images
- [ ] Set up Google Analytics (via Segment)

### 4. Security
- [ ] Verify CSP headers are working
- [ ] Test Turnstile bot protection
- [ ] Check HTTPS is enforced
- [ ] Review environment variables are secure

### 5. Performance
- [ ] Run Lighthouse audit (aim for 90+ score)
- [ ] Test page load speed
- [ ] Verify images are optimized
- [ ] Check Core Web Vitals

### 6. Monitoring
- [ ] Set up Sentry for error tracking (optional)
- [ ] Configure uptime monitoring
- [ ] Set up analytics dashboard
- [ ] Create alerts for critical issues

---

## Troubleshooting

### Build Fails

**Error: "Module not found"**
- Solution: Run `npm install` to ensure all dependencies are installed

**Error: "Environment variable not found"**
- Solution: Add missing environment variables in deployment platform

**Error: "TypeScript errors"**
- Solution: Run `npm run build` locally to identify and fix errors

### Runtime Errors

**Chatbot not working**
- Check: `OPENAI_API_KEY` is set correctly
- Check: API key has sufficient credits
- Check: Browser console for errors

**Contact form not sending**
- Check: `RESEND_API_KEY` is set correctly
- Check: Email domain is verified in Resend
- Check: Turnstile keys are correct

**Personalization not working**
- Check: Browser localStorage is enabled
- Check: JavaScript is enabled
- Clear browser cache and try again

---

## Performance Optimization

### Enable Caching
Vercel automatically caches static assets. For API routes:

```javascript
// In API routes
export const config = {
  runtime: 'edge', // Use Edge Runtime for faster response
};
```

### Image Optimization
Images are automatically optimized by Next.js. Ensure you're using the `<Image>` component:

```jsx
import Image from 'next/image';

<Image src="/logo.png" alt="Logo" width={200} height={50} />
```

### Code Splitting
Next.js automatically code-splits. For dynamic imports:

```javascript
const Component = dynamic(() => import('./Component'), {
  loading: () => <p>Loading...</p>,
});
```

---

## Scaling Considerations

### Traffic Spikes
- Vercel Pro plan supports unlimited bandwidth
- Consider upgrading if expecting >100k monthly visitors
- Enable ISR (Incremental Static Regeneration) for dynamic content

### Database (Future)
- If adding database, consider Vercel Postgres or Supabase
- Use connection pooling for better performance
- Implement caching layer (Redis) for frequently accessed data

### API Rate Limits
- OpenAI: Monitor usage and set limits
- Resend: Free tier allows 100 emails/day
- Implement rate limiting on API routes

---

## Maintenance

### Regular Updates
```bash
# Update dependencies monthly
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Monitoring
- Review Vercel Analytics weekly
- Check error logs in Sentry
- Monitor API usage and costs
- Review user feedback from contact form

### Backups
- Code is backed up in Git repository
- Environment variables should be documented securely
- Export analytics data monthly

---

## Support

### Documentation
- Next.js: https://nextjs.org/docs
- Vercel: https://vercel.com/docs
- Tailwind CSS: https://tailwindcss.com/docs

### Community
- Next.js Discord: https://nextjs.org/discord
- Vercel Community: https://github.com/vercel/vercel/discussions

### Professional Support
- Vercel Pro: Includes email support
- Enterprise: Dedicated support team

---

## Cost Estimate

### Vercel Hobby (Free)
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Global CDN
- ❌ No custom domains on free tier (use vercel.app subdomain)

### Vercel Pro ($20/month)
- ✅ Everything in Hobby
- ✅ Custom domains
- ✅ Unlimited bandwidth
- ✅ Advanced analytics
- ✅ Email support

### Additional Costs
- **OpenAI API**: ~$10-50/month (depends on chatbot usage)
- **Resend**: Free up to 100 emails/day, then $10/month for 10k emails
- **Cloudflare Turnstile**: Free
- **Segment**: Free up to 1k MTU, then $120/month
- **Domain**: ~$12/year (if not already owned)

**Total Estimated Cost:** $30-80/month for production deployment

---

## Next Steps

1. **Choose deployment platform** (Vercel recommended)
2. **Obtain API keys** for required services
3. **Deploy using one of the methods above**
4. **Configure custom domain**
5. **Test all features thoroughly**
6. **Launch and monitor**

**Need help?** Contact the development team or refer to the documentation links above.
