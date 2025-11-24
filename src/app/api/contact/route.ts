import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(req: NextRequest) {
  if (!resend) {
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

    const name: string = String(body?.name ?? '').trim();
    const email: string = String(body?.email ?? '').trim();
    const company: string = String(body?.company ?? '').trim();
    const message: string = String(body?.message ?? '').trim();

    if (!name || !email) {
      return NextResponse.json(
        { ok: false, error: 'Name and email are required.' },
        { status: 400 },
      );
    }

    const from = process.env.RESEND_FROM_EMAIL || 'hello@pilonqubitventures.com';

    const htmlSections = [
      `<p><strong>Name:</strong> ${name}</p>`,
      `<p><strong>Email:</strong> ${email}</p>`,
    ];

    if (company) {
      htmlSections.push(`<p><strong>Company:</strong> ${company}</p>`);
    }

    if (message) {
      const safeMessage = message.replace(/\n/g, '<br />');
      htmlSections.push(`<p><strong>Message:</strong><br />${safeMessage}</p>`);
    }

    htmlSections.push(
      `<p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>`,
    );

    await resend.emails.send({
      from,
      to: 'hello@pilonqubitventures.com',
      subject: 'New lead from PILON Qubit website contact form',
      html: htmlSections.join(''),
      reply_to: email,
    });

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
