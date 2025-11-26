// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_TO =
  process.env.CONTACT_TO ||
  process.env.PRODUCTION_EMAIL_TO ||
  "hello@pilonqubitventures.com";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || "Leads";

let resend: Resend | null = null;

if (!RESEND_API_KEY) {
  console.error(
    "RESEND_API_KEY is not set. /api/contact will still try Airtable, but email sending is disabled."
  );
} else {
  resend = new Resend(RESEND_API_KEY);
}

async function createAirtableRecord(params: {
  name?: string;
  email: string;
  phone?: string;
  message: string;
  source?: string;
}) {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
    console.warn(
      "Airtable env vars missing; skipping Airtable sync (AIRTABLE_API_KEY / AIRTABLE_BASE_ID / AIRTABLE_TABLE_NAME)."
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
    const body = await req.json();

    const {
      name,
      email,
      phone,
      message,
      source, // "website-contact-form" | "ai-assistant" etc.
      context,
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

    const lines: string[] = [
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
      lines.push(
        "",
        "Additional context:",
        typeof context === "string"
          ? context
          : JSON.stringify(context, null, 2)
      );
    }

    const text = lines.join("\n");

    // 1) Email via Resend (if configured)
    if (resend && CONTACT_TO) {
      const emailResult = await resend.emails.send({
        from: `Pilon Qubit Website <${CONTACT_TO}>`,
        to: [CONTACT_TO],
        reply_to: email,
        subject: `New website lead${subjectSource}`,
        text,
      });

      console.log(
        "Resend lead email sent:",
        emailResult?.data?.id ?? emailResult
      );
    } else {
      console.warn(
        "Resend or CONTACT_TO missing; skipping email send, only Airtable will be used."
      );
    }

    // 2) Airtable record (non-blocking for user)
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

export async function GET() {
  return NextResponse.json(
    {
      info:
        "Pilon Qubit contact endpoint is alive. Send a POST request with lead fields (email, message, ...).",
    },
    { status: 200 }
  );
}
