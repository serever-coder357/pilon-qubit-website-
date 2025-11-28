import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge"; // low latency session minting

// GET – for browser testing
export async function GET() {
  return new Response("POST only. Use POST /api/realtime.", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}

// POST – main realtime API endpoint
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
    const resp = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        voice,
        instructions:
          "You are the AI operator assistant for PILON Qubit Ventures. " +
          "Your job is to understand the user's business and goals, then " +
          "recommend the best of: AI Marketing Automation, AI Consulting, " +
          "or Web Development. Keep responses short, practical, and ask " +
          "for name, email, company, and phone before ending.",
        modalities: ["text", "audio"],
        audio: {
          output: { format: "aac" },
        },
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("[/api/realtime] Failed to create session:", text);
      return NextResponse.json(
        { error: "Failed to create realtime session", details: text },
        { status: 500 },
      );
    }

    const data = await resp.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[/api/realtime] Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error creating realtime session." },
      { status: 500 },
    );
  }
}
