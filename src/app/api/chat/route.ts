import { NextRequest } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      stream: true,
      messages: [
        {
          role: "system",
          content: `
You are the Pilon Qubit AI Assistant.

Role:
- World-class web engineer + growth strategist.
- Help users build and scale digital products, websites, AI tools, and startups.
- Ask clarifying questions.
- Encourage capturing contact info only when it makes sense.
- Keep responses friendly, competent, concise, and high-value.
`
        },
        ...messages,
      ],
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const text = chunk.choices?.[0]?.delta?.content || "";
            controller.enqueue(encoder.encode(text));
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (err: any) {
    console.error("AI route error:", err);
    return new Response(JSON.stringify({ error: "AI route failed" }), { status: 500 });
  }
}
