import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { ok: false, error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!openai) {
      return NextResponse.json({
        ok: false,
        error: 'Transcription service not configured',
      }, { status: 503 });
    }

    // Convert File to format OpenAI expects
    const buffer = await audioFile.arrayBuffer();
    const blob = new Blob([buffer], { type: audioFile.type });
    const file = new File([blob], audioFile.name, { type: audioFile.type });

    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'en',
    });

    return NextResponse.json({
      ok: true,
      text: transcription.text,
    });
  } catch (error: any) {
    console.error('Transcription Error:', error);
    
    return NextResponse.json({
      ok: false,
      error: 'Failed to transcribe audio',
    }, { status: 500 });
  }
}
