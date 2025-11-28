// src/app/api/voice-assistant/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { ok: false, error: "Missing OPENAI_API_KEY on the server." },
        { status: 500 }
      );
    }

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("multipart/form-data")) {
      return NextResponse.json(
        {
          ok: false,
          error: "Expected multipart/form-data with an 'audio' file field.",
        },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("audio");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { ok: false, error: "No audio file found in 'audio' field." },
        { status: 400 }
      );
    }

    // 1) Voice → text (speech-to-text)
    const transcription = await openai.audio.transcriptions.create({
      // New Whisper model; text output
      model: "gpt-4o-transcribe",
      // @ts-ignore – OpenAI Node SDK accepts Blob/File here at runtime
      file,
      response_format: "text",
    });

    const userText =
      typeof transcription === "string"
        ? transcription
        : // fallback if SDK returns an object
          // @ts-ignore
          transcription.text ?? "";

    // 2) Text → reply (chat completion)
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are the Pilon Qubit Ventures AI voice concierge. " +
            "You speak clearly and briefly, in a professional but friendly tone. " +
            "You can answer questions from founders and investors, explain Pilon Qubit Ventures, " +
            "and suggest visiting the contact section or booking a call when it makes sense.",
        },
        {
          role: "user",
          content: userText || "Hello, I have a question about Pilon Qubit Ventures.",
        },
      ],
      max_tokens: 350,
    });

    const rawContent = completion.choices[0]?.message?.content;

    const replyText =
      typeof rawContent === "string"
        ? rawContent
        : Array.isArray(rawContent)
        ? rawContent
            .map((part: any) =>
              typeof part === "string" ? part : part?.text ?? ""
            )
            .join(" ")
        : "";

    // 3) Reply text → audio (text-to-speech)
    const speech = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input:
        replyText ||
        "Thanks for reaching out to Pilon Qubit Ventures. How can we help you today?",
    });

    const audioArrayBuffer = await speech.arrayBuffer();
    const audioBase64 = Buffer.from(audioArrayBuffer).toString("base64");

    return NextResponse.json({
      ok: true,
      userText,
      replyText,
      audioBase64,
      audioMimeType: "audio/mpeg",
    });
  } catch (error: any) {
    console.error("Voice assistant error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Voice assistant failed on the server.",
        details: error?.message ?? String(error),
      },
      { status: 500 }
    );
  }
}
