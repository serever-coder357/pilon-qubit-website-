(function() {
  'use strict';

  // Widget configuration from script tag data attributes
  const scriptTag = document.currentScript || document.querySelector('script[data-widget-id]');
  const WIDGET_ID = scriptTag?.getAttribute('data-widget-id') || '';
  const API_BASE = scriptTag?.getAttribute('data-api-url') || window.location.origin;

  // Generate or retrieve visitor ID
  function getVisitorId() {
    let visitorId = localStorage.getItem('chat_visitor_id');
    if (!visitorId) {
      visitorId = 'visitor_' + Math.random().toString(36).substr(2, 9) + Date.now();
      localStorage.setItem('chat_visitor_id', visitorId);
    }
    return visitorId;
  }

  const VISITOR_ID = getVisitorId();

  // Widget state
  let isOpen = false;
  let conversationId = null;
  let messages = [];
  let widgetConfig = {
    primaryColor: '#0F172A',
    secondaryColor: '#10B981',
    position: 'bottom-right',
    welcomeMessage: "Hi! I'm your AI concierge at Pilon Qubit Ventures.",
    companyName: 'Pilon Qubit Ventures',
    isOnline: true,
    enableAI: true,
    enableVoiceMessages: true
  };

  // Create widget HTML
  function createWidget() {
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'chat-widget-container';
    widgetContainer.innerHTML = `
      <style>
        #chat-widget-container {
          position: fixed;
          z-index: 999999;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        
        #chat-widget-container.bottom-right {
          bottom: 20px;
          right: 20px;
        }
        
        #chat-widget-container.bottom-left {
          bottom: 20px;
          left: 20px;
        }
        
        #chat-widget-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: ${widgetConfig.primaryColor};
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        #chat-widget-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }
        
        #chat-widget-button svg {
          width: 28px;
          height: 28px;
          fill: white;
        }
        
        #chat-widget-window {
          position: fixed;
          bottom: 90px;
          right: 20px;
          width: 380px;
          max-width: calc(100vw - 40px);
          max-height: 70vh;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(15,23,42,0.35);
          display: none;
          flex-direction: column;
          overflow: hidden;
        }
        
        #chat-header {
          padding: 14px 16px;
          background: ${widgetConfig.primaryColor};
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        #chat-header h3 {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
        }
        
        #chat-header-status {
          font-size: 12px;
          opacity: 0.85;
        }
        
        #chat-header button {
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          width: 28px;
          height: 28px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        #chat-header button:hover {
          background: rgba(15,23,42,0.35);
        }
        
        #chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          background: #F9FAFB;
        }
        
        .chat-message {
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
        }
        
        .chat-message.visitor {
          align-items: flex-end;
        }
        
        .chat-message.agent, .chat-message.ai {
          align-items: flex-start;
        }
        
        .message-bubble {
          max-width: 75%;
          padding: 10px 14px;
          border-radius: 12px;
          word-wrap: break-word;
          white-space: pre-wrap;
          font-size: 14px;
          line-height: 1.4;
        }
        
        .chat-message.visitor .message-bubble {
          background: ${widgetConfig.secondaryColor};
          color: white;
          border-bottom-right-radius: 4px;
        }
        
        .chat-message.agent .message-bubble,
        .chat-message.ai .message-bubble {
          background: white;
          color: #0F172A;
          border-bottom-left-radius: 4px;
          border: 1px solid #E5E7EB;
        }
        
        .message-meta {
          margin-top: 4px;
          font-size: 11px;
          color: #6B7280;
        }
        
        #chat-input-area {
          padding: 12px 14px;
          border-top: 1px solid #E5E7EB;
          background: white;
          display: flex;
          align-items: flex-end;
          gap: 8px;
        }
        
        #chat-input {
          flex: 1;
          min-height: 38px;
          max-height: 120px;
          border-radius: 999px;
          border: 1px solid #D1D5DB;
          padding: 8px 12px;
          font-size: 14px;
          resize: none;
          outline: none;
        }
        
        #chat-input:focus {
          border-color: ${widgetConfig.secondaryColor};
          box-shadow: 0 0 0 1px rgba(16,185,129,0.15);
        }
        
        #chat-send-btn, #chat-voice-btn {
          width: 38px;
          height: 38px;
          border-radius: 999px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        
        #chat-send-btn {
          background: ${widgetConfig.secondaryColor};
          color: white;
        }
        
        #chat-send-btn svg {
          width: 20px;
          height: 20px;
        }
        
        #chat-voice-btn {
          background: #F3F4F6;
          color: #4B5563;
        }
        
        #chat-voice-btn.recording {
          background: rgba(220,38,38,0.12);
          color: #DC2626;
        }
        
        #chat-voice-btn svg {
          width: 20px;
          height: 20px;
        }
        
        #chat-typing-indicator {
          padding: 8px 16px;
          font-size: 12px;
          color: #6B7280;
          display: none;
          align-items: center;
          gap: 8px;
        }
        
        #chat-typing-indicator .dots {
          display: flex;
          gap: 3px;
        }
        
        #chat-typing-indicator .dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: #9CA3AF;
          animation: chat-pulse 1.25s infinite ease-in-out;
        }
        
        #chat-typing-indicator .dot:nth-child(2) {
          animation-delay: 0.15s;
        }
        
        #chat-typing-indicator .dot:nth-child(3) {
          animation-delay: 0.3s;
        }
        
        @keyframes chat-pulse {
          0%, 80%, 100% { transform: scale(0.9); opacity: 0.3; }
          40% { transform: scale(1.1); opacity: 1; }
        }
        
        #chat-welcome {
          margin-bottom: 16px;
          font-size: 14px;
          color: #4B5563;
        }
        
        #chat-welcome strong {
          display: block;
          margin-bottom: 4px;
          color: #111827;
        }
        
        #chat-welcome ul {
          margin: 8px 0 0;
          padding-left: 16px;
        }
        
        #chat-welcome li {
          font-size: 13px;
          color: #6B7280;
        }

        @media (max-width: 640px) {
          #chat-widget-window {
            bottom: 80px;
            right: 10px;
            left: 10px;
            width: auto;
            max-width: none;
            max-height: 70vh;
          }
        }
      </style>
      
      <button id="chat-widget-button" aria-label="Open chat">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        </svg>
      </button>
      
      <div id="chat-widget-window">
        <div id="chat-header">
          <div>
            <h3>${widgetConfig.companyName}</h3>
            <div id="chat-header-status">${widgetConfig.isOnline ? 'Online' : 'Offline'}</div>
          </div>
          <button id="chat-close-btn" aria-label="Close chat">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        
        <div id="chat-messages"></div>
        
        <div id="chat-input-area">
          ${widgetConfig.enableVoiceMessages ? `
            <button id="chat-voice-btn" aria-label="Record voice message">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H6c0 3.07 2.13 5.64 5 6.32V21h2v-3.68c2.87-.68 5-3.25 5-6.32h-1z"/>
              </svg>
            </button>
          ` : ''}
          <textarea id="chat-input" rows="1" placeholder="Type your message..."></textarea>
          <button id="chat-send-btn" aria-label="Send message">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 21l21-9L2 3v7l15 2-15 2z"/>
            </svg>
          </button>
        </div>
        <div id="chat-typing-indicator">
          <span>Assistant is typing</span>
          <div class="dots">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        </div>
      </div>
    `;

    widgetContainer.className = widgetConfig.position;
    document.body.appendChild(widgetContainer);

    const button = document.getElementById('chat-widget-button');
    const windowEl = document.getElementById('chat-widget-window');
    const closeBtn = document.getElementById('chat-close-btn');
    const messagesEl = document.getElementById('chat-messages');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send-btn');
    const typingIndicator = document.getElementById('chat-typing-indicator');
    const voiceBtn = document.getElementById('chat-voice-btn');

    // Event listeners
    button.addEventListener('click', () => toggleWidget(windowEl));
    closeBtn.addEventListener('click', () => toggleWidget(windowEl, false));
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', handleInputKeydown);
    input.addEventListener('input', autoResizeTextarea);

    if (voiceBtn) {
      setupVoiceRecording(voiceBtn);
    }

    // Load existing conversation
    loadConversation();

    // Preload welcome message
    addWelcomeMessage();

    function toggleWidget(windowEl, forceState) {
      isOpen = typeof forceState === 'boolean' ? forceState : !isOpen;
      windowEl.style.display = isOpen ? 'flex' : 'none';

      if (isOpen) {
        trackEvent('widget-opened');
        setTimeout(() => {
          const inputEl = document.getElementById('chat-input');
          if (inputEl) inputEl.focus();
        }, 100);
      } else {
        trackEvent('widget-closed');
      }
    }

    function addWelcomeMessage() {
      if (!widgetConfig.welcomeMessage) return;
      
      const welcome = document.createElement('div');
      welcome.id = 'chat-welcome';
      welcome.innerHTML = `
        <strong>${widgetConfig.welcomeMessage}</strong>
        <ul>
          <li>Share what you're building and your stage.</li>
          <li>Ask how PQV can help: capital, strategy, or execution.</li>
          <li>We’ll help you understand if there is a potential fit.</li>
        </ul>
      `;
      messagesEl.appendChild(welcome);
    }

    // Message handling
    function addMessage(message) {
      const messageEl = document.createElement('div');
      messageEl.className = `chat-message ${message.senderType}`;
      
      const bubble = document.createElement('div');
      bubble.className = 'message-bubble';
      bubble.innerHTML = escapeHtml(message.content);
      messageEl.appendChild(bubble);
      
      if (message.senderName || message.createdAt) {
        const meta = document.createElement('div');
        meta.className = 'message-meta';
        const name = message.senderName ? `<strong>${escapeHtml(message.senderName)}</strong>` : '';
        const time = message.createdAt ? new Date(message.createdAt).toLocaleTimeString() : '';
        meta.innerHTML = `${name}${name && time ? ' · ' : ''}${time}`;
        messageEl.appendChild(meta);
      }
      
      messagesEl.appendChild(messageEl);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      
      messages.push(message);
    }

    function showTypingIndicator() {
      if (typingIndicator) {
        typingIndicator.style.display = 'flex';
      }
    }

    function hideTypingIndicator() {
      if (typingIndicator) {
        typingIndicator.style.display = 'none';
      }
    }

    function autoResizeTextarea(event) {
      const target = event.target;
      target.style.height = 'auto';
      target.style.height = target.scrollHeight + 'px';
    }

    function handleInputKeydown(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    }

    // Voice recording
    function setupVoiceRecording(voiceBtn) {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('Voice recording not supported in this browser');
        return;
      }

      let mediaRecorder = null;
      let audioChunks = [];

      voiceBtn.addEventListener('click', async () => {
        try {
          if (!mediaRecorder || mediaRecorder.state === 'inactive') {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.addEventListener('dataavailable', event => {
              audioChunks.push(event.data);
            });

            mediaRecorder.addEventListener('stop', () => {
              const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
              audioChunks = [];
              sendVoiceMessage(audioBlob);
              stream.getTracks().forEach(track => track.stop());
            });

            audioChunks = [];
            mediaRecorder.start();
            voiceBtn.classList.add('recording');
          } else if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            voiceBtn.classList.remove('recording');
          }
        } catch (error) {
          console.error('Error accessing microphone:', error);
        }
      });
    }

    // Message sending
    async function sendMessage() {
      const input = document.getElementById('chat-input');
      const content = input.value.trim();
      
      if (!content) return;
      
      input.value = '';
      input.style.height = 'auto';
      
      // Add user message to UI
      addMessage({
        senderType: 'visitor',
        content: content,
        createdAt: new Date()
      });
      
      // Show typing indicator
      showTypingIndicator();
      
      // Send to API
      try {
        const response = await fetch(`${API_BASE}/api/widget/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            widgetId: WIDGET_ID,
            visitorId: VISITOR_ID,
            content: content,
            conversationId: conversationId
          })
        });
        
        const data = await response.json();
        
        if (data.conversationId) {
          conversationId = data.conversationId;
        }
        
        hideTypingIndicator();
        
        if (data.reply) {
          addMessage({
            senderType: data.reply.senderType,
            senderName: data.reply.senderName,
            content: data.reply.content,
            createdAt: new Date(data.reply.createdAt)
          });
        }
        
        trackEvent('message-sent');
      } catch (error) {
        console.error('Failed to send message:', error);
        hideTypingIndicator();
        addMessage({
          senderType: 'ai',
          content: 'Sorry, there was an error sending your message. Please try again.',
          createdAt: new Date()
        });
      }
    }

    async function sendVoiceMessage(audioBlob) {
      showTypingIndicator();
      
      try {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'voice-message.webm');
        formData.append('widgetId', WIDGET_ID);
        formData.append('visitorId', VISITOR_ID);
        formData.append('conversationId', conversationId || '');
        
        const response = await fetch(`${API_BASE}/api/widget/voice`, {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        if (data.conversationId) {
          conversationId = data.conversationId;
        }
        
        hideTypingIndicator();
        
        if (data.transcription) {
          addMessage({
            senderType: 'visitor',
            content: `🎤 ${data.transcription}`,
            createdAt: new Date()
          });
        }
        
        if (data.reply) {
          addMessage({
            senderType: data.reply.senderType,
            senderName: data.reply.senderName,
            content: data.reply.content,
            createdAt: new Date(data.reply.createdAt)
          });
        }
      } catch (error) {
        console.error('Failed to send voice message:', error);
        hideTypingIndicator();
      }
    }

    // Load conversation history
    async function loadConversation() {
      try {
        const response = await fetch(`${API_BASE}/api/widget/conversation?widgetId=${WIDGET_ID}&visitorId=${VISITOR_ID}`);
        const data = await response.json();
        
        if (data.conversationId) {
          conversationId = data.conversationId;
        }
        
        if (Array.isArray(data.messages)) {
          data.messages.forEach(addMessage);
        }
      } catch (error) {
        console.error('Failed to load conversation:', error);
      }
    }

    // Analytics
    async function trackEvent(eventType) {
      try {
        await fetch(`${API_BASE}/api/widget/analytics`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            widgetId: WIDGET_ID,
            conversationId: conversationId,
            eventType: eventType
          })
        });
      } catch (error) {
        console.error('Failed to track event:', error);
      }
    }
  }

  // Utility function to escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Initialize widget when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();
