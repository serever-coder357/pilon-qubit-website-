import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  source?: string;
  turnstileToken?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactPayload | null;

    if (!body) {
      return NextResponse.json(
        {
          ok: false,
          success: false,
          error: "Invalid request body",
        },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      phone,
      company,
      message,
      source,
      turnstileToken,
    } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        {
          ok: false,
          success: false,
          error: "Missing required fields: name, email, message",
        },
        { status: 400 }
      );
    }

    // ---- Cloudflare Turnstile verification (server-side) ----
    if (!turnstileToken) {
      return NextResponse.json(
        {
          ok: false,
          success: false,
          error: "Missing Turnstile token",
        },
        { status: 400 }
      );
    }

    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (!turnstileSecret) {
      console.error("TURNSTILE_SECRET_KEY is not set");
      return NextResponse.json(
        {
          ok: false,
          success: false,
          error: "Server configuration error (Turnstile)",
        },
        { status: 500 }
      );
    }

    const ip =
      req.headers.get("CF-Connecting-IP") ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      undefined;

    const formData = new FormData();
    formData.append("secret", turnstileSecret);
    formData.append("response", turnstileToken);
    if (ip) {
      formData.append("remoteip", ip);
    }

    const turnstileResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      }
    );

    const turnstileResult = (await turnstileResponse.json()) as {
      success: boolean;
      "error-codes"?: string[];
      [key: string]: unknown;
    };

    if (!turnstileResult.success) {
      console.error("Turnstile verification failed:", turnstileResult);
      return NextResponse.json(
        {
          ok: false,
          success: false,
          error: "Turnstile verification failed",
          details: turnstileResult,
        },
        { status: 400 }
      );
    }

    // ---- Resend email sending ----

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      return NextResponse.json(
        {
          ok: false,
          success: false,
          error: "Server configuration error (Resend API key)",
        },
        { status: 500 }
      );
    }

    // TEMPORARY: use Resend’s verified sender to bypass DNS issues.
    // LATER: switch this back to "hello@pilonqubitventures.com" after domain verification.
    const fromAddress = "onboarding@resend.dev";

    const subject = `New website contact from ${name}`;
    const plainTextLines = [
      `New contact form submission from pilonqubitventures.com`,
      ``,
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : "",
      company ? `Company: ${company}` : "",
      source ? `Source: ${source}` : "",
      ``,
      `Message:`,
      message,
    ].filter(Boolean);

    const html = `
      <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.5; color: #111827;">
        <h2 style="font-size: 20px; margin-bottom: 12px;">New contact form submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${
          phone
            ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>`
            : ""
        }
        ${
          company
            ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>`
            : ""
        }
        ${
          source
            ? `<p><strong>Source:</strong> ${escapeHtml(source)}</p>`
            : ""
        }
        <hr style="margin: 16px 0;" />
        <p style="margin-bottom: 4px;"><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
      </div>
    `;

    const emailResult = await resend.emails.send({
      from: fromAddress,
      to: "hello@pilonqubitventures.com",
      reply_to: email,
      subject,
      text: plainTextLines.join("\n"),
      html,
    });

    if (emailResult.error) {
      console.error("Resend send error:", emailResult.error);
      return NextResponse.json(
        {
          ok: false,
          success: false,
          error: "Resend reported an error",
          details: emailResult.error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected /api/contact error:", error);
    return NextResponse.json(
      {
        ok: false,
        success: false,
        error: "Unexpected server error",
        details:
          error instanceof Error
            ? { message: error.message, stack: error.stack }
            : { raw: String(error) },
      },
      { status: 500 }
    );
  }
}

// Simple HTML escaping to avoid issues if someone injects tags into the form
function escapeHtml(value?: string) {
  if (!value) return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
