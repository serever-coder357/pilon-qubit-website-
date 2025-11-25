"use client";

import { useState, useRef, useEffect } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function AIWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: "Hi, I'm the Pilon Qubit AI assistant. What are you trying to build?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [leadCaptured, setLeadCaptured] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage: Msg = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // Lead capture trigger: ultra simple v1
    if (!leadCaptured && /email|project|build|quote|help|website|ai/i.test(input)) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Before I continue—what’s your best email so I can send a summary and proposal?"
        }
      ]);
      setLeadCaptured(true);
    }

    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages })
    });

    const reader = res.body?.getReader();
    if (!reader) {
      setLoading(false);
      return;
    }

    let assistantText = "";
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      assistantText += decoder.decode(value);
      setMessages([...newMessages, { role: "assistant", content: assistantText }]);
    }

    setLoading(false);

    // Email auto-capture if user enters an email
    if (leadCaptured && /\S+@\S+\.\S+/.test(input)) {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: input,
          message: "AI Assistant Lead",
          source: "ai-assistant"
        })
      });
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-black text-white px-4 py-3 rounded-full shadow-lg"
      >
        Chat with AI
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl flex flex-col h-[80vh]">
            <div className="p-4 border-b font-semibold flex justify-between">
              Pilon Qubit Assistant
              <button onClick={() => setOpen(false)}>✕</button>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto space-y-3"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg max-w-[90%] ${
                    m.role === "user"
                      ? "ml-auto bg-black text-white"
                      : "mr-auto bg-gray-100"
                  }`}
                >
                  {m.content}
                </div>
              ))}

              {loading && (
                <div className="text-gray-400 text-sm">Thinking...</div>
              )}
            </div>

            <div className="p-4 border-t flex gap-2">
              <input
                className="border flex-1 rounded px-3 py-2"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                className="bg-black text-white px-4 py-2 rounded-lg"
                disabled={loading}
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
