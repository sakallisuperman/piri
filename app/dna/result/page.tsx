'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getQuestionsForMode,
  scoreChoiceIndex,
  type CoreDimension,
  type Mode,
  type ShadowSignal,
} from '../questions';

type Scores = Record<CoreDimension, number>;
type ShadowScores = Record<ShadowSignal, number>;
type AnswerMap = Record<string, number | string>;

function piriCommentTR(scores: Scores, topSignals: { key: ShadowSignal; value: number }[]) {
  const top = topSignals[0]?.key;

  if (top === 'avoidance') {
    return 'Kararsız değilsin. Bir şeyi açık tutarak kendini koruyorsun.';
  }
  if (top === 'control') {
    return 'Sorun risk değil. Kontrolü kaybetme ihtimali.';
  }
  if (top === 'perfectionism') {
    return 'Sorun cesaret değil. Doğru olanı kusursuz seçme baskısı.';
  }
  if (top === 'approval') {
    return 'Kendi sesin var. Ama başka sesler onu bastırabiliyor.';
  }
  if (top === 'abandonment') {
    return 'Belirsizlik senin için sadece belirsizlik değil. Tetiklenme alanı.';
  }
  if (top === 'innerCritic') {
    return 'En sert baskı dışarıdan değil. İçeriden geliyor olabilir.';
  }

  return 'Bir karar haritası oluştu. Şimdi paterni daha net okuyabiliriz.';
}

function dnaCode(scores: Scores) {
  const band = (v: number) => (v <= 33 ? 0 : v <= 66 ? 1 : 2);

  return `R${band(scores.risk)}-U${band(scores.uncertainty)}-G${band(scores.regret)}-A${band(
    scores.agency
  )}-E${band(scores.energy)}-T${band(scores.attachment)}`;
}

function signalLabel(signal: ShadowSignal) {
  switch (signal) {
    case 'perfectionism':
      return 'Mükemmeliyet baskısı';
    case 'approval':
      return 'Onay ihtiyacı';
    case 'abandonment':
      return 'Terk edilme hassasiyeti';
    case 'control':
      return 'Kontrol ihtiyacı';
    case 'avoidance':
      return 'Kaçınma eğilimi';
    case 'innerCritic':
      return 'İçsel eleştirmen';
    default:
      return signal;
  }
}

