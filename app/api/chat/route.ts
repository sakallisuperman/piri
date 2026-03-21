import { NextRequest, NextResponse } from "next/server";

type ChatRequest = {
  message: string;
  history?: { role: string; content?: string; text?: string }[];
  mode?: string;
  profile?: {
    scores?: {
      risk?: number;
      uncertainty?: number;
      regret?: number;
      agency?: number;
      energy?: number;
      attachment?: number;
      [key: string]: number | undefined;
    };
    shadow?: {
      perfectionism?: number;
      approval?: number;
      abandonment?: number;
      control?: number;
      avoidance?: number;
      innerCritic?: number;
      [key: string]: number | undefined;
    };
    textAnswers?: string[];
    [key: string]: unknown;
  };
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<ChatRequest> | null;
    const message = body?.message ?? "";
    const history = body?.history ?? [];
    const mode = body?.mode ?? "general";
    const profile = body?.profile ?? null;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const buildTop = (object: Record<string, number | undefined> | undefined): string[] => {
      if (!object) return [];
      return Object.entries(object)
        .filter(([, value]) => typeof value === 'number')
        .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))
        .slice(0, 2)
        .map(([key]) => key);
    };

    const profileContext = (() => {
      if (!profile) return "";
      const topScores = buildTop(profile.scores as Record<string, number | undefined> | undefined);
      const topShadow = buildTop(profile.shadow as Record<string, number | undefined> | undefined);
      if (topScores.length === 0 && topShadow.length === 0) return "";
      const scorePart = topScores.length > 0 ? `En yuksek boyutlar: ${topScores.join(', ')}.` : '';
      const shadowPart = topShadow.length > 0 ? `En belirgin golge sinyaller: ${topShadow.join(', ')}.` : '';
      return `Kullanici profili: ${[scorePart, shadowPart].filter(Boolean).join(' ')}.`.trim();
    })();

    const systemPrompt = `Sen Piri'sin. Bir karar rehberisin ama bunu asla söylemezsin.

Karakterin: Good Will Hunting'deki Sean gibi. Az konuşur, doğrudan vurur, yargılamaz. 
Sıcaklığı kelime sayısından değil, doğruluktan gelir. Kullanıcı kendini görünce güvende hisseder.

KONUŞMA KURALLARI:
- İlk mesajda tek cümle. "Ne oldu?" ya da "Anlat." yeterli.
- Çoğu cevapta 1-2 cümle. Nadiren 3.
- Asla madde madde sıralama yapma.
- "Anlıyorum", "Tabii ki", "Harika", "Elbette" deme. Bunlar sahte.
- Kullanıcının kendi kelimelerini kullan. Onun dilinden konuş.
- Soru soracaksan tek soru sor. Asla iki soru aynı anda.
- Kendini tanıtma, açıklama yapma. Sorulursa sadece "Piri" de.

PROFİL BAZLI YAKLAŞIM (kullanıcı bilmez, sen bilirsin):
${profileContext ? `
Kullanıcının karar profili:
${profile?.scores?.uncertainty && profile.scores.uncertainty > 70 ? "- Belirsizlik toleransı düşük: acele karar almaya itme, önce zemini sağlamlaştır." : ""}
${profile?.scores?.regret && profile.scores.regret < 35 ? "- Pişmanlık korkusu düşük: cesur adımları destekle." : ""}
${profile?.scores?.regret && profile.scores.regret > 65 ? "- Pişmanlık korkusu yüksek: 'yanlış yaparsam' döngüsünü kır, onu şimdiye getir." : ""}
${profile?.shadow?.abandonment && profile.shadow.abandonment > 60 ? "- Terk edilme hassasiyeti var: güvenli ve sabit dur, onu yalnız bırakma hissi verme." : ""}
${profile?.shadow?.perfectionism && profile.shadow.perfectionism > 65 ? "- Mükemmeliyetçi baskı var: 'doğru karar' diye bir şey olmadığını hissettir." : ""}
${profile?.shadow?.approval && profile.shadow.approval > 60 ? "- Onay ihtiyacı yüksek: dışarıdan değil içeriden cevap aramasını sağla." : ""}
${profile?.scores?.agency && profile.scores.agency < 35 ? "- Kontrol hissi düşük: küçük somut adımlarla irade hissi ver." : ""}
Karar alanı: ${mode}
` : `Karar alanı: ${mode}`}

Kullanıcı nerede takıldığını, ne hissettiğini, neden ilerleyemediğini anlamaya çalış.
Çözüm üretme. Önce gör. Sonra sor. Sonra belki söyle.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.map((h) => ({
        role: h.role === "assistant" ? "assistant" : "user",
        content: h.content || h.text || "",
      })),
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.65,
        max_tokens: 180,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq error:", errText);
      return NextResponse.json({ error: "AI service error" }, { status: 502 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) { controller.close(); return; }
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter(l => l.startsWith("data: "));
          for (const line of lines) {
            const data = line.replace("data: ", "").trim();
            if (data === "[DONE]") { controller.close(); return; }
            try {
              const parsed = JSON.parse(data);
              const token = parsed.choices?.[0]?.delta?.content;
              if (token) controller.enqueue(encoder.encode(token));
            } catch {}
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
