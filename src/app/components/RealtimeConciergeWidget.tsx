"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

type ConciergeState = "closed" | "minimized" | "open";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

type LeadStatus = "idle" | "submitting" | "success" | "error";

const RealtimeConciergeWidget: React.FC = () => {
  const [state, setState] = useState<ConciergeState>("closed");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "assistant-initial",
      role: "assistant",
      content:
        "Hi, I’m the Pilon Qubit concierge. We usually help in three tracks: (1) websites & funnels, (2) AI marketing automation, and (3) frontier AI consulting. Which of these do you want help with first?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadCompany, setLeadCompany] = useState("");
  const [leadMessage, setLeadMessage] = useState("");
  const [leadStatus, setLeadStatus] = useState<LeadStatus>("idle");
  const [leadError, setLeadError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const pathname = usePathname();
  const [sectionHint, setSectionHint] = useState<string>("");
  const panelRef = useRef<HTMLDivElement | null>(null);
  const lastInteractionRef = useRef<number>(Date.now());

  const isOpen = state === "open";

  const recordInteraction = () => {
    lastInteractionRef.current = Date.now();
  };

  const handleOpen = () => {
    recordInteraction();
    setState("open");
  };

  const handleMinimize = () => {
    recordInteraction();
    setState("minimized");
  };

  const handleClose = () => {
    recordInteraction();
    setState("closed");
  };

  const handleQuickAction = (text: string) => {
    if (isStreaming) return;
    recordInteraction();
    setInput(text);
  };

  const resetConversation = () => {
    if (isStreaming) return;
    recordInteraction();
    setMessages([
      {
        id: "assistant-initial",
        role: "assistant",
        content:
          "Hi again, I’m the Pilon Qubit concierge. Our three main tracks are: (1) websites & funnels, (2) AI marketing automation, and (3) frontier AI consulting. Which one do you want to focus on?",
      },
    ]);
    setInput("");
    setError(null);
  };

  const stopStreaming = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    recordInteraction();
    setIsStreaming(false);
  };

  // Track the current #section from URL hash (e.g. #services, #contact)
  useEffect(() => {
    const updateSection = () => {
      if (typeof window === "undefined") return;
      setSectionHint(window.location.hash || "");
    };

    updateSection();
    window.addEventListener("hashchange", updateSection);
    return () => {
      window.removeEventListener("hashchange", updateSection);
    };
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isOpen]);

  // Auto-minimize on outside click/tap and scroll
  useEffect(() => {
    if (state !== "open") return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!panelRef.current) return;
      const target = event.target as Node | null;
      if (target && panelRef.current.contains(target)) {
        // Click inside panel → interaction, do not minimize
        recordInteraction();
        return;
      }
      // Click/tap outside → minimize
      setState("minimized");
    };

    const handleScroll = () => {
      // Any page scroll while open → minimize
      setState("minimized");
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [state]);

  // Auto-minimize on inactivity (~45s) when open and not streaming
  useEffect(() => {
    if (state !== "open") return;

    const interval = setInterval(() => {
      if (isStreaming) return;
      const now = Date.now();
      if (now - lastInteractionRef.current > 45_000) {
        setState("minimized");
      }
    }, 5_000);

    return () => clearInterval(interval);
  }, [state, isStreaming]);

  const handleSend = async (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    if (!input.trim() || isStreaming) return;

    recordInteraction();

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

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const payload = {
        messages: [...[...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        }))],
        pagePath: pathname || "/",
        pageSection: sectionHint || "",
      };

      const response = await fetch("/api/concierge-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
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
    } catch (err: any) {
      if (err?.name === "AbortError") {
        console.warn("[RealtimeConciergeWidget] streaming aborted by user");
        // Keep whatever content was already streamed.
      } else {
        console.error("[RealtimeConciergeWidget] send error", err);
        setError(
          "I had trouble reaching the concierge service. Please try again in a moment.",
        );
        // If we failed before any content, remove the empty assistant bubble.
        setMessages((prev) =>
          prev.filter((m) => m.id !== assistantMessageId || m.content !== ""),
        );
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  };

  const handleLeadSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (leadStatus === "submitting") return;

    recordInteraction();

    if (!leadEmail.trim() || !leadMessage.trim()) {
      setLeadError("Please add at least your email and a short note.");
      setLeadStatus("error");
      return;
    }

    setLeadStatus("submitting");
    setLeadError(null);

    try {
      const payload = {
        name: leadName.trim() || undefined,
        email: leadEmail.trim(),
        company: leadCompany.trim() || undefined,
        message: leadMessage.trim(),
        pagePath: pathname || "/",
        pageSection: sectionHint || "",
      };

      const res = await fetch("/api/concierge-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!res.ok || !data?.ok) {
        const errMsg =
          data?.error || "There was an issue sending your details.";
        setLeadError(errMsg);
        setLeadStatus("error");
        return;
      }

      setLeadStatus("success");
      setLeadError(null);
      setLeadMessage("");
      // Optional: don’t clear name/email so they stay prefilled for next time.
      // Auto-minimize after a moment to get out of the way
      setTimeout(() => {
        setState("minimized");
      }, 3000);
    } catch (err) {
      console.error("[RealtimeConciergeWidget] lead submit error", err);
      setLeadError("Unexpected error while sending your details.");
      setLeadStatus("error");
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

      {/* OPEN STATE → full panel, compact height, auto-minimized on outside actions */}
      {isOpen && (
        <section
          aria-label="Pilon Qubit Realtime Concierge"
          ref={panelRef}
          className="fixed bottom-4 right-4 z-[9999] flex w-[340px] max-w-[calc(100vw-2rem)] max-h-[80vh] flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/95 text-slate-50 shadow-2xl shadow-slate-950/80 backdrop-blur-md"
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

          {/* Conversation area – compact */}
          <div className="flex max-h-60 flex-col gap-3 overflow-y-auto px-4 py-3 text-sm">
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
                  {m.content ||
                    (m.role === "assistant" && isStreaming ? "Typing…" : null)}
                </div>
              </div>
            ))}
            {error && (
              <div className="mt-1 text-xs text-amber-400">{error}</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick actions – three main tracks */}
          <div className="border-t border-slate-800/80 bg-slate-950/95 px-4 py-2">
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() =>
                  handleQuickAction(
                    "I want help with websites and funnels.",
                  )
                }
                className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-slate-100 shadow-sm transition hover:border-sky-500 hover:bg-slate-900 hover:text-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Websites & funnels
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickAction("I want help with AI marketing automation.")
                }
                className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-slate-100 shadow-sm transition hover:border-sky-500 hover:bg-slate-900 hover:text-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                AI marketing automation
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickAction(
                    "I want help with frontier AI consulting and custom builds.",
                  )
                }
                className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-slate-100 shadow-sm transition hover:border-sky-500 hover:bg-slate-900 hover:text-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Frontier AI consulting
              </button>
            </div>
          </div>

          {/* Input + controls + hard CTAs + mini lead form */}
          <footer className="border-t border-slate-800/80 bg-slate-950/95 px-4 py-3">
            {/* Chat input */}
            <form
              onSubmit={(e) => {
                recordInteraction();
                void handleSend(e);
              }}
              className="flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => {
                    recordInteraction();
                    setInput(e.target.value);
                  }}
                  placeholder="Ask about one of those tracks…"
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
                <button
                  type="button"
                  onClick={stopStreaming}
                  disabled={!isStreaming}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 shadow-sm transition hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Stop
                </button>
              </div>

              <div className="flex flex-col gap-1 text-[11px] text-slate-500">
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

                {/* Hard CTAs */}
                <div className="mt-1 flex items-center justify-between gap-2">
                  <Link
                    href="/#contact"
                    className="inline-flex flex-1 items-center justify-center rounded-lg border border-sky-600/70 bg-sky-600/10 px-2 py-1.5 text-[11px] font-semibold text-sky-200 shadow-sm transition hover:bg-sky-600/20 hover:text-sky-50"
                  >
                    Go to contact section
                  </Link>
                  <a
                    href="mailto:hello@pilonqubitventures.com"
                    className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-[11px] font-medium text-slate-200 shadow-sm transition hover:bg-slate-800 hover:text-white"
                  >
                    Email hello@pilonqubitventures.com
                  </a>
                </div>

                {/* Toggle mini lead form */}
                <button
                  type="button"
                  onClick={() => {
                    recordInteraction();
                    setShowLeadForm((prev) => !prev);
                  }}
                  className="mt-1 text-left text-[11px] text-sky-300 underline-offset-2 hover:text-sky-200 hover:underline"
                >
                  {showLeadForm
                    ? "Hide quick contact form"
                    : "Or share your details here and we’ll follow up"}
                </button>
              </div>
            </form>

            {/* Mini lead form */}
            {showLeadForm && (
              <form
                onSubmit={handleLeadSubmit}
                className="mt-2 flex flex-col gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2.5"
              >
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-slate-300">
                    Name (optional)
                  </label>
                  <input
                    type="text"
                    value={leadName}
                    onChange={(e) => {
                      recordInteraction();
                      setLeadName(e.target.value);
                    }}
                    className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-[12px] text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400"
                    placeholder="Your name"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-slate-300">
                    Email (required)
                  </label>
                  <input
                    type="email"
                    value={leadEmail}
                    onChange={(e) => {
                      recordInteraction();
                      setLeadEmail(e.target.value);
                    }}
                    className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-[12px] text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400"
                    placeholder="you@company.com"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-slate-300">
                    Company (optional)
                  </label>
                  <input
                    type="text"
                    value={leadCompany}
                    onChange={(e) => {
                      recordInteraction();
                      setLeadCompany(e.target.value);
                    }}
                    className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-[12px] text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400"
                    placeholder="Company or project name"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-slate-300">
                    What do you need help with? (required)
                  </label>
                  <textarea
                    value={leadMessage}
                    onChange={(e) => {
                      recordInteraction();
                      setLeadMessage(e.target.value);
                    }}
                    className="min-h-[60px] rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-[12px] text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400"
                    placeholder="Short summary of your website, marketing, or AI needs."
                  />
                </div>

                {leadError && (
                  <p className="text-[11px] text-amber-300">{leadError}</p>
                )}
                {leadStatus === "success" && !leadError && (
                  <p className="text-[11px] text-emerald-300">
                    Thanks — your details are in. We&apos;ll follow up by email.
                  </p>
                )}

                <div className="mt-1 flex items-center justify-between gap-2">
                  <button
                    type="submit"
                    disabled={leadStatus === "submitting"}
                    className="inline-flex flex-1 items-center justify-center rounded-lg bg-sky-600 px-2 py-1.5 text-[12px] font-semibold text-white shadow-md shadow-sky-600/40 transition hover:bg-sky-500 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300 disabled:shadow-none"
                  >
                    {leadStatus === "submitting"
                      ? "Sending…"
                      : "Send to Pilon Qubit"}
                  </button>
                  <span className="text-[10px] text-slate-500">
                    Sent securely via email
                  </span>
                </div>
              </form>
            )}
          </footer>
        </section>
      )}
    </>
  );
};

export default RealtimeConciergeWidget;
