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
    let body: { model?: string } = {};
    try {
      body = (await req.json()) as { model?: string };
    } catch {
      // Optional JSON body; ignore if empty
    }

    const model = body.model || DEFAULT_REALTIME_MODEL;

    // Use OpenAI Realtime client_secrets to mint an ephemeral key (ek_...).
    const clientSecretRes = await fetch(
      "https://api.openai.com/v1/realtime/client_secrets",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "OpenAI-Beta": "realtime=v1",
        },
        body: JSON.stringify({
          session: {
            type: "realtime",
            model,
            instructions:
              "You are the Pilon Qubit Ventures voice concierge. Speak clearly, stay concise, and focus on qualifying founders and operators. Ask focused questions about what they are building and what support they need. When appropriate, invite them to leave their contact details in the form below for follow-up.",
          },
        }),
      },
    );

    if (!clientSecretRes.ok) {
      const txt = await clientSecretRes.text();
      return NextResponse.json(
        {
          error: "OpenAI realtime client_secret request failed",
          status: clientSecretRes.status,
          details: txt,
        },
        { status: 500 },
      );
    }

    const json = (await clientSecretRes.json()) as {
      value?: string;
      session?: { model?: string };
      [key: string]: unknown;
    };

    const clientSecret = json.value;
    const sessionModel = json.session?.model;

    if (!clientSecret) {
      return NextResponse.json(
        {
          error: "Missing client_secret value in OpenAI response",
          raw: json,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        client_secret: clientSecret,
        model: sessionModel || model,
      },
      { status: 200 },
    );
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
