import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

// ---- Types ----

type ContactRequestBody = {
  name?: string;
  email?: string;
  company?: string;
  role?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  source?: string;
};

// ---- Helpers ----

function jsonError(message: string, status: number) {
  return NextResponse.json(
    {
      ok: false,
      success: false,
      error: message,
    },
    { status }
  );
}

function sanitizeString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function buildPlainTextEmail(payload: Required<Pick<ContactRequestBody, "name" | "email" | "message">> & ContactRequestBody) {
  const lines: string[] = [];

  lines.push(`New contact from Pilon Qubit Ventures website`);
  lines.push("");
  lines.push(`Name: ${payload.name}`);
  lines.push(`Email: ${payload.email}`);

  if (payload.company) lines.push(`Company: ${payload.company}`);
  if (payload.role) lines.push(`Role: ${payload.role}`);
  if (payload.budget) lines.push(`Budget: ${payload.budget}`);
  if (payload.timeline) lines.push(`Timeline: ${payload.timeline}`);
  if (payload.source) lines.push(`Source: ${payload.source}`);

  lines.push("");
  lines.push("Message:");
  lines.push(payload.message);

  return lines.join("\n");
}

function buildHtmlEmail(payload: Required<Pick<ContactRequestBody, "name" | "email" | "message">> & ContactRequestBody) {
  return `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.5; color: #0f172a;">
      <h2>New contact from Pilon Qubit Ventures website</h2>
      <p><strong>Name:</strong> ${payload.name}</p>
      <p><strong>Email:</strong> ${payload.email}</p>
      ${payload.company ? `<p><strong>Company:</strong> ${payload.company}</p>` : ""}
      ${payload.role ? `<p><strong>Role:</strong> ${payload.role}</p>` : ""}
      ${payload.budget ? `<p><strong>Budget:</strong> ${payload.budget}</p>` : ""}
      ${payload.timeline ? `<p><strong>Timeline:</strong> ${payload.timeline}</p>` : ""}
      ${payload.source ? `<p><strong>Source:</strong> ${payload.source}</p>` : ""}
      <hr style="margin: 16px 0;" />
      <p><strong>Message:</strong></p>
      <p>${payload.message.replace(/\n/g, "<br />")}</p>
    </div>
  `;
}

// ---- Handler ----

export async function POST(req: NextRequest) {
  try {
    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return jsonError("Invalid JSON body", 400);
    }

    if (!body || typeof body !== "object") {
      return jsonError("Request body must be an object", 400);
    }

    const raw = body as ContactRequestBody;

    const name = sanitizeString(raw.name) ?? "Unknown";
    const email = sanitizeString(raw.email);
    const message = sanitizeString(raw.message);

    const company = sanitizeString(raw.company);
    const role = sanitizeString(raw.role);
    const budget = sanitizeString(raw.budget);
    const timeline = sanitizeString(raw.timeline);
    const source = sanitizeString(raw.source);

    if (!email) {
      return jsonError("Email is required", 400);
    }

    if (!message) {
      return jsonError("Message is required", 400);
    }

    const payload: Required<Pick<ContactRequestBody, "name" | "email" | "message">> &
      ContactRequestBody = {
      name,
      email,
      message,
      company,
      role,
      budget,
      timeline,
      source,
    };

    // --- Send email via Resend ---

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error("Contact API: RESEND_API_KEY is not set. Skipping email send.");
    } else {
      const resend = new Resend(resendApiKey);

      const toEmail = process.env.CONTACT_TO_EMAIL || "hello@pilonqubitventures.com";
      const fromEmail =
        process.env.CONTACT_FROM_EMAIL || "Pilon Qubit Ventures <hello@pilonqubitventures.com>";

      try {
        await resend.emails.send({
          from: fromEmail,
          to: toEmail,
          subject: `New contact from ${payload.name}`,
          reply_to: payload.email,
          text: buildPlainTextEmail(payload),
          html: buildHtmlEmail(payload),
        });
      } catch (err) {
        console.error("Contact API: Resend email send failed:", err);
        // We still continue; we don't want to expose 500s to the user unless everything is broken
      }
    }

    // --- Optional: Airtable or other CRM sync ---
    // If you already have an Airtable sync somewhere else, you can re-insert it here.
    // Keep it as "fire and forget" so it doesn't block the user:
    //
    // someAsyncSync(payload).catch((err) => console.error("Airtable sync error:", err));

    // --- Final success response (what the frontend cares about) ---

    return NextResponse.json(
      {
        ok: true,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact API: unexpected error", error);

    return NextResponse.json(
      {
        ok: false,
        success: false,
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
