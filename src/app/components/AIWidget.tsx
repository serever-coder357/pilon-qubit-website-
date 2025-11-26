'use client';

import ChatbotButton from '../ChatbotButton';

/**
 * Shim component to ensure any legacy imports of AIWidget resolve to the
 * unified ChatbotButton + AIChatWidget experience.
 */
export default function AIWidget() {
  return <ChatbotButton />;
}
