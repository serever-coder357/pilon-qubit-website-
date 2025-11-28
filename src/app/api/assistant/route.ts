import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const userMessage =
      (body && body.message && String(body.message)) || "No message provided";

    const reply = `Thanks, I received: "${userMessage}". A smarter PQV AI brain will respond here soon.`;

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error in /api/assistant:", error);
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400 },
    );
  }
}
