#!/bin/bash

### ============================================================
###  PILON QUBIT — Unified AI Assistant Update
###  This script:
###   1. Replaces ChatbotButton.tsx
###   2. Replaces AIChatbotWidget.tsx
###   3. Replaces /api/chat/route.ts
###   4. Confirms OpenAI API variable exists
###   5. Commits & pushes automatically
### ============================================================

echo "=== Updating PILON Qubit AI Assistant ==="


### ------------------------------------------------------------
### 1. Update ChatbotButton.tsx
### ------------------------------------------------------------
cat > src/app/ChatbotButton.tsx << 'EOF2'
'use client';

import { useState } from 'react';
import AIChatbotWidget from './components/AIChatbotWidget';

export default function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="Open AI assistant"
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      )}

      {isOpen && <AIChatbotWidget onClose={() => setIsOpen(false)} />}
    </>
  );
}
EOF2

echo "✔ ChatbotButton.tsx updated"


### ------------------------------------------------------------
### 2. Update AIChatbotWidget.tsx
### ------------------------------------------------------------
cat > src/app/components/AIChatbotWidget.tsx << 'EOF2'
'use client';

import { useState } from 'react';

type Role = 'user' | 'assistant';

interface ChatMessage {
  role: Role;
  content: string;
}

interface Props {
  onClose: () => void;
}

export default function AIChatbotWidget({ onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm your AI assistant at PILON Qubit Ventures. I can help with AI strategy, automation, or scoping a project. What are you working on?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const newHistory = [
      ...messages,
      { role: 'user', content: trimmed },
    ];

    setMessages(newHistory);
    setInput('');
    setIsSending(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory }),
      });

      if (!res.ok) throw new Error('API connection failed');
      const data = await res.json();

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setError(
        "I'm having trouble connecting to the AI service. Share your name/company/email and I'll forward it to the team."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md">
      <div className="bg-[#05071f]/95 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">

        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 flex items-center justify-between">
          <h3 className="text-white font-semibold">AI Assistant</h3>
          <button onClick={onClose} className="text-white hover:text-cyan-100">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0A0A2A]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                m.role === 'assistant'
                  ? 'bg-cyan-500/10 border border-cyan-500/40 text-cyan-50'
                  : 'bg-cyan-500 text-white ml-auto'
              }`}
            >
              {m.content}
            </div>
          ))}

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 p-2 rounded-xl text-xs text-red-200">
              {error}
            </div>
          )}

          {isSending && (
            <div className="text-xs text-cyan-100/60">Thinking…</div>
          )}
        </div>

        <form onSubmit={sendMessage} className="p-3 border-t border-cyan-500/30 bg-[#05071f] flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about AI, automation, pricing, or scoping."
            className="flex-1 bg-cyan-500/10 border border-cyan-500/30 rounded-xl px-3 py-2 text-sm text-white"
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
EOF2

echo "✔ AIChatbotWidget.tsx updated"


### ------------------------------------------------------------
### 3. Update /api/chat/route.ts
### ------------------------------------------------------------
cat > src/app/api/chat/route.ts << 'EOF2'
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are the AI assistant for PILON Qubit Ventures.

- Friendly, helpful, clear.
- Identify user type (founder, enterprise, technical).
- Ask clarifying questions.
- Move toward soft lead capture: name, company, email.
- Give practical, specific AI suggestions.
- Never invent facts or clients.
`;

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'AI not configured. Email hello@pilonqubitventures.com.' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const messages = body.messages;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.6,
    });

    const reply = completion.choices[0]?.message?.content ?? "I'm here to help!";
    return NextResponse.json({ reply });
  } catch (err) {
    return NextResponse.json(
      { error: 'AI connection failed.' },
      { status: 500 }
    );
  }
}
EOF2

echo "✔ API route updated"


### ------------------------------------------------------------
### 4. Commit and Push
### ------------------------------------------------------------

git add .
git commit -m "Unified AI assistant upgrade (GPT-4o, lead gen, single widget)"
git push

echo "=== All done. Visit Vercel to redeploy if needed. ==="
