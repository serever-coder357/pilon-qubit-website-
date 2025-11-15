#!/bin/bash

# Pre-push verification script for PILON Qubit Website
# Run this before pushing to production

set -e

echo "🔍 Pre-Push Verification Script"
echo "================================"
echo ""

# Check we're in the correct directory
CURRENT_DIR=$(pwd)
EXPECTED_DIR="/home/ubuntu/pilon-qubit-website-"

if [ "$CURRENT_DIR" != "$EXPECTED_DIR" ]; then
    echo "❌ ERROR: Wrong directory!"
    echo "   Current:  $CURRENT_DIR"
    echo "   Expected: $EXPECTED_DIR"
    echo ""
    echo "   Run: cd $EXPECTED_DIR"
    exit 1
fi

echo "✅ Correct directory: $CURRENT_DIR"
echo ""

# Check if dev server is running
DEV_SERVER_PORT=3002
if lsof -Pi :$DEV_SERVER_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "✅ Dev server is running on port $DEV_SERVER_PORT"
    echo "   URL: https://3002-ibvkptqgiaioidqfdtz1i-2253fba3.manusvm.computer/"
else
    echo "⚠️  WARNING: Dev server is NOT running"
    echo "   Start with: npm run dev"
fi
echo ""

# Check for uncommitted changes
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    echo "📝 Uncommitted changes found:"
    git status --short
    echo ""
    read -p "Do you want to see the diff? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git diff
    fi
else
    echo "✅ No uncommitted changes"
fi
echo ""

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  WARNING: Not on main branch (current: $CURRENT_BRANCH)"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ On main branch"
fi
echo ""

# Check for unpushed commits
UNPUSHED=$(git log origin/main..HEAD --oneline 2>/dev/null | wc -l)
if [ "$UNPUSHED" -gt 0 ]; then
    echo "📤 $UNPUSHED unpushed commit(s):"
    git log origin/main..HEAD --oneline
else
    echo "✅ No unpushed commits"
fi
echo ""

# Verification checklist
echo "================================"
echo "🎯 MANUAL VERIFICATION CHECKLIST"
echo "================================"
echo ""
echo "Before pushing, have you:"
echo ""
echo "  [ ] Tested changes on dev server?"
echo "  [ ] Checked all modified pages?"
echo "  [ ] Tested interactive elements (buttons, forms, widgets)?"
echo "  [ ] Verified mobile responsiveness?"
echo "  [ ] Reviewed all file changes with 'git diff'?"
echo ""
read -p "All checks passed? (y/N): " -n 1 -r
echo
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Verification cancelled. Fix issues and run again."
    exit 1
fi

echo "✅ Pre-push verification complete!"
echo ""
echo "Next steps:"
echo "  1. git pull origin main"
echo "  2. git push origin main"
echo "  3. Monitor Vercel deployment"
echo "  4. Verify production site after deployment"
echo ""
