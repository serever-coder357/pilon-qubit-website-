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

  // Placeholder for future phases (realtime voice + lead capture)
  const handlePrimaryCTA = () => {
    console.log("[RealtimeConcierge] Primary CTA clicked (no realtime yet).");
  };

  const handleQuickAction = (label: string) => {
    console.log(`[RealtimeConcierge] Quick action clicked: ${label}`);
  };

  if (state === "closed") {
    return (
      <button
        type="button"
        onClick={() => setState("open")}
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
      {/* Floating button (minimized) */}
      {state === "minimized" && (
        <button
          type="button"
          onClick={() => setState("open")}
          className="fixed bottom-4 right-4 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg shadow-sky-600/40 transition hover:scale-105 hover:bg-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
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
                  Smart assistant for your growth questions
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-300">
                Preview
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
              I&apos;m your AI concierge for Pilon Qubit Ventures. Soon you&apos;ll
              be able to talk to me in realtime about strategy, marketing, and
              web builds. For now, this is a preview of the experience.
            </p>

            <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2.5 text-xs text-slate-300">
              <p className="font-semibold text-slate-100">
                Ask me about, for example:
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    handleQuickAction("How Pilon Qubit can help my business")
                  }
                  className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-slate-100 shadow-sm transition hover:border-sky-500 hover:bg-slate-900 hover:text-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  How can you help my business?
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleQuickAction("Timeline and process for a new website")
                  }
                  className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-slate-100 shadow-sm transition hover:border-sky-500 hover:bg-slate-900 hover:text-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  What does the website process look like?
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleQuickAction("Pricing and engagement models")
                  }
                  className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-slate-100 shadow-sm transition hover:border-sky-500 hover:bg-slate-900 hover:text-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  How do pricing and retainers work?
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2.5 text-xs text-slate-300">
              <p className="font-semibold text-slate-100">
                What&apos;s coming next:
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-4">
                <li>Realtime voice conversations with visitors.</li>
                <li>Page-aware answers (knows which service they are reading).</li>
                <li>Instant lead capture to your email / CRM.</li>
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
                Realtime voice is in development
              </button>
              <p className="text-[11px] leading-snug text-slate-400">
                This preview is safe and static: no mic, no background calls,
                and no data is sent anywhere yet. Next step is wiring this into
                realtime voice and lead capture.
              </p>
            </div>
          </footer>
        </section>
      )}
    </>
  );
};

export default RealtimeConciergeWidget;
