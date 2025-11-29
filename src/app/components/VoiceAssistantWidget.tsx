import { NextResponse } from "next/server";

export async function POST() {
  const apiKey = process.env.OPENAI_API_KEY;
  const model =
    process.env.NEXT_PUBLIC_OPENAI_REALTIME_MODEL ??
    "gpt-4o-realtime-preview-2024-12-17";

  if (!apiKey) {
    console.error("Missing OPENAI_API_KEY");
    return NextResponse.json(
      { error: "Server missing OPENAI_API_KEY" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("Realtime session creation failed:", res.status, text);
      return NextResponse.json(
        {
          error: "Failed to create realtime session",
          details: text,
        },
        { status: 500 },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Unexpected /api/realtime error:", err);
    return NextResponse.json(
      {
        error: "Unexpected error creating realtime session",
      },
      { status: 500 },
    );
  }
}
