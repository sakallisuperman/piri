import { NextRequest, NextResponse } from 'next/server';

// ───────────────────────────────────────────
// POST /api/tts
// Input: { text: string, voice?: string }
// Output: audio/mpeg stream
// ───────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { text, voice } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Missing text' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: voice || 'nova', // nova: warm, calm — Piri's voice
        response_format: 'mp3',
        speed: 0.95, // slightly slower for gravitas
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('TTS error:', errText);
      return NextResponse.json({ error: 'TTS service error' }, { status: 502 });
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400', // cache 24h
      },
    });
  } catch (err) {
    console.error('TTS error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
