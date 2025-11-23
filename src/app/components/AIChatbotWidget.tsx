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

    const newHistory: ChatMessage[] = [
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
