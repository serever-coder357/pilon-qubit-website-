// src/app/api/realtime-session/route.ts
import { NextRequest } from "next/server";

export const runtime = "nodejs";

/**
 * Secure endpoint to mint an ephemeral client secret for the OpenAI Realtime API.
 *
 * Frontend flow (later):
 *  - Browser calls /api/realtime-session (GET).
 *  - This route uses OPENAI_API_KEY to ask OpenAI for a short-lived client_secret.
 *  - Browser uses that client_secret to open a WebRTC connection directly to Realtime.
 */
export async function GET(_req: NextRequest): Promise<Response> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("[realtime-session] Missing OPENAI_API_KEY");
      return new Response(
        JSON.stringify({ error: "Server missing OPENAI_API_KEY" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Session config: tune as we like later (model, voice, instructions, tools, etc.)
    const sessionConfig = {
      session: {
        type: "realtime",
        // Use a current realtime-capable model; adjust if you prefer another:
        model: "gpt-realtime-preview",
        audio: {
          input: {
            // Enable microphone input and transcription
            enabled: true,
          },
          output: {
            // Default voice for the realtime session
            voice: "marin",
            format: "wav",
          },
        },
        instructions:
          "You are the Pilon Qubit voice concierge. Speak clearly, naturally, and focus on understanding the visitor’s needs, explaining services, and capturing contact details when appropriate.",
      },
    };

    const upstreamResponse = await fetch(
      "https://api.openai.com/v1/realtime/client_secrets",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionConfig),
      },
    );

    if (!upstreamResponse.ok) {
      const text = await upstreamResponse.text().catch(() => "");
      console.error(
        "[realtime-session] Upstream error",
        upstreamResponse.status,
        text,
      );

      return new Response(
        JSON.stringify({
          error: "Failed to generate realtime client secret",
          status: upstreamResponse.status,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const data = await upstreamResponse.json();

    // This JSON includes a client_secret.value the browser will use later.
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[realtime-session] Unexpected error", error);
    return new Response(
      JSON.stringify({ error: "Unexpected error in realtime-session" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
