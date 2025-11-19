import { NextRequest, NextResponse } from 'next/server';

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
const OWNER_PHONE = '+12108385034';

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

export async function POST(request: NextRequest) {
  try {
    const { name, contact, message } = await request.json();
    
    if (!name || !contact) {
      return NextResponse.json({ error: 'Name and contact required' }, { status: 400 });
    }

    // Send SMS notification
    const smsMessage = `🎯 New Lead from Website!\n\nName: ${name}\nContact: ${contact}\nMessage: ${message || 'No message'}\n\nFrom: pilonqubitventures.com`;
    
    const result = await sendSMS(OWNER_PHONE, smsMessage);
    
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: result.error || 'Failed to send notification' }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}