export default function DnaResultPage() {
  const router = useRouter();
  const [scores, setScores] = useState<Scores | null>(null);
  const [shadow, setShadow] = useState<ShadowScores | null>(null);
  const [textAnswers, setTextAnswers] = useState<string[]>([]);

  const mode = ((typeof window !== 'undefined'
    ? localStorage.getItem('piri_mode')
    : null) as Mode | null) ?? 'work';

  useEffect(() => {
    const rawStored = localStorage.getItem(`piri_answers_${mode}`);
    if (!rawStored) return;

    const answers: AnswerMap = JSON.parse(rawStored);
    const questions = getQuestionsForMode(mode);

    const coreRaw: Scores = {
      risk: 0,
      uncertainty: 0,
      regret: 0,
      agency: 0,
      energy: 0,
      attachment: 0,
    };

    const coreCount: Scores = {
      risk: 0,
      uncertainty: 0,
      regret: 0,
      agency: 0,
      energy: 0,
      attachment: 0,
    };

    const shadowRaw: ShadowScores = {
      perfectionism: 0,
      approval: 0,
      abandonment: 0,
      control: 0,
      avoidance: 0,
      innerCritic: 0,
    };

    const shadowCount: ShadowScores = {
      perfectionism: 0,
      approval: 0,
      abandonment: 0,
      control: 0,
      avoidance: 0,
      innerCritic: 0,
    };

    const texts: string[] = [];

    questions.forEach((q) => {
      const answer = answers[q.id];
      if (answer === undefined) return;

      if (q.inputType === 'text') {
        if (typeof answer === 'string' && answer.trim()) {
          texts.push(answer.trim());
        }
        return;
      }

      const index = Number(answer);
      const base = scoreChoiceIndex(index);
      const value = q.reverse ? 4 - base : base;

      coreRaw[q.primary] += value;
      coreCount[q.primary] += 1;

      q.secondary?.forEach((s) => {
        shadowRaw[s] += value;
        shadowCount[s] += 1;
      });
    });

    const normCore = (dim: CoreDimension) =>
      coreCount[dim] ? Math.round((coreRaw[dim] / (coreCount[dim] * 4)) * 100) : 0;

    const normShadow = (sig: ShadowSignal) =>
      shadowCount[sig] ? Math.round((shadowRaw[sig] / (shadowCount[sig] * 4)) * 100) : 0;

    setScores({
      risk: normCore('risk'),
      uncertainty: normCore('uncertainty'),
      regret: normCore('regret'),
      agency: normCore('agency'),
      energy: normCore('energy'),
      attachment: normCore('attachment'),
    });

    setShadow({
      perfectionism: normShadow('perfectionism'),
      approval: normShadow('approval'),
      abandonment: normShadow('abandonment'),
      control: normShadow('control'),
      avoidance: normShadow('avoidance'),
      innerCritic: normShadow('innerCritic'),
    });

    setTextAnswers(texts);
  }, [mode]);

  const topSignals = useMemo(() => {
    if (!shadow) return [];
    return Object.entries(shadow)
      .map(([key, value]) => ({ key: key as ShadowSignal, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);
  }, [shadow]);

  if (!scores || !shadow) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="fixed inset-0 bg-gradient-to-b from-[#EAF6FF] via-[#E6F4F1] to-[#F2F8FF]" />
        <div className="relative text-slate-700">Sonuç bulunamadı. Önce testi çöz.</div>
      </main>
    );
  }

  const rows = [
    { key: 'risk', label: 'Risk', value: scores.risk },
    { key: 'uncertainty', label: 'Belirsizlik', value: scores.uncertainty },
    { key: 'regret', label: 'Pişmanlık', value: scores.regret },
    { key: 'agency', label: 'Kontrol / Ajans', value: scores.agency },
    { key: 'energy', label: 'Enerji', value: scores.energy },
    { key: 'attachment', label: 'Bağlanma', value: scores.attachment },
  ] as const;

  const modeTitle =
    mode === 'work' ? 'İş' : mode === 'life' ? 'Yol' : 'Aşk';

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="fixed inset-0 bg-gradient-to-b from-[#EAF6FF] via-[#E6F4F1] to-[#F2F8FF]" />

      <div className="relative w-full max-w-4xl space-y-8">
        <div className="text-center space-y-3">
          <div className="text-sm text-slate-500">{modeTitle} · Decision Signature</div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Karar Haritan</h1>
          <p className="text-slate-700 text-lg max-w-2xl mx-auto">
            {piriCommentTR(scores, topSignals)}
          </p>
        </div>

        <div className="bg-white/55 border border-white/60 rounded-[28px] p-8 shadow-sm ring-1 ring-white/60 backdrop-blur-xl space-y-8">
          <div className="text-center">
            <p className="text-xs text-slate-500 mb-2 tracking-widest">GENOME</p>
            <p className="text-lg tracking-widest text-slate-900">{dnaCode(scores)}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {rows.map((item) => (
              <div key={item.key} className="flex items-center gap-4">
                <div
                  className="w-11 h-11 rounded-full bg-white/70 border border-white/70 flex items-center justify-center text-sm text-slate-900"
                  style={{
                    boxShadow: `0 0 ${Math.max(6, item.value / 6)}px rgba(15,23,42,0.18)`,
                  }}
                >
                  {Math.round(item.value)}
                </div>

                <div className="flex flex-col">
                  <span className="text-sm text-slate-700">{item.label}</span>
                  <div className="w-36 h-[4px] bg-slate-900/10 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-900" style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="text-sm font-medium text-slate-800">Baskın blokaj sinyalleri</div>
            <div className="flex flex-wrap gap-2">
              {topSignals.map((s) => (
                <span
                  key={s.key}
                  className="rounded-full bg-white/70 border border-white/70 px-4 py-2 text-sm text-slate-800"
                >
                  {signalLabel(s.key)}
                </span>
              ))}
            </div>
          </div>

          {textAnswers.length > 0 && (
            <div className="space-y-3">
              <div className="text-sm font-medium text-slate-800">Anlatı katmanı yakalandı</div>
              <div className="grid gap-3">
                {textAnswers.slice(0, 3).map((t, i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-white/65 border border-white/70 p-4 text-sm text-slate-700"
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center pt-2 space-y-4">
            <p className="text-slate-600 max-w-md mx-auto">
              Şimdi seni buraya getiren karara bakabiliriz.
            </p>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={() => router.push('/simulate')}
                className="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium transition hover:scale-[1.02] active:scale-[0.98]"
              >
                Simülasyonu Başlat
              </button>

              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 rounded-xl bg-white/70 text-slate-900 border border-white/70 font-medium transition hover:scale-[1.02] active:scale-[0.98]"
              >
                Başka Kapı Aç
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}