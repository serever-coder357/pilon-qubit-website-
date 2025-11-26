#!/usr/bin/env bash
set -euo pipefail

echo "===== PQV cleanup: dashboard + legacy AI chat ====="

# 1) Audit for "dashboard" anywhere in the repo
echo
echo ">>> Searching for 'dashboard' references..."
if command -v rg >/dev/null 2>&1; then
  rg "dashboard" -n || echo "No 'dashboard' references found by ripgrep."
else
  grep -RIn "dashboard" . || echo "No 'dashboard' references found by grep."
fi

# 2) Audit for legacy AI chat components / routes / text
echo
echo ">>> Searching for legacy AI chat references..."
PATTERN='AIChatbot|AIChatWidget|ChatbotButton|AI Chatbot|AI chatbot|/api/ai/chat|/api/ai-chat'
if command -v rg >/dev/null 2>&1; then
  rg "${PATTERN}" -n || echo "No legacy AI chat references found by ripgrep."
else
  grep -RInE "${PATTERN}" . || echo "No legacy AI chat references found by grep."
fi

# 3) Remove known legacy / unused AI chat files if present
echo
echo ">>> Removing known legacy AI chat files (if they exist)..."

LEGACY_FILES=(
  "src/app/ChatbotButton.tsx"
  "src/app/components/AIChatWidget.tsx"
  "src/app/components/AIChatbot.tsx"
  "src/app/components/AIChatbotWidget.tsx"
  "src/app/api/ai-chat/route.ts"
  "src/app/api/ai/chat/route.ts"
  "src/pages/api/chat.ts"
  "src/pages/api/contact.ts"
)

for f in "${LEGACY_FILES[@]}"; do
  if [ -f "$f" ]; then
    echo "  - Removing $f"
    rm "$f"
  else
    echo "  - Skipping $f (not found)"
  fi
done

# 4) Stage deletions and commit
echo
echo ">>> Staging deletions..."
git add -u || true

echo
echo ">>> Creating cleanup commit (if there are changes)..."
git commit -m "Cleanup legacy dashboard + AI chat artifacts" || echo "No changes to commit."

echo
echo "===== Cleanup complete ====="
echo "Review the 'dashboard' / legacy AI matches printed above."
echo "If any dashboard-related files or old chat code remain that you don’t want, delete them manually and commit."
