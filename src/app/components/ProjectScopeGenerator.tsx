'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

interface ProjectScope {
  title: string;
  challenge: string;
  approach: string[];
  technologies: string[];
  timeline: string;
  team: string;
  outcomes: string[];
}

const INITIAL_QUESTIONS = [
  {
    id: 'industry',
    question: "Let's start! What industry are you in?",
    placeholder: "e.g., Healthcare, Fintech, E-commerce, SaaS..."
  },
  {
    id: 'challenge',
    question: "What's the main challenge or goal you're trying to address?",
    placeholder: "Describe your current challenge or what you want to build..."
  },
  {
    id: 'technical',
    question: "Do you have any specific technical requirements or constraints?",
    placeholder: "e.g., Must integrate with existing systems, specific compliance needs..."
  },
  {
    id: 'timeline',
    question: "What's your desired timeline?",
    placeholder: "e.g., 3 months, 6 months, ASAP..."
  },
  {
    id: 'team',
    question: "Tell me about your current team and technical capabilities.",
    placeholder: "e.g., 5 engineers, no AI expertise, need full support..."
  }
];

export default function ProjectScopeGenerator() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectScope, setProjectScope] = useState<ProjectScope | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleStart = () => {
    setIsOpen(true);
    setMessages([{
      role: 'assistant',
      content: INITIAL_QUESTIONS[0].question
    }]);
  };

  const handleSubmitAnswer = async () => {
    if (!input.trim()) return;

    const currentQuestion = INITIAL_QUESTIONS[currentStep];
    const userMessage: Message = { role: 'user', content: input };
    
    setMessages(prev => [...prev, userMessage]);
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: input }));
    setInput('');

    if (currentStep < INITIAL_QUESTIONS.length - 1) {
      // Move to next question
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: INITIAL_QUESTIONS[currentStep + 1].question
        }]);
      }, 500);
    } else {
      // Generate project scope
      await generateProjectScope();
    }
  };

  const generateProjectScope = async () => {
    setIsGenerating(true);
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: "Perfect! Let me analyze your requirements and generate a comprehensive project scope..."
    }]);

    try {
      const response = await fetch('/api/generate-scope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });

      const data = await response.json();
      
      if (data.ok && data.scope) {
        setProjectScope(data.scope);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "Excellent! I've created a comprehensive project scope based on your needs. This is just a starting point - we'll work together to refine it and adjust everything to fit your specific budget and timeline. Download the PDF below or click 'Discuss with Team' to continue the conversation!"
        }]);
      } else {
        throw new Error('Failed to generate scope');
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I encountered an issue generating your scope. Please try again or contact us directly."
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!projectScope) return;

    try {
      const response = await fetch('/api/generate-scope-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope: projectScope })
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'project-scope-pilon-qubit.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download PDF. Please try again.');
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setMessages([{
      role: 'assistant',
      content: INITIAL_QUESTIONS[0].question
    }]);
    setInput('');
    setProjectScope(null);
    setAnswers({});
  };

  if (!isOpen) {
    return (
      <div className="flex justify-center my-12">
        <motion.button
          onClick={handleStart}
          className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🚀 Generate AI Project Scope
        </motion.button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl"
      >
        <div className="bg-gradient-to-br from-[#0a0a2a] to-[#1a1a4a] rounded-2xl border border-cyan-900/50 shadow-2xl overflow-hidden flex flex-col" style={{maxHeight: '85vh'}}>
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4" style={{flexShrink: 0}}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-white">AI Project Scope Generator</h3>
              <p className="text-cyan-100 mt-1">Let&apos;s define your project together</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-cyan-200 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress Bar */}
          {!projectScope && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-cyan-100 mb-2">
                <span>Progress</span>
                <span>{currentStep + 1} / {INITIAL_QUESTIONS.length}</span>
              </div>
              <div className="w-full bg-cyan-900/30 rounded-full h-2">
                <motion.div
                  className="bg-cyan-300 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / INITIAL_QUESTIONS.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <div ref={messagesContainerRef} className="p-4 space-y-4" style={{flex: 1, overflowY: 'auto', minHeight: 0}}>
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-[#1a1a4a] text-cyan-100 border border-cyan-900/50'
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-[#1a1a4a] text-cyan-100 border border-cyan-900/50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span>Analyzing your requirements...</span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Project Scope Display */}
        {projectScope && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-[#0a0a2a] border-t border-cyan-900/50 overflow-y-auto"
            style={{flex: 1, minHeight: 0}}
          >
            <h4 className="text-xl font-bold text-cyan-400 mb-4">📋 Your Project Scope</h4>
            
            <div className="space-y-4 text-cyan-100">
              <div>
                <h5 className="font-semibold text-cyan-300 mb-2">Project Title</h5>
                <p>{projectScope.title}</p>
              </div>

              <div>
                <h5 className="font-semibold text-cyan-300 mb-2">Challenge</h5>
                <p>{projectScope.challenge}</p>
              </div>

              <div>
                <h5 className="font-semibold text-cyan-300 mb-2">Proposed Approach</h5>
                <ul className="list-disc list-inside space-y-1">
                  {projectScope.approach.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-semibold text-cyan-300 mb-2">Recommended Technologies</h5>
                <div className="flex flex-wrap gap-2">
                  {projectScope.technologies.map((tech, idx) => (
                    <span key={idx} className="px-3 py-1 bg-cyan-900/30 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-cyan-300 mb-2">Timeline</h5>
                  <p>{projectScope.timeline}</p>
                </div>
                <div>
                  <h5 className="font-semibold text-cyan-300 mb-2">Team</h5>
                  <p>{projectScope.team}</p>
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-cyan-300 mb-2">Expected Outcomes</h5>
                <ul className="list-disc list-inside space-y-1">
                  {projectScope.outcomes.map((outcome, idx) => (
                    <li key={idx}>{outcome}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleDownloadPDF}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                📥 Download PDF
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setTimeout(() => {
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }, 300);
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                💬 Let&apos;s Chat!
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all"
              >
                🔄 Start Over
              </button>
            </div>
          </motion.div>
        )}

        {/* Input Area */}
        {!projectScope && !isGenerating && (
          <div className="p-4 bg-[#0a0a2a] border-t border-cyan-900/50" style={{flexShrink: 0}}>
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                placeholder={INITIAL_QUESTIONS[currentStep]?.placeholder || "Type your answer..."}
                className="flex-1 px-4 py-3 bg-[#1a1a4a] border border-cyan-900/50 rounded-lg text-white placeholder-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button
                onClick={handleSubmitAnswer}
                disabled={!input.trim()}
                className="px-4 py-3 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
              >
                ➤
              </button>
            </div>
          </div>
        )}
        </div>
      </motion.div>
    </div>
  );
}
