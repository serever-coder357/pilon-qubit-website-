# Client Website Deployment Checklist

## Phase 1: Pre-Development Setup

### Client Information Gathering
- [ ] Collect business name, logo, and branding assets
- [ ] Gather business address, phone number, email
- [ ] Obtain business hours and service areas
- [ ] Collect social media profiles (Facebook, LinkedIn, Instagram, etc.)
- [ ] Get content (About, Services, Team bios, etc.)
- [ ] Identify target keywords and SEO goals
- [ ] Define website goals and success metrics

### Domain & Hosting
- [ ] Purchase or transfer domain name
- [ ] Set up Vercel account (or hosting platform)
- [ ] Configure DNS settings
- [ ] Set up SSL certificate (auto with Vercel)
- [ ] Configure custom domain in Vercel project settings

---

## Phase 2: Development

### Website Build
- [ ] Create project repository
- [ ] Set up development environment
- [ ] Implement responsive design (mobile, tablet, desktop)
- [ ] Build all pages (Home, About, Services, Contact, etc.)
- [ ] Add contact forms with email integration
- [ ] Implement AI chat widget (if applicable)
- [ ] Add analytics tracking code
- [ ] Optimize images for web performance
- [ ] Test cross-browser compatibility (Chrome, Firefox, Safari, Edge)

### SEO Foundation
- [ ] Add meta titles and descriptions to all pages
- [ ] Implement proper heading hierarchy (H1, H2, H3)
- [ ] Add alt text to all images
- [ ] Create XML sitemap
- [ ] Add robots.txt file
- [ ] Implement schema markup (LocalBusiness, Organization, etc.)
- [ ] Set up 301 redirects (if migrating from old site)
- [ ] Optimize page load speed (Core Web Vitals)

---

## Phase 3: Pre-Launch Testing

### Quality Assurance
- [ ] Test all links (internal and external)
- [ ] Verify contact forms send emails correctly
- [ ] Test mobile responsiveness on real devices
- [ ] Check page load speed (Google PageSpeed Insights)
- [ ] Verify all images load correctly
- [ ] Test browser compatibility
- [ ] Proofread all content for typos and errors
- [ ] Test checkout/payment flows (if e-commerce)

### Security & Performance
- [ ] Enable HTTPS (SSL certificate)
- [ ] Set up security headers
- [ ] Configure caching headers
- [ ] Minify CSS and JavaScript
- [ ] Compress images
- [ ] Test website in incognito/private mode

---

## Phase 4: Deployment

### Go Live
- [ ] Deploy to production (Vercel/hosting platform)
- [ ] Verify custom domain is working
- [ ] Test all functionality on live site
- [ ] Set up automated backups
- [ ] Configure error monitoring (Sentry, etc.)

---

## Phase 5: Google Business Profile Setup

### Create/Claim Google Business Profile
- [ ] Go to https://business.google.com
- [ ] Create new business profile or claim existing
- [ ] Enter accurate business name
- [ ] Select correct business category
- [ ] Add complete business address
- [ ] Set service area (if applicable)
- [ ] Add phone number and website URL
- [ ] Set business hours (including holidays)

### Complete Business Profile
- [ ] Upload high-quality business photos (exterior, interior, products/services)
- [ ] Add logo and cover photo
- [ ] Write compelling business description (750 characters max)
- [ ] Add services with descriptions and pricing (if applicable)
- [ ] Add products (if applicable)
- [ ] Enable messaging (if desired)
- [ ] Add attributes (wheelchair accessible, Wi-Fi, etc.)

### Verify Google Business Profile
- [ ] Choose verification method (postcard, phone, email, or instant)
- [ ] Complete verification process
- [ ] Wait for verification approval (1-14 days for postcard)
- [ ] Confirm business is verified in Google Business Profile dashboard

---

## Phase 6: Google Search Console Setup

