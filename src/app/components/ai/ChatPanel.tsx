"use client";

import React, { useCallback, useRef, useState } from "react";

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

interface ChatPanelProps {
  onClose?: () => void;
}

export default function ChatPanel({ onClose }: ChatPanelProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [lastUserText, setLastUserText] = useState<string | null>(null);
  const [lastReplyText, setLastReplyText] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<string>("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const recognitionRef = useRef<any>(null);

  const isRecording = status === "recording";
  const isBusy = status === "thinking" || status === "playing";

  const stopBrowserRecognition = () => {
    const recognition = recognitionRef.current;
    if (recognition) {
      try {
        recognition.onresult = null;
        recognition.onend = null;
        recognition.onerror = null;
        recognition.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
  };

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

        // Prefer what the user saw live, but fall back to server text.
        const finalUserText =
          (liveTranscript && liveTranscript.trim()) ||
          data.userText ||
          null;

        setLastUserText(finalUserText);
        setLastReplyText(data.replyText ?? null);
        setErrorMessage(null);
        setLiveTranscript("");

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
    [liveTranscript]
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
      setLiveTranscript("");
      setLastUserText(null);
      setLastReplyText(null);

      // Start microphone recording (for the server)
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
          stopBrowserRecognition();
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();

      // Start browser-side speech recognition for live transcript (best-effort).
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let text = "";
          for (let i = 0; i < event.results.length; i++) {
            const result = event.results[i];
            if (result && result[0] && result[0].transcript) {
              text += result[0].transcript + " ";
            }
          }
          setLiveTranscript(text.trim());
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event);
        };

        recognition.onend = () => {
          // We let the recorder.onstop finish the flow.
        };

        try {
          recognition.start();
        } catch (err) {
          console.warn("Speech recognition start failed:", err);
        }
      }

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
    // We mark as thinking while the server processes the audio.
    setStatus("thinking");
    // Stop browser recognition immediately so we don't keep updating text.
    stopBrowserRecognition();

    // If we already have a transcript, show it as "You said" right away.
    if (liveTranscript && liveTranscript.trim()) {
      setLastUserText(liveTranscript.trim());
    }
  }, [liveTranscript]);

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

  const hasHistory = !!lastUserText || !!lastReplyText;

  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl bg-slate-950/90 p-4 text-slate-50 shadow-xl ring-1 ring-slate-800">
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

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white"
            aria-label="Close assistant"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex-1 space-y-3 overflow-hidden rounded-xl bg-slate-900/70 p-3">
        {!hasHistory && !liveTranscript && (
          <p className="text-sm text-slate-400">
            Press the microphone, start talking, and you&apos;ll see your words
            appear as you speak (in supported browsers). When you stop, I&apos;ll
            think for a moment and then reply with voice.
          </p>
        )}

        {liveTranscript && status === "recording" && (
          <div className="rounded-lg border border-cyan-500/40 bg-slate-900/80 px-3 py-2 text-xs text-slate-100">
            <div className="mb-1 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wide text-cyan-300">
              <span>Listening live</span>
              <span className="animate-pulse text-[9px] text-cyan-400">
                Transcribing…
              </span>
            </div>
            <div>{liveTranscript}</div>
          </div>
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
            Uses browser speech + OpenAI speech models
          </span>
        </div>
      </div>
    </div>
  );
}
