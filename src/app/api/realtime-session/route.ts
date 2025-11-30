import { NextRequest, NextResponse } from "next/server";

const REALTIME_MODEL =
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
    // Expect raw SDP offer in the body (text/plain / application/sdp)
    const offerSdp = await req.text();
    if (!offerSdp || !offerSdp.trim()) {
      return NextResponse.json(
        { error: "Missing SDP offer in request body" },
        { status: 400 },
      );
    }

    const sessionConfig = JSON.stringify({
      type: "realtime",
      model: REALTIME_MODEL,
      instructions:
        "You are the Pilon Qubit Ventures voice concierge. Speak clearly, stay concise, and focus on qualifying founders and operators. Ask focused questions about what they are building, their stage, and the support they need. When appropriate, invite them to leave their details in the form in the widget so the team can follow up.",
      input_audio_format: "pcm16",
      output_audio_format: "pcm16",
      audio: {
        input: {
          type: "input_audio",
        },
        output: {
          voice: "marin",
        },
      },
      // You can tweak turn detection etc. later if needed.
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
