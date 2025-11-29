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

// Very simple page classification so the model can answer differently.
function getPageContext(pagePath: string): string {
  if (!pagePath) return "";

  const path = pagePath.toLowerCase();

  if (path === "/" || path === "/home") {
    return `
Current page:
- Visitor is on the HOME page.
- Focus on a high-level overview of Pilon Qubit Ventures.
- Offer to guide them to the right service (web, marketing, AI automation).`;
  }

  if (path.startsWith("/services") || path.includes("services")) {
    return `
Current page:
- Visitor is on a SERVICES page.
- Assume they are evaluating what you can build or run for them.
- Give concrete examples of website, funnel, or AI systems you can deliver.
- Encourage them to share their industry, current website, and timeline.`;
  }

  if (path.startsWith("/contact") || path.includes("contact")) {
    return `
Current page:
- Visitor is on the CONTACT page.
- They are closer to reaching out.
- Help them clarify what to write in the contact form (goals, budget range, timeline).
- Encourage them to submit the form or email directly.`;
  }

  if (path.includes("ventures") || path.includes("capital")) {
    return `
Current page:
- Visitor is on a VENTURES or CAPITAL page.
- Focus more on venture building, growth, and long-term partnerships.
- Ask if they are a founder, investor, or operator, and adapt accordingly.`;
  }

  return `
Current page:
- Visitor is on "${pagePath}".
- Adapt your answers to the most likely intent based on the path.
- If unsure, ask a quick clarifying question about what they are looking for.`;
}

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

    const pageContextSnippet = getPageContext(pagePath);
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
