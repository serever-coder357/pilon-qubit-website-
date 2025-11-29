import { NextRequest, NextResponse } from "next/server";

const DEFAULT_REALTIME_MODEL =
  process.env.OPENAI_REALTIME_MODEL || "gpt-realtime";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured on the server" },
      { status: 500 },
    );
  }

  try {
    // SDP offer sent from the browser
    const offerSdp = await req.text();
    if (!offerSdp) {
      return NextResponse.json(
        { error: "Missing SDP offer in request body" },
        { status: 400 },
      );
    }

    const sessionConfig = JSON.stringify({
      type: "realtime",
      model: DEFAULT_REALTIME_MODEL,
      instructions:
        "You are the Pilon Qubit Ventures voice concierge. Speak clearly, stay concise, and focus on qualifying founders and operators. Ask focused questions about what they are building, stage, and what support they need. When appropriate, invite them to leave their details in the form below so we can follow up.",
      audio: {
        output: {
          voice: "marin",
        },
      },
    });

    const fd = new FormData();
    fd.set("sdp", offerSdp);
    fd.set("session", sessionConfig);

    const r = await fetch("https://api.openai.com/v1/realtime/calls", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "OpenAI-Beta": "realtime=v1",
      },
      body: fd,
    });

    if (!r.ok) {
      const txt = await r.text();
      return new NextResponse(
        JSON.stringify({
          error: "OpenAI /v1/realtime/calls request failed",
          status: r.status,
          details: txt,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const answerSdp = await r.text();

    // Return SDP answer directly to the browser
    return new NextResponse(answerSdp, {
      status: 200,
      headers: { "Content-Type": "application/sdp" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Failed to create realtime session", details: message },
      { status: 500 },
    );
  }
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
