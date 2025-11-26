// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_TO =
  process.env.CONTACT_TO ||
  process.env.PRODUCTION_EMAIL_TO ||
  "hello@pilonqubitventures.com";
const CONTACT_FROM = process.env.RESEND_FROM_EMAIL || "hello@pilonqubitventures.com";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || "Leads";

if (!RESEND_API_KEY) {
  console.error("Missing RESEND_API_KEY environment variable");
}

if (!CONTACT_TO) {
  console.error("Missing CONTACT_TO / PRODUCTION_EMAIL_TO environment variable");
}

/**
 * Create a lead record in Airtable.
 * Non-blocking for user: errors are logged but do not break the response.
 */
async function createAirtableRecord(params: {
  name?: string;
  email: string;
  phone?: string;
  message: string;
  source?: string;
}) {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
    console.warn(
      "Airtable env vars missing; skipping Airtable sync (AIRTABLE_API_KEY / AIRTABLE_BASE_ID / AIRTABLE_TABLE_NAME)"
    );
    return;
  }

  const { name, email, phone, message, source } = params;

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
        AIRTABLE_TABLE_NAME
      )}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            Name: name || "",
            Email: email,
            Phone: phone || "",
            Message: message,
            Source: source || "unknown",
          },
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Airtable record creation failed:", res.status, text);
      return;
    }

    const data = await res.json();
    console.log("Airtable lead created:", data.id || data);
  } catch (err) {
    console.error("Error calling Airtable API:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!RESEND_API_KEY) {
      return NextResponse.json(
        { success: false, error: "Missing RESEND_API_KEY environment variable" },
        { status: 500 },
      );
    }

    const resend = new Resend(RESEND_API_KEY);

    const body = await req.json();

    const {
      name,
      email,
      phone,
      message,
      source, // e.g. "website-contact-form" or "ai-assistant"
      context, // optional: extra JSON/string context (conversation transcript, etc.)
    } = body || {};

    if (!email || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: email and message.",
        },
        { status: 400 }
      );
    }

    const subjectSource = source ? ` (${source})` : "";
    const safeName =
      name && String(name).trim().length > 0
        ? String(name).trim()
        : "Not provided";
    const safePhone =
      phone && String(phone).trim().length > 0
        ? String(phone).trim()
        : "Not provided";

    const textLines = [
      `New website lead from Pilon Qubit`,
      "",
      `Name: ${safeName}`,
      `Email: ${email}`,
      `Phone: ${safePhone}`,
      `Source: ${source || "Not provided"}`,
      "",
      "Message:",
      String(message),
    ];

    if (context) {
      textLines.push(
        "",
        "Additional context:",
        typeof context === "string"
          ? context
          : JSON.stringify(context, null, 2)
      );
    }

    const text = textLines.join("\n");

    // 1) Email via Resend
    const emailResult = await resend.emails.send({
      from: `Pilon Qubit Website <${CONTACT_FROM}>`,
      to: [CONTACT_TO],
      reply_to: email,
      subject: `New website lead${subjectSource}`,
      text,
    });

    console.log("Resend lead email sent:", emailResult?.data?.id ?? emailResult);

    // 2) Airtable record (fire-and-forget)
    createAirtableRecord({
      name: safeName === "Not provided" ? undefined : safeName,
      email,
      phone: safePhone === "Not provided" ? undefined : safePhone,
      message: String(message),
      source,
    }).catch((err) => console.error("Airtable sync error:", err));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in /api/contact:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to send lead via email / Airtable.",
        details:
          process.env.NODE_ENV === "development"
            ? String(error?.message ?? error)
            : undefined,
      },
      { status: 500 }
    );
  }
}

const methodNotAllowedResponse = NextResponse.json(
  {
    success: false,
    error: "Use POST with name, email/phone, and message to contact the team.",
  },
  { status: 405 },
);

export function GET() {
  return methodNotAllowedResponse;
}

export function HEAD() {
  return methodNotAllowedResponse;
}

export const OPTIONS = GET;