### Add Property to Search Console
- [ ] Go to https://search.google.com/search-console
- [ ] Click "Add Property"
- [ ] Choose "URL prefix" property type
- [ ] Enter website URL (e.g., https://pilonqubitventures.com)

### Verify Ownership (HTML File Upload Method)
- [ ] Download verification file from Search Console (e.g., `googlea8b20078c4d12477.html`)
- [ ] Upload file to website's public/root directory
- [ ] Deploy to production
- [ ] Test file is accessible: `https://yourdomain.com/googlea8b20078c4d12477.html`
- [ ] Verify file loads WITHOUT requiring login (test in incognito mode)
- [ ] Click "Verify" button in Search Console
- [ ] Confirm verification success

### Alternative Verification Methods (if HTML file fails)
- [ ] **HTML tag method**: Add meta tag to `<head>` section
- [ ] **Google Analytics method**: Use existing GA tracking code
- [ ] **Google Tag Manager method**: Use existing GTM container
- [ ] **DNS record method**: Add TXT record to domain DNS settings

### Submit Sitemap
- [ ] Generate XML sitemap (e.g., `sitemap.xml`)
- [ ] Upload sitemap to website root directory
- [ ] In Search Console, go to "Sitemaps" section
- [ ] Submit sitemap URL (e.g., `https://yourdomain.com/sitemap.xml`)
- [ ] Verify sitemap is successfully processed

---

## Phase 7: Google Analytics Setup

### Create Google Analytics Property
- [ ] Go to https://analytics.google.com
- [ ] Create new GA4 property
- [ ] Add property name and timezone
- [ ] Configure data collection settings

### Install Tracking Code
- [ ] Copy GA4 measurement ID (e.g., `G-XXXXXXXXXX`)
- [ ] Add tracking code to all website pages
- [ ] Test tracking with Google Tag Assistant
- [ ] Verify real-time data is being collected
- [ ] Set up conversion goals/events

### Link Analytics to Search Console
- [ ] In Google Analytics, go to Admin
- [ ] Under Property settings, click "Search Console links"
- [ ] Click "Link" and select Search Console property
- [ ] Confirm linking

---

## Phase 8: Additional Google Services

### Google Tag Manager (Optional but Recommended)
- [ ] Create GTM account at https://tagmanager.google.com
- [ ] Install GTM container code on website
- [ ] Migrate tracking codes to GTM (GA, Facebook Pixel, etc.)
- [ ] Test all tags are firing correctly

### Google My Maps (For Service Areas)
- [ ] Create custom map showing service areas
- [ ] Embed map on website (if applicable)

### Google Reviews Widget
- [ ] Set up Google Reviews display on website
- [ ] Add "Leave a Review" CTA buttons
- [ ] Link to Google Business Profile review page

---

## Phase 9: Social Media & Local SEO

### Social Media Setup
- [ ] Create/update Facebook Business Page
- [ ] Create/update LinkedIn Company Page
- [ ] Create/update Instagram Business Account
- [ ] Add website link to all social profiles
- [ ] Ensure NAP (Name, Address, Phone) consistency across all platforms

### Local Citations & Directories
- [ ] Submit to Yelp
- [ ] Submit to Yellow Pages
- [ ] Submit to Bing Places
- [ ] Submit to industry-specific directories
- [ ] Ensure NAP consistency across all listings

### Schema Markup Validation
- [ ] Test schema markup with Google Rich Results Test
- [ ] Verify LocalBusiness schema is valid
- [ ] Add Organization schema
- [ ] Add BreadcrumbList schema (if applicable)

---

## Phase 10: Post-Launch Monitoring

### Week 1 Monitoring
- [ ] Monitor Google Analytics for traffic
- [ ] Check Search Console for indexing issues
- [ ] Monitor website uptime
- [ ] Check for 404 errors
- [ ] Verify all forms are working
- [ ] Monitor page load speed

### Ongoing Maintenance (Monthly)
- [ ] Review Google Analytics reports
- [ ] Check Search Console performance
- [ ] Monitor Google Business Profile insights
- [ ] Respond to Google reviews
- [ ] Update content regularly
- [ ] Check for broken links
- [ ] Update plugins/dependencies
- [ ] Review and optimize Core Web Vitals
- [ ] Monitor keyword rankings
- [ ] Analyze competitor websites

---

## Phase 11: Client Handoff

### Documentation
- [ ] Provide login credentials (hosting, domain, analytics, etc.)
- [ ] Create website maintenance guide
- [ ] Document how to update content
- [ ] Provide SEO best practices guide
- [ ] Share analytics dashboard access

### Training
- [ ] Train client on Google Business Profile management
- [ ] Show how to respond to reviews
- [ ] Demonstrate how to update website content
- [ ] Explain how to read analytics reports
- [ ] Provide ongoing support contact information

---

## Critical Success Metrics

### Technical Performance
- [ ] Page load speed < 3 seconds
- [ ] Mobile-friendly (Google Mobile-Friendly Test)
- [ ] Core Web Vitals passing (LCP, FID, CLS)
- [ ] 100% HTTPS coverage
- [ ] No broken links or 404 errors

### SEO Performance
- [ ] Website indexed in Google (site:yourdomain.com)
- [ ] All pages indexed in Search Console
- [ ] Sitemap successfully processed
- [ ] Google Business Profile verified and published
- [ ] Schema markup validated

### Business Goals
- [ ] Contact form submissions tracked
- [ ] Phone call tracking enabled (if applicable)
- [ ] Conversion goals set up in Analytics
- [ ] Google Business Profile getting impressions
- [ ] Website appearing in local search results

---

## Emergency Contacts & Resources

### Important Links
- **Google Search Console**: https://search.google.com/search-console
- **Google Business Profile**: https://business.google.com
- **Google Analytics**: https://analytics.google.com
- **Google PageSpeed Insights**: https://pagespeed.web.dev
- **Google Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly
- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Vercel Dashboard**: https://vercel.com/dashboard

### Support Resources
- Vercel Support: https://vercel.com/support
- Google Business Profile Help: https://support.google.com/business
- Google Search Console Help: https://support.google.com/webmasters

---

## Notes

- **Timeline**: Typical deployment takes 2-4 weeks from start to full verification
- **Google Business verification**: Can take 1-14 days depending on method
- **Search Console indexing**: Can take 1-7 days for initial indexing
- **Local SEO results**: Can take 30-90 days to see significant ranking improvements

**Last Updated**: November 17, 2025
