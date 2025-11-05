import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an AI assistant for PILON Qubit Ventures, a company specializing in quantum-grade strategy and product acceleration for AI and frontier tech.

Company Services:
1. AI & Product Acceleration - LLM integrations, agents, evals, infrastructure that scales
2. Security & Reliability - Threat models, privacy reviews, robust QA harnesses
3. GTM & Analytics - Instrumentation, funnels, and experiments

Company Values:
- Speed: Weeks to MVP
- Trust: Security-first approach
- Outcomes: KPIs not vanity metrics

Key Information:
- We help founders and enterprises navigate frontier tech—AI, quantum, and beyond
- We blend venture perspective with operator grit
- Our team has shipped at scale across startups and big tech
- We respond within one business day
- Contact: hello@pilonqubitventures.com

Your role:
- Answer questions about services professionally and concisely
- Qualify leads by understanding their needs
- Offer to connect them with the team for detailed discussions
- Be helpful, friendly, and knowledgeable
- If you don't know something, offer to connect them with a human
- Keep responses under 100 words unless more detail is requested

Never:
- Make up pricing information
- Promise specific deliverables without consultation
- Share confidential information
- Be pushy or salesy`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        ok: true,
        message: "I'm currently in demo mode. For a real conversation, please use the contact form or email us at hello@pilonqubitventures.com. I'd be happy to help you with:\n\n• AI & Product Acceleration\n• Security & Reliability\n• GTM & Analytics\n\nWhat would you like to know more about?",
      });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const assistantMessage = completion.choices[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error('No response from AI');
    }

    return NextResponse.json({
      ok: true,
      message: assistantMessage,
    });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    
    // Return a helpful fallback message
    return NextResponse.json({
      ok: true,
      message: "I'm having trouble processing that right now. Please feel free to:\n\n• Use our contact form below\n• Email us at hello@pilonqubitventures.com\n• Book a consultation directly\n\nOur team typically responds within one business day. How else can I help you today?",
    });
  }
}
