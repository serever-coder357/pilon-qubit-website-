export type ServerEvent = {
  event: string;
  anonymousId?: string;
  userId?: string;
  properties?: Record<string, any>;
  context?: Record<string, any>;
};

export async function segmentTrack(ev: ServerEvent) {
  const key = process.env.SEGMENT_WRITE_KEY_SERVER;
  if (!key) throw new Error('Missing SEGMENT_WRITE_KEY_SERVER');
  const auth = Buffer.from(key + ':').toString('base64');
  const r = await fetch('https://api.segment.io/v1/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` },
    body: JSON.stringify({
      ...ev,
      context: { library: { name: 'pqv-capi-adapter', version: '0.1.0' }, ...(ev.context || {}) },
    }),
    cache: 'no-store',
  });
  if (!r.ok) { const text = await r.text(); throw new Error(`Segment error ${r.status}: ${text}`); }
}
