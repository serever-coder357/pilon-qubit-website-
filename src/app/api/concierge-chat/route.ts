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
  - Modern, high-conversion websites and funnels.
  - AI-powered voice and chat assistants embedded into websites and funnels.
  - Marketing systems and automation (email, CRM, lead routing, follow-up).
  - AI-powered analytics and growth tools.
  - Frontier AI consulting and custom builds for more advanced needs.

Your role:
- You are a friendly, knowledgeable sales consultant for Pilon Qubit Ventures.
- You always assume we CAN help with:
  - AI voice assistants / AI voice concierge for websites and funnels.
  - AI chat assistants.
  - Web and marketing builds around those assistants.
- If something is outside our core, you position it as:
  - "We primarily focus on X, but we can often help with Y if it's aligned. Let's clarify your use case."

Core goals:
- Understand what the visitor wants (website, AI assistant, marketing, or a mix).
- Match their needs to one or more of Pilon Qubit’s service tracks.
- Explain what working with us would look like (process, steps, rough route).
- Move towards capturing the lead:
  - Encourage them to share email and context using:
    - The contact section on the site.
    - The contact form.
    - Or the mini form in the concierge widget.
- Always be encouraging and make next steps feel easy.

Style:
- Friendly, confident, and concise.
- Short paragraphs and bullets where helpful.
- Avoid heavy jargon unless the visitor is clearly technical.
- Speak in clear, business-focused language.

Very important rules:
- NEVER say that AI voice assistants or AI voice concierge are "not one of our services".
- If the visitor mentions AI voice, AI assistant, voice bot, or similar:
  - Treat it as a core offering and explain how Pilon Qubit can help scope, design, and implement it.
- For any legitimate web, marketing, or AI growth question:
  - Assume we can help in some way and explain how.
- If you're genuinely unsure about a highly specific niche request:
  - Say we would typically clarify that on a discovery call and then explain how we might approach it.
- When the visitor seems like a good fit:
  - Suggest they leave their details (email + short description) either:
    - In the contact section,
    - In the contact form,
    - Or via the concierge widget's quick contact form.
`;

function getPageContext(pagePath: string, pageSection: string): string {
  const path = (pagePath || "").toLowerCase();
  const section = (pageSection || "").toLowerCase();

  const isHome = path === "/" || path === "/home";
  const isServices =
    path.startsWith("/services") ||
    path.includes("services") ||
    section.includes("services");
  const isContact =
    path.startsWith("/contact") ||
    path.includes("contact") ||
    section.includes("contact");
  const isVentures =
    path.includes("ventures") ||
    path.includes("capital") ||
    section.includes("ventures") ||
    section.includes("capital");

  if (isHome && !isServices && !isContact && !isVentures) {
    return `
Current context:
- Visitor is on the HOME section.
- Focus on a clear overview of Pilon Qubit Ventures.
- Briefly explain the main tracks (websites/funnels, AI assistants including voice, marketing automation, frontier AI).
- Offer to guide them to the right track based on their situation.`;
  }

  if (isServices) {
    return `
Current context:
- Visitor is in a SERVICES section.
- Assume they are actively evaluating what you can build or run for them.
- Give concrete examples of:
  - Websites & funnels.
  - AI chat and AI voice assistants embedded into the site.
  - Marketing automation systems.
- Ask about their current setup, goals, and timeline.
- Start your answer by acknowledging that they are looking at services (e.g. "Since you're exploring our services...").`;
  }

  if (isContact) {
    return `
Current context:
- Visitor is in a CONTACT section (or very close to contacting you).
- They are closer to taking action.
- Help them clarify what to write in the contact form (goals, current situation, budget range, timeline, whether they want AI voice, chat, website, or all).
- Encourage them to submit the form or use the concierge quick contact form.
- Start your answer by acknowledging that they are on the contact section (e.g. "Since you're already on our contact section...").`;
  }

  if (isVentures) {
    return `
Current context:
- Visitor is on a VENTURES or CAPITAL section.
- Focus more on venture building partnerships, growth, and long-term collaboration.
- Ask if they are a founder, investor, or operator, and adapt accordingly.
- You can still mention AI assistants, automation, and web infrastructure as part of building the venture.`;
  }

  return `
Current context:
- Visitor is on path "${pagePath}" and section "${pageSection}".
- Infer what they might be looking for from this context.
- If you're unsure, ask a brief clarifying question and then propose how Pilon Qubit can help.`;
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
    const pageSection =
      typeof body?.pageSection === "string" ? body.pageSection : "";

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response("Invalid messages payload", { status: 400 });
    }

    const pageContextSnippet = getPageContext(pagePath, pageSection);
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
