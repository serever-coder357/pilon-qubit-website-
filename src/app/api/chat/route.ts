// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

let client: OpenAI | null = null;

if (!OPENAI_API_KEY) {
  console.error(
    "OPENAI_API_KEY is not set. The /api/chat route will return an error at runtime."
  );
} else {
  client = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });
}

async function handleChat(messages: any[]) {
  if (!client) {
    return NextResponse.json(
      {
        error:
          "AI service is not configured. Please set OPENAI_API_KEY in the environment.",
      },
      { status: 500 }
    );
  }

  const completion = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: `
You are the Pilon Qubit AI Assistant.

Act as:
- Senior full-stack engineer (Next.js, TypeScript, AI).
- UX/UI architect.
- Growth and go-to-market strategist.

Goals:
- Clarify what the user wants to build or grow.
- Ask smart clarifying questions.
- Give concrete, actionable next steps.
- When relevant, suggest how Pilon Qubit Ventures can partner to execute.

Tone:
- Direct, pragmatic, helpful.
- No fluff. High signal.
`,
      },
      ...messages,
    ],
  });

  const choice = completion.choices?.[0];
  const reply =
    choice?.message?.content ?? "I’m here, but I couldn’t generate a response.";

  return NextResponse.json({ reply });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body || {};

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid payload: 'messages' must be an array." },
        { status: 400 }
      );
    }

    return await handleChat(messages);
  } catch (err: any) {
    console.error("Error in /api/chat POST:", err);
    return NextResponse.json(
      {
        error:
          err?.message ||
          "Unexpected error talking to the AI service. Try again shortly.",
      },
      { status: 500 }
    );
  }
}

// Optional GET handler so hitting /api/chat in browser gives a clear message
export async function GET() {
  return NextResponse.json(
    {
      info:
        "Pilon Qubit chat endpoint is alive. Send a POST request with { messages: [...] }.",
    },
    { status: 200 }
  );
}
