"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * VoiceAssistantWidget – PRODUCTION + LEAD LOGGING
 *
 * - Floating mic button bottom-right
 * - Opens panel with status + transcript
 * - Connects to /api/realtime to mint an ephemeral session
 * - Uses WebRTC + Realtime API for audio in/out
 * - Listens to response.audio_transcript.delta for assistant transcript
 * - On stop, sends transcript (or stub) to /api/contact as a lead
 * - Logs /api/contact response to console and shows error in UI if it fails
 */

type Status =
  | "idle"
  | "requesting-permission"
  | "connecting"
  | "listening"
  | "responding"
  | "error";

const REALTIME_BASE_URL = "https://api.openai.com/v1/realtime";
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

  // Prevent sending multiple emails for the same conversation
  const leadSentRef = useRef(false);

  const cleanup = useCallback(() => {
    try {
      if (dcRef.current) dcRef.current.close();
    } catch {
      // ignore
    }
    try {
      if (pcRef.current) pcRef.current.close();
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

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Always send a lead when conversation stops (even if transcript is empty)
  const sendTranscriptAsLead = useCallback(
    async (rawText: string) => {
      if (leadSentRef.current) return;
      leadSentRef.current = true;

      const now = new Date().toISOString();
      const trimmed = rawText.trim();

      const messageBody =
        trimmed.length > 0
          ? `Source: voice-operator\nTimestamp: ${now}\n\nAssistant transcript (what the AI said):\n\n${trimmed}`
          : `Source: voice-operator\nTimestamp: ${now}\n\nNo text transcript captured, but the visitor used the voice assistant.\nRecommend follow-up to qualify this lead.`;

      try {
        const resp = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Voice Operator Lead",
            email: "no-reply@pilonqubitventures.com",
            phone: "",
            company: "",
            message: messageBody,
            source: "voice-operator",
          }),
        });

        const respText = await resp.text();

        console.log(
          "[VoiceAssistantWidget] /api/contact status:",
          resp.status,
        );
        console.log("[VoiceAssistantWidget] /api/contact body:", respText);

        if (!resp.ok) {
          setError(
            `Lead email failed (contact API ${resp.status}). Check console/logs.`,
          );
        }
      } catch (err: any) {
        console.error("[VoiceAssistantWidget] Failed to send lead:", err);
        setError(
          err?.message ??
            "Lead email failed due to a network or server error.",
        );
      }
    },
    [setError],
  );

  const startConversation = useCallback(async () => {
    if (status !== "idle") return;

    setError(null);
    setStatus("requesting-permission");
    setTranscript("");
    leadSentRef.current = false; // new session

    try {
      // 1) Get ephemeral key from backend
      const tokenResp = await fetch("/api/realtime", { method: "POST" });
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

      // 2) WebRTC setup
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
      const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = ms;
      ms.getTracks().forEach((t) => pc.addTrack(t, ms));

      // 4) Data channel
      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;

      dc.addEventListener("open", () => {
        const sessionUpdateEvent = {
          type: "session.update",
          session: {
            instructions:
              "You are the AI Operator Assistant for PILON Qubit Ventures.\n\n" +
              "Primary Goals:\n" +
              "1) Understand the visitor's business, goals, pain points, and timeline.\n" +
              "2) Determine whether they need: (a) AI Marketing Automation, (b) AI Consulting & Strategy, " +
              "or (c) Web Development, or a combination.\n" +
              "3) Provide short, practical guidance.\n" +
              "4) Capture lead information with high accuracy.\n\n" +
              "Rules:\n" +
              "- Keep responses short and conversational (2–4 sentences).\n" +
              "- Ask ONE question at a time.\n" +
              "- Ask clarifying questions before making recommendations.\n" +
              "- Before ending, ALWAYS collect: Full Name, Work Email, Company, Phone Number (optional but preferred), " +
              "and a short summary of what they want to build.\n\n" +
              "Final Step (DO NOT LOOP):\n" +
              "- After you have collected the lead details, say once: " +
              "\"Great, I'll package this for the PILON Qubit Ventures team so they can follow up with you.\"\n" +
              "- Then give ONE short closing sentence (for example: \"If you have any other questions, you can ask them now.\").\n" +
              "- After that, STOP speaking. Do NOT repeat this message. Remain silent unless the user clearly asks a new question.\n" +
              "Tone:\n" +
              "- Smart, concise, professional. No hype.",
            modalities: ["audio", "text"],
          },
        };

        dc.send(JSON.stringify(sessionUpdateEvent));
        setStatus("listening");
      });

      dc.addEventListener("message", (event) => {
        try {
          const parsed = JSON.parse(event.data);

          // Assistant speech transcript comes through response.audio_transcript.delta
          if (parsed.type === "response.audio_transcript.delta") {
            const deltaText: string =
              parsed.delta?.text ?? parsed.delta ?? "";
            if (deltaText) {
              setTranscript((prev) =>
                prev.length ? prev + deltaText : deltaText,
              );
            }
          }

          if (
            parsed.type === "response.completed" ||
            parsed.type === "response.done"
          ) {
            setStatus("listening");
          }

          if (parsed.type === "response.started") {
            setStatus("responding");
          }
        } catch {
          // ignore non-JSON
        }
      });

      dc.addEventListener("error", (e) => {
        console.error("[VoiceAssistantWidget] DataChannel error:", e);
        setError("Connection error.");
        setStatus("error");
      });

      // 5) SDP negotiation
      setStatus("connecting");

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpResp = await fetch(
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

      if (!sdpResp.ok) {
        const text = await sdpResp.text();
        throw new Error(`SDP negotiation failed: ${text}`);
      }

      const answerSdp = await sdpResp.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

      setStatus("listening");
    } catch (err: any) {
      console.error("[VoiceAssistantWidget] startConversation error:", err);
      setError(err?.message ?? "Unexpected error starting voice assistant.");
      setStatus("error");
      cleanup();
    }
  }, [cleanup, status]);

  const stopConversation = useCallback(() => {
    const currentTranscript = transcript;
    cleanup();
    void sendTranscriptAsLead(currentTranscript);
  }, [cleanup, sendTranscriptAsLead, transcript]);

  const handlePrimaryClick = async () => {
    if (status === "idle" || status === "error") {
      await startConversation();
    } else {
      stopConversation();
    }
  };

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const label =
    status === "idle" || status === "error" ? "Start Conversation" : "Stop";

  const statusLabel: string =
    status === "idle"
      ? "Idle"
      : status === "requesting-permission"
      ? "Requesting microphone permission…"
      : status === "connecting"
      ? "Connecting to AI operator…"
      : status === "listening"
      ? "Listening… you can speak now."
      : status === "responding"
      ? "Responding…"
      : "Error";

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
        <span className="text-xl font-bold">🎙️</span>
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="mt-3 w-80 max-w-[90vw] rounded-2xl bg-slate-900/95 p-4 text-slate-50 shadow-2xl backdrop-blur">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
                PILON AI OPERATOR
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
