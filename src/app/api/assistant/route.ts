import { NextResponse } from "next/server";

type AssistantRequestBody = {
  message?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AssistantRequestBody;

    const userMessage = (body.message || "").toString().trim();

    if (!userMessage) {
      return NextResponse.json(
        { error: "Missing message" },
        { status: 400 },
      );
    }

    // Placeholder “brain” for now – we’ll replace this with real logic later.
    const reply =
      `Got it. You said: "${userMessage}". ` +
      `Right now I'm a simple router, but soon I'll classify intent (funding, partnership, advisory, etc.) and send a structured lead to your team.`;

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error in /api/assistant:", error);
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400 },
    );
  }
}
