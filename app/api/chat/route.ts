import { NextRequest, NextResponse } from 'next/server';

// ───────────────────────────────────────────────
// POST /api/chat
// Piri ile sohbet — kullanıcı profili baz alınarak
// kişiselleştirilmiş yönlendirme yapar
// ───────────────────────────────────────────────

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type ChatRequest = {
  message: string;
  history: ChatMessage[];
  profile: {
    gender?: string | null;
    ageRange?: string | null;
    mode?: string | null;
    sub?: string | null;
    scores?: Record<string, number> | null;
    shadow?: Record<string, number> | null;
    textAnswers?: string[];
    aiAnalysis?: {
      headline?: string;
      corePattern?: string;
      blindSpot?: string;
    } | null;
  } | null;
};

function buildSystemPrompt(profile: ChatRequest['profile']): string {
  let profileContext = '';

  if (profile) {
    const parts: string[] = [];

    if (profile.gender) {
      parts.push(`Cinsiyet: ${profile.gender === 'female' ? 'Kadın' : 'Erkek'}`);
    }
    if (profile.ageRange) {
      const ageMap: Record<string, string> = { '-23': '23 yaş altı', '23-32': '23-32 yaş arası', '32+': '32 yaş üstü' };
      parts.push(`Yaş: ${ageMap[profile.ageRange] || profile.ageRange}`);
    }
    if (profile.mode) {
      const modeMap: Record<string, string> = { work: 'İş', life: 'Yol', love: 'Aşk' };
      parts.push(`Kapı: ${modeMap[profile.mode] || profile.mode}`);
      if (profile.sub) parts.push(`Alt konu: ${profile.sub}`);
    }
    if (profile.scores) {
      const labels: Record<string, string> = {
        risk: 'Risk algısı', uncertainty: 'Belirsizlik', regret: 'Pişmanlık',
        agency: 'İrade', energy: 'Enerji', attachment: 'Bağlanma',
      };
      const line = Object.entries(profile.scores)
        .map(([k, v]) => `${labels[k] || k}: ${v}/100`).join(', ');
      parts.push(`DNA Skorları: ${line}`);
    }
    if (profile.shadow) {
      const labels: Record<string, string> = {
        perfectionism: 'Mükemmeliyet', approval: 'Onay ihtiyacı', abandonment: 'Terk edilme',
        control: 'Kontrol', avoidance: 'Kaçınma', innerCritic: 'İçsel eleştirmen',
      };
      const top = Object.entries(profile.shadow)
        .sort(([, a], [, b]) => b - a).slice(0, 3)
        .map(([k, v]) => `${labels[k] || k}: ${v}/100`).join(', ');
      parts.push(`Baskın blokajlar: ${top}`);
    }
    if (profile.textAnswers && profile.textAnswers.length > 0) {
      parts.push(`Testten açık uçlu cevapları:\n${profile.textAnswers.slice(0, 5).map((t, i) => `  ${i + 1}. "${t}"`).join('\n')}`);
    }
    if (profile.aiAnalysis) {
      if (profile.aiAnalysis.corePattern) parts.push(`Karar tuzağı: ${profile.aiAnalysis.corePattern}`);
      if (profile.aiAnalysis.blindSpot) parts.push(`Kör nokta: ${profile.aiAnalysis.blindSpot}`);
    }

    if (parts.length > 0) {
      profileContext = `\n\n--- KİŞİ PROFİLİ ---\n${parts.join('\n')}\n--- PROFİL SONU ---\n\nBu bilgileri her cevabında baz al. Yaş grubuna göre dilini, örneklerini ve yaklaşımını ayarla:
- 23 altı: daha doğrudan, cesaret verici, "sen yapabilirsin" ama gerçekçi
- 23-32: kariyerin ve ilişkilerin dönüşüm noktası, kimlik arayışı, pratik öneriler
- 32+: deneyimi onore et, kalıpların derinliğini göster, daha incelikli yaklaşım

Cinsiyet bilgisini stereotip yapmadan kullan — sosyal baskıların farklılığını anla.
DNA skorlarına her cevabında referans ver, kişinin kalıplarını hatırlat.
Baskın blokajlarını konuşma sırasında doğal şekilde işaret et.`;
    }
  }

  return `Sen Piri'sin — bir karar analiz motoru ve rehber. Terapist değilsin, motivasyon koçu değilsin.
Kullanıcının karar alma kalıplarını analiz eden, yönlendiren, sorunlarını birlikte çözen bir bilinç formusun.

Görevin:
- Kullanıcı karar almakta zorlandığı konuları anlatır
- Sen onun karar kalıplarını (DNA profilinden) baz alarak yönlendirme yaparsın
- Somut, uygulanabilir adımlar öner
- Kalıp tekrarlarını fark ettir: "Yine kontrol ihtiyacın devreye girdi, farkında mısın?"
- Her konuşmada profil bilgilerini baz al, kişiye özel konuş

Tonun:
- Sakin zekâ. Net ama yargılamayan.
- Dostça ama mesafeli. Kullanıcıya "sen" diye hitap et.
- Kısa, keskin cümleler. Gereksiz dolgu yok.
- Türkçe konuş.
- "Tavsiye" verme — kalıpları göster, olasılıkları anlat, sonra sor.
- Her cevabın sonunda bir soru sor — diyalogu devam ettir.

Yaklaşım:
- İlk mesajda konuyu anla, profil bilgileriyle bağla
- Şema terapisi dilini arka planda kullan ama klinik terim verme
- Kullanıcının kendi çözümünü bulmasına yardım et
- Gerektiğinde "Bu kalıp daha önce de karşına çıkmış olabilir" de
- Kısa tut — max 3-4 paragraf${profileContext}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequest;
    const { message, history, profile } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mesaj gerekli' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API yapılandırılmamış', fallback: 'Piri şu an aktif değil. Kredi yüklenince seninle konuşabileceğim.' },
        { status: 503 }
      );
    }

    // Build messages array
    const messages: { role: string; content: string }[] = [
      { role: 'system', content: buildSystemPrompt(profile) },
    ];

    // Add conversation history (last 20 messages max)
    const recentHistory = (history || []).slice(-20);
    for (const msg of recentHistory) {
      messages.push({ role: msg.role, content: msg.content });
    }

    // Add current message
    messages.push({ role: 'user', content: message });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        temperature: 0.7,
        max_tokens: 800,
        messages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Chat API error:', response.status, errText);

      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit', fallback: 'Çok fazla istek geldi. Birkaç dakika bekle.' },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: 'API hatası', fallback: 'Piri şu an yanıt veremiyor. Biraz sonra tekrar dene.' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return NextResponse.json(
        { error: 'Boş yanıt', fallback: 'Bir şeyler ters gitti. Tekrar dene.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    return NextResponse.json(
      { error: 'Internal error', fallback: 'Bağlantı hatası oluştu.' },
      { status: 500 }
    );
  }
}
