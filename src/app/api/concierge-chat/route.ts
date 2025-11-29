// src/app/api/concierge-chat/route.ts
import { NextRequest } from "next/server";

export const runtime = "nodejs";

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

interface IncomingBody {
  messages?: IncomingMessage[];
  pagePath?: string;
  pageSection?: string;
}

const MODEL = "gpt-4.1-mini";

function buildSystemPrompt(pagePath?: string, pageSection?: string): string {
  const path = pagePath || "/";
  const section = pageSection || "";

  return `
You are the Pilon Qubit Ventures AI concierge.

Your role:
- You are a friendly, confident sales consultant for Pilon Qubit Ventures (PQV).
- You understand the full offering across the whole website, not just the current page.
- You ALWAYS assume we can help with AI voice assistants and AI contact centers. Never say it's "not a service" — it is part of our AI assistants & automation offering.

Core service lines you can reference at any time:
1) Websites & Funnels
   - High-conversion marketing sites and landing pages
   - Custom websites and web applications (Next.js, modern stacks)
   - Funnel strategy, lead capture, and analytics

2) AI Assistants & Voice
   - AI chatbots for web
   - AI voice assistants (phone, web voice widgets, contact center)
   - Multichannel assistants (chat + SMS + voice)
   - Automation around scheduling, intake, FAQs, and basic support

3) Frontier AI Consulting
   - Strategy and architecture for frontier AI / LLMs
   - Custom AI tools, copilots, and workflows
   - Integrations into existing systems, data, and infrastructure

Tone and behavior:
- Be warm, concise, and practical. No fluff.
- Think like a senior sales engineer who also understands implementation details.
- Make it clear that PQV can design, build, and maintain the solution, not just "advise".

Lead-capture mindset (very important):
- Your goal is to understand:
  - What type of business the visitor has
  - What they want help with (website, AI assistant / voice, funnels, or a mix)
  - Rough scale (solo, small team, established business)
  - Urgency (timeline) and any budget hints
- Ask 1–2 targeted questions at a time, not a long survey.
- Once there is clear interest, explicitly invite them to share:
  - Name
  - Email
  - Company (optional)
  - Short summary of their project
- Phrase it so it matches the UI mini-form, e.g.:
  "If you’d like, you can share your name, email, company, and a short summary here and we’ll follow up."

Page awareness (do NOT be limited by this):
- Current path: "${path}"
- Current section anchor (if any): "${section}"
- Use this mainly to adjust emphasis. Examples:
  - On marketing / services pages: highlight specific offerings and typical outcomes.
  - On contact section: focus on next step / call scheduling / form submission.
- Never say "that’s not on this page" or "we don’t do that here".
- Always answer using full knowledge of PQV’s services.

When asked about AI voice:
- Treat AI phone agents, inbound call routing, and voice assistants as a **first-class service**.
- Explain briefly how PQV can set up a 24/7 AI voice assistant (phone or web), then ask what kind of calls or flows they want covered.
- Steer toward capturing contact details if they seem serious.

Style:
- Short paragraphs and clear bullets.
- Avoid over-technical jargon unless the user clearly is technical.
- Always end answers with either:
  - A helpful next question, OR
  - A suggestion to share their details so the team can follow up.
`;
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("[concierge-chat] Missing OPENAI_API_KEY");
      return new Response(
        "Server misconfigured: missing OPENAI_API_KEY",
        { status: 500 },
      );
    }

    const body = (await req.json().catch(() => null)) as IncomingBody | null;

    const incomingMessages = Array.isArray(body?.messages)
      ? body!.messages
      : [];

    const pagePath = body?.pagePath;
    const pageSection = body?.pageSection;

    const systemPrompt = buildSystemPrompt(pagePath, pageSection);

    // Hard cap conversation history for cost + speed
    const trimmedHistory = incomingMessages.slice(-16);

    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          stream: true,
          temperature: 0.5,
          messages: [
            { role: "system", content: systemPrompt },
            ...trimmedHistory.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          ],
        }),
      },
    );

    if (!openaiRes.ok || !openaiRes.body) {
      const text = await openaiRes.text().catch(() => "");
      console.error(
        "[concierge-chat] OpenAI error",
        openaiRes.status,
        text,
      );
      return new Response(
        "Error contacting concierge model.",
        { status: 500 },
      );
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder("utf-8");

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const reader = openaiRes.body!.getReader();

        try {
          let done = false;
          while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            if (!value) continue;

            const chunk = decoder.decode(value, {
              stream: !doneReading,
            });

            const lines = chunk
              .split("\n")
              .map((l) => l.trim())
              .filter((l) => l.startsWith("data:"));

            for (const line of lines) {
              const data = line.replace(/^data:\s*/, "");
              if (!data || data === "[DONE]") continue;

              try {
                const json = JSON.parse(data) as {
                  choices?: Array<{
                    delta?: {
                      content?:
                        | string
                        | Array<{ type: string; text?: string }>;
                    };
                  }>;
                };

                const delta = json.choices?.[0]?.delta?.content;
                if (!delta) continue;

                if (typeof delta === "string") {
                  controller.enqueue(encoder.encode(delta));
                } else if (Array.isArray(delta)) {
                  for (const part of delta) {
                    if (part.type === "text" && part.text) {
                      controller.enqueue(encoder.encode(part.text));
                    }
                  }
                }
              } catch (err) {
                console.error(
                  "[concierge-chat] Failed to parse SSE chunk",
                  err,
                );
              }
            }
          }
        } catch (err) {
          console.error("[concierge-chat] Stream error", err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[concierge-chat] Unexpected error", err);
    return new Response(
      "Unexpected error in concierge chat route.",
      { status: 500 },
    );
  }
}
