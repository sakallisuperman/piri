import { NextRequest, NextResponse } from "next/server";

type ChatRequest = {
  message: string;
  history?: { role: "user" | "assistant"; text: string }[];
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

    const systemPrompt = "Sen Piri adinda bir karar simulasyon asistanisin. " +
      "Kullanicinin kararlarini analiz ediyorsun. Tavsiye vermiyorsun, " +
      "onun yerine dusunmesini sagliyorsun. Kisa, derin ve yansitici sorular soruyorsun. " +
      "Turkce konusuyorsun. Karar alani: " + mode + ". " +
      "Terapist gibi degil, bilge bir ayna gibi davran.";

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.map((h) => ({ role: h.role, content: h.text })),
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
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq error:", errText);
      return NextResponse.json({ error: "AI service error" }, { status: 502 });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "Bir seyler ters gitti.";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
