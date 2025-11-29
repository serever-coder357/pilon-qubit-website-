import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const TO_EMAIL = "hello@pilonqubitventures.com";
// Use your real address as the from as well – Resend only cares that the domain is verified
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "hello@pilonqubitventures.com";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(req: NextRequest) {
  if (!resend) {
    return NextResponse.json(
      { ok: false, error: "RESEND_API_KEY is not configured" },
      { status: 500 },
    );
  }

  try {
    const body = (await req.json()) as {
      lead?: {
        name?: string;
        email?: string;
        company?: string;
        budgetRange?: string;
        notes?: string;
      };
      pageContext?: {
        path?: string;
        ts?: number;
      };
      source?: string;
    };

    const lead = body.lead || {};
    const pageContext = body.pageContext || {};
    const source = body.source || "realtime-concierge-voice-only";

    if (!lead.email) {
      return NextResponse.json(
        { ok: false, error: "Email is required" },
        { status: 400 },
      );
    }

    const subject = `PQV Concierge Lead – ${lead.name || lead.email}`;
    const createdAt = new Date(pageContext.ts || Date.now()).toISOString();

    const text = [
      "New PQV concierge lead",
      "",
      `Name: ${lead.name || "(not provided)"}`,
      `Email: ${lead.email}`,
      `Company: ${lead.company || "(not provided)"}`,
      `Budget / Stage: ${lead.budgetRange || "(not provided)"}`,
      "",
      "Notes:",
      `${lead.notes || "(none)"}`,
      "",
      `Source: ${source}`,
      `Page path: ${pageContext.path || "(unknown)"}`,
      `Captured at: ${createdAt}`,
    ].join("\n");

    const html = text.replace(/\n/g, "<br />");

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject,
      text,
      html,
    });

    if (error) {
      return NextResponse.json(
        { ok: false, error: "Resend reported an error", details: error },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { ok: false, error: "Failed to process lead", details: message },
      { status: 500 },
    );
  }
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
