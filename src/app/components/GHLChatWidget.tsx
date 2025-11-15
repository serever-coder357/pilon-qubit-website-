'use client';

import { useState, useRef, useEffect } from 'react';

/**
 * GHL Chat Widget
 * Live chat widget that creates conversations in GoHighLevel
 * AI-powered responses with lead capture
 */

const GHL_LOCATION_ID = 'hzFViWrDM1Mc0NGkcyIM';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function GHLChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', email: '', captured: false });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addAIMessage(
          "Hi! 👋 I'm the PILON Qubit AI Assistant. I can help you learn about our AI marketing automation ($299-$999/mo) and frontier AI consulting services. What brings you here today?"
        );
      }, 500);
    }
  }, [isOpen, messages.length]);

  const addAIMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    addUserMessage(userMessage);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ghl/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          userInfo,
          conversationHistory: messages,
          locationId: GHL_LOCATION_ID
        })
      });

      const data = await response.json();
      
      setTimeout(() => {
        setIsTyping(false);
        addAIMessage(data.response);
        
        if (!userInfo.captured && data.needsInfo) {
          setTimeout(() => {
            addAIMessage("To better assist you, could you share your name and email? This helps me provide personalized recommendations.");
          }, 1000);
        }
        
        if (data.userInfo) {
          setUserInfo(prev => ({ ...prev, ...data.userInfo, captured: true }));
        }
      }, 1000 + Math.random() * 1000);

    } catch (error) {
      setIsTyping(false);
      addAIMessage("I'm having trouble connecting right now. Please try again or contact us directly at hello@pilonqubitventures.com");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { text: "Marketing Automation Pricing", emoji: "💰" },
    { text: "AI Consulting Services", emoji: "🚀" },
    { text: "Book a Demo", emoji: "📅" },
    { text: "Calculate ROI", emoji: "📊" }
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center group relative transition-all hover:scale-110"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Chat Assistant"
      >
        {!isOpen && messages.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
            {messages.filter(m => m.sender === 'ai').length}
          </span>
        )}
        <svg className="w-7 h-7 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
        </svg>
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-[9999] w-96 h-[600px] max-h-[calc(100vh-120px)] bg-gradient-to-br from-[#0A0A2A] to-[#1A1A4A] border border-blue-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center relative">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
              </div>
              <div>
                <h3 className="text-white font-bold">AI Assistant</h3>
                <p className="text-white/80 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Online now
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-white/10 text-cyan-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className="text-xs opacity-60 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-cyan-100/60 mb-2">Quick actions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputValue(action.text);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    className="text-xs px-3 py-2 bg-white/5 border border-blue-500/30 rounded-lg hover:bg-white/10 hover:border-blue-500/50 transition-all text-left text-cyan-100/80"
                  >
                    {action.emoji} {action.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-white/5 border-t border-blue-500/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 bg-white/10 border border-blue-500/30 rounded-lg text-white placeholder-cyan-100/50 focus:outline-none focus:border-blue-500 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-400 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </div>
            <p className="text-xs text-cyan-100/40 mt-2 text-center">
              Powered by PILON Qubit AI
            </p>
          </div>
        </div>
      )}
    </>
  );
}
