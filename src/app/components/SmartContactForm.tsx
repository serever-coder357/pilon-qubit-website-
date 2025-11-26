'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface FormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function SmartContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isRecording, setIsRecording] = useState(false);

  // Email validation with smart suggestions
  const validateEmail = (email: string): { valid: boolean; suggestion?: string } => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      return { valid: false };
    }

    // Common typo corrections
    const commonTypos: Record<string, string> = {
      'gmial.com': 'gmail.com',
      'gmai.com': 'gmail.com',
      'yahooo.com': 'yahoo.com',
      'hotmial.com': 'hotmail.com',
      'outlok.com': 'outlook.com',
    };

    const domain = email.split('@')[1];
    if (domain && commonTypos[domain]) {
      return {
        valid: true,
        suggestion: email.replace(domain, commonTypos[domain]),
      };
    }

    return { valid: true };
  };

  const handleEmailBlur = () => {
    if (formData.email) {
      const validation = validateEmail(formData.email);
      if (validation.suggestion) {
        if (window.confirm(`Did you mean ${validation.suggestion}?`)) {
          setFormData({ ...formData, email: validation.suggestion });
        }
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email).valid) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message should be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVoiceInput = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser. Please try Chrome or Edge.');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setFormData({ ...formData, message: formData.message + ' ' + transcript });
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          turnstileToken: undefined,
        }),
      });

      const data = await response.json();

      const isSuccess = response.ok && (data?.ok === true || data?.success === true);

      if (isSuccess) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', company: '', message: '' });
        setErrors({});
        
        // Track success event
        if ((window as any).analytics) {
          (window as any).analytics.track('contact_form_submitted', {
            has_company: !!formData.company,
          });
        }
      } else {
        throw new Error(data.error || 'Submission failed');
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6">
      <h3 className="text-3xl font-bold mb-6">Let&apos;s talk</h3>
      <p className="text-cyan-100/80 mb-8">
        Tell us about your project and goals. We&apos;ll get back within one business day.
      </p>

      <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Name Field */}
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm text-cyan-50/90">
              Your name <span className="text-red-400">*</span>
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ada Lovelace"
              className={`px-3 py-2 rounded text-black ${
                errors.name ? 'ring-2 ring-red-500' : ''
              }`}
              required
              aria-required="true"
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm"
              >
                {errors.name}
              </motion.p>
            )}
          </div>

          {/* Email Field */}
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm text-cyan-50/90">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              onBlur={handleEmailBlur}
              placeholder="you@company.com"
              className={`px-3 py-2 rounded text-black ${
                errors.email ? 'ring-2 ring-red-500' : ''
              }`}
              required
              aria-required="true"
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm"
              >
                {errors.email}
              </motion.p>
            )}
          </div>
        </div>

        {/* Company Field */}
        <div className="grid gap-2">
          <label htmlFor="company" className="text-sm text-cyan-50/90">
            Company
          </label>
          <input
            id="company"
            name="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Company Inc."
            className="px-3 py-2 rounded text-black"
          />
        </div>

        {/* Message Field with Voice Input */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="message" className="text-sm text-cyan-50/90">
              Message <span className="text-red-400">*</span>
            </label>
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`text-sm flex items-center gap-1 ${
                isRecording ? 'text-red-400' : 'text-cyan-400 hover:text-cyan-300'
              }`}
              title="Use voice input"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
              {isRecording ? 'Recording...' : 'Voice input'}
            </button>
          </div>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="What are you trying to build?"
            rows={5}
            className={`px-3 py-2 rounded text-black ${
              errors.message ? 'ring-2 ring-red-500' : ''
            }`}
            required
            aria-required="true"
            aria-invalid={!!errors.message}
          />
          {errors.message && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm"
            >
              {errors.message}
            </motion.p>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 items-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded bg-cyan-500 text-white hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:bg-cyan-900 disabled:cursor-not-allowed flex items-center gap-2"
            aria-label="Send message"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending...
              </>
            ) : (
              'Send message'
            )}
          </button>
          <a
            className="px-4 py-2 rounded border border-cyan-500 hover:bg-cyan-500/10 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            href="mailto:hello@pilonqubitventures.com?subject=Inquiry from PILON Qubit Website&body=Hi PILON Qubit team,%0D%0A%0D%0AI'm interested in learning more about your services.%0D%0A%0D%0A"
            target="_blank"
            rel="noopener noreferrer"
          >
            Email us directly
          </a>
        </div>

        {/* Success/Error Messages */}
        {submitStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/20 border border-green-500 text-green-100 px-4 py-3 rounded"
          >
            ✓ Thanks! We&apos;ll be in touch shortly.
          </motion.div>
        )}
        {submitStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded"
          >
            Something went wrong. Please try again or email us directly.
          </motion.div>
        )}
      </form>
    </div>
  );
}
