"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * VoiceAssistantWidget — DEBUG VERSION
 * ----------------------------------------------------------
 * This version logs EVERY realtime event to the console so we
 * can identify the correct event types for transcripts and AI
 * text. After inspection, we’ll replace this with production
 * handlers.
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

  // Prevent sending multiple emails for a single session
  const leadSentRef = useRef(false);

  const cleanup = useCallback(() => {
    try {
      if (dcRef.current) dcRef.current.close();
    } catch {}
    try {
      if (pcRef.current) pcRef.current.close();
    } catch {}

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
    return () => cleanup();
  }, [cleanup]);

  // Always send a lead when conversation stops (stub OK)
  const sendTranscriptAsLead = useCallback(async (rawText: string) => {
    if (leadSentRef.current) return;
    leadSentRef.current = true;

    const now = new Date().toISOString();
    const trimmed = rawText.trim();

    const messageBody =
      trimmed.length > 0
        ? `Source: voice-operator\nTimestamp: ${now}\n\nTranscript:\n\n${trimmed}`
        : `Source: voice-operator\nTimestamp: ${now}\n\nNo transcript text captured, but the visitor used the voice assistant.\nRecommend follow-up.`

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Voice Operator Lead",
          email: "no-reply@pilonqubitventures.com",
          phone: "",
          company: "",
          message: messageBody,
          source: "voice-operator",
        }),
      });
    } catch (err) {
      console.error("[VoiceAssistantWidget] Failed sending lead:", err);
    }
  }, []);

  // -----------------------------------------------------
  // START CONVERSATION
  // -----------------------------------------------------
  const startConversation = useCallback(async () => {
    if (status !== "idle") return;

    setError(null);
    setStatus("requesting-permission");
    setTranscript("");
    leadSentRef.current = false;

    try {
      // 1) Get ephemeral key
      const tokenResp = await fetch("/api/realtime", { method: "POST" });
      if (!tokenResp.ok) {
        const text = await tokenResp.text();
        throw new Error(`Realtime session failed: ${text}`);
      }
      const sessionData = await tokenResp.json();
      const ephemeralKey = sessionData?.client_secret?.value;
      if (!ephemeralKey) throw new Error("Missing ephemeral key");

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

      // ------------------------------
      // DEBUG: Log all realtime events
      // ------------------------------
      dc.addEventListener("message", (event) => {
        console.group("%c REALTIME EVENT", "color:cyan; font-weight: bold;");
        try {
          const parsed = JSON.parse(event.data);
          console.log(parsed);

          // We do NOT try to interpret transcripts here.
          // After reviewing logs, we will add correct handlers.

        } catch {
          console.warn("NON-JSON EVENT:", event.data);
        }
        console.groupEnd();
      });

      dc.addEventListener("open", () => {
        console.log("%cDATA CHANNEL OPEN", "color:lime; font-size:14px;");

        const sessionUpdateEvent = {
          type: "session.update",
          session: {
            instructions:
              "You are the AI Operator Assistant for PILON Qubit Ventures.\n" +
              "Keep answers short and professional.\n" +
              "Ask for: name, email, company, phone, project need.\n" +
              "After collecting info, say ONE closing line.\n" +
              "Then remain silent unless the user asks more.\n" +
              "Do NOT loop.\n",
            modalities: ["audio", "text"],
          },
        };

        dc.send(JSON.stringify(sessionUpdateEvent));
        setStatus("listening");
      });

      dc.addEventListener("error", (e) => {
        console.error("[VoiceAssistantWidget] DataChannel error:", e);
        setError("Connection error.");
        setStatus("error");
      });

      // WebRTC SDP negotiation
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
        const t = await sdpResp.text();
        throw new Error(`SDP negotiation failed: ${t}`);
      }

      const answerSdp = await sdpResp.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

      setStatus("listening");
    } catch (err: any) {
      console.error("[VoiceAssistantWidget] Start error:", err);
      setError(err?.message ?? "Unknown error");
      setStatus("error");
      cleanup();
    }
  }, [status, cleanup]);

  // -----------------------------------------------------
  // STOP CONVERSATION
  // -----------------------------------------------------
  const stopConversation = useCallback(() => {
    const textBeforeCleanup = transcript;
    cleanup();
    void sendTranscriptAsLead(textBeforeCleanup);
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

  const statusLabel =
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
      {/* Button */}
      <button
        type="button"
        onClick={toggleOpen}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 text-white shadow-lg"
      >
        🎙️
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="mt-3 w-80 rounded-2xl bg-slate-900/95 p-4 text-slate-50 shadow-2xl backdrop-blur">
          <div className="flex justify-between">
            <div>
              <h2 className="text-sm font-semibold text-cyan-300">
                PILON AI OPERATOR (DEBUG MODE)
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Open DevTools → Console to see realtime events.
              </p>
            </div>

            <button
              onClick={toggleOpen}
              className="text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 bg-slate-800/70 p-2 rounded-xl text-xs">
            <p className="text-cyan-200 font-medium">Status</p>
            <p className="text-slate-200 mt-1">{statusLabel}</p>
            {error && <p className="text-rose-400 mt-1">{error}</p>}
          </div>

          <div className="mt-3 max-h-40 overflow-y-auto bg-slate-800/50 p-2 rounded-xl text-[11px] whitespace-pre-wrap">
            {transcript || (
              <span className="text-slate-500">Transcript will appear here</span>
            )}
          </div>

          <button
            type="button"
            onClick={handlePrimaryClick}
            className={`mt-3 w-full rounded-xl py-2 text-sm font-semibold ${
              status === "idle" || status === "error"
                ? "bg-cyan-500"
                : "bg-rose-500"
            }`}
          >
            {label}
          </button>
        </div>
      )}
    </div>
  );
}
