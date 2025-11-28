"use client";

import { useState } from "react";
import MessageBubble from "./MessageBubble";
import InputBar from "./InputBar";

type ChatMessage = {
  id: string;
  role: "ai" | "user";
  text: string;
};

export default function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "ai",
      text: "Hi, I'm the PQV Assistant. Tell me what you're looking for and I'll help.",
    },
  ]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
    };

    // For now, just echo a placeholder AI reply.
    // We will wire this to a real /api/assistant route later.
    const aiReply: ChatMessage = {
      id: `ai-${Date.now()}`,
      role: "ai",
      text: "Thanks, I received your message. I'll route this appropriately.",
    };

    setMessages((prev) => [...prev, userMessage, aiReply]);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg">PQV Assistant</h2>
          <p className="text-xs text-neutral-500">
            Ask about services, partnerships, or investments.
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-sm text-neutral-500 hover:text-black"
        >
          Close
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50">
        {messages.map((m) => (
          <MessageBubble key={m.id} role={m.role} text={m.text} />
        ))}
      </div>

      {/* Input */}
      <InputBar onSend={handleSend} />
    </div>
  );
}
