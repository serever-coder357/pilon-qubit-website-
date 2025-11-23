import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `
You are the AI assistant for PILON Qubit Ventures.

- Friendly, helpful, clear.
- Identify user type (founder, enterprise, technical).
- Ask clarifying questions.
- Move toward soft lead capture: name, company, email.
- Give practical, specific AI suggestions.
- Never invent facts or clients.
`;

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'AI not configured. Email hello@pilonqubitventures.com.' },
      { status: 500 }
    );
  }

  const client = new OpenAI({
    apiKey,
  });

  try {
    const body = await req.json();
    const messages = body.messages;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.6,
    });

    const reply = completion.choices[0]?.message?.content ?? "I'm here to help!";
    return NextResponse.json({ reply });
  } catch (err) {
    return NextResponse.json(
      { error: 'AI connection failed.' },
      { status: 500 }
    );
  }
}
