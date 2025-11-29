"use client";

import { useState, FormEvent } from "react";

type BubbleState = "idle" | "submitting" | "success" | "error";

export default function AIContactBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<BubbleState>("idle");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!name || !email || !message) {
      return;
    }

    try {
      setState("submitting");

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          source: "ai-contact-bubble",
        }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      setState("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setState("error");
    } finally {
      setTimeout(() => {
        setState("idle");
      }, 4000);
    }
  }

  return (
    <>
      {/* Floating bubble button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          fixed bottom-6 right-6 z-40
          flex items-center justify-center
          h-14 w-14 rounded-full
          shadow-lg border border-white/20
          bg-gradient-to-r from-slate-900 to-slate-700
          text-sm font-semibold
          hover:scale-105 hover:shadow-xl
          transition-transform transition-shadow
        "
        aria-label="Open AI assistant"
      >
        <span className="text-xs leading-tight">
          AI
          <br />
          Help
        </span>
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          className="
            fixed bottom-24 right-6 z-40
            w-80 max-w-[90vw]
            rounded-2xl border border-slate-800
            bg-slate-950/95 backdrop-blur
            shadow-2xl
            text-slate-50
            p-4
          "
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-400">
                PILON Qubit
              </div>
              <div className="text-sm font-semibold">
                AI Contact Assistant
              </div>
              <p className="mt-1 text-xs text-slate-300">
                Tell us what you need. We will email you back with next steps.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-100"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2 mt-2">
            <div className="space-y-1">
              <label className="block text-xs text-slate-300">
                Name
              </label>
              <input
                className="
                  w-full rounded-md border border-slate-700
                  bg-slate-900/60 px-2 py-1.5
                  text-xs text-slate-50
                  outline-none focus:border-sky-500
                "
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs text-slate-300">
                Email
              </label>
              <input
                type="email"
                className="
                  w-full rounded-md border border-slate-700
                  bg-slate-900/60 px-2 py-1.5
                  text-xs text-slate-50
                  outline-none focus:border-sky-500
                "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs text-slate-300">
                What are you trying to build or fix?
              </label>
              <textarea
                className="
                  w-full rounded-md border border-slate-700
                  bg-slate-900/60 px-2 py-1.5
                  text-xs text-slate-50
                  outline-none focus:border-sky-500
                  resize-none
                "
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={state === "submitting"}
              className="
                mt-1 w-full rounded-md
                bg-sky-600 px-3 py-1.5
                text-xs font-semibold text-white
                hover:bg-sky-500 disabled:opacity-60
              "
            >
              {state === "submitting"
                ? "Sending..."
                : "Send to PILON Qubit"}
            </button>

            {state === "success" && (
              <p className="mt-1 text-[11px] text-emerald-400">
                Got it. We will follow up at your email.
              </p>
            )}

            {state === "error" && (
              <p className="mt-1 text-[11px] text-rose-400">
                Something went wrong. Please try again or use the main contact form.
              </p>
            )}

            <p className="mt-1 text-[10px] text-slate-500">
              This assistant just collects your info and sends it to our team. No spam. No reselling.
            </p>
          </form>
        </div>
      )}
    </>
  );
}
