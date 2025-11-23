import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const SYSTEM_PROMPT = `
You are the AI assistant for PILON Qubit Ventures (pilonqubitventures.com).

Tone:
- Friendly, clear, and confident.
- No jargon unless the user is technical.
- Short paragraphs, bullet points when helpful.

Context (what the company does):
- Builds production-ready AI systems (agents, automation, chatbots, content workflows).
- Designs and develops modern web apps and sites with AI integration.
- Focus on security, compliance, and real ROI for mission-critical operations.

Goals for every conversation:
1. Quickly understand who the visitor is:
   - Founder / startup, enterprise leader, technical / developer, or general visitor.
2. Clarify their situation:
   - Industry, main problem, current tools, and rough timeline.
3. Explain how PILON Qubit Ventures can help, in concrete terms (not generic AI fluff).
4. Work toward a soft lead capture:
   - Politely ask for name, company, and best email so the team can follow up.
   - If they hesitate, still give value and suggest the contact form or booking a strategy call.
5. Keep answers focused:
   - Start with a 2–3 sentence summary.
   - Then 3–5 bullet points of how you can help.
   - End with a clear “Next step” suggestion.

Rules:
- If you don’t know a detail (like an exact price), be transparent and say it depends, then suggest a brief call.
- Never invent specific clients or fake numbers.
- Always invite the user to share contact details before ending a conversation.
`;

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        error:
          'AI is not configured yet. Please contact us at hello@pilonqubitventures.com while we finalize the assistant.',
      },
      { status: 500 },
    );
  }

  try {
    const body = await req.json();
    const messages = body?.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Missing messages array.' }, { status: 400 });
    }

    // Call OpenAI for the assistant reply
    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((m: any) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: String(m.content ?? ''),
        })),
      ],
      temperature: 0.6,
    });

    const reply =
      completion.choices[0]?.message?.content?.trim() ||
      "I'm not sure what to say yet, but I’d love to learn more about your project so we can help.";

    // Basic lead detection: look at the latest user message for email/phone
    const lastUser = [...messages].reverse().find((m: any) => m.role === 'user');
    const lastContent: string = lastUser?.content ?? '';

    const hasEmail = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(lastContent);
    const hasPhone = /(\+?\d[\d\s\-().]{7,})/.test(lastContent);

    if (resend && (hasEmail || hasPhone)) {
      try {
        const transcript = messages
          .map((m: any) => `${m.role.toUpperCase()}: ${String(m.content ?? '')}`)
          .join('\n\n');

        await resend.emails.send({
          from: 'PILON Qubit AI Lead <noreply@pilonqubitventures.com>',
          to: 'hello@pilonqubitventures.com',
          subject: 'New AI chat lead from PILON Qubit website',
          text: [
            'A visitor just shared contact details in the AI assistant.',
            '',
            'Last user message:',
            lastContent,
            '',
            '--- Full conversation transcript ---',
            transcript,
          ].join('\n'),
        });
      } catch (emailErr) {
        console.error('Error sending AI lead email:', emailErr);
      }
    }

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
