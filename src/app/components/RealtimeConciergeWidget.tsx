"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
} from "react";
import { usePathname } from "next/navigation";
import { useRealtimeVoice, RealtimeVoiceToggle } from "./RealtimeVoiceClient";

type ConciergeMode = "text" | "voice-live";

type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: number;
};

type LeadFormState = {
  name: string;
  email: string;
  company: string;
  budgetRange: string;
  notes: string;
};

const initialLeadForm: LeadFormState = {
  name: "",
  email: "",
  company: "",
  budgetRange: "",
  notes: "",
};

type ConciergeStatus = "idle" | "sending" | "error";

function createId() {
  return Math.random().toString(36).slice(2);
}

export default function RealtimeConciergeWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ConciergeMode>("text");

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [status, setStatus] = useState<ConciergeStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const [leadForm, setLeadForm] = useState<LeadFormState>(initialLeadForm);
  const [leadStatus, setLeadStatus] = useState<ConciergeStatus>("idle");
  const [leadError, setLeadError] = useState<string | null>(null);
  const [leadSuccess, setLeadSuccess] = useState<string | null>(null);

  const pageContext = useMemo(
    () => ({
      path: pathname || "/",
      ts: Date.now(),
    }),
    [pathname],
  );

  const {
    status: voiceStatus,
    error: voiceError,
    start: startVoice,
    stop: stopVoice,
  } = useRealtimeVoice({
    onLog: (msg) => {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.debug("[ConciergeVoice]", msg);
      }
    },
  });

  /**
   * If voice hits an error while in voice mode, fall back to text mode.
   */
  useEffect(() => {
    if (voiceError && mode === "voice-live") {
      setMode("text");
    }
  }, [voiceError, mode]);

  /**
   * Open/close bubble.
   */
  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  /**
   * Basic chat send to /api/concierge-chat
   */
  const sendMessage = useCallback(async () => {
    if (!userInput.trim()) return;
    if (status === "sending") return;

    const content = userInput.trim();
    const userMsg: ChatMessage = {
      id: createId(),
      role: "user",
      content,
      createdAt: Date.now(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setUserInput("");
    setStatus("sending");
    setError(null);

    try {
      const res = await fetch("/api/concierge-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          pageContext,
          history: chatMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Chat API error (${res.status}): ${txt}`);
      }

      const data = await res.json();
      const assistantText: string =
        data.reply ??
        data.answer ??
        data.message ??
        "Thanks for reaching out — how else can I help?";

      const assistantMsg: ChatMessage = {
        id: createId(),
        role: "assistant",
        content: assistantText,
        createdAt: Date.now(),
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
      setStatus("idle");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setStatus("error");
    }
  }, [userInput, status, pageContext, chatMessages]);

  /**
   * Lead mini-form submission → /api/concierge-lead
   */
  const submitLead = useCallback(async () => {
    if (leadStatus === "sending") return;

    setLeadStatus("sending");
    setLeadError(null);
    setLeadSuccess(null);

    try {
      const res = await fetch("/api/concierge-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead: leadForm,
          pageContext,
          source: "realtime-concierge",
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Lead API error (${res.status}): ${txt}`);
      }

      await res.json().catch(() => ({}));

      setLeadSuccess(
        "Got it. We will follow up at the email you provided.",
      );
      setLeadStatus("idle");
      setLeadForm(initialLeadForm);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setLeadError(msg);
      setLeadStatus("error");
    }
  }, [leadForm, leadStatus, pageContext]);

  const handleLeadChange = useCallback(
    (field: keyof LeadFormState, value: string) => {
      setLeadForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (mode === "text") {
          void sendMessage();
        }
      }
    },
    [mode, sendMessage],
  );

  const isVoiceLive = mode === "voice-live" && voiceStatus === "live";

  return (
    <>
      {/* Floating bubble */}
      <button
        type="button"
        onClick={toggleOpen}
        className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white shadow-lg shadow-slate-900/30 transition hover:scale-105 hover:bg-slate-800"
        aria-label={isOpen ? "Close AI Concierge" : "Open AI Concierge"}
      >
        {isOpen ? "×" : "AI"}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-40 flex w-[360px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/20">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                Pilon Qubit Concierge
              </span>
              <span className="text-sm text-slate-600">
                Realtime assistant for this page
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span
                className={`h-2 w-2 rounded-full ${
                  isVoiceLive ? "bg-emerald-500" : "bg-slate-300"
                }`}
              />
              {isVoiceLive ? "Voice live" : "Text mode"}
            </div>
          </div>

          {/* Mode switch & voice controls */}
          <div className="border-b border-slate-100 px-4 pb-3 pt-2">
            <div className="mb-1 flex items-center gap-2 text-[11px] text-slate-500">
              <button
                type="button"
                onClick={() => {
                  setMode("text");
                  stopVoice();
                }}
                className={`rounded-full px-2 py-1 text-[11px] ${
                  mode === "text"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Text chat
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("voice-live");
                  void startVoice();
                }}
                className={`rounded-full px-2 py-1 text-[11px] ${
                  mode === "voice-live"
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                }`}
              >
                Live voice
              </button>
            </div>

            <RealtimeVoiceToggle
              status={voiceStatus}
              error={voiceError}
              onStart={() => {
                setMode("voice-live");
                void startVoice();
              }}
              onStop={() => {
                stopVoice();
                setMode("text");
              }}
            />
          </div>

          {/* Body */}
          <div className="flex max-h-[460px] flex-col">
            {/* Conversation */}
            <div className="flex-1 overflow-y-auto bg-slate-50/60 px-4 py-3 text-sm text-slate-800">
              {chatMessages.length === 0 ? (
                <div className="space-y-2 text-xs text-slate-500">
                  <p>
                    I can help you understand this page, evaluate fit, and
                    capture the details we need to follow up.
                  </p>
                  <ul className="list-disc pl-4">
                    <li>Ask anything about Pilon Qubit Ventures.</li>
                    <li>Share your company, stage, and goals.</li>
                    <li>Switch to live voice for realtime conversation.</li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-2">
                  {chatMessages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${
                        m.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                          m.role === "user"
                            ? "rounded-br-sm bg-slate-900 text-slate-50"
                            : "rounded-bl-sm bg-white text-slate-800 shadow-sm"
                        }`}
                      >
                        {m.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {status === "sending" && (
                <p className="mt-2 text-[11px] italic text-slate-500">
                  Thinking…
                </p>
              )}
              {error && (
                <p className="mt-2 text-[11px] text-rose-600">
                  Chat error: {error}
                </p>
              )}
            </div>

            {/* Input & lead form */}
            <div className="border-t border-slate-200 bg-white px-4 py-3">
              {/* Text input is disabled when fully in live voice mode */}
              <div className="mb-3 space-y-1">
                <label className="block text-[11px] font-medium text-slate-600">
                  {isVoiceLive
                    ? "Live voice is active — you can still type if you prefer."
                    : "Ask a question about this page"}
                </label>
                <textarea
                  className="h-16 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-slate-400"
                  placeholder={
                    isVoiceLive
                      ? "Or type here while we talk…"
                      : 'Example: “Are we a good fit if we’re a SaaS startup raising a seed round?”'
                  }
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={status === "sending"}
                />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    I’ll use this page plus your context to tailor the answer.
                  </span>
                  <button
                    type="button"
                    onClick={() => void sendMessage()}
                    disabled={!userInput.trim() || status === "sending"}
                    className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Send
                  </button>
                </div>
              </div>

              {/* Lead capture mini-form */}
              <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-700">
                    Share your details for follow-up
                  </span>
                  {leadSuccess && (
                    <span className="text-[10px] text-emerald-600">
                      {leadSuccess}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-800 placeholder:text-slate-400 focus:border-slate-400"
                    placeholder="Name"
                    value={leadForm.name}
                    onChange={(e) =>
                      handleLeadChange("name", e.target.value)
                    }
                  />
                  <input
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-800 placeholder:text-slate-400 focus:border-slate-400"
                    placeholder="Email"
                    value={leadForm.email}
                    onChange={(e) =>
                      handleLeadChange("email", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-800 placeholder:text-slate-400 focus:border-slate-400"
                    placeholder="Company"
                    value={leadForm.company}
                    onChange={(e) =>
                      handleLeadChange("company", e.target.value)
                    }
                  />
                  <input
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-800 placeholder:text-slate-400 focus:border-slate-400"
                    placeholder="Budget / stage"
                    value={leadForm.budgetRange}
                    onChange={(e) =>
                      handleLeadChange("budgetRange", e.target.value)
                    }
                  />
                </div>
                <textarea
                  className="h-12 w-full resize-none rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-800 placeholder:text-slate-400 focus:border-slate-400"
                  placeholder="Anything else you want us to know?"
                  value={leadForm.notes}
                  onChange={(e) =>
                    handleLeadChange("notes", e.target.value)
                  }
                />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    We’ll reach out by email. No spam.
                  </span>
                  <button
                    type="button"
                    onClick={() => void submitLead()}
                    disabled={leadStatus === "sending"}
                    className="rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {leadStatus === "sending" ? "Sending…" : "Share"}
                  </button>
                </div>
                {leadError && (
                  <p className="text-[10px] text-rose-600">
                    Lead error: {leadError}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
