import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export async function POST(req: Request) {
  try {
    const { answers } = await req.json();

    if (!answers) {
      return NextResponse.json(
        { ok: false, error: 'Missing answers' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!openai) {
      // Return a demo scope
      return NextResponse.json({
        ok: true,
        scope: {
          title: `${answers.industry || 'Industry'} AI Transformation Project`,
          challenge: answers.challenge || 'Transform business operations with AI',
          approach: [
            'Phase 1: Discovery and requirements gathering (2 weeks)',
            'Phase 2: Architecture design and prototyping (3 weeks)',
            'Phase 3: Core development and integration (6-8 weeks)',
            'Phase 4: Testing, optimization, and deployment (2 weeks)',
            'Phase 5: Training and handoff (1 week)'
          ],
          technologies: ['Python', 'OpenAI GPT-4', 'Next.js', 'PostgreSQL', 'Docker', 'AWS/GCP'],
          timeline: answers.timeline || '3-4 months',
          team: answers.team || '2-3 engineers + 1 AI specialist',
          outcomes: [
            'Production-ready AI system',
            'Comprehensive documentation',
            'Team training and knowledge transfer',
            'Ongoing support and maintenance plan'
          ]
        }
      });
    }

    const prompt = `You are a senior consultant at PILON Qubit Ventures. Based on the following client answers, generate a comprehensive project scope.

Client Answers:
- Industry: ${answers.industry}
- Challenge/Goal: ${answers.challenge}
- Technical Requirements: ${answers.technical}
- Timeline: ${answers.timeline}
- Team: ${answers.team}

Generate a detailed project scope with the following structure (return as JSON):
{
  "title": "A professional project title",
  "challenge": "A clear restatement of the client's challenge (2-3 sentences)",
  "approach": ["Phase 1: ...", "Phase 2: ...", ...] (5-7 phases with brief descriptions),
  "technologies": ["Tech1", "Tech2", ...] (6-10 recommended technologies),
  "timeline": "Realistic timeline estimate",
  "team": "Recommended team composition",
  "outcomes": ["Outcome 1", "Outcome 2", ...] (4-6 expected outcomes)
}

Make it specific to their industry and challenge. Be realistic and professional. Focus on PILON Qubit's strengths: AI & Product Acceleration, Security & Reliability, and GTM & Analytics.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a senior consultant at PILON Qubit Ventures specializing in AI and frontier tech. Generate professional, realistic project scopes.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1000,
    });

    const scopeText = completion.choices[0]?.message?.content;
    
    if (!scopeText) {
      throw new Error('No response from AI');
    }

    const scope = JSON.parse(scopeText);

    return NextResponse.json({
      ok: true,
      scope
    });
  } catch (error: any) {
    console.error('Generate Scope Error:', error);
    
    return NextResponse.json(
      { ok: false, error: 'Failed to generate project scope' },
      { status: 500 }
    );
  }
}
