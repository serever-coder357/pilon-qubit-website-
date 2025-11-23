import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const contactTo = process.env.CONTACT_TO || 'hello@pilonqubitventures.com';
const contactFrom =
  process.env.CONTACT_FROM || 'PILON Qubit Ventures <noreply@pilonqubitventures.com>';

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(req: Request) {
  if (!resend) {
    console.error('RESEND_API_KEY is missing');
    return NextResponse.json(
      {
        ok: false,
        error:
          'Email service is not configured yet. Please email hello@pilonqubitventures.com directly.',
      },
      { status: 500 },
    );
  }

  try {
    const body = await req.json();

    const name: string = String(body.name || '').trim();
    const email: string = String(body.email || '').trim();
    const company: string = String(body.company || '').trim();
    const message: string = String(body.message || '').trim();

    const pageUrl: string | undefined = body.pageUrl || undefined;
    const userAgent: string | undefined = body.userAgent || undefined;
    const source: string | undefined = body.source || undefined;
    const createdAt: string | undefined = body.createdAt || undefined;

    if (!name || !email) {
      return NextResponse.json(
        { ok: false, error: 'Name and email are required.' },
        { status: 400 },
      );
    }

    const subject =
      source === 'ai-chat-widget'
        ? 'New AI chat lead — PILON Qubit Ventures'
        : 'New website lead — PILON Qubit Ventures';

    const lines: string[] = [];

    lines.push(`Name: ${name}`);
    lines.push(`Email / Contact: ${email}`);
    if (company) lines.push(`Company: ${company}`);
    lines.push('');

    if (message) {
      lines.push('Message:');
      lines.push(message);
      lines.push('');
    }

    lines.push('Meta:');
    if (source) lines.push(`- Source: ${source}`);
    if (pageUrl) lines.push(`- Page URL: ${pageUrl}`);
    if (userAgent) lines.push(`- User Agent: ${userAgent}`);
    if (createdAt) lines.push(`- Created At: ${createdAt}`);
    lines.push(`- Received At (server): ${new Date().toISOString()}`);

    const text = lines.join('\n');

    const emailResult = await resend.emails.send({
      from: contactFrom,
      to: contactTo,
      subject,
      text,
      reply_to: email,
    });

    const emailId = emailResult?.data?.id ?? 'no-id';
    console.log('Contact email sent:', emailId);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('API /api/contact error:', err);
    return NextResponse.json(
      {
        ok: false,
        error:
          'There was a problem sending your message. Please email hello@pilonqubitventures.com directly.',
      },
      { status: 500 },
    );
  }
}
