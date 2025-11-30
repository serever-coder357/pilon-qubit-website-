"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useRealtimeVoice, RealtimeVoiceToggle } from "./RealtimeVoiceClient";

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

type LeadStatus = "idle" | "sending" | "error";

export default function RealtimeConciergeWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const [leadForm, setLeadForm] = useState<LeadFormState>(initialLeadForm);
  const [leadStatus, setLeadStatus] = useState<LeadStatus>("idle");
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

  const isVoiceLive = voiceStatus === "live";

  // Open/close bubble – now also controls voice
  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;

      // Opening: auto-start voice session
      if (!prev && next) {
        // This is guaranteed to be in a real user click handler.
        // If anything is going to satisfy browser permission rules, it's this.
        void startVoice();
      }

      // Closing while voice live: stop the session
      if (prev && !next && isVoiceLive) {
        stopVoice();
      }

      return next;
    });
  }, [startVoice, stopVoice, isVoiceLive]);

  // Aggressive auto-minimize: close as soon as user scrolls page a bit
  useEffect(() => {
    function onScroll() {
      if (isOpen && window.scrollY > 50) {
        setIsOpen(false);
        if (isVoiceLive) {
          stopVoice();
        }
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isOpen, isVoiceLive, stopVoice]);

  const handleLeadChange = useCallback(
    (field: keyof LeadFormState, value: string) => {
      setLeadForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

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
          source: "realtime-concierge-voice-only",
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Lead API error (${res.status}): ${txt}`);
      }

      await res.json().catch(() => ({}));
      setLeadSuccess("Got it. We will follow up at the email you provided.");
      setLeadStatus("idle");
      setLeadForm(initialLeadForm);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setLeadError(msg);
      setLeadStatus("error");
    }
  }, [leadForm, leadStatus, pageContext]);

  return (
    <>
      {/* Bigger, glowing floating bubble */}
      <button
        type="button"
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white shadow-xl shadow-slate-900/40 ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950/60 transition hover:scale-110 hover:bg-slate-800 animate-pulse"
        aria-label={isOpen ? "Close AI Concierge" : "Open AI Concierge"}
      >
        {isOpen ? "×" : "Talk"}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 flex w-[340px] max-h-[70vh] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/20">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                Pilon Qubit Concierge
              </span>
              <span className="text-sm text-slate-600">
                Live voice conversation
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span
                className={`h-2 w-2 rounded-full ${
                  isVoiceLive ? "bg-emerald-500" : "bg-slate-300"
                }`}
              />
              {isVoiceLive ? "Listening" : "Idle"}
            </div>
          </div>

          {/* Body with internal scroll; voice controls at very top */}
          <div className="flex max-h-[52vh] flex-col overflow-y-auto bg-slate-50/60">
            {/* Voice section: toggle still shows status + Stop, but Start is auto on open */}
            <div className="px-4 pt-3 pb-2 text-sm text-slate-800">
              <RealtimeVoiceToggle
                status={voiceStatus}
                error={voiceError}
                onStart={() => {
                  // Secondary Start hook in case auto-start fails
                  void startVoice();
                }}
                onStop={() => {
                  stopVoice();
                }}
              />

              <p className="mt-3 mb-1 text-xs text-slate-600">
                I’ll start listening as soon as the widget opens (or when you
                tap Start). Speak naturally – I’ll answer in realtime and help
                you understand if Pilon Qubit Ventures is a fit.
              </p>
              <ul className="mb-2 list-disc pl-4 text-[11px] text-slate-500">
                <li>Clarify what you are building.</li>
                <li>Discuss stage, capital, and support you need.</li>
                <li>
                  When you are ready, leave your details so we can follow up.
                </li>
              </ul>
            </div>

            {/* Lead capture mini-form */}
            <div className="mt-1 border-t border-slate-200 bg-white px-4 py-3">
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
