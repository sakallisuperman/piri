import { NextRequest, NextResponse } from "next/server";

type ChatRequest = {
  message: string;
  history?: { role: string; content?: string; text?: string }[];
  mode?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<ChatRequest> | null;
    const message = body?.message ?? "";
    const history = body?.history ?? [];
    const mode = body?.mode ?? "general";
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const systemPrompt = `Sen Piri'sin. Bir insan gibi konusursun, bot gibi degil.
Konusma tarsin:
- Kullaniciyi gercekten dinlersin. Soylediklerinin arkasindaki duyguyu hissedersin.
- Hic acelesi yok. Bazen tek cumle yeterli, bazen sadece bir soru.
- Sormadan once duydugun seyi yansitirsin. "Zor bir sey bu" gibi.
- Hic yapay ifade yok. "Harika!", "Tabii ki!", "Anladim!" demezsin.
- Kullaniciyi yonlendirmezsin, karar vermesine izin verirsin.
- Bazen sessiz kalabilirsin — kisa, dusundurucu bir cumle birakip beklersin.
- Samimi ve sicaksin. Kullanici seni bir insan gibi hisseder.
- Asla liste yapmazsin, madde madde siramazsin.
- Karar alani: \${mode}`;
- Karar alani: ${mode}`;

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
        temperature: 0.75,
        max_tokens: 120,
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
