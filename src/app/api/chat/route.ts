import OpenAI from 'openai';
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `
You are the AI assistant for PILON Qubit Ventures, a boutique firm focused on enterprise AI, AI marketing automation, and frontier AI consulting.
Speak in a clear, friendly, expert tone.
You only answer based on reasonable industry knowledge and what a firm like PILON Qubit would offer.
Your goals:
1) Understand the visitor's needs.
2) Explain how PILON Qubit can help (services, engagement models, etc.).
3) If the visitor shows buying intent (quote, strategy session, implementation help, timeline, or pricing), politely ask for their name and email so the team can follow up.
`;

type RequestMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

type LeadPayload = {
  name?: string;
  email?: string;
  context?: string;
};

const model = 'gpt-4o-mini';

export async function POST(req: NextRequest) {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!openaiApiKey) {
    return NextResponse.json(
      { ok: false, error: 'Missing OpenAI API Key' },
      { status: 500 },
    );
  }

  if (!resendApiKey) {
    return NextResponse.json(
      { ok: false, error: 'Missing Resend API Key' },
      { status: 500 },
    );
  }

  const openai = new OpenAI({ apiKey: openaiApiKey });
  const resend = new Resend(resendApiKey);

  try {
    const body = await req.json();
    const incoming: RequestMessage[] = Array.isArray(body?.messages)
      ? body.messages
      : [];
    const lead: LeadPayload | undefined = body?.lead;

    const normalizedMessages = incoming
      .filter((m) => m && typeof m.content === 'string' && m.role)
      .map((m) => ({
        role:
          m.role === 'assistant'
            ? 'assistant'
            : m.role === 'system'
              ? 'system'
              : 'user',
        content: String(m.content ?? ''),
      } as RequestMessage));

    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...normalizedMessages],
      temperature: 0.6,
    });

    const reply =
      completion.choices[0]?.message?.content?.trim() ||
      "I'm here to help—tell me a bit more about what you're building and what success looks like.";

    if (lead?.email) {
      const transcript = normalizedMessages
        .slice(-10)
        .map((m) => {
          const speaker =
            m.role === 'assistant' ? 'Assistant' : m.role === 'system' ? 'System' : 'User';
          const safeContent = String(m.content ?? '').replace(/\n/g, '<br />');
          return `<p><strong>${speaker}:</strong> ${safeContent}</p>`;
        })
        .join('');

      const leadContext = lead.context ? `<p><strong>Context:</strong> ${lead.context}</p>` : '';
      const leadName = lead.name ? `<p><strong>Name:</strong> ${lead.name}</p>` : '';
      const from = process.env.RESEND_FROM_EMAIL || 'hello@pilonqubitventures.com';

      resend.emails
        .send({
          from,
          to: 'hello@pilonqubitventures.com',
          subject: 'New AI chat lead from PILON Qubit website',
          html: `
            <h3>New AI chat lead</h3>
            ${leadName}
            <p><strong>Email:</strong> ${lead.email}</p>
            ${leadContext}
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            <h4>Recent conversation</h4>
            ${transcript}
          `,
          reply_to: lead.email,
        })
        .catch((error) => {
          console.error('AI chat lead email failed:', error);
        });
    }

    return NextResponse.json({ ok: true, reply });
  } catch (err) {
    console.error('API /api/chat error:', err);
    return NextResponse.json(
      {
        ok: false,
        error:
          'There was a problem talking to the AI service. Please email hello@pilonqubitventures.com or use the main contact form.',
      },
      { status: 500 },
    );
  }
}

export function GET() {
  return NextResponse.json({
    ok: false,
    error: 'Use POST with a messages array to chat with the assistant.',
  });
}

export const OPTIONS = GET;
