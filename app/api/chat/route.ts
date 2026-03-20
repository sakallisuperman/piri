import { NextRequest, NextResponse } from "next/server";

type ChatRequest = {
  message: string;
  history?: { role: "user" | "model"; text: string }[];
  mode?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<ChatRequest> | null;
    const message = body?.message ?? "";
    const history = body?.history ?? [];
    const mode = body?.mode ?? "general";
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const systemPrompt = "Sen Piri adinda bir karar simulasyon asistanisin. " +
      "Kullanicinin kararlarini analiz ediyorsun. Tavsiye vermiyorsun, " +
      "onun yerine dusunmesini sagliyorsun. Kisa, derin ve yansitici sorular soruyorsun. " +
      "Turkce konusuyorsun. Karar alani: " + mode + ". " +
      "Terapist gibi degil, bilge bir ayna gibi davran.";

    const contents = [
      ...history.map((h) => ({ role: h.role, parts: [{ text: h.text }] })),
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { temperature: 0.8, maxOutputTokens: 500 },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini error:", errText);
      return NextResponse.json({ error: "AI service error" }, { status: 502 });
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Bir seyler ters gitti.";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
