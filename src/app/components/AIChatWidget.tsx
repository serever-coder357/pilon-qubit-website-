'use client';

import { useState } from 'react';

type Role = 'user' | 'assistant';

type ChatMessage = {
  id: string;
  role: Role;
  content: string;
};

type LeadPayload = {
  name: string;
  email: string;
  context?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const initialAssistantMessage: ChatMessage = {
  id: 'assistant-welcome',
  role: 'assistant',
  content:
    'Hi, I’m the AI assistant at PILON Qubit Ventures. What are you trying to accomplish with AI right now?',
};

const leadKeywords = [
  'pricing',
  'quote',
  'proposal',
  'hire you',
  'work with you',
  'implementation',
  'build this',
  'start project',
  'timeline',
  'cost',
  'budget',
];

const makeId = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export default function AIChatWidget({ isOpen, onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([initialAssistantMessage]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [leadRequested, setLeadRequested] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  if (!isOpen) return null;

  const buildApiPayload = (lead?: LeadPayload) => ({
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    lead,
  });

  const maybeAddLeadPrompt = (
    history: ChatMessage[],
    latestUserContent: string,
  ): ChatMessage[] => {
    if (leadCaptured || leadRequested) return history;

    const userCount = history.filter((m) => m.role === 'user').length;
    const hasIntent = leadKeywords.some((keyword) =>
      latestUserContent.toLowerCase().includes(keyword),
    );

    if (userCount >= 2 || hasIntent) {
      setLeadRequested(true);
      return [
        ...history,
        {
          id: makeId(),
          role: 'assistant',
          content:
            'This sounds like something our team can help with. What’s your name and email so we can follow up with a tailored proposal?',
        },
      ];
    }

    return history;
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = { id: makeId(), role: 'user', content: trimmed };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput('');
    setIsSending(true);
    setError('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages.map(({ role, content }) => ({ role, content })) }),
      });

      const data = await response.json();
      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || 'AI service unavailable');
      }

      const assistantMessage: ChatMessage = {
        id: makeId(),
        role: 'assistant',
        content: data.reply,
      };

      const withAssistant = [...nextMessages, assistantMessage];
      const finalMessages = maybeAddLeadPrompt(withAssistant, trimmed);
      setMessages(finalMessages);
    } catch (err) {
      console.error('AIChatWidget sendMessage error:', err);
      setError('Sorry, I could not reach the AI service. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = leadName.trim();
    const trimmedEmail = leadEmail.trim();
    if (!trimmedName || !trimmedEmail) return;

    const recentUserContext = messages
      .filter((m) => m.role === 'user')
      .slice(-3)
      .map((m) => m.content)
      .join(' | ');

    setIsSubmittingLead(true);
    setError('');

    try {
      const payload = buildApiPayload({
        name: trimmedName,
        email: trimmedEmail,
        context: recentUserContext,
      });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || 'Failed to submit lead');
      }

      const confirmation: ChatMessage = {
        id: makeId(),
        role: 'assistant',
        content: `Perfect, thanks! Our team will reach out at ${trimmedEmail} shortly. Anything else I can help you with now?`,
      };

      setMessages((prev) => [...prev, confirmation]);
      setLeadCaptured(true);
      setLeadRequested(false);
    } catch (err) {
      console.error('AIChatWidget lead submission error:', err);
      setError('We had trouble capturing your contact. Please try again.');
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const renderMessage = (message: ChatMessage) => (
    <div
      key={message.id}
      className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
        message.role === 'assistant'
          ? 'bg-cyan-500/10 border border-cyan-500/40 text-cyan-50'
          : 'bg-cyan-500 text-white ml-auto'
      }`}
    >
      {message.content}
    </div>
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md">
      <div className="bg-[#05071f]/95 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold">AI Assistant</h3>
            <p className="text-cyan-100/80 text-xs">Powered by OpenAI + PILON Qubit</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-cyan-100" aria-label="Close AI assistant">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0A0A2A]">
          {messages.map(renderMessage)}

          {leadRequested && !leadCaptured && (
            <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-xl p-3 text-sm text-white space-y-3">
              <p className="text-cyan-100">
                This sounds promising. Please share your name and email so we can follow up with next steps.
              </p>
              <form onSubmit={handleLeadSubmit} className="space-y-2">
                <input
                  type="text"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-3 py-2 text-white placeholder-cyan-100/50 focus:outline-none focus:border-cyan-400"
                />
                <input
                  type="email"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-3 py-2 text-white placeholder-cyan-100/50 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={isSubmittingLead || !leadName.trim() || !leadEmail.trim()}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-2 rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingLead ? 'Sending…' : 'Share contact details'}
                </button>
              </form>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 p-2 rounded-xl text-xs text-red-200">{error}</div>
          )}

          {isSending && <div className="text-xs text-cyan-100/60">Thinking…</div>}
        </div>

        <form onSubmit={sendMessage} className="p-3 border-t border-cyan-500/30 bg-[#05071f] flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about AI strategy, automation, or projects"
            className="flex-1 bg-cyan-500/10 border border-cyan-500/30 rounded-xl px-3 py-2 text-sm text-white"
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white disabled:opacity-60"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
