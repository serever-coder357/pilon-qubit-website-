// src/app/api/concierge-chat/route.ts
import { NextRequest } from "next/server";
import OpenAI from "openai";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const BASE_SYSTEM_PROMPT = `
You are the Pilon Qubit Ventures concierge.

Company:
- Pilon Qubit Ventures helps small and medium businesses with:
  - Modern, high-conversion websites.
  - Marketing systems and funnels.
  - AI-powered automation and growth tools.

Goals:
- Help visitors understand what Pilon Qubit Ventures does.
- Explain services clearly and practically.
- Ask focused follow-up questions when needed (budget, timeline, goals).
- If the visitor sounds like a fit, gently suggest a call or contact form.

Style:
- Friendly, confident, and concise.
- Short paragraphs and bullets where helpful.
- Avoid jargon unless the visitor is clearly technical.

Rules:
- Always speak as a concierge of Pilon Qubit Ventures.
- Do NOT invent services the company doesn't offer.
- If you don't know something, say so and suggest a call.
`;

export async function POST(req: NextRequest): Promise<Response> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new Response("Missing OPENAI_API_KEY", { status: 500 });
    }

    const body = await req.json();

    const messages = (body?.messages ??
      []) as { role: "user" | "assistant"; content: string }[];

    const pagePath = typeof body?.pagePath === "string" ? body.pagePath : "";

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response("Invalid messages payload", { status: 400 });
    }

    const pageContextSnippet = pagePath
      ? `
Current page context:
- The visitor is on: "${pagePath}".
- Adapt your answers to that page (e.g. if it's a services, pricing, or contact page).`
      : "";

    const systemPrompt = BASE_SYSTEM_PROMPT + pageContextSnippet;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
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
