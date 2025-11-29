import { NextRequest, NextResponse } from "next/server";

const REALTIME_MODEL = process.env.OPENAI_REALTIME_MODEL || "gpt-4o-realtime-preview";

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
      // optional body, ignore parse errors
    }

    const model = body.model || REALTIME_MODEL;

    const sessionRes = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        // You can tune these later for more sales/lead-capture behavior
        instructions:
          "You are the Pilon Qubit Ventures voice concierge. Speak clearly and briefly. Ask focused questions to qualify the visitor and, when appropriate, invite them to leave their contact details in the form below.",
      }),
    });

    if (!sessionRes.ok) {
      const txt = await sessionRes.text();
      return NextResponse.json(
        { error: "OpenAI realtime session request failed", details: txt },
        { status: 500 },
      );
    }

    const sessionJson: any = await sessionRes.json();

    const clientSecret =
      sessionJson?.client_secret?.value ?? sessionJson?.client_secret ?? null;

    if (!clientSecret) {
      return NextResponse.json(
        {
          error: "Realtime session response did not include client_secret",
          raw: sessionJson,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        client_secret: clientSecret,
        model: sessionJson.model || model,
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
  // Make GET explicitly not allowed, so the client must use POST
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
