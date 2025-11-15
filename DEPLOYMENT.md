# PILON Qubit Website - Deployment Guide

## 🚀 Quick Start

**Project Directory:** `/home/ubuntu/pilon-qubit-website-`  
**Dev Server:** Port 3002  
**Production:** https://pilonqubitventures.com  
**Hosting:** Vercel (auto-deploys from GitHub)

---

## 📋 Standard Deployment Workflow

### 1. Make Changes

```bash
cd /home/ubuntu/pilon-qubit-website-
# Edit files as needed
```

### 2. Test Locally

```bash
# Start dev server (if not running)
npm run dev

# Visit: https://3002-ibvkptqgiaioidqfdtz1i-2253fba3.manusvm.computer/
# Test all changes thoroughly
```

### 3. Run Pre-Push Verification

```bash
./scripts/verify-before-push.sh
```

This script checks:
- ✅ Correct directory
- ✅ Dev server running
- ✅ Git status
- ✅ Current branch
- ✅ Manual checklist

### 4. Commit & Push

```bash
git add .
git commit -m "Descriptive commit message"
git pull origin main  # Always pull first!
git push origin main
```

### 5. Monitor Deployment

1. Check Vercel dashboard: https://vercel.com/dashboard
2. Wait 2-3 minutes for build
3. Check deployment logs for errors

### 6. Verify Production

```bash
# Visit production site
open https://pilonqubitventures.com

# Hard refresh to clear cache
# Chrome/Edge: Ctrl+Shift+R
# Safari: Cmd+Shift+R
```

---

## 🔧 Useful Commands

```bash
# Check what's running
ps aux | grep "next dev"
lsof -i :3002

# View git history
git log --oneline -10
git log --graph --oneline --all

# Undo last commit (not pushed)
git reset --soft HEAD~1

# Discard all local changes
git fetch origin
git reset --hard origin/main

# Check remote URL
git remote -v

# Pull latest from production
git pull origin main
```

---

## 🚨 Emergency Rollback

If production is broken:

```bash
# 1. Find last working commit
git log --oneline

# 2. Revert to that commit
git revert <commit-hash>
git push origin main

# OR force reset (dangerous!)
git reset --hard <commit-hash>
git push origin main --force
```

Vercel will auto-deploy the rollback.

---

## 📁 Project Structure

```
pilon-qubit-website-/
├── src/
│   ├── app/
│   │   ├── components/     # Reusable components
│   │   ├── services/       # Services page
│   │   ├── layout.tsx      # Root layout (widgets here)
│   │   └── page.tsx        # Homepage
│   └── ...
├── public/                 # Static assets
├── scripts/
│   └── verify-before-push.sh
├── .deployment-checklist.md
├── DEPLOYMENT.md          # This file
├── vercel.json            # Vercel config
└── package.json
```

---

## 🔐 Environment Variables

Managed in Vercel dashboard:
- `NEXT_PUBLIC_SITE_URL`
- Any API keys (if added later)

---

## 🐛 Troubleshooting

### Dev server won't start
```bash
# Kill existing process
pkill -f "next dev"
# Restart
npm run dev
```

### Build fails on Vercel
1. Check Vercel deployment logs
2. Test build locally: `npm run build`
3. Check for TypeScript errors
4. Verify all dependencies in package.json

### Changes not showing on production
1. Hard refresh browser (Ctrl+Shift+R)
2. Check Vercel deployment status
3. Verify commit was pushed: `git log origin/main`
4. Check Vercel build logs for errors

### Wrong directory error
```bash
# You should always be in:
cd /home/ubuntu/pilon-qubit-website-

# NOT in:
# /home/ubuntu/pilon-qubit-website (this was deleted)
```

---

## 📞 Support

- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Repo:** https://github.com/serever-coder357/pilon-qubit-website-
- **Dev Server:** https://3002-ibvkptqgiaioidqfdtz1i-2253fba3.manusvm.computer/

---

## 📝 Deployment Log

Keep track of major deployments:

| Date | Changes | Deployed By | Status |
|------|---------|-------------|--------|
| 2024-11-15 | Services page update, widgets added | Manus AI | ✅ Success |

