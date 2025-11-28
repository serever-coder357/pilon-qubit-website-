"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

type Role = "user" | "assistant";

type Message = {
  id: string;
  role: Role;
  text: string;
};

export default function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi, I’m the PQV Assistant. Tell me what you’re looking for, and I’ll help route it correctly.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const handleSend = async () => {
    const content = input.trim();
    if (!content || isSending) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text: content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: content }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = (await res.json()) as { reply?: string; error?: string };

      const replyText =
        data.reply ||
        data.error ||
        "I’m here, but something went wrong reading your message.";

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: replyText,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Error calling /api/assistant:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          text:
            "I couldn’t reach the server just now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ y: 300, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 300, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 25 }}
      className="fixed bottom-20 right-6 w-[360px] max-w-[100vw] bg-white text-black p-4 rounded-2xl shadow-xl border border-gray-200 flex flex-col"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="font-bold text-sm">PQV Assistant</h3>
          <p className="text-[11px] text-gray-500">
            Early version · Helps route your message to the right place.
          </p>
        </div>
        <button
          className="text-xs text-gray-500 hover:text-black"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="border rounded-lg h-48 p-2 overflow-y-auto bg-gray-50 text-sm space-y-2"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs ${
                m.role === "user"
                  ? "bg-black text-white rounded-br-none"
                  : "bg-gray-200 text-black rounded-bl-none"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex justify-start">
            <div className="max-w-[80%] px-3 py-2 rounded-2xl text-xs bg-gray-200 text-gray-700 rounded-bl-none">
              Thinking…
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="mt-3 flex gap-2">
        <input
          className="flex-1 border rounded-lg px-2 py-2 text-xs"
          placeholder="Type your message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSend}
          disabled={isSending || !input.trim()}
          className="px-3 py-2 text-xs bg-black text-white rounded-lg hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </motion.div>
  );
}
