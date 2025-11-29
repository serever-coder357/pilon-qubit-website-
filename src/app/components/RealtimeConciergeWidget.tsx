// src/app/components/RealtimeConciergeWidget.tsx
"use client";

import React, { useState } from "react";

type ConciergeState = "closed" | "minimized" | "open";

const RealtimeConciergeWidget: React.FC = () => {
  const [state, setState] = useState<ConciergeState>("closed");

  const isOpen = state === "open";

  const handleToggle = () => {
    setState((prev) => (prev === "open" ? "minimized" : "open"));
  };

  const handleClose = () => {
    setState("closed");
  };

  // In future phases, this will trigger:
  // - Mic permission
  // - Realtime session init
  // - Transcript + UI streaming updates
  const handlePrimaryCTA = () => {
    // Placeholder for Phase 2+:
    // e.g., startRealtimeSession(), openMic(), etc.
    console.log("[RealtimeConcierge] Primary CTA clicked (no realtime yet).");
  };

  if (state === "closed") {
    return (
      <button
        type="button"
        onClick={() => setState("open")}
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg shadow-sky-600/40 transition hover:scale-105 hover:bg-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
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
      {/* Floating button (minimized or open) */}
      {state === "minimized" && (
        <button
          type="button"
          onClick={() => setState("open")}
          className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg shadow-sky-600/40 transition hover:scale-105 hover:bg-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          aria-label="Open Pilon Qubit Concierge"
        >
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/90 text-xs font-semibold uppercase tracking-wide">
            AI
          </span>
        </button>
      )}

      {/* Panel */}
      {isOpen && (
        <section
          aria-label="Pilon Qubit Realtime Concierge"
          className="fixed bottom-4 right-4 z-50 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/95 text-slate-50 shadow-2xl shadow-slate-950/80 backdrop-blur-md"
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
                  Realtime assistant shell · Phase 1
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-300">
                Alpha
              </span>
              <button
                type="button"
                onClick={() => setState("minimized")}
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

          {/* Body */}
          <div className="flex flex-col gap-3 px-4 py-3 text-sm">
            <p className="text-slate-200">
              This is your future realtime concierge. In this phase it&apos;s a
              safe, non-realtime shell — no mic, no streaming, no backend
              dependency.
            </p>

            <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2.5 text-xs text-slate-300">
              <p className="font-semibold text-slate-100">
                What it will do soon:
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-4">
                <li>Talk to visitors in realtime (voice + text).</li>
                <li>Understand page context and your offers.</li>
                <li>Capture qualified leads to your email / CRM.</li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2.5 text-xs text-slate-300">
              <p className="font-semibold text-slate-100">
                Phase 1 (current):
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-4">
                <li>UI shell and UX anchor point.</li>
                <li>No external services required.</li>
                <li>Safe to ship to production now.</li>
              </ul>
            </div>
          </div>

          {/* Footer / CTA */}
          <footer className="border-t border-slate-800/80 bg-slate-950/90 px-4 py-3">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handlePrimaryCTA}
                className="inline-flex w-full items-center justify-center rounded-xl bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-sky-600/40 transition hover:bg-sky-500 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
                disabled
              >
                Realtime voice coming in Phase 2
              </button>
              <p className="text-[11px] leading-snug text-slate-400">
                Deployed as a feature-flagged shell so we can safely wire in
                realtime voice + lead capture later without touching the rest of
                your site.
              </p>
            </div>
          </footer>
        </section>
      )}
    </>
  );
};

export default RealtimeConciergeWidget;
