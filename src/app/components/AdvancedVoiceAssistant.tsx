// src/app/components/AdvancedVoiceAssistant.tsx
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  FormEvent,
} from "react";

type AssistantPhase =
  | "idle"
  | "listening"
  | "transcribing"
  | "thinking"
  | "speaking"
  | "error";

type TurnRole = "user" | "assistant";

interface Turn {
  role: TurnRole;
  text: string;
}

interface VoiceResultOK {
  ok: true;
  userText: string;
  replyText: string;
  audioBase64: string;
  audioMimeType: string;
}

interface VoiceResultError {
  ok: false;
  error: string;
  details?: string;
}

type VoiceResult = VoiceResultOK | VoiceResultError;

export default function AdvancedVoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [phase, setPhase] = useState<AssistantPhase>("idle");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSending, setContactSending] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  const isBusy =
    phase === "transcribing" ||
    phase === "thinking" ||
    phase === "speaking";

  // Auto-scroll conversation area when content changes
  useEffect(() => {
    const el = scrollAreaRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [turns, errorMessage]);

  const statusLabel = (() => {
    switch (phase) {
      case "idle":
        return "Tap to speak";
      case "listening":
        return "Listening… tap again to send";
      case "transcribing":
        return "Transcribing your voice…";
      case "thinking":
        return "Thinking about the best answer…";
      case "speaking":
        return "Speaking…";
      case "error":
        return "Error – try again";
      default:
        return "";
    }
  })();

  const sendContactLead = useCallback(async () => {
    if (!contactEmail) {
      setContactError("Please add an email so we can follow up.");
      return;
    }

    if (!turns.length) {
      setContactError("Have a short conversation first, then send it.");
      return;
    }

    try {
      setContactSending(true);
      setContactSent(false);
      setContactError(null);

      const conversationSummary = turns
        .map((t) => {
          const label = t.role === "user" ? "Founder" : "Assistant";
          return `${label}: ${t.text}`;
        })
        .join("\n");

      const payload = {
        name: contactName || "Voice assistant visitor",
        email: contactEmail,
        message: [
          "Advanced voice assistant conversation from pilonqubitventures.com",
          "",
          conversationSummary,
        ].join("\n"),
        source: "advanced-voice-assistant",
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let body: any = null;
      try {
        body = await res.json();
      } catch {
        // ignore
      }

      if (!res.ok || body?.success === false) {
        setContactError("Could not send your details to the team.");
        return;
      }

      setContactSent(true);
    } catch (err) {
      console.error(
        "[AdvancedVoiceAssistant] /api/contact error:",
        err
      );
      setContactError("Unexpected error sending your details.");
    } finally {
      setContactSending(false);
    }
  }, [contactEmail, contactName, turns]);

  const sendAudioToServer = useCallback(
    async (blob: Blob) => {
      try {
        setPhase("transcribing");
        setErrorMessage(null);

        const formData = new FormData();
        formData.append("audio", blob, "voice.webm");
        formData.append(
          "history",
          JSON.stringify(
            turns.map((t) => ({
              role: t.role,
              content: t.text,
            }))
          )
        );

        const res = await fetch("/api/voice-assistant", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          console.error(
            "[AdvancedVoiceAssistant] voice API HTTP error:",
            res.status,
            text
          );
          setPhase("error");
          setErrorMessage("Server error from voice assistant.");
          return;
        }

        const data = (await res.json()) as VoiceResult;

        if (!data.ok) {
          console.error(
            "[AdvancedVoiceAssistant] voice API logical error:",
            data
          );
          setPhase("error");
          setErrorMessage(
            data.error || "Voice assistant returned an error."
          );
          return;
        }

        const userText = data.userText?.trim();
        const replyText = data.replyText?.trim();

        const newTurns: Turn[] = [...turns];

        if (userText) {
          newTurns.push({ role: "user", text: userText });
        }

        if (replyText) {
          newTurns.push({ role: "assistant", text: replyText });
        }

        setTurns(newTurns);

        // Play the assistant audio if provided
        if (data.audioBase64 && data.audioMimeType) {
          setPhase("speaking");
          const src = `data:${data.audioMimeType};base64,${data.audioBase64}`;
          const audio = new Audio(src);

          audio.onended = () => {
            setPhase("idle");
          };

          audio.onerror = (e) => {
            console.error(
              "[AdvancedVoiceAssistant] audio playback error:",
              e
            );
            setPhase("error");
            setErrorMessage("Could not play the assistant audio.");
          };

          await audio.play();
        } else {
          setPhase("idle");
        }
      } catch (err) {
        console.error(
          "[AdvancedVoiceAssistant] sendAudioToServer error:",
          err
        );
        setPhase("error");
        setErrorMessage(
          "Unexpected error sending audio to the assistant."
        );
      }
    },
    [turns]
  );

  const startRecording = useCallback(async () => {
    try {
      if (typeof window === "undefined") return;

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setPhase("error");
        setErrorMessage(
          "Your browser does not support microphone capture."
        );
        return;
      }

      setErrorMessage(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const recorder = new MediaRecorder(stream);

      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        try {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          chunksRef.current = [];

          await sendAudioToServer(blob);
        } catch (err) {
          console.error(
            "[AdvancedVoiceAssistant] error after recording stop:",
            err
          );
          setPhase("error");
          setErrorMessage(
            "Something went wrong processing your recording."
          );
        } finally {
          stream.getTracks().forEach((t) => t.stop());
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setPhase("listening");
    } catch (err) {
      console.error(
        "[AdvancedVoiceAssistant] startRecording error:",
        err
      );
      setPhase("error");
      setErrorMessage("Could not access your microphone.");
    }
  }, [sendAudioToServer]);

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
    setPhase("transcribing");
  }, []);

  const handleMicClick = useCallback(() => {
    if (phase === "listening") {
      stopRecording();
    } else if (!isBusy) {
      startRecording();
    }
  }, [phase, isBusy, startRecording, stopRecording]);

  const handleReset = useCallback(() => {
    setTurns([]);
    setErrorMessage(null);
    setPhase("idle");
  }, []);

  const hasConversation = turns.length > 0;

  // Optional: small fallback for users who cannot use mic but want to type
  const [manualInput, setManualInput] = useState("");
  const handleManualSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const text = manualInput.trim();
      if (!text) return;

      setManualInput("");
      setTurns((prev) => [...prev, { role: "user", text }]);
      setPhase("thinking");
      setErrorMessage(null);

      try {
        const res = await fetch("/api/voice-assistant-text", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userText: text,
            history: turns,
          }),
        });

        if (!res.ok) {
          const msg = await res.text().catch(() => "");
          console.error(
            "[AdvancedVoiceAssistant] text fallback HTTP error:",
            res.status,
            msg
          );
          setPhase("error");
          setErrorMessage("Assistant error on text input.");
          return;
        }

        const data = (await res.json()) as {
          ok: boolean;
          replyText?: string;
          error?: string;
        };

        if (!data.ok || !data.replyText) {
          setPhase("error");
          setErrorMessage(
            data.error || "Assistant could not generate a reply."
          );
          return;
        }

        setTurns((prev) => [
          ...prev,
          { role: "assistant", text: data.replyText! },
        ]);
        setPhase("idle");
      } catch (err) {
        console.error(
          "[AdvancedVoiceAssistant] text fallback error:",
          err
        );
        setPhase("error");
        setErrorMessage("Unexpected error on text input.");
      }
    },
    [manualInput, turns]
  );

  return (
    <>
      {/* Floating launcher button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          fixed bottom-6 right-6 z-50
          flex h-14 w-14 items-center justify-center
          rounded-full border border-cyan-400/60
          bg-slate-950/90 text-[11px] font-semibold text-cyan-50
          shadow-[0_10px_40px_rgba(15,23,42,0.9)]
          hover:scale-105 hover:border-cyan-300 hover:shadow-[0_16px_60px_rgba(8,47,73,0.9)]
          transition
        "
        aria-label="Open PILON Qubit AI voice assistant"
      >
        <div className="flex flex-col items-center leading-tight">
          <span className="text-[10px] uppercase tracking-[0.16em] text-cyan-300">
            AI
          </span>
          <span>Concierge</span>
        </div>
      </button>

      {/* Assistant panel */}
      {isOpen && (
        <div
          className="
            fixed bottom-24 right-6 z-50
            w-[380px] max-w-[92vw]
            rounded-2xl border border-slate-800
            bg-slate-950/95 backdrop-blur-xl
            shadow-[0_24px_80px_rgba(15,23,42,0.95)]
            flex flex-col overflow-hidden
          "
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 border-b border-slate-800 px-4 pt-3 pb-2">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                PILON Qubit AI Concierge
              </p>
              <p className="text-sm font-semibold text-slate-50">
                Voice-first assistance for founders & operators
              </p>
              <p className="text-[11px] text-slate-400">
                Describe your situation out loud. I&apos;ll respond with a
                clear, actionable plan and you can send the transcript to the
                team in one tap.
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

          {/* Conversation */}
          <div
            ref={scrollAreaRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-[12px]"
          >
            {!hasConversation && !errorMessage && (
              <p className="text-[12px] text-slate-400">
                Tap the mic, speak naturally about your product, funnel, or
                tech stack. When you tap again, I&apos;ll transcribe,
                analyze, and respond with next steps.
              </p>
            )}

            {turns.map((t, idx) => (
              <div
                key={idx}
                className={
                  t.role === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                <div
                  className={
                    t.role === "user"
                      ? "max-w-[80%] rounded-lg bg-slate-800 px-3 py-2 text-slate-50"
                      : "max-w-[80%] rounded-lg bg-cyan-900/40 px-3 py-2 text-cyan-50"
                  }
                >
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    {t.role === "user" ? "You" : "PQV Assistant"}
                  </div>
                  <div className="whitespace-pre-wrap">{t.text}</div>
                </div>
              </div>
            ))}

            {errorMessage && (
              <div className="rounded-lg bg-red-900/40 px-3 py-2 text-[12px] text-red-100">
                {errorMessage}
              </div>
            )}
          </div>

          {/* Contact capture */}
          <div className="border-t border-slate-800 bg-slate-950/90 px-4 py-3 text-[11px]">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Send this to the team
              </span>
              {contactSent && (
                <span className="text-[10px] text-emerald-400">
                  Conversation sent
                </span>
              )}
            </div>
            <p className="mb-2 text-[11px] text-slate-400">
              Add your details and we&apos;ll receive this conversation at{" "}
              <span className="font-medium text-slate-200">
                hello@pilonqubitventures.com
              </span>{" "}
              with context included.
            </p>
            <div className="mb-2 flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                placeholder="Name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="h-8 flex-1 rounded-lg border border-slate-700 bg-slate-950/70 px-2 text-[11px] text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400"
              />
              <input
                type="email"
                placeholder="Email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="h-8 flex-1 rounded-lg border border-slate-700 bg-slate-950/70 px-2 text-[11px] text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400"
              />
            </div>
            {contactError && (
              <p className="text-[11px] text-red-300">{contactError}</p>
            )}
            {contactSending && (
              <p className="text-[11px] text-slate-400">
                Sending your conversation…
              </p>
            )}
            <div className="mt-2 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={sendContactLead}
                className="rounded-full bg-cyan-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-cyan-500 disabled:opacity-60"
                disabled={contactSending || !turns.length}
              >
                Send conversation to team
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="text-[10px] text-slate-400 hover:text-slate-200"
              >
                Reset conversation
              </button>
            </div>
          </div>

          {/* Mic + optional manual input */}
          <div className="border-t border-slate-800 bg-slate-950 px-4 py-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleMicClick}
                className={[
                  "flex h-11 flex-1 items-center justify-center gap-2 rounded-full border text-[12px] font-semibold transition",
                  phase === "listening"
                    ? "border-rose-400 bg-rose-500/20 text-rose-50 shadow-[0_0_0_1px_rgba(248,113,113,0.6)]"
                    : "border-cyan-400/70 bg-cyan-500/15 text-cyan-50 hover:bg-cyan-500/25",
                  isBusy ? "opacity-70" : "",
                ].join(" ")}
                disabled={phase === "transcribing" || phase === "thinking"}
              >
                <span
                  className={[
                    "inline-block h-2 w-2 rounded-full",
                    phase === "listening"
                      ? "bg-rose-400 animate-pulse"
                      : "bg-cyan-400",
                  ].join(" ")}
                />
                <span>{statusLabel}</span>
              </button>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
                  Voice mode
                </span>
                <span className="text-[10px] text-slate-500">
                  Uses OpenAI speech + chat
                </span>
              </div>
            </div>

            <form
              onSubmit={handleManualSubmit}
              className="flex items-center gap-2"
            >
              <input
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="No mic? Type a quick question instead…"
                className="h-8 flex-1 rounded-lg border border-slate-700 bg-slate-950/80 px-2 text-[11px] text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400"
              />
              <button
                type="submit"
                className="h-8 rounded-lg bg-slate-800 px-3 text-[11px] text-slate-100 hover:bg-slate-700"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
