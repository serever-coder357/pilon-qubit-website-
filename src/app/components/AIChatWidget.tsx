'use client';

import { useEffect, useState } from 'react';

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        setIsOpen(false);
        setStatus('idle');
        setName('');
        setContact('');
        setMessage('');
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) {
      setError('Please fill in your name, email, and question.');
      return;
    }

    setStatus('sending');
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: contact.trim(),
          company: '',
          message: `[AI Chat Lead] ${message.trim()}`,
          turnstileToken: undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        setStatus('error');
        setError(data.error || 'We could not send your message. Please try again.');
        return;
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-2xl text-white flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="Open AI chat lead widget"
        >
          <span className="text-2xl">💬</span>
        </button>
      )}

      {isOpen && (
        <div className="w-80 sm:w-96 bg-[#05071f]/95 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">AI Lead Capture</p>
              <p className="text-cyan-100/80 text-xs">Quickly share your question and contact</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-cyan-100"
              aria-label="Close AI lead widget"
            >
              ✕
            </button>
          </div>

          <div className="p-4 space-y-3 bg-[#0A0A2A]">
            {status === 'success' ? (
              <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-100 rounded-xl p-3 text-sm">
                Thanks! Your note is on its way. We&apos;ll reach out shortly.
              </div>
            ) : (
              <form className="space-y-3" onSubmit={handleSubmit}>
                <div className="space-y-1">
                  <label className="text-xs text-cyan-100/80" htmlFor="ai-name">
                    Name
                  </label>
                  <input
                    id="ai-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm text-white"
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-cyan-100/80" htmlFor="ai-contact">
                    Email
                  </label>
                  <input
                    id="ai-contact"
                    type="email"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm text-white"
                    placeholder="name@email.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-cyan-100/80" htmlFor="ai-message">
                    How can we help?
                  </label>
                  <textarea
                    id="ai-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm text-white min-h-[96px]"
                    placeholder="Briefly describe your AI project or automation need"
                  />
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-100 rounded-lg p-2 text-xs">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-white font-semibold disabled:opacity-70"
                >
                  {status === 'sending' ? 'Sending…' : 'Send to our team'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
