import { NextRequest, NextResponse } from 'next/server';

// ───────────────────────────────────────────────
// POST /api/analyze
// Input: mode, scores, shadow, textAnswers, sub
// Output: AI-generated analysis, simulation, action
// ───────────────────────────────────────────────

type CoreDimension = 'risk' | 'uncertainty' | 'regret' | 'agency' | 'energy' | 'attachment';
type ShadowSignal = 'perfectionism' | 'approval' | 'abandonment' | 'control' | 'avoidance' | 'innerCritic';

type AnalyzeRequest = {
  mode: 'work' | 'life' | 'love';
  sub: string;
  scores: Record<CoreDimension, number>;
  shadow: Record<ShadowSignal, number>;
  textAnswers: string[];
  lang: 'tr' | 'en';
};

const SHADOW_NAMES_TR: Record<ShadowSignal, string> = {
  perfectionism: 'Mükemmeliyet baskısı',
  approval: 'Onay ihtiyacı',
  abandonment: 'Terk edilme hassasiyeti',
  control: 'Kontrol ihtiyacı',
  avoidance: 'Kaçınma eğilimi',
  innerCritic: 'İçsel eleştirmen',
};

const CORE_NAMES_TR: Record<CoreDimension, string> = {
  risk: 'Risk algısı',
  uncertainty: 'Belirsizlik hassasiyeti',
  regret: 'Pişmanlık eğilimi',
  agency: 'Kontrol / irade',
  energy: 'Enerji durumu',
  attachment: 'Bağlanma kalıbı',
};

function buildSystemPrompt(): string {
  return `Sen Piri'sin — bir karar analiz motoru. Terapist değilsin, motivasyon koçu değilsin. 
Kullanıcının karar alma kalıplarını analiz eden, olası sonuçları gösteren bir bilinç formusun.

Tonun:
- Sakin zekâ. Net ama yargılamayan.
- Dostça ama mesafeli. Kullanıcıya "sen" diye hitap et.
- Şema terapisi dilini KULLANMA — arka planda ol ama terapötik etiket verme.
- Kısa, keskin cümleler. Gereksiz dolgu yok.
- "Tavsiye" verme — kalıpları göster, olasılıkları anlat.

Jeffrey E. Young & Janet S. Klosko'nun şema terapisi yaklaşımını arka planda kullan:
- Erken dönem yaşam tuzaklarını (lifetraps) tespit et ama klinik isim verme
- Tekrar eden kalıpları göster
- Kaçınma, teslim olma ve aşırı telafi stratejilerini işaret et
- Kullanıcının kendi sesini bulmasına yardım et

JSON formatında yanıt ver. Başka hiçbir şey yazma.`;
}

function buildUserPrompt(data: AnalyzeRequest): string {
  const modeLabel = data.mode === 'work' ? 'İş' : data.mode === 'life' ? 'Yol' : 'Aşk';

  // Top 3 shadow signals
  const topShadow = Object.entries(data.shadow)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([k, v]) => `${SHADOW_NAMES_TR[k as ShadowSignal]}: ${v}/100`)
    .join(', ');

  // Core scores
  const coreLines = Object.entries(data.scores)
    .map(([k, v]) => `${CORE_NAMES_TR[k as CoreDimension]}: ${v}/100`)
    .join(', ');

  // Text answers
  const textBlock = data.textAnswers.length > 0
    ? `\n\nKullanıcının açık uçlu cevapları:\n${data.textAnswers.map((t, i) => `${i + 1}. "${t}"`).join('\n')}`
    : '';

  return `Kapı: ${modeLabel}
Alt konu: ${data.sub}

Core skorlar: ${coreLines}
Baskın blokaj sinyalleri: ${topShadow}
${textBlock}

Şimdi bu verilerle aşağıdaki JSON yapısını üret:

{
  "analysis": {
    "headline": "Tek cümlelik keskin tespit (max 15 kelime)",
    "paragraphs": [
      "1. paragraf: Kullanıcının temel karar kalıbı ne? Tekrar eden döngüyü anlat. (3-4 cümle)",
      "2. paragraf: Bu kalıbın görünmeyen bedeli ne? Neyi kaybediyor farkında olmadan? (3-4 cümle)", 
      "3. paragraf: Kullanıcının açık uçlu cevaplarından çıkan en önemli sinyal. (3-4 cümle)"
    ],
    "blindSpot": "Kullanıcının görmediği ama verilerin gösterdiği şey (1-2 cümle)",
    "corePattern": "Bu kişinin karar verirken düştüğü temel tuzak — isim ver (yaratıcı, klinik değil, max 5 kelime)"
  },
  "simulation": {
    "scenarioA": {
      "title": "Hemen hareket edersen",
      "timeline": [
        {"period": "İlk 7 gün", "text": "DNA skorlarına göre bu kişi için ne olur (2 cümle)"},
        {"period": "1-2 ay", "text": "..."},
        {"period": "3-6 ay", "text": "..."}
      ],
      "risk": "En büyük risk (1 cümle)",
      "gain": "En büyük kazanım (1 cümle)"
    },
    "scenarioB": {
      "title": "Kontrollü ilerlersen",
      "timeline": [
        {"period": "İlk 7 gün", "text": "..."},
        {"period": "1-2 ay", "text": "..."},
        {"period": "3-6 ay", "text": "..."}
      ],
      "risk": "...",
      "gain": "..."
    },
    "scenarioC": {
      "title": "Ertelersen",
      "timeline": [
        {"period": "İlk 7 gün", "text": "..."},
        {"period": "1-2 ay", "text": "..."},
        {"period": "3-6 ay", "text": "..."}
      ],
      "risk": "...",
      "gain": "..."
    }
  },
  "action": {
    "today": "Bugün yapabileceğin en küçük ama en dürüst adım (1-2 cümle)",
    "thisWeek": "Bu hafta için somut bir öneri (1-2 cümle)",
    "question": "Kendine sorman gereken bir soru (tek soru)"
  }
}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AnalyzeRequest;

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(body);
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini error:', errText);
      return NextResponse.json(
        { error: 'AI service error' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      return NextResponse.json(
        { error: 'Empty AI response' },
        { status: 502 }
      );
    }

    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error('Analyze error:', err);
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    );
  }
}
