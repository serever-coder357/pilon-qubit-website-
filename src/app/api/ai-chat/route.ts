import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();

    const messages = Array.isArray(body?.messages) ? body.messages : [];
    if (!messages.length) {
      return new Response(
        JSON.stringify({ error: "NO_MESSAGES", message: "Missing messages array" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are the AI contact assistant for PILON Qubit Ventures. " +
            "Help small and medium businesses with marketing, web development, " +
            "automation, and AI-powered solutions. Be clear, friendly, and concise. " +
            "Always aim to understand their goal and suggest concrete next steps. " +
            "If relevant, encourage them to share name and email so the team can follow up.",
        },
        ...messages,
      ],
      temperature: 0.6,
      max_tokens: 400,
    });

    const reply =
      completion.choices[0]?.message?.content ??
      "Sorry, I could not generate a response right now.";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("AI /api/ai-chat error:", err);
    return new Response(
      JSON.stringify({
        error: "AI_ERROR",
        message: "Something went wrong talking to the AI.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
