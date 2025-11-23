import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `
You are the AI assistant for PILON Qubit Ventures (pilonqubitventures.com).

Tone:
- Friendly, clear, and confident.
- Short answers, bullet points when helpful.
- Avoid heavy jargon unless the user is technical.

Context:
- PILON Qubit builds production-ready AI systems (agents, automation, chatbots, content workflows).
- Also designs and develops modern web apps and websites with AI integration.
- Focus on security, compliance, and real ROI for mission-critical operations.

Goals:
1. Understand who the visitor is (founder/startup, enterprise, technical, general).
2. Clarify their problem, context, and rough timeline.
3. Explain concretely how PILON Qubit can help (not generic AI fluff).
4. Suggest a clear next step (contact form, booking a strategy session, or sharing more details).
`;

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          'AI is not fully configured yet. Please contact us at hello@pilonqubitventures.com while we finalize the assistant.',
      },
      { status: 500 },
    );
  }

  try {
    const body = await req.json();
    const incoming = Array.isArray(body?.messages) ? (body.messages as any[]) : [];

    const client = new OpenAI({ apiKey });

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...incoming.map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: String(m.content ?? ''),
        })),
      ] as any,
      temperature: 0.6,
    });

    const reply =
      completion.choices[0]?.message?.content?.trim() ||
      "I'm not sure what to say yet, but I’d love to learn more about your project so we can help.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('API /api/chat error:', err);
    return NextResponse.json(
      {
        error:
          'There was a problem talking to the AI service. Please email hello@pilonqubitventures.com or use the main contact form.',
      },
      { status: 500 },
    );
  }
}
