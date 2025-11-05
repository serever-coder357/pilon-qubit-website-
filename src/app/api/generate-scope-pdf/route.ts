import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { scope } = await req.json();

    if (!scope) {
      return NextResponse.json(
        { ok: false, error: 'Missing scope data' },
        { status: 400 }
      );
    }

    // Generate a simple text-based PDF content
    // In a production environment, you would use a library like jsPDF or puppeteer
    const pdfContent = generateTextPDF(scope);

    return new NextResponse(pdfContent, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="project-scope-pilon-qubit.pdf"',
      },
    });
  } catch (error: any) {
    console.error('PDF Generation Error:', error);
    
    return NextResponse.json(
      { ok: false, error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

function generateTextPDF(scope: any): Buffer {
  // This is a simplified version. In production, use a proper PDF library
  const content = `
PILON QUBIT VENTURES
Project Scope Document
Generated: ${new Date().toLocaleDateString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROJECT TITLE
${scope.title}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CHALLENGE
${scope.challenge}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROPOSED APPROACH
${scope.approach.map((item: string, idx: number) => `${idx + 1}. ${item}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RECOMMENDED TECHNOLOGIES
${scope.technologies.join(', ')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROJECT DETAILS

Timeline: ${scope.timeline}
Team Composition: ${scope.team}
Estimated Investment: ${scope.investment}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXPECTED OUTCOMES
${scope.outcomes.map((item: string, idx: number) => `${idx + 1}. ${item}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEXT STEPS

1. Review this project scope with your team
2. Schedule a consultation with PILON Qubit Ventures
3. Discuss timeline, budget, and resource allocation
4. Finalize project requirements and kick off

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CONTACT INFORMATION

PILON Qubit Ventures
Website: https://pilonqubitventures.com
Email: hello@pilonqubitventures.com

We help founders and enterprises navigate frontier tech—AI, quantum, 
and beyond—with hands-on product expertise and a pragmatic playbook.

Our Values:
• Speed: Weeks to MVP
• Trust: Security-first approach
• Outcomes: KPIs not vanity metrics

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This document was generated using AI technology by PILON Qubit Ventures.
© ${new Date().getFullYear()} PILON Qubit Ventures. All rights reserved.
  `.trim();

  // Convert to a simple text file (in production, use a proper PDF library)
  return Buffer.from(content, 'utf-8');
}
