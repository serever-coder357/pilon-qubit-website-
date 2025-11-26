'use client';

import { useState } from 'react';
import AIChatWidget from './components/AIChatWidget';

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

      {isOpen && <AIChatWidget isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
}
