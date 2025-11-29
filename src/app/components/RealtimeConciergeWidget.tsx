"use client";

import React, { useEffect, useRef, useState } from "react";

type ConciergeState = "closed" | "minimized" | "open";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

const RealtimeConciergeWidget: React.FC = () => {
  const [state, setState] = useState<ConciergeState>("closed");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "assistant-initial",
      role: "assistant",
      content:
        "Hi, I’m the Pilon Qubit concierge. Ask me anything about websites, marketing systems, or how we can help your business grow.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const isOpen = state === "open";

  const handleOpen = () => {
    setState("open");
  };

  const handleMinimize = () => {
    setState("minimized");
  };

  const handleClose = () => {
    setState("closed");
  };

  const handleQuickAction = (text: string) => {
    if (isStreaming) return;
    setInput(text);
  };

  const resetConversation = () => {
    if (isStreaming) return;
    setMessages([
      {
        id: "assistant-initial",
        role: "assistant",
        content:
          "Hi again, I’m the Pilon Qubit concierge. How can I help with your website, marketing, or growth today?",
      },
    ]);
    setInput("");
    setError(null);
  };

  // Auto-scroll to latest message
  useEffect(() => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isOpen]);

  const handleSend = async (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
    };

    const assistantMessageId = `assistant-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        id: assistantMessageId,
        role: "assistant",
        content: "",
      },
    ]);
    setInput("");
    setError(null);
    setIsStreaming(true);

    try {
      const payload = {
        messages: [
          // Only send user/assistant messages to backend
          ...[...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        ],
      };

      const response = await fetch("/api/concierge-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (!value) continue;

        const chunk = decoder.decode(value, { stream: !doneReading });
        if (!chunk) continue;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessageId
              ? { ...m, content: m.content + chunk }
              : m,
          ),
        );
      }
    } catch (err) {
      console.error("[RealtimeConciergeWidget] send error", err);
      setError(
        "I had trouble reaching the concierge service. Please try again in a moment.",
      );
      // If we failed, don’t leave an empty assistant bubble
      setMessages((prev) =>
        prev.filter((m) => m.id !== assistantMessageId || m.content !== ""),
      );
    } finally {
      setIsStreaming(false);
    }
  };

  // CLOSED STATE → only bubble
  if (state === "closed") {
    return (
      <button
        type="button"
        onClick={handleOpen}
        className="fixed bottom-4 right-4 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg shadow-sky-600/40 transition hover:scale-105 hover:bg-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        aria-label="Open Pilon Qubit Concierge"
      >
        <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/90 text-xs font-semibold uppercase tracking-wide">
          AI
        </span>
      </button>
    );
  }

  return (
    <>
      {/* MINIMIZED STATE → bubble only */}
      {state === "minimized" && (
        <button
          type="button"
          onClick={handleOpen}
          className="fixed bottom-4 right-4 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg shadow-sky-600/40 transition hover:scale-105 hover:bg-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          aria-label="Open Pilon Qubit Concierge"
        >
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/90 text-xs font-semibold uppercase tracking-wide">
            AI
          </span>
        </button>
      )}

      {/* OPEN STATE → full panel */}
      {isOpen && (
        <section
          aria-label="Pilon Qubit Realtime Concierge"
          className="fixed bottom-4 right-4 z-[9999] flex w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/95 text-slate-50 shadow-2xl shadow-slate-950/80 backdrop-blur-md"
        >
          {/* Header */}
          <header className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/90 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-600 text-xs font-semibold uppercase tracking-wide">
                AI
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">
                  Pilon Qubit Concierge
                </span>
                <span className="text-[11px] text-slate-400">
                  Live AI chat about your website and growth
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-300">
                Text · Phase 2
              </span>
              <button
                type="button"
                onClick={handleMinimize}
                className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-800 hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                aria-label="Minimize concierge"
              >
                ▾
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-800 hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                aria-label="Close concierge"
              >
                ✕
              </button>
            </div>
          </header>

          {/* Conversation area */}
          <div className="flex h-64 flex-col gap-3 overflow-y-auto px-4 py-3 text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-sky-600 text-white"
                      : "bg-slate-900/80 text-slate-100 border border-slate-800"
                  }`}
                >
                  {m.content || (m.role === "assistant" && isStreaming
                    ? "···"
                    : null)}
                </div>
              </div>
            ))}
            {error && (
              <div className="mt-1 text-xs text-amber-400">{error}</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick actions */}
          <div className="border-t border-slate-800/80 bg-slate-950/95 px-4 py-2">
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() =>
                  handleQuickAction("How can Pilon Qubit help my business?")
                }
                className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-slate-100 shadow-sm transition hover:border-sky-500 hover:bg-slate-900 hover:text-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                How can you help my business?
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickAction(
                    "What does the website build process look like?",
                  )
                }
                className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-slate-100 shadow-sm transition hover:border-sky-500 hover:bg-slate-900 hover:text-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                What does the website process look like?
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickAction("How do pricing and retainers work?")
                }
                className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-slate-100 shadow-sm transition hover:border-sky-500 hover:bg-slate-900 hover:text-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                How do pricing and retainers work?
              </button>
            </div>
          </div>

          {/* Input + controls */}
          <footer className="border-t border-slate-800/80 bg-slate-950/95 px-4 py-3">
            <form onSubmit={handleSend} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about websites, funnels, or growth…"
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  disabled={isStreaming}
                />
                <button
                  type="submit"
                  disabled={isStreaming || !input.trim()}
                  className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-sky-600/40 transition hover:bg-sky-500 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
                >
                  {isStreaming ? "Thinking…" : "Send"}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={resetConversation}
                  className="text-[11px] text-slate-500 underline-offset-2 hover:text-slate-300 hover:underline"
                  disabled={isStreaming}
                >
                  Reset conversation
                </button>
                <span className="text-[10px] text-slate-500">
                  Phase 2: live text chat · no voice yet
                </span>
              </div>
            </form>
          </footer>
        </section>
      )}
    </>
  );
};

export default RealtimeConciergeWidget;
