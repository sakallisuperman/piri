'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Outcome = {
  title: string;
  subtitle: string;
  timeline: { t: string; line: string }[];
};

export default function SimulatePage() {
  const router = useRouter();
  const [mode, setMode] = useState<string | null>(null);
  const [sub, setSub] = useState<string | null>(null);

  useEffect(() => {
    setMode(localStorage.getItem('piri_mode'));
    setSub(localStorage.getItem('piri_sub'));
  }, []);

  const outcomes: Outcome[] = useMemo(() => {
    // Şimdilik hardcoded “ilk simülasyon” — sonra DNA skorlarına göre dinamikleştireceğiz
    const decision = `${mode ?? ''} → ${sub ?? ''}`.trim();

    return [
      {
        title: 'Senaryo A: Hemen hareket',
        subtitle: decision || 'Seçimin',
        timeline: [
          { t: 'İlk 7 gün', line: 'Rahatlama + hız. Karar netleştiği için zihin sessizleşir.' },
          { t: '1–2 ay', line: 'Belirsizlik geri gelir. “Doğru mu yaptım?” sesi yükselir.' },
          { t: '3–6 ay', line: 'Yeni düzen oturur. Kalan risk: pişmanlık değil, “kontrol” ihtiyacı.' },
        ],
      },
      {
        title: 'Senaryo B: Kontrollü ilerleme',
        subtitle: decision || 'Seçimin',
        timeline: [
          { t: 'İlk 7 gün', line: 'Plan kurarsın. Stres düşer ama süreç uzar.' },
          { t: '1–2 ay', line: 'Netlik artar. Karar daha az “duygusal”, daha çok “stratejik” olur.' },
          { t: '3–6 ay', line: 'Daha az pişmanlık riski. Bedel: daha yavaş tatmin.' },
        ],
      },
      {
        title: 'Senaryo C: Erteleme',
        subtitle: decision || 'Seçimin',
        timeline: [
          { t: 'İlk 7 gün', line: 'Geçici rahatlama. Ama karar kafada yaşamaya devam eder.' },
          { t: '1–2 ay', line: 'Seçenekler artar gibi görünür; aslında enerji sızar.' },
          { t: '3–6 ay', line: 'Baskı yükselir. Pişmanlık riski genelde burada büyür.' },
        ],
      },
    ];
  }, [mode, sub]);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="fixed inset-0 bg-gradient-to-b from-[#EAF6FF] via-[#E6F4F1] to-[#F2F8FF]" />

      <div className="relative w-full max-w-4xl space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Simülasyon</h1>
          <p className="text-slate-600">
            {mode && sub ? (
              <>
                Seçim: <span className="font-medium text-slate-900">{mode} → {sub}</span>
              </>
            ) : (
              'Seçim bulunamadı. Geri dön ve bir kapı seç.'
            )}
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => router.push('/')}
              className="rounded-xl bg-white/60 px-5 py-2 text-sm text-slate-800 ring-1 ring-white/60 backdrop-blur-md hover:bg-white/75"
            >
              Kapılara Dön
            </button>
            <button
              onClick={() => router.push('/dna/result')}
              className="rounded-xl bg-slate-900 px-5 py-2 text-sm text-white hover:scale-[1.02] active:scale-[0.98]"
            >
              Karar Haritasına Dön
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {outcomes.map((o) => (
            <div
              key={o.title}
              className="bg-white/55 border border-white/60 rounded-[28px] p-6 shadow-sm ring-1 ring-white/60 backdrop-blur-xl"
            >
              <div className="space-y-2 mb-5">
                <div className="text-xs tracking-widest text-slate-500">OUTCOME</div>
                <div className="text-xl font-semibold text-slate-900">{o.title}</div>
                <div className="text-sm text-slate-600">{o.subtitle}</div>
              </div>

              <div className="space-y-4">
                {o.timeline.map((x) => (
                  <div key={x.t} className="space-y-1">
                    <div className="text-sm font-medium text-slate-800">{x.t}</div>
                    <div className="text-sm text-slate-600">{x.line}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center text-sm text-slate-600">
          Bu bir “tavsiye” değil. Senaryolar olasılık anlatısıdır. Karar senin.
        </div>
      </div>
    </main>
  );
}