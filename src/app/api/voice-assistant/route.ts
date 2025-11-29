// src/app/api/voice-assistant/route.ts

import OpenAI from "openai";

// Ensure this env var is set in Vercel
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "nodejs";

type HistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

type VoiceResponse =
  | {
      ok: true;
      userText: string;
      replyText: string;
      audioBase64: string;
      audioMimeType: string;
    }
  | {
      ok: false;
      error: string;
      details?: string;
    };

export async function POST(req: Request): Promise<Response> {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio");
    const historyJson = formData.get("history");

    if (!audioFile || !(audioFile instanceof Blob)) {
      const body: VoiceResponse = {
        ok: false,
        error: "NO_AUDIO",
        details: "Missing audio file in form-data under key 'audio'.",
      };
      return new Response(JSON.stringify(body), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let history: HistoryMessage[] = [];
    if (typeof historyJson === "string" && historyJson.trim().length > 0) {
      try {
        const parsed = JSON.parse(historyJson) as HistoryMessage[];
        // keep only the last few turns to avoid context bloat
        history = parsed.slice(-6);
      } catch (err) {
        console.error("Failed to parse history JSON:", err);
      }
    }

    // 1) Transcribe user audio → text
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile as any, // File/Blob is accepted by the SDK in app routes
      model: "whisper-1",
      temperature: 0.2,
    });

    const userText =
      typeof transcription.text === "string" && transcription.text.trim().length
        ? transcription.text.trim()
        : "";

    if (!userText) {
      const body: VoiceResponse = {
        ok: false,
        error: "EMPTY_TRANSCRIPT",
        details: "The audio was received but no speech could be transcribed.",
      };
      return new Response(JSON.stringify(body), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2) Get assistant reply with context
    const messages: HistoryMessage[] = history.concat({
      role: "user",
      content: userText,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      max_tokens: 400,
      messages: [
        {
          role: "system",
          content: [
            "You are the advanced AI concierge for PILON Qubit Ventures.",
            "You help small and medium businesses with:",
            "- Full-stack web development and modern frontends (Next.js, React).",
            "- Marketing strategy, funnels, automation, and analytics.",
            "- AI-powered workflows, lead capture, and growth experiments.",
            "",
            "Guidelines:",
            "- Speak clearly and practically, as a senior consultant.",
            "- Ask clarifying questions when needed, but keep answers concise.",
            "- Suggest specific next steps: audits, quick wins, experiments.",
            "- You may recommend that users share their name and email so the team can follow up.",
          ].join("\n"),
        },
        ...messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ],
    });

    const replyText =
      completion.choices[0]?.message?.content?.trim() ||
      "I had trouble generating a response. Please ask again in a different way.";

    // 3) Turn reply into speech
    const tts = await openai.audio.speech.create({
      // If this model name does not work on your account,
      // use "tts-1" or whatever TTS model is in your OpenAI dashboard docs.
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: replyText,
    });

    const audioBuffer = Buffer.from(await tts.arrayBuffer());
    const audioBase64 = audioBuffer.toString("base64");
    // Most SDK defaults are MP3/MPEG; adjust if your account uses a different default.
    const audioMimeType = "audio/mpeg";

    const body: VoiceResponse = {
      ok: true,
      userText,
      replyText,
      audioBase64,
      audioMimeType,
    };

    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("/api/voice-assistant fatal error:", err);

    const body: VoiceResponse = {
      ok: false,
      error: "SERVER_ERROR",
      details:
        typeof err?.message === "string"
          ? err.message
          : "Unexpected error in voice assistant route.",
    };

    return new Response(JSON.stringify(body), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
