"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type Status = "idle" | "recording" | "thinking" | "playing" | "error";

interface VoiceResult {
  ok: boolean;
  userText?: string;
  replyText?: string;
  audioBase64?: string;
  audioMimeType?: string;
  error?: string;
  details?: string;
}

export default function VoiceAssistantWidget() {
  const [status, setStatus] = useState<Status>("idle");
  const [lastUserText, setLastUserText] = useState<string | null>(null);
  const [lastReplyText, setLastReplyText] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSending, setContactSending] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  const isRecording = status === "recording";
  const isBusy = status === "thinking" || status === "playing";

  // Auto-scroll conversation area when content changes
  useEffect(() => {
    const el = scrollAreaRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [lastUserText, lastReplyText, errorMessage]);

  const sendContactLead = useCallback(
    async (userText: string | null, replyText: string | null) => {
      if (!contactEmail || !userText || !replyText) {
        // no email or no conversation; nothing to send
        return;
      }

      try {
        setContactSending(true);
        setContactError(null);

        const message = [
          "Voice assistant conversation from pilonqubitventures.com",
          "",
          `User said:`,
          userText,
          "",
          `Assistant replied:`,
          replyText,
        ].join("\n");

        const payload = {
          name: contactName || "Voice assistant visitor",
          email: contactEmail,
          message,
          source: "voice-assistant",
        };

        const res = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        console.log(
          "[VoiceAssistantWidget] /api/contact status:",
          res.status
        );

        let body: unknown = null;
        try {
          body = await res.json();
          console.log(
            "[VoiceAssistantWidget] /api/contact body:",
            body
          );
        } catch {
          // ignore parse error
        }

        if (!res.ok) {
          setContactError("Could not send your details to the team.");
          return;
        }

        setContactSent(true);
      } catch (err) {
        console.error("[VoiceAssistantWidget] /api/contact error:", err);
        setContactError("Unexpected error sending your details.");
      } finally {
        setContactSending(false);
      }
    },
    [contactName, contactEmail]
  );

  const sendAudioToServer = useCallback(
    async (blob: Blob) => {
      try {
        setStatus("thinking");

        const formData = new FormData();
        formData.append("audio", blob, "voice.webm");

        const res = await fetch("/api/voice-assistant", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          console.error("Voice API HTTP error:", res.status, text);
          setStatus("error");
          setErrorMessage("Server error from voice assistant.");
          return;
        }

        const data = (await res.json()) as VoiceResult;

        if (!data.ok) {
          console.error("Voice API returned error:", data);
          setStatus("error");
          setErrorMessage(data.error || "Voice assistant failed.");
          return;
        }

        const userText = data.userText ?? null;
        const replyText = data.replyText ?? null;

        setLastUserText(userText);
        setLastReplyText(replyText);
        setErrorMessage(null);

        // Fire-and-forget contact lead if we have email + conversation
        void sendContactLead(userText, replyText);

        if (data.audioBase64 && data.audioMimeType) {
          setStatus("playing");

          const src = `data:${data.audioMimeType};base64,${data.audioBase64}`;
          const audio = new Audio(src);

          audio.onended = () => {
            setStatus("idle");
          };

          audio.onerror = (e) => {
            console.error("Audio playback error:", e);
            setStatus("error");
            setErrorMessage("Could not play the assistant audio.");
          };

          await audio.play();
        } else {
          // No audio, just text reply
          setStatus("idle");
        }
      } catch (err: any) {
        console.error("sendAudioToServer error:", err);
        setStatus("error");
        setErrorMessage("Unexpected error talking to the assistant.");
      }
    },
    [sendContactLead]
  );

  const startRecording = useCallback(async () => {
    try {
      if (typeof window === "undefined") return;

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setStatus("error");
        setErrorMessage("Your browser does not support microphone capture.");
        return;
      }

      setErrorMessage(null);
      setLastUserText(null);
      setLastReplyText(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
        } catch (err: any) {
          console.error("Error after recording stop:", err);
          setStatus("error");
          setErrorMessage("Something went wrong processing your audio.");
        } finally {
          stream.getTracks().forEach((t) => t.stop());
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setStatus("recording");
    } catch (err: any) {
      console.error("startRecording error:", err);
      setStatus("error");
      setErrorMessage("Could not access your microphone.");
    }
  }, [sendAudioToServer]);

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
    setStatus("thinking");
  }, []);

  const handleMicClick = useCallback(() => {
    if (isBusy) return;

    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isBusy, isRecording, startRecording, stopRecording]);

  const statusLabel = (() => {
    switch (status) {
      case "idle":
        return "Tap and speak";
      case "recording":
        return "Listening… tap again to send";
      case "thinking":
        return "Thinking…";
      case "playing":
        return "Speaking…";
      case "error":
        return "Error – try again";
      default:
        return "";
    }
  })();

  const hasConversation = !!lastUserText || !!lastReplyText;

  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl bg-slate-950/90 p-4 text-slate-50 shadow-xl ring-1 ring-slate-800">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Pilon Qubit AI Concierge
          </p>
          <h2 className="text-lg font-semibold">
            Ask your question out loud. I&apos;ll answer with voice.
          </h2>
          <p className="text-sm text-slate-300">
            Ask about Pilon Qubit Ventures, AI consulting, product builds,
            studio projects, or how to work with us. Short, practical answers
            for founders, investors, and partners.
          </p>
        </div>
      </div>

      {/* Conversation area */}
      <div
        ref={scrollAreaRef}
        className="flex-1 space-y-3 overflow-y-auto rounded-xl bg-slate-900/70 p-3"
      >
        {!hasConversation && !errorMessage && (
          <p className="text-sm text-slate-400">
            Press the microphone, ask your question, then release and wait for
            the answer. I&apos;ll speak back and keep it short.
          </p>
        )}

        {lastUserText && (
          <div className="rounded-lg bg-slate-800/80 px-3 py-2 text-xs text-slate-100">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              You said
            </div>
            <div>{lastUserText}</div>
          </div>
        )}

        {lastReplyText && (
          <div className="rounded-lg bg-cyan-900/40 px-3 py-2 text-xs text-cyan-50">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-cyan-300">
              PQV Assistant
            </div>
            <div>{lastReplyText}</div>
          </div>
        )}

        {errorMessage && (
          <div className="rounded-lg bg-red-900/40 px-3 py-2 text-xs text-red-100">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Contact capture */}
      <div className="space-y-2 rounded-xl bg-slate-900/70 p-3 text-xs">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Share your details
          </span>
          {contactSent && (
            <span className="text-[10px] text-emerald-400">
              Sent to the team
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-400">
          If you want us to follow up, leave your name and email. We&apos;ll
          receive this conversation plus your contact.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            placeholder="Name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="h-8 flex-1 rounded-lg border border-slate-700 bg-slate-950/60 px-2 text-[11px] text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="h-8 flex-1 rounded-lg border border-slate-700 bg-slate-950/60 px-2 text-[11px] text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400"
          />
        </div>
        {contactError && (
          <p className="text-[11px] text-red-300">{contactError}</p>
        )}
        {contactSending && (
          <p className="text-[11px] text-slate-400">
            Sending your details…
          </p>
        )}
      </div>

      {/* Mic button / status */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleMicClick}
          disabled={isBusy}
          className={[
            "flex h-12 flex-1 items-center justify-center gap-2 rounded-full border text-sm font-semibold transition",
            isRecording
              ? "border-red-400 bg-red-500/20 text-red-100 shadow-[0_0_0_1px_rgba(248,113,113,0.5)]"
              : "border-cyan-400/70 bg-cyan-500/15 text-cyan-100 hover:bg-cyan-500/25",
            isBusy ? "opacity-60" : "",
          ].join(" ")}
        >
          <span
            className={[
              "inline-block h-2 w-2 rounded-full",
              isRecording ? "bg-red-400 animate-pulse" : "bg-cyan-400",
            ].join(" ")}
          />
          <span>{statusLabel}</span>
        </button>

        <div className="flex flex-col items-end justify-center">
          <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
            Voice mode
          </span>
          <span className="text-[10px] text-slate-500">
            Uses OpenAI speech models
          </span>
        </div>
      </div>
    </div>
  );
}
