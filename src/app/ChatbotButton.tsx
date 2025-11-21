'use client';

import { useState, useEffect, useRef } from 'react';

export default function ChatbotButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hey! I'm the PILON Qubit AI assistant 👋\n\nWe help companies build and scale real AI solutions — from marketing automation to frontier-grade models.\n\nWhat are you working on right now?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [userName, setUserName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [messages, input]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setInput('');

    setTimeout(() => {
      let reply = '';

      if (!userName) {
        const name = userMsg.split(' ')[0] || 'there';
        setUserName(name);
        reply = `Nice to meet you, ${name}! Which area are you most interested in — AI-powered marketing automation, custom AI development, or modern web applications?`;
      } else if (messages.length <= 3) {
        reply = `Got it, ${userName}! To get you the perfect next step, what’s the best email or phone number to reach you?`;
      } else {
        reply = `Perfect, ${userName}! Someone from our team will reach out within the hour. Anything else I can help with today?`;
      }

      setMessages(prev => [...prev, { text: reply, sender: 'bot' }]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button onClick={() => setOpen(!open)} className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white text-3xl hover:scale-110 transition-all">
        AI
      </button>

      {open && (
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-white rounded-2xl shadow-2xl flex flex-col">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 text-white flex justify-between items-center">
            <div>
              <div className="font-bold">PILON Qubit AI Assistant</div>
              <div className="text-xs opacity-90">Usually replies instantly</div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white hover:opacity-70">X</button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  {msg.text.split('\n').map((line, j) => <p key={j}>{line}</p>)}
                </div>
              </div>
            ))}
            {input && (
              <div className="flex justify-end">
                <div className="max-w-xs px-4 py-3 rounded-2xl bg-blue-600 text-white opacity-70">{input}</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-cyan-500 text-gray-800"
              />
              <button onClick={handleSend} className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full hover:from-cyan-400 hover:to-blue-500 transition-all">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
