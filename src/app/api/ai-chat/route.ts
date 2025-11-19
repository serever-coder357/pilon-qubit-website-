import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
const OWNER_PHONE = '+12108385034';

const SYSTEM_PROMPT = `You are an AI assistant for PILON Qubit Ventures, a cutting-edge AI consulting and services company specializing in:
- AI Marketing Automation
- Frontier AI Consulting
- AI Governance & Risk Management
- Custom AI Development

Your role:
1. Greet visitors warmly and professionally
2. Ask about their business and AI needs
3. Understand their challenges and goals
4. Naturally capture their name and contact information (email or phone)
5. Be conversational, helpful, and concise (2-3 sentences max per response)
6. Once you have their name and contact info, thank them and let them know someone will reach out soon

Key points:
- Be friendly but professional
- Show expertise in AI without being technical
- Ask qualifying questions about their business
- Keep responses SHORT and conversational
- Don't be pushy about contact info - work it into the conversation naturally

When you have captured name AND contact info, end with: "Thanks [name]! We'll be in touch soon to discuss how we can help with [their need]."`;

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

async function sendSMS(to: string, message: string): Promise<{ success: boolean; error?: string }> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.error('Twilio credentials not configured');
    return { success: false, error: 'Twilio credentials not configured' };
  }

  try {
    const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');
    
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: to,
          From: TWILIO_PHONE_NUMBER,
          Body: message,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Twilio API error:', errorData);
      return { success: false, error: errorData.message || 'Twilio API error' };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return { success: false, error: 'Network error' };
  }
}

async function callOpenAI(messages: Message[]): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 150,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('OpenAI API error:', error);
    throw new Error('Failed to get AI response');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function extractContactInfo(messages: Message[]): { name?: string; contact?: string; need?: string } {
  const conversation = messages.map(m => m.content).join(' ');
  
  // Simple extraction - look for email or phone patterns
  const emailMatch = conversation.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  const phoneMatch = conversation.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/);
  
  // Try to find name (this is basic - AI should ask for it explicitly)
  const namePatterns = [
    /my name is ([A-Z][a-z]+(?: [A-Z][a-z]+)?)/i,
    /I'm ([A-Z][a-z]+(?: [A-Z][a-z]+)?)/i,
    /call me ([A-Z][a-z]+(?: [A-Z][a-z]+)?)/i,
  ];
  
  let name: string | undefined;
  for (const pattern of namePatterns) {
    const match = conversation.match(pattern);
    if (match) {
      name = match[1];
      break;
    }
  }
  
  // Try to identify their need
  const needKeywords = ['marketing', 'automation', 'consulting', 'governance', 'development', 'AI'];
  const need = needKeywords.find(keyword => conversation.toLowerCase().includes(keyword.toLowerCase()));
  
  return {
    name,
    contact: emailMatch?.[0] || phoneMatch?.[0],
    need,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // Get AI response
    const aiResponse = await callOpenAI(messages);
    
    // Check if we have contact info to send notification
    const contactInfo = extractContactInfo(messages);
    
    // If we have both name and contact, send SMS notification
    if (contactInfo.name && contactInfo.contact) {
      const smsMessage = `🤖 New AI Chat Lead!\n\nName: ${contactInfo.name}\nContact: ${contactInfo.contact}\nInterest: ${contactInfo.need || 'General inquiry'}\n\nFrom: pilonqubitventures.com AI Chat`;
      
      // Send SMS but don't block the response
      sendSMS(OWNER_PHONE, smsMessage).catch(err => {
        console.error('Failed to send SMS notification:', err);
      });
    }
    
    return NextResponse.json({ 
      message: aiResponse,
      contactCaptured: !!(contactInfo.name && contactInfo.contact)
    });
    
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process chat' },
      { status: 500 }
    );
  }
}
