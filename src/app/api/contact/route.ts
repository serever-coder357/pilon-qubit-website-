import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// All leads (forms + AI widget) should end up here.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      phone,
      message,
      source,      // e.g. "website-contact-form" or "ai-assistant"
      context,     // optional: extra JSON/string context (e.g. conversation transcript)
    } = body || {};

    if (!email || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: email and message.' },
        { status: 400 },
      );
    }

    const subjectSource = source ? ` (${source})` : '';
    const safeName = name && String(name).trim().length > 0 ? String(name).trim() : 'Not provided';
    const safePhone = phone && String(phone).trim().length > 0 ? String(phone).trim() : 'Not provided';

    const textLines = [
      `New website lead from Pilon Qubit`,
      '',
      `Name: ${safeName}`,
      `Email: ${email}`,
      `Phone: ${safePhone}`,
      `Source: ${source || 'Not provided'}`,
      '',
      'Message:',
      String(message),
    ];

    if (context) {
      textLines.push('', 'Additional context:', typeof context === 'string' ? context : JSON.stringify(context, null, 2));
    }

    const text = textLines.join('\n');

    const data = await resend.emails.send({
      // If your Resend domain is different, adjust this "from" line.
      from: 'Pilon Qubit Website <hello@pilonqubitventures.com>',
      to: ['hello@pilonqubitventures.com'],
      reply_to: email,
      subject: `New website lead${subjectSource}`,
      text,
    });

    // Optional: log the Resend id for debugging in Vercel logs
    console.log('Resend lead email sent:', data?.data?.id ?? data);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in /api/contact:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send lead via email.',
        details: process.env.NODE_ENV === 'development' ? String(error?.message ?? error) : undefined,
      },
      { status: 500 },
    );
  }
}
