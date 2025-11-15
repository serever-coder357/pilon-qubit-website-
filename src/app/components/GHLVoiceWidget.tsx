'use client';

import { useState, useRef, useEffect } from 'react';

/**
 * GHL Voice AI Widget
 * Floating voice call button that connects to GoHighLevel Voice AI
 * Captures leads and creates conversations in GHL
 */

const GHL_PHONE_NUMBER = '+1-XXX-XXX-XXXX'; // TODO: Replace with actual GHL phone number
const GHL_LOCATION_ID = 'hzFViWrDM1Mc0NGkcyIM';

export default function GHLVoiceWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [userInfo, setUserInfo] = useState({ name: '', email: '', phone: '' });
  const [step, setStep] = useState<'intro' | 'form' | 'calling'>('intro');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isCallActive) {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setCallDuration(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isCallActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = async () => {
    if (!userInfo.name || !userInfo.email) {
      alert('Please provide your name and email to start the call');
      return;
    }

    // Create contact in GHL
    try {
      const response = await fetch('/api/ghl/create-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userInfo.name,
          email: userInfo.email,
          phone: userInfo.phone,
          source: 'Voice Widget',
          locationId: GHL_LOCATION_ID
        })
      });

      if (response.ok) {
        setStep('calling');
        setIsCallActive(true);
        console.log('Voice call initiated for:', userInfo);
      }
    } catch (error) {
      console.error('Failed to create contact:', error);
      alert('Failed to start call. Please try again.');
    }
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setStep('intro');
    setUserInfo({ name: '', email: '', phone: '' });
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Voice Button */}
      <button
        className="fixed bottom-6 right-24 z-50 w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center group transition-all hover:scale-110"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Voice AI Assistant"
      >
        {isCallActive ? (
          <div className="relative">
            <svg className="w-7 h-7 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
            </svg>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
          </div>
        ) : (
          <svg className="w-7 h-7 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        )}
      </button>

      {/* Voice Widget Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-24 z-50 w-96 bg-gradient-to-br from-[#0A0A2A] to-[#1A1A4A] border border-cyan-500/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold">Talk to AI Assistant</h3>
                <p className="text-white/80 text-xs">Available 24/7</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 'intro' && (
              <div className="text-center">
                <div className="mb-4">
                  <div className="w-20 h-20 mx-auto bg-cyan-500/20 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-10 h-10 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Talk to Our AI Expert</h4>
                  <p className="text-cyan-100/70 text-sm mb-4">
                    Get instant answers about our AI marketing automation and consulting services. Our AI assistant is ready to help!
                  </p>
                </div>
                <button
                  onClick={() => setStep('form')}
                  className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all"
                >
                  Start Voice Call
                </button>
              </div>
            )}

            {step === 'form' && (
              <div>
                <h4 className="text-lg font-bold text-white mb-4">Quick Info</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-cyan-500/30 rounded-lg text-white placeholder-cyan-100/50 focus:outline-none focus:border-cyan-500"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-cyan-500/30 rounded-lg text-white placeholder-cyan-100/50 focus:outline-none focus:border-cyan-500"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number (optional)"
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-cyan-500/30 rounded-lg text-white placeholder-cyan-100/50 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setStep('intro')}
                    className="flex-1 px-4 py-2 bg-white/10 border border-cyan-500 text-white rounded-lg hover:bg-white/20 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleStartCall}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all"
                  >
                    Start Call
                  </button>
                </div>
              </div>
            )}

            {step === 'calling' && (
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-24 h-24 mx-auto bg-cyan-500/20 rounded-full flex items-center justify-center mb-4 relative">
                    <div className="absolute inset-0 rounded-full bg-cyan-500/30 animate-ping"></div>
                    <svg className="w-12 h-12 text-cyan-400 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Call in Progress</h4>
                  <p className="text-cyan-400 text-2xl font-mono mb-1">{formatDuration(callDuration)}</p>
                  <p className="text-cyan-100/70 text-sm">Connected to AI Assistant</p>
                </div>
                <button
                  onClick={handleEndCall}
                  className="w-full px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.70 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.68-1.36-2.66-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
                  </svg>
                  End Call
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-white/5 border-t border-cyan-500/20 text-center">
            <p className="text-cyan-100/60 text-xs">
              Powered by PILON Qubit AI • Available 24/7
            </p>
          </div>
        </div>
      )}
    </>
  );
}
