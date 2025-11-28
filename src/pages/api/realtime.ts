// src/pages/api/realtime.ts
import type { NextApiRequest, NextApiResponse } from "next";

type ErrorResponse = { error: string; details?: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | ErrorResponse>,
) {
  // GET: simple browser test
  if (req.method === "GET") {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(200).send("POST only. Use POST /api/realtime.");
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST", "GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model =
    process.env.OPENAI_REALTIME_MODEL ??
    "gpt-4o-realtime-preview-2024-12-17";
  const voice = process.env.OPENAI_REALTIME_VOICE ?? "verse";

  if (!apiKey) {
    console.error("[pages/api/realtime] Missing OPENAI_API_KEY");
    return res
      .status(500)
      .json({ error: "Server misconfigured: OPENAI_API_KEY is not set." });
  }

  try {
    const upstream = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        voice,
        // Realtime now infers audio from the model/voice; no `audio` param.
        // We still provide clear instructions + modalities.
        instructions:
          "You are the AI operator assistant for PILON Qubit Ventures. " +
          "Your job is to understand the user's business and goals, then " +
          "recommend AI Marketing Automation, AI Consulting, or Web " +
          "Development. Keep responses short and practical. Before ending, " +
          "ask for name, email, company, and phone so the team can follow up.",
        modalities: ["text", "audio"],
      }),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      console.error("[pages/api/realtime] Failed to create session:", text);
      return res.status(500).json({
        error: "Failed to create realtime session",
        details: text,
      });
    }

    const data = await upstream.json();
    return res.status(200).json(data);
  } catch (err: any) {
    console.error("[pages/api/realtime] Unexpected error:", err);
    return res.status(500).json({
      error: "Unexpected error creating realtime session.",
      details: err?.message ?? String(err),
    });
  }
}
