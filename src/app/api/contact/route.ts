import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function verifyTurnstile(token: string | undefined, ip: string | null) {
  if (!process.env.TURNSTILE_SECRET_KEY) return { success: true, code: 'demo_mode' } as const;
  if (!token) return { success: true, code: 'demo_mode' } as const;
  const form = new URLSearchParams();
  form.append('secret', process.env.TURNSTILE_SECRET_KEY);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);

  const resp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST', body: form, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, cache: 'no-store',
  });
  const data = await resp.json();
  return { success: !!data.success, code: data['error-codes']?.[0] } as const;
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;
    const json = await req.json();
    const { name, email, company, message, turnstileToken } = json || {};

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    const check = await verifyTurnstile(turnstileToken, ip);
    if (!check.success && check.code !== 'demo_mode') {
      return NextResponse.json({ ok: false, error: `Verification failed: ${check.code || 'invalid'}` }, { status: 400 });
    }

    const to = process.env.CONTACT_TO_EMAIL!;
    const from = process.env.CONTACT_FROM_EMAIL!;

    if (resend) {
      await resend.emails.send({
        from, to, subject: `New website inquiry from ${name}`,
        text: `Name: ${name}
Email: ${email}
Company: ${company || '-'}

Message:
${message}`,
      });
    } else {
      console.log('Demo mode: Email would be sent to', to, 'from', name);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
