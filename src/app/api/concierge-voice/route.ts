// src/app/api/concierge-voice/route.ts
import { NextRequest } from "next/server";
import OpenAI from "openai";
import { Buffer } from "buffer";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest): Promise<Response> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new Response("Missing OPENAI_API_KEY", { status: 500 });
    }

    const body = (await req.json().catch(() => null)) as
      | { text?: string }
      | null;

    const rawText = (body?.text || "").trim();

    if (!rawText) {
      return new Response("Missing text", { status: 400 });
    }

    // Safety: cap length to avoid accidental giant TTS payloads
    const text =
      rawText.length > 1600 ? rawText.slice(0, 1600) + "…" : rawText;

    const speechResponse = await client.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "coral",
      input: text,
      instructions:
        "Speak in a clear, warm, professional tone suitable for a sales consultant, not too fast.",
    });

    const arrayBuffer = await speechResponse.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[concierge-voice] error", error);
    return new Response("Failed to generate speech", { status: 500 });
  }
}
