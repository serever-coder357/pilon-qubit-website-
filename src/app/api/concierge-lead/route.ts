// src/app/api/concierge-lead/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "edge";

const resend = new Resend(process.env.RESEND_API_KEY);

const DEFAULT_TO_EMAIL = "hello@pilonqubitventures.com";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("[concierge-lead] Missing RESEND_API_KEY");
      return NextResponse.json(
        { ok: false, error: "Email service not configured." },
        { status: 500 },
      );
    }

    const json = (await req.json().catch(() => null)) as
      | {
          name?: string;
          email?: string;
          company?: string;
          message?: string;
          pagePath?: string;
          pageSection?: string;
        }
      | null;

    if (!json) {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON body." },
        { status: 400 },
      );
    }

    const name = (json.name || "").trim();
    const email = (json.email || "").trim();
    const company = (json.company || "").trim();
    const message = (json.message || "").trim();
    const pagePath = (json.pagePath || "").trim();
    const pageSection = (json.pageSection || "").trim();

    if (!email || !message) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please provide at least an email and a short message.",
        },
        { status: 400 },
      );
    }

    const to = process.env.CONCIERGE_LEAD_TO || DEFAULT_TO_EMAIL;

    const subject = `New AI concierge lead from ${name || "website visitor"}`;

    const lines: string[] = [];

    lines.push(`Name: ${name || "Not provided"}`);
    lines.push(`Email: ${email}`);
    lines.push(`Company: ${company || "Not provided"}`);
    lines.push("");
    lines.push("Message:");
    lines.push(message || "(no message)");
    lines.push("");
    lines.push("Context:");
    lines.push(`- Source: AI concierge widget`);
    if (pagePath) lines.push(`- Page path: ${pagePath}`);
    if (pageSection) lines.push(`- Page section: ${pageSection}`);

    const textBody = lines.join("\n");

    await resend.emails.send({
      from: "Pilon Qubit Concierge <hello@pilonqubitventures.com>",
      to: [to],
      subject,
      // NOTE: property name must be "reply_to", not "replyTo"
      reply_to: email,
      text: textBody,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("[concierge-lead] error", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Unexpected error while sending your details.",
      },
      { status: 500 },
    );
  }
}
