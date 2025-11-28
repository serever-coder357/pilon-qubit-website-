import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge"; // low latency for token minting

export async function POST(_req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model =
    process.env.OPENAI_REALTIME_MODEL ??
    "gpt-4o-realtime-preview-2024-12-17";
  const voice = process.env.OPENAI_REALTIME_VOICE ?? "verse";

  if (!apiKey) {
    console.error("[/api/realtime] Missing OPENAI_API_KEY");
    return NextResponse.json(
      { error: "Server misconfigured: OPENAI_API_KEY is not set." },
      { status: 500 },
    );
  }

  try {
    // Mint an ephemeral Realtime session key
    const resp = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        voice,
        // You can tune session defaults here
        instructions:
          "You are the AI operator assistant for PILON Qubit Ventures, " +
          "an AI & frontier tech consulting firm in San Antonio, TX. " +
          "Your goal is to quickly understand the user's business, goals, " +
          "and timing, then recommend the best of: (1) AI Marketing " +
          "Automation, (2) Frontier AI Consulting, or (3) Web Development. " +
          "Ask concise, targeted questions. Before the conversation ends, " +
          "politely ask for their name, email, company, and phone so the " +
          "team can follow up. Keep answers short, practical, and avoid hype.",
        modalities: ["text", "audio"],
        // Make sure we get audio output
        audio: {
          output: {
            format: "aac",
          },
        },
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("[/api/realtime] Failed to create session:", text);
      return NextResponse.json(
        {
          error: "Failed to create realtime session",
          details: text,
        },
        { status: 500 },
      );
    }

    const data = await resp.json();

    // Very important: we only send the ephemeral client_secret back to browser.
    // The browser will use data.client_secret.value as its Bearer token.
    return NextResponse.json(data);
  } catch (err) {
    console.error("[/api/realtime] Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error creating realtime session." },
      { status: 500 },
    );
  }
}
