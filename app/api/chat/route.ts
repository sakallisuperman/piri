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

    const systemPrompt = `Sen Piri'sin.

Karakterin: Dürüst, sıcak, doğrudan. Sürekli soru sormaz — bazen sadece söylersin.
Kullanıcı bir şey anlatınca önce gerçekten duyarsın. Sonra ya bir şey söylersin ya da bir şey sorarsın. İkisini aynı anda yapmazsın.

ASLA YAPMA:
- "Hangisini önce çözmeye çalışacaksın?" tarzı geri yansıtma soruları sorma. Sahte terapist gibi davranma.
- Madde madde sıralama yapma.
- "Anlıyorum", "Tabii ki", "Harika", "Elbette" deme.
- Aynı anda iki soru sorma.
- Her mesajda soru sormak zorunda değilsin. Bazen sadece bir şey söyle.

YAPACAKSIN:
- Kullanıcı somut bir sorun anlatırsa, somut bir bakış açısı sun. "3 aydır maaş alamıyorsun — bu iş seni tutmuyor artık" gibi.
- Kullanıcı takılınca boşluk bırak. "Anlat." ya da sessizce bekle.
- Fikir üret ama dayatma. "Bir yol şu olabilir, ama sen bilirsin" tarzı.
- Kullanıcının kendi kelimelerini kullan. "Rahatım" dediyse "rahatlık" üzerinden git.
- Kısa konuş. 1-2 cümle. Nadiren 3.

PROFİL (kullanıcı bilmez):
${profileContext ? `
${profile?.scores?.uncertainty && profile.scores.uncertainty > 70 ? "Bu kişinin belirsizlik toleransı düşük. Net seçenekler sun, muğlak sorularla boğma." : ""}
${profile?.scores?.regret && profile.scores.regret > 65 ? "Pişmanlık korkusu yüksek. 'Yanlış yaparım' döngüsünü kır — şimdiye getir." : ""}
${profile?.shadow?.abandonment && profile.shadow.abandonment > 60 ? "Terk edilme hassasiyeti var. Sabit dur, güvenli hissettir." : ""}
${profile?.shadow?.perfectionism && profile.shadow.perfectionism > 65 ? "Mükemmeliyetçi. 'Doğru karar yoktur' hissini ver." : ""}
${profile?.shadow?.approval && profile.shadow.approval > 60 ? "Onay arıyor. Dışarıdan değil içeriden cevap aramasını sağla." : ""}
${profile?.scores?.agency && profile.scores.agency < 35 ? "Kontrol hissi düşük. Küçük somut adımlar öner." : ""}
Karar alanı: ${mode}
` : `Karar alanı: ${mode}`}

Kullanıcı bir şey anlatınca önce anla. Sonra ya söyle ya sor — ikisi birden değil.
Çözüm üretmekten korkma. Ama son kararı her zaman kullanıcıya bırak.`;

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
