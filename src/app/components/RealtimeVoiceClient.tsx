"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type VoiceStatus =
  | "idle"
  | "requesting-mic"
  | "requesting-token"
  | "connecting"
  | "live"
  | "stopping"
  | "error";

type RealtimeSessionTokenResponse = {
  client_secret: string;
  model?: string;
};

type UseRealtimeVoiceOptions = {
  onLog?: (msg: string) => void;
};

export function useRealtimeVoice(options?: UseRealtimeVoiceOptions) {
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);

  const log = useCallback(
    (msg: string) => {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.log("[RealtimeVoice]", msg);
      }
      options?.onLog?.(msg);
    },
    [options],
  );

  const hardStop = useCallback(() => {
    log("Stopping realtime voice session");
    setStatus("stopping");

    try {
      if (dataChannelRef.current) dataChannelRef.current.close();
    } catch {
      // ignore
    }
    dataChannelRef.current = null;

    try {
      if (pcRef.current) {
        pcRef.current.ontrack = null;
        pcRef.current.onicecandidate = null;
        pcRef.current.close();
      }
    } catch {
      // ignore
    }
    pcRef.current = null;

    try {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    } catch {
      // ignore
    }
    micStreamRef.current = null;

    if (audioElementRef.current) {
      try {
        audioElementRef.current.pause();
        audioElementRef.current.srcObject = null;
      } catch {
        // ignore
      }
    }

    setStatus("idle");
  }, [log]);

  const start = useCallback(async () => {
    if (
      status === "connecting" ||
      status === "live" ||
      status === "requesting-mic" ||
      status === "requesting-token"
    ) {
      log("Start called but session already in progress");
      return;
    }

    setError(null);
    setStatus("requesting-mic");

    if (typeof window === "undefined") {
      setError("Realtime voice is only available in the browser.");
      setStatus("error");
      return;
    }

    try {
      // 1) Get mic
      log("Requesting microphone access...");
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      if (!micStream) {
        throw new Error("Could not access microphone.");
      }
      micStreamRef.current = micStream;
      setStatus("requesting-token");

      // 2) Get ephemeral client_secret from backend
      log("Requesting realtime session client_secret...");
      const tokenRes = await fetch("/api/realtime-session", {
        method: "POST",
      });

      if (!tokenRes.ok) {
        const txt = await tokenRes.text();
        throw new Error(
          `Failed to get realtime session token (${tokenRes.status}): ${txt}`,
        );
      }

      const tokenJson = (await tokenRes.json()) as RealtimeSessionTokenResponse;
      if (!tokenJson.client_secret) {
        throw new Error("Backend did not return client_secret.");
      }

      const { client_secret, model } = tokenJson;

      // 3) Create RTCPeerConnection
      setStatus("connecting");
      log("Creating RTCPeerConnection...");

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      pcRef.current = pc;

      // 4) Outbound mic tracks
      micStream.getTracks().forEach((track) => {
        pc.addTrack(track, micStream);
      });

      // 5) Inbound audio element
      if (!audioElementRef.current) {
        const audioEl = new Audio();
        audioEl.autoplay = true;
        audioElementRef.current = audioEl;
      }

      pc.ontrack = (event) => {
        const [remoteStream] = event.streams;
        log("Received remote audio track");
        if (audioElementRef.current) {
          audioElementRef.current.srcObject = remoteStream;
          audioElementRef.current
            .play()
            .then(() => log("Remote audio playback started"))
            .catch((err) => log(`Audio playback error: ${String(err)}`));
        }
      };

      // 6) DataChannel (optional)
      const dc = pc.createDataChannel("oai-events");
      dataChannelRef.current = dc;

      dc.onopen = () => {
        log("DataChannel opened");
      };

      dc.onmessage = (event) => {
        if (process.env.NODE_ENV !== "production") {
          log(`DataChannel message: ${event.data}`);
        }
      };

      dc.onerror = (event) => {
        log(`DataChannel error: ${JSON.stringify(event)}`);
      };

      // 7) WebRTC offer/answer with OpenAI Realtime
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const url = new URL("https://api.openai.com/v1/realtime");
      if (model) {
        url.searchParams.set("model", model);
      }

      log("Sending SDP offer to OpenAI Realtime API...");
      const sdpRes = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/sdp",
          "OpenAI-Beta": "realtime=v1",
          Authorization: `Bearer ${client_secret}`,
        },
        body: offer.sdp ?? "",
      });

      if (!sdpRes.ok) {
        const txt = await sdpRes.text();
        throw new Error(
          `Failed to negotiate WebRTC with Realtime API (${sdpRes.status}): ${txt}`,
        );
      }

      const answerSdp = await sdpRes.text();
      const answerDesc = new RTCSessionDescription({
        type: "answer",
        sdp: answerSdp,
      });

      await pc.setRemoteDescription(answerDesc);
      log("Realtime voice session is live");
      setStatus("live");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      log(`Error starting realtime voice: ${message}`);
      setError(message);
      setStatus("error");
      hardStop();
    }
  }, [hardStop, log, status]);

  const stop = useCallback(() => {
    hardStop();
  }, [hardStop]);

  useEffect(() => {
    return () => {
      hardStop();
    };
  }, [hardStop]);

  return {
    status,
    error,
    start,
    stop,
  };
}

export type RealtimeVoiceToggleProps = {
  status: VoiceStatus;
  error?: string | null;
  onStart: () => void;
  onStop: () => void;
};

export function RealtimeVoiceToggle(props: RealtimeVoiceToggleProps) {
  const { status, error, onStart, onStop } = props;

  const isLive = status === "live";
  const isBusy =
    status === "requesting-mic" ||
    status === "requesting-token" ||
    status === "connecting" ||
    status === "stopping";

  return (
    <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="font-medium">
            {isLive
              ? "Live voice: listening"
              : isBusy
              ? "Setting up live voice…"
              : "Live voice is off"}
          </span>
          <span className="text-[11px] text-slate-500">
            {isLive
              ? "Speak naturally. Tap Stop to return to idle."
              : "Start live voice for realtime conversation."}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!isLive ? (
            <button
              type="button"
              onClick={onStart}
              disabled={isBusy}
              className="rounded-full border border-emerald-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-600 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isBusy ? "Starting…" : "Start live voice"}
            </button>
          ) : (
            <button
              type="button"
              onClick={onStop}
              className="rounded-full border border-rose-500 bg-rose-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white hover:bg-rose-600"
            >
              Stop
            </button>
          )}
        </div>
      </div>
      {error && (
        <p className="mt-1 text-[11px] text-rose-600">
          Voice error: {error}. Falling back to idle.
        </p>
      )}
    </div>
  );
}
