'use client';

import { useState } from 'react';

export default function ChatbotButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white text-2xl hover:scale-110 transition-all"
      >
        💬
      </button>

      {open && (
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-white rounded-xl shadow-2xl p-4 z-50 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">AI Assistant</h3>
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          <div className="h-full bg-gray-50 rounded-lg p-4 overflow-y-auto">
            <p className="text-sm text-gray-700 mb-4">
              Hello! How can I help you with AI consulting today?
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 p-3 border border-gray-300 rounded-lg text-gray-800"
              />
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
