'use client';

import { useState } from 'react';

export default function ChatbotButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white text-4xl hover:scale-110 transition-all animate-pulse"
      >
        AI
      </button>

      {open && (
        <div className="absolute bottom-24 right-0 w-96 h-96 bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Same chat code as before — just copy your current one inside */}
          {/* (I'll give you the full one if you want) */}
        </div>
      )}
    </div>
  );
}
