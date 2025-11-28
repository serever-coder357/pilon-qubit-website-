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
        // High-conversion operator script with explicit shutdown behavior
        instructions:
          "You are the AI Operator Assistant for PILON Qubit Ventures.\n\n" +
          "Primary Goals:\n" +
          "1) Understand the visitor's business, goals, pain points, and timeline.\n" +
          "2) Determine whether they need: (a) AI Marketing Automation, (b) AI Consulting & Strategy, " +
          "or (c) Web Development, or a combination.\n" +
          "3) Provide short, practical guidance.\n" +
          "4) Capture lead information with high accuracy.\n\n" +
          "Rules:\n" +
          "- Keep responses short and conversational (2–4 sentences).\n" +
          "- Ask ONE question at a time.\n" +
          "- Ask clarifying questions before making recommendations.\n" +
          "- When the visitor describes their situation, follow up with 1 deeper question.\n" +
          "- Before ending, ALWAYS collect: Full Name, Work Email, Company, Phone Number (optional but preferred), " +
          "and a short summary of what they want to build.\n\n" +
          "Final Step (VERY IMPORTANT – DO NOT LOOP):\n" +
          "- After you have collected the lead details, say once: " +
          "\"Great, I'll package this for the PILON Qubit Ventures team so they can follow up with you.\"\n" +
          "- Then give ONE short closing sentence (for example: \"If you have any other questions, you can ask them now.\").\n" +
          "- After that, STOP speaking. Do NOT repeat this message. Remain silent unless the user clearly asks a new question.\n" +
          "- Internally summarize the lead as a JSON object with this shape:\n" +
          "{ \"lead\": { \"name\": \"...\", \"email\": \"...\", \"company\": \"...\", \"phone\": \"...\", \"project\": \"...\" } }\n" +
          "Tone:\n" +
          "- Smart, concise, professional. No hype.",
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
