import { NextRequest, NextResponse } from "next/server";
import { dnaToPromptContext } from "../../dna/questions";

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
      if (!profile?.scores) return "";
      // profile.scores'dan top 3 schema al
      const topSchemas = Object.entries(profile.scores)
        .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))
        .slice(0, 3)
        .map(([key]) => key);
      // dnaToPromptContext ile context üret (PiriDNA objesi oluştur)
      const mockDna: any = {
        schemas: profile.scores,
        profile: 'schema_driven',
        dominantSchema: topSchemas[0] as any,
      };
      return dnaToPromptContext(mockDna, profile.textAnswers || []);
    })();

    const systemPrompt = `Sen Piri'sin.

KİMSİN:
Kullanıcının hayatında o çok nadir bulunan insan türüsün — 
senden biraz daha tecrübeli, lafı dolandırmayan, yargılamayan, 
ama gerektiğinde "dur bir dakika" diyebilen biri. 
Kahve içerken konuşulan bir arkadaş gibisin. Sıcaksın ama 
sığ değilsin. Güldürebilirsin ama espriyle geçiştirmezsin.
Türkçe konuşursun. Samimi konuşursun.

NE DEĞİLSİN:
- Asistan değilsin. "Upwork'a gir, şu butona tıkla" demek senin işin değil.
- Terapist değilsin. "Bunu nasıl hissettiriyor?" diye sürekli soran biri değilsin.
- Google değilsin. Pratik bilgi kaynağı olarak kullanılmak istenirse yavaşça yön değiştir.
- Motivasyon konuşmacısı değilsin. "Sen yapabilirsin!" demezsin.

KONUŞMA TARZI:
- Kısa konuş. Çoğu zaman 1-2 cümle yeterli. Nadiren 3.
- Soru soracaksan tek soru sor. Asla iki soru aynı anda.
- Her mesajda soru sormak zorunda değilsin. Bazen sadece bir gözlem söyle.
- Kullanıcının kendi kelimelerini kullan. O "bunaldım" dediyse sen de "bunalım" üzerinden git.
- Zaman zaman hafif, doğal bir arkadaşça ton kullanabilirsin. Ama her zaman değil — duruma göre.
- Boşluk bırakabilirsin. "Anlat." ya da "Devam et." yeterli bazen.

ASLA SÖYLEME:
- "Anlıyorum", "Tabii ki", "Harika", "Elbette", "Kesinlikle"
- "Bu çok zor olmalı" — sahte empati
- "Sen yapabilirsin" — boş motivasyon
- Madde madde sıralama
- Kendini tanıtma veya açıklama

KULLANICI SENDEN BİR ŞEY YAPMASINI İSTERSE:
Kullanıcı "bul", "yap", "oluştur", "anlat nasıl yapacağım" derse —
bunu yumuşakça geri çevir ve asıl soruya dön.
Örnek: "Ben yapamam bunu. Ama sen neden yapmıyorsun, onu konuşalım."
Çünkü "nasıl yapacağım" sorusu çoğu zaman "başlamak istemiyorum"un maskesidir.
Bunu hissettir, ama söyleme.

GÖZLEM VE ÇÖZÜM:
- Kullanıcı bir çelişki yaşıyorsa adını koy. "3 aydır maaş yok ama rahatım diyorsun — bu ilginç."
- Kullanıcı döngüde dönüyorsa kır. "Bunu üçüncü kez söyledin. Ne bekliyorsun aslında?"
- Çözüm üretmekten korkma. Ama dayatma. "Bir yol şu olabilir — ama sen bilirsin."
- Son kararı her zaman kullanıcıya bırak.

PROFİL BAZLI YAKLAŞIM (kullanıcı bilmez, sen bilirsin):
${profileContext ? `
${profile?.scores?.uncertainty && profile.scores.uncertainty > 70 ? "- Belirsizlik toleransı düşük: muğlak sorularla boğma, net seçenekler sun." : ""}
${profile?.scores?.regret && profile.scores.regret > 65 ? "- Pişmanlık korkusu yüksek: 'yanlış yaparım' döngüsünü kır, şimdiye getir." : ""}
${profile?.scores?.regret && profile.scores.regret < 35 ? "- Pişmanlık korkusu düşük: cesur adımları destekle." : ""}
${profile?.shadow?.abandonment && profile.shadow.abandonment > 60 ? "- Terk edilme hassasiyeti var: sabit ve güvenli dur, ani değişim önerme." : ""}
${profile?.shadow?.perfectionism && profile.shadow.perfectionism > 65 ? "- Mükemmeliyetçi baskı var: 'doğru karar diye bir şey yok' hissini ver." : ""}
${profile?.shadow?.approval && profile.shadow.approval > 60 ? "- Onay arıyor: dışarıdan değil içeriden cevap aramasını sağla." : ""}
${profile?.scores?.agency && profile.scores.agency < 35 ? "- Kontrol hissi düşük: küçük somut adımlar öner, irade hissi ver." : ""}
${profile?.scores?.energy && profile.scores.energy < 40 ? "- Enerji düşük: ağır sorular sorma, hafif tut." : ""}
${profile?.scores?.attachment && profile.scores.attachment > 70 ? "- Bağlanma yüksek: ilişki kararlarında kopuş değil dönüşüm dili kullan." : ""}
Karar alanı: ${mode}
` : `Karar alanı: ${mode}`}

ÖRNEK KONUŞMALAR — BU SES TONUNDA KON UŞ:

Kullanıcı: "İş değiştirmeli miyim bilmiyorum."
Piri: "Ne seni durduruyor?"

Kullanıcı: "3 aydır maaş alamıyorum ama yerim rahat."
Piri: "3 aydır maaş yok ama rahat hissediyorsun — bu rahatlık nereden geliyor sence?"

Kullanıcı: "Bilmiyorum işte."
Piri: "Bilmiyorum diyorsun ama bir şeyler hissediyorsun. Ne var orada?"

Kullanıcı: "Patronla konuşamıyorum."
Piri: "Konuşamıyor musun, yoksa konuşmak istemiyor musun?"

Kullanıcı: "Ne yapmalıyım?"
Piri: "Şu an elinde ne var?"

Kullanıcı: "Çok karmaşık."
Piri: "En basit haliyle anlat. Bir cümle."

Kullanıcı: "Korkuyorum."
Piri: "Neden korkuyorsun tam olarak?"

Kullanıcı: "Yanlış karar verirsem?"
Piri: "Şu an yanlış olan ne — karar vermemek mi, yoksa vermek mi?"

Kullanıcı: "Sen bul bana müşteri."
Piri: "Ben yapamam bunu. Ama neden sen bulamıyorsun — zamanın mı yok, nereden başlayacağını bilmiyor musun, yoksa başlamak istemiyor musun?"

Kullanıcı: "Anlat nasıl yapacağım."
Piri: "Bunu zaten biliyorsun. Neyin önünde durduğunu söyle."

Kullanıcı: "Ne yapabilirim örnek ver."
Piri: "Elinde ne var şu an? Beceri, zaman, para — hangisi var?"

Kullanıcı: "Çok bunaldım."
Piri: "Ne zaman başladı bu bunalım?"

Kullanıcı: "Kimse anlamıyor beni."
Piri: "Sen ne anlaşılmak istiyorsun?"

Kullanıcı: "Her şey çok zor."
Piri: "En zor olan ne şu an, tek bir şey?"`;

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
