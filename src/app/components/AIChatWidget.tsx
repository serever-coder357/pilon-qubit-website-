'use client';

import { useState } from 'react';

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !contact.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const pageUrl =
        typeof window !== 'undefined' ? window.location.href : undefined;
      const userAgent =
        typeof navigator !== 'undefined' ? navigator.userAgent : undefined;

      const payload = {
        name,
        email: contact,
        company: '',
        message:
          `[AI Chat Lead]\n` +
          `Name: ${name}\n` +
          `Contact: ${contact}\n\n` +
          (message?.trim() || 'No additional message provided.'),
        turnstileToken: undefined,
        pageUrl,
        userAgent,
        source: 'ai-chat-widget',
        createdAt: new Date().toISOString(),
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setError(data.error || 'Failed to send. Please try again or email us.');
        return;
      }

      setSubmitted(true);

      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setName('');
        setContact('');
        setMessage('');
      }, 2500);
    } catch (err) {
      console.error('AIChatWidget submit error:', err);
      setError(
        'Network error. Please email us at hello@pilonqubitventures.com.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="Open AI assistant"
        >
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      )}

      {/* Widget window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 bg-[#0A0A2A] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-cyan-600 font-bold text-lg">PQ</span>
              </div>
              <div>
                <h3 className="text-white font-semibold">AI Assistant</h3>
                <p className="text-cyan-100 text-xs">
                  Ask anything about our services — we&apos;ll follow up by
                  email.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-cyan-100 transition-colors"
              aria-label="Close AI assistant"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  Message sent!
                </h3>
                <p className="text-cyan-100/70">
                  We&apos;ll review your question and reply to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-cyan-100 text-sm font-medium mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-cyan-100/50 focus:outline-none focus:border-cyan-400"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-cyan-100 text-sm font-medium mb-2">
                    Work email or phone *
                  </label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                    className="w-full bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-cyan-100/50 focus:outline-none focus:border-cyan-400"
                    placeholder="you@company.com or (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-cyan-100 text-sm font-medium mb-2">
                    What can we help you with?
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="w-full bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-cyan-100/50 focus:outline-none focus:border-cyan-400 resize-none"
                    placeholder="Tell us about your project, timeline, or questions."
                  />
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim() || !contact.trim()}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending…' : 'Send to the team'}
                </button>

                <p className="text-cyan-100/50 text-xs text-center">
                  Or email us at{' '}
                  <a
                    href="mailto:hello@pilonqubitventures.com"
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    hello@pilonqubitventures.com
                  </a>
                  .
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
