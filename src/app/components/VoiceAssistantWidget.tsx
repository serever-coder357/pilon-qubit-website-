"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * Simple realtime voice assistant widget using OpenAI Realtime + WebRTC.
 * - Floating button bottom-right
 * - Click to open/close
 * - "Start / Stop conversation" controls
 * - Streams mic audio to OpenAI and plays voice replies
 *
 * NOTE: This is a baseline. Once working, we can refine UI/UX and
 * integrate tightly with your contact route to push captured leads.
 */

type Status =
  | "idle"
  | "requesting-permission"
  | "connecting"
  | "listening"
  | "responding"
  | "error";

const REALTIME_BASE_URL = "https://api.openai.com/v1/realtime";
// Optional NEXT_PUBLIC env for model override; otherwise we match backend default
const REALTIME_MODEL =
  process.env.NEXT_PUBLIC_OPENAI_REALTIME_MODEL ??
  "gpt-4o-realtime-preview-2024-12-17";

export function VoiceAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>("");

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Helper: clean up WebRTC + media
  const cleanup = useCallback(() => {
    try {
      if (dcRef.current) {
        dcRef.current.close();
      }
    } catch {
      // ignore
    }
    try {
      if (pcRef.current) {
        pcRef.current.close();
      }
    } catch {
      // ignore
    }
    pcRef.current = null;
    dcRef.current = null;

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }

    if (audioElementRef.current) {
      audioElementRef.current.srcObject = null;
      audioElementRef.current = null;
    }

    setStatus("idle");
  }, []);

  // Ensure cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const startConversation = useCallback(async () => {
    if (status !== "idle") {
      return;
    }

    setError(null);
    setStatus("requesting-permission");

    try {
      // 1) Get ephemeral key from our Next.js API
      const tokenResp = await fetch("/api/realtime", {
        method: "POST",
      });

      if (!tokenResp.ok) {
        const text = await tokenResp.text();
        throw new Error(
          `Failed to create realtime session: ${tokenResp.status} ${text}`,
        );
      }

      const sessionData = await tokenResp.json();

      const ephemeralKey: string | undefined =
        sessionData?.client_secret?.value;

      if (!ephemeralKey) {
        throw new Error("No ephemeral key returned from /api/realtime");
      }

      // 2) Setup RTCPeerConnection + audio
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      audioElementRef.current = audioEl;

      pc.ontrack = (e) => {
        if (!audioElementRef.current) return;
        audioElementRef.current.srcObject = e.streams[0];
      };

      // 3) Mic input
      const ms = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      micStreamRef.current = ms;
      ms.getTracks().forEach((track) => pc.addTrack(track, ms));

      // 4) Data channel for realtime events
      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;

      dc.addEventListener("open", () => {
        // When channel is open, we are ready to send events
        // We immediately send a session.update to confirm modalities and instructions
        const sessionUpdateEvent = {
          type: "session.update",
          session: {
            instructions:
              "You are the AI operator assistant for PILON Qubit Ventures, " +
              "an AI & frontier tech consulting firm in San Antonio, TX. " +
              "Your job is to quickly understand the user's business and " +
              "goals, then recommend the best of these: " +
              "(1) AI Marketing Automation, " +
              "(2) Frontier AI Consulting, " +
              "(3) Web Development. " +
              "Keep replies short and practical. " +
              "Before the conversation ends, ask for the user's name, email, " +
              "company, and phone so the team can follow up. " +
              "Speak in a friendly, operator-style tone.",
            modalities: ["audio", "text"],
          },
        };

        dc.send(JSON.stringify(sessionUpdateEvent));
        setStatus("listening");
      });

      dc.addEventListener("message", (event) => {
        try {
          const parsed = JSON.parse(event.data);

          // Debug: log all events in devtools
          // console.log("[Realtime event]", parsed);

          // Handle transcription events so we can show "what you said"
          if (
            parsed.type ===
              "conversation.item.input_audio_transcription.completed" &&
            parsed.transcript
          ) {
            setTranscript((prev) =>
              prev.length
                ? `${prev}\nYou: ${parsed.transcript}`
                : `You: ${parsed.transcript}`,
            );
          }

          // Handle text output deltas when present
          if (parsed.type === "response.output_text.delta") {
            const delta = parsed.delta?.text ?? parsed.delta;
            if (delta) {
              setTranscript((prev) =>
                prev.length ? `${prev}${delta}` : `Assistant: ${delta}`,
              );
            }
          }

          if (parsed.type === "response.output_text.done") {
            setTranscript((prev) => `${prev}\n`);
          }

          if (parsed.type === "response.started") {
            setStatus("responding");
          }

          if (parsed.type === "response.completed" || parsed.type === "response.done") {
            setStatus("listening");
          }
        } catch {
          // Not JSON or unknown; ignore
        }
      });

      dc.addEventListener("error", (e) => {
        console.error("[VoiceAssistantWidget] DataChannel error", e);
        setError("Connection error.");
        setStatus("error");
      });

      // 5) Start SDP negotiation with Realtime API
      setStatus("connecting");

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpResponse = await fetch(
        `${REALTIME_BASE_URL}?model=${encodeURIComponent(REALTIME_MODEL)}`,
        {
          method: "POST",
          body: offer.sdp,
          headers: {
            Authorization: `Bearer ${ephemeralKey}`,
            "Content-Type": "application/sdp",
          },
        },
      );

      if (!sdpResponse.ok) {
        const text = await sdpResponse.text();
        throw new Error(`SDP negotiation failed: ${text}`);
      }

      const answerSdp = await sdpResponse.text();
      await pc.setRemoteDescription({
        type: "answer",
        sdp: answerSdp,
      });

      setStatus("listening");
    } catch (err: any) {
      console.error("[VoiceAssistantWidget] startConversation error:", err);
      setError(err?.message ?? "Unexpected error starting voice assistant.");
      setStatus("error");
      cleanup();
    }
  }, [cleanup, status]);

  const stopConversation = useCallback(() => {
    cleanup();
  }, [cleanup]);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const handlePrimaryClick = async () => {
    if (status === "idle" || status === "error") {
      await startConversation();
    } else {
      stopConversation();
    }
  };

  const label =
    status === "idle" || status === "error" ? "Start Conversation" : "Stop";

  const statusLabel: string = (() => {
    switch (status) {
      case "idle":
        return "Idle";
      case "requesting-permission":
        return "Requesting microphone permission…";
      case "connecting":
        return "Connecting to AI operator…";
      case "listening":
        return "Listening… you can speak now.";
      case "responding":
        return "Responding…";
      case "error":
        return "Error";
      default:
        return "";
    }
  })();

  // Hide entirely on server render
  if (typeof window === "undefined") return null;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Floating bubble */}
      <button
        type="button"
        onClick={toggleOpen}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 text-white shadow-lg outline-none ring-cyan-300 transition hover:bg-cyan-400 focus-visible:ring-2"
        aria-label="Open AI voice assistant"
      >
        {/* Simple mic icon */}
        <span className="text-xl font-bold">🎙️</span>
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="mt-3 w-80 max-w-[90vw] rounded-2xl bg-slate-900/95 p-4 text-slate-50 shadow-2xl backdrop-blur">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
                PILON AI Operator
              </h2>
              <p className="mt-1 text-xs text-slate-300">
                Ask about AI marketing, AI consulting, or web dev. We&apos;ll
                keep it short and practical.
              </p>
            </div>
            <button
              type="button"
              onClick={toggleOpen}
              className="rounded-full px-2 text-xs text-slate-400 hover:text-slate-200"
              aria-label="Close voice assistant"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 rounded-xl bg-slate-800/80 p-2 text-xs">
            <p className="font-medium text-cyan-200">Status</p>
            <p className="mt-1 text-[11px] text-slate-200">{statusLabel}</p>
            {error && (
              <p className="mt-1 text-[11px] text-rose-400">
                Error: {error || "Something went wrong."}
              </p>
            )}
          </div>

          <div className="mt-3 max-h-40 overflow-y-auto rounded-xl bg-slate-800/60 p-2 text-[11px] leading-snug text-slate-100">
            {transcript ? (
              <pre className="whitespace-pre-wrap font-mono text-[11px]">
                {transcript}
              </pre>
            ) : (
              <p className="text-slate-400">
                When you speak, we&apos;ll show key transcript snippets here.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handlePrimaryClick}
            className={`mt-3 flex w-full items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold shadow-md outline-none ring-cyan-400 transition focus-visible:ring-2 ${
              status === "idle" || status === "error"
                ? "bg-cyan-500 hover:bg-cyan-400 text-slate-900"
                : "bg-rose-500 hover:bg-rose-400 text-slate-50"
            }`}
          >
            {label}
          </button>

          <p className="mt-2 text-[10px] text-slate-400">
            By using this assistant you agree that your audio may be processed
            by OpenAI to power the conversation.
          </p>
        </div>
      )}
    </div>
  );
}
