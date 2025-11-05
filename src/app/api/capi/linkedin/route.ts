import { NextResponse } from 'next/server';
import { segmentTrack } from '../_segment';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined;
    const ua = req.headers.get('user-agent') || undefined;
    const body = await req.json();
    const { event = 'Lead', anonymousId, userId, properties = {} } = body || {};

    await segmentTrack({ event, anonymousId, userId, properties: { ...properties, platform: 'linkedin' }, context: { ip, userAgent: ua } });
    return NextResponse.json({ ok: true });
  } catch (e: any) { return NextResponse.json({ ok: false, error: e?.message || 'error' }, { status: 500 }); }
}
