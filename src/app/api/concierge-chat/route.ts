// src/app/api/concierge-chat/route.ts
import { NextRequest } from "next/server";
import OpenAI from "openai";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// This is the “brains” of your concierge.
// You can refine this later for tone, offers, and logic.
const SYSTEM_PROMPT = `
You are the Pilon Qubit Ventures concierge.

Goals:
- Help founders and business owners understand what Pilon Qubit Ventures does.
- Explain services: modern websites, marketing systems, AI-powered growth, automation.
- Make it very clear when a custom project or call would make sense.
- Be friendly, concise, and practical.

Rules:
- Always answer as a helpful assistant on behalf of Pilon Qubit Ventures.
- Avoid long paragraphs. Prefer short, clear responses.
- If the user is clearly a fit, suggest booking a call or leaving contact info on the contact page.
`;

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return new Response("Missing OPENAI_API_KEY", { status: 500 });
    }

    const messages = (body?.messages ??
      []) as { role: "user" | "assistant"; content: string }[];

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response("Invalid messages payload", { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const delta = chunk.choices?.[0]?.delta?.content;
            if (!delta) continue;
            const encoded = encoder.encode(delta);
            controller.enqueue(encoded);
          }
        } catch (error) {
          console.error("[concierge-chat] stream error", error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error) {
    console.error("[concierge-chat] handler error", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
