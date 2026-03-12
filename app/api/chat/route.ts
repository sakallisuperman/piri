import { NextRequest, NextResponse } from 'next/server';

// ───────────────────────────────────────────────
// POST /api/chat
// Prototype Piri — simulated local responses
// ───────────────────────────────────────────────

const REFLECTIVE_QUESTIONS = [
  'Ne zamandır böyle hissediyorsun?',
  'Seni en çok zorlayan kısım ne?',
  'Bu düşünce ilk ne zaman ortaya çıktı?',
  'Bunun senin için en riskli tarafı ne?',
];

type ChatRequest = {
  message: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<ChatRequest> | null;
    const message = body?.message ?? '';

    const randomIndex = Math.floor(Math.random() * REFLECTIVE_QUESTIONS.length);
    const reply = REFLECTIVE_QUESTIONS[randomIndex] ?? REFLECTIVE_QUESTIONS[0];

    return NextResponse.json(
      {
        reply,
        debug: {
          receivedMessageEmpty: !message,
          prototype: true,
        },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error('Chat prototype error:', err);

    return NextResponse.json(
      {
        reply: 'Şu an teknik bir aksaklık var ama seni duyuyorum. İçinden geçenleri bir cümleyle tekrar yazar mısın?',
        debug: {
          error: true,
          prototype: true,
        },
      },
      { status: 200 },
    );
  }
}
