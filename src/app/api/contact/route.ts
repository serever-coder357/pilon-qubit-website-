import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper: read JSON or form-data safely
async function parseRequest(req: Request) {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return await req.json();
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const formData = await req.formData();
    const obj: Record<string, string> = {};
    formData.forEach((value, key) => {
      obj[key] = String(value);
    });
    return obj;
  }

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const obj: Record<string, string> = {};
    formData.forEach((value, key) => {
      obj[key] = String(value);
    });
    return obj;
  }

  // Fallback: try JSON anyway
  try {
    return await req.json();
  } catch {
    return {};
  }
}

export async function POST(req: Request) {
  try {
    const body = await parseRequest(req);

    const name = (body.name || body.fullName || "").toString().trim();
    const email = (body.email || body.from || "").toString().trim();
    const phone = (body.phone || body.phoneNumber || "").toString().trim();
    const message = (body.message || body.notes || body.text || "").toString().trim();
    const source = (body.source || body.origin || "Website contact form").toString().trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          ok: false,
          success: false,
          error: "Missing required fields",
          details: { name: !!name, email: !!email, message: !!message },
        },
        { status: 400 },
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("Missing RESEND_API_KEY env var");
      return NextResponse.json(
        {
          ok: false,
          success: false,
          error: "Server email configuration error",
        },
        { status: 500 },
      );
    }

    const subject = `New ${source} lead: ${name}`;

    // FROM: verified domain (email.pilonqubitventures.com)
    // TO: your primary inbox
    const fromAddress = "Pilon Qubit Ventures <hello@email.pilonqubitventures.com>";
    const toAddress = "hello@pilonqubitventures.com";

    const html = `
      <h2>New website lead from ${source}</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br/>")}</p>
    `;

    const text = `
New website lead from ${source}

Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}\n` : ""}

Message:
${message}
`.trim();

    const resendResult = await resend.emails.send({
      from: fromAddress,
      to: [toAddress],
      reply_to: email,
      subject,
      html,
      text,
    });

    if ((resendResult as any).error) {
      console.error("Resend reported an error:", (resendResult as any).error);
      return NextResponse.json(
        {
          ok: false,
          success: false,
          error: "Resend reported an error",
          details: (resendResult as any).error,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, success: true });
  } catch (err: any) {
    console.error("Unexpected /api/contact error:", err);
    return NextResponse.json(
      {
        ok: false,
        success: false,
        error: "Unexpected server error",
      },
      { status: 500 },
    );
  }
}
