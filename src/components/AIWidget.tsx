"use client";

import { useState, useRef, useEffect } from "react";

type MsgRole = "user" | "assistant";

type Msg = {
  role: MsgRole;
  content: string;
};

export default function AIWidget() {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant" as const,
      content:
        "Hi, I'm the Pilon Qubit AI assistant. What are you trying to build or improve right now?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [leadPrompted, setLeadPrompted] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: Msg = { role: "user", content: trimmed };
    const newMessages: Msg[] = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // Automatic lead capture if email detected
    if (/\S+@\S+\.\S+/.test(trimmed)) {
      try {
        await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: trimmed,
            name: undefined,
            phone: undefined,
            message: "AI Assistant Lead",
            source: "ai-assistant",
          }),
        });
      } catch (err) {
        console.error("Failed to send AI email lead:", err);
      }
    }

    // Proactive request for email
    if (
      !leadPrompted &&
      /build|quote|help|website|project|startup|ai|contact/i.test(trimmed)
    ) {
      const promptMessage: Msg = {
        role: "assistant",
        content:
          "Before we go deeper, what’s the best email to reach you? I can send a summary and a tailored proposal after this chat.",
      };
      setMessages((prev) => [...prev, promptMessage]);
      setLeadPrompted(true);
    }

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.body) {
        setLoading(false);
        const errorMsg: Msg = {
          role: "assistant",
          content:
            "I couldn’t reach the AI service. Please try again or use the contact page.",
        };
        setMessages((prev) => [...prev, errorMsg]);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let runningText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        runningText += decoder.decode(value, { stream: true });
        const assistantMessage: Msg = {
          role: "assistant",
          content: runningText,
        };
        setMessages([...newMessages, assistantMessage]);
      }
    } catch (err) {
      console.error("AI chat error:", err);
      const errorMsg: Msg = {
        role: "assistant",
        content:
          "There was an issue talking to the AI. Try again or send a message through the contact form.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-white text-black px-4 py-3 rounded-full shadow-xl font-semibold hover:bg-gray-200"
      >
        Chat with AI
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-black w-full max-w-md rounded-2xl shadow-2xl flex flex-col h-[80vh]">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <div className="text-sm font-bold">Pilon Qubit Assistant</div>
                <div className="text-xs text-gray-500">
                  Engineering + Growth Intelligence
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`px-3 py-2 rounded-xl max-w-[85%] text-sm ${
                    m.role === "user"
                      ? "ml-auto bg-black text-white"
                      : "mr-auto bg-white border"
                  }`}
                >
                  {m.content}
                </div>
              ))}
              {loading && (
                <div className="text-xs text-gray-400">Assistant is thinking…</div>
              )}
            </div>

            <div className="p-3 border-t bg-white flex gap-2">
              <input
                className="border flex-1 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                placeholder="Type your message..."
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
