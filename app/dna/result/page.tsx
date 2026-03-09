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

type TimelineItem = { period: string; text: string };
type Scenario = {
  title: string;
  timeline: TimelineItem[];
  risk: string;
  gain: string;
};

type AIAnalysis = {
  analysis: {
    headline: string;
    paragraphs: string[];
    blindSpot: string;
    corePattern: string;
  };
  simulation: {
    scenarioA: Scenario;
    scenarioB: Scenario;
    scenarioC: Scenario;
  };
  action: {
    today: string;
    thisWeek: string;
    question: string;
  };
};

function signalLabel(signal: ShadowSignal) {
  const map: Record<ShadowSignal, string> = {
    perfectionism: 'Mükemmeliyet baskısı',
    approval: 'Onay ihtiyacı',
    abandonment: 'Terk edilme hassasiyeti',
    control: 'Kontrol ihtiyacı',
    avoidance: 'Kaçınma eğilimi',
    innerCritic: 'İçsel eleştirmen',
  };
  return map[signal] || signal;
}

function dnaCode(scores: Scores) {
  const band = (v: number) => (v <= 33 ? 0 : v <= 66 ? 1 : 2);
  return `R${band(scores.risk)}-U${band(scores.uncertainty)}-G${band(scores.regret)}-A${band(scores.agency)}-E${band(scores.energy)}-T${band(scores.attachment)}`;
}

// Fallback comment when AI is loading or fails
function fallbackComment(topSignals: { key: ShadowSignal; value: number }[]) {
  const top = topSignals[0]?.key;
  if (top === 'avoidance') return 'Kararsız değilsin. Bir şeyi açık tutarak kendini koruyorsun.';
  if (top === 'control') return 'Sorun risk değil. Kontrolü kaybetme ihtimali.';
  if (top === 'perfectionism') return 'Sorun cesaret değil. Doğru olanı kusursuz seçme baskısı.';
  if (top === 'approval') return 'Kendi sesin var. Ama başka sesler onu bastırabiliyor.';
  if (top === 'abandonment') return 'Belirsizlik senin için sadece belirsizlik değil. Tetiklenme alanı.';
  if (top === 'innerCritic') return 'En sert baskı dışarıdan değil. İçeriden geliyor olabilir.';
  return 'Bir karar haritası oluştu. Şimdi paterni daha net okuyabiliriz.';
}

export default function DnaResultPage() {
  const router = useRouter();
  const [scores, setScores] = useState<Scores | null>(null);
  const [shadow, setShadow] = useState<ShadowScores | null>(null);
  const [textAnswers, setTextAnswers] = useState<string[]>([]);
  const [aiResult, setAiResult] = useState<AIAnalysis | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);
  const [activeScenario, setActiveScenario] = useState<'A' | 'B' | 'C'>('A');

  const mode = ((typeof window !== 'undefined'
    ? localStorage.getItem('piri_mode')
    : null) as Mode | null) ?? 'work';

  const sub = (typeof window !== 'undefined'
    ? localStorage.getItem('piri_sub')
    : null) ?? '';

  // Calculate scores
  useEffect(() => {
    const rawStored = localStorage.getItem(`piri_answers_${mode}`);
    if (!rawStored) return;

    const answers: AnswerMap = JSON.parse(rawStored);
    const questions = getQuestionsForMode(mode);

    const coreRaw: Scores = { risk: 0, uncertainty: 0, regret: 0, agency: 0, energy: 0, attachment: 0 };
    const coreCount: Scores = { risk: 0, uncertainty: 0, regret: 0, agency: 0, energy: 0, attachment: 0 };
    const shadowRaw: ShadowScores = { perfectionism: 0, approval: 0, abandonment: 0, control: 0, avoidance: 0, innerCritic: 0 };
    const shadowCount: ShadowScores = { perfectionism: 0, approval: 0, abandonment: 0, control: 0, avoidance: 0, innerCritic: 0 };
    const texts: string[] = [];

    questions.forEach((q) => {
      const answer = answers[q.id];
      if (answer === undefined) return;

      if (q.inputType === 'text') {
        if (typeof answer === 'string' && answer.trim()) texts.push(answer.trim());
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

    const newScores: Scores = {
      risk: normCore('risk'), uncertainty: normCore('uncertainty'), regret: normCore('regret'),
      agency: normCore('agency'), energy: normCore('energy'), attachment: normCore('attachment'),
    };
    const newShadow: ShadowScores = {
      perfectionism: normShadow('perfectionism'), approval: normShadow('approval'),
      abandonment: normShadow('abandonment'), control: normShadow('control'),
      avoidance: normShadow('avoidance'), innerCritic: normShadow('innerCritic'),
    };

    setScores(newScores);
    setShadow(newShadow);
    setTextAnswers(texts);
  }, [mode]);

  // Call AI once scores are ready
  useEffect(() => {
    if (!scores || !shadow) return;

    // Check if we already have cached result
    const cached = localStorage.getItem(`piri_ai_${mode}`);
    if (cached) {
      try {
        setAiResult(JSON.parse(cached));
        return;
      } catch { /* ignore */ }
    }

    setAiLoading(true);
    setAiError(false);

    fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode,
        sub,
        scores,
        shadow,
        textAnswers,
        lang: 'tr',
      }),
    })
      .then((r) => {
        if (!r.ok) throw new Error('API error');
        return r.json();
      })
      .then((data: AIAnalysis) => {
        setAiResult(data);
        localStorage.setItem(`piri_ai_${mode}`, JSON.stringify(data));
      })
      .catch(() => setAiError(true))
      .finally(() => setAiLoading(false));
  }, [scores, shadow, mode, sub, textAnswers]);

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
        <div className="fixed inset-0 bg-gradient-to-b from-[#f5faff] via-[#edf6ff] to-[#f5fbff]" />
        <div className="relative text-slate-700">Sonuç bulunamadı. Önce testi çöz.</div>
      </main>
    );
  }

  const rows = [
    { key: 'risk', label: 'Risk Algısı', value: scores.risk },
    { key: 'uncertainty', label: 'Belirsizlik', value: scores.uncertainty },
    { key: 'regret', label: 'Pişmanlık', value: scores.regret },
    { key: 'agency', label: 'İrade / Kontrol', value: scores.agency },
    { key: 'energy', label: 'Enerji', value: scores.energy },
    { key: 'attachment', label: 'Bağlanma', value: scores.attachment },
  ] as const;

  const modeTitle = mode === 'work' ? 'İş' : mode === 'life' ? 'Yol' : 'Aşk';
  const ai = aiResult;
  const scenarios = ai ? [
    { key: 'A' as const, data: ai.simulation.scenarioA },
    { key: 'B' as const, data: ai.simulation.scenarioB },
    { key: 'C' as const, data: ai.simulation.scenarioC },
  ] : [];

  const activeData = scenarios.find(s => s.key === activeScenario)?.data;

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="fixed inset-0 bg-gradient-to-b from-[#f5faff] via-[#edf6ff] to-[#f5fbff]" />

      <div className="relative w-full max-w-3xl space-y-8 py-12">

        {/* ── Header ── */}
        <div className="text-center space-y-3">
          <div className="text-sm text-slate-500 tracking-wide">{modeTitle} · Karar İmzası</div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            {ai ? ai.analysis.headline : 'Karar Haritan'}
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            {ai ? '' : fallbackComment(topSignals)}
          </p>
        </div>

        {/* ── AI Loading ── */}
        {aiLoading && (
          <div className="text-center space-y-4 py-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/55 border border-white/60 backdrop-blur-xl">
              <div className="w-5 h-5 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
              <span className="text-slate-700">Piri analiz ediyor...</span>
            </div>
          </div>
        )}

        {/* ── AI Analysis ── */}
        {ai && (
          <div className="card space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white via-[rgba(210,230,255,0.9)] to-[rgba(165,200,255,0.4)] border border-white/80 shadow-sm flex-shrink-0" />
              <div>
                <p className="text-xs tracking-widest text-slate-400 uppercase">Piri</p>
                {ai.analysis.corePattern && (
                  <p className="text-sm font-medium text-slate-700">{ai.analysis.corePattern}</p>
                )}
              </div>
            </div>
            {ai.analysis.paragraphs.map((p, i) => (
              <p key={i} className="text-slate-700 leading-relaxed">{p}</p>
            ))}
            {ai.analysis.blindSpot && (
              <div className="rounded-2xl bg-slate-900/[0.03] border border-slate-900/[0.06] p-5">
                <p className="text-xs tracking-widest text-slate-400 uppercase mb-2">Kör Nokta</p>
                <p className="text-slate-800 font-medium">{ai.analysis.blindSpot}</p>
              </div>
            )}
          </div>
        )}

        {/* ── DNA Scores ── */}
        <div className="card space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs tracking-widest text-slate-400 uppercase">Karar DNA</p>
            <p className="text-sm tracking-widest text-slate-600 font-mono">{dnaCode(scores)}</p>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {rows.map((item) => (
              <div key={item.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">{item.label}</span>
                  <span className="text-sm font-medium text-slate-900">{item.value}</span>
                </div>
                <div className="w-full h-[5px] bg-slate-900/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-900 rounded-full transition-all duration-700"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-2">
            <p className="text-xs tracking-widest text-slate-400 uppercase">Baskın Blokaj Sinyalleri</p>
            <div className="flex flex-wrap gap-2">
              {topSignals.map((s) => (
                <span key={s.key} className="tag">
                  {signalLabel(s.key)} <span className="text-slate-400 ml-1">{s.value}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Simulation (AI) ── */}
        {ai && (
          <div className="card space-y-6">
            <p className="text-xs tracking-widest text-slate-400 uppercase">Simülasyon</p>

            {/* Scenario tabs */}
            <div className="flex gap-2">
              {scenarios.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setActiveScenario(s.key)}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                    activeScenario === s.key
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white/60 text-slate-600 hover:bg-white/80'
                  }`}
                >
                  {s.data.title}
                </button>
              ))}
            </div>

            {/* Active scenario */}
            {activeData && (
              <div className="space-y-5 animate-fadeUp">
                {activeData.timeline.map((t, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-900 mt-1.5" />
                      {i < activeData.timeline.length - 1 && (
                        <div className="w-px flex-1 bg-slate-200 my-1" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium text-slate-900 mb-1">{t.period}</p>
                      <p className="text-sm text-slate-600 leading-relaxed">{t.text}</p>
                    </div>
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-xl bg-red-50/50 border border-red-100/60 p-4">
                    <p className="text-xs text-red-400 uppercase tracking-wide mb-1">Risk</p>
                    <p className="text-sm text-red-800">{activeData.risk}</p>
                  </div>
                  <div className="rounded-xl bg-emerald-50/50 border border-emerald-100/60 p-4">
                    <p className="text-xs text-emerald-400 uppercase tracking-wide mb-1">Kazanım</p>
                    <p className="text-sm text-emerald-800">{activeData.gain}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Action Steps (AI) ── */}
        {ai && (
          <div className="card space-y-5">
            <p className="text-xs tracking-widest text-slate-400 uppercase">Şimdi Ne Yapabilirsin</p>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-medium flex-shrink-0">1</div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Bugün</p>
                  <p className="text-slate-800">{ai.action.today}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-medium flex-shrink-0">2</div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Bu hafta</p>
                  <p className="text-slate-800">{ai.action.thisWeek}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-900 flex items-center justify-center text-xs flex-shrink-0">?</div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Kendine sor</p>
                  <p className="text-slate-800 italic">{ai.action.question}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Text Answers ── */}
        {textAnswers.length > 0 && !ai && (
          <div className="card space-y-3">
            <p className="text-xs tracking-widest text-slate-400 uppercase">Senin Sözlerin</p>
            <div className="grid gap-3">
              {textAnswers.slice(0, 3).map((t, i) => (
                <div key={i} className="rounded-2xl bg-white/65 border border-white/70 p-4 text-sm text-slate-700">
                  &ldquo;{t}&rdquo;
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── AI Error fallback ── */}
        {aiError && (
          <div className="text-center text-sm text-slate-500">
            Piri şu an derinlemesine analiz yapamıyor. Temel haritanı yukarıda görebilirsin.
          </div>
        )}

        {/* ── Footer actions ── */}
        <div className="text-center space-y-4 pt-4">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => {
                // Clear AI cache to get fresh analysis
                localStorage.removeItem(`piri_ai_${mode}`);
                window.location.reload();
              }}
              className="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium transition hover:scale-[1.02] active:scale-[0.98]"
            >
              Yeniden Analiz Et
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 rounded-xl bg-white/70 text-slate-900 border border-white/70 font-medium transition hover:scale-[1.02] active:scale-[0.98]"
            >
              Başka Kapı Aç
            </button>
          </div>
          <p className="text-sm text-slate-400">
            Bu bir tavsiye değil. Karar haritası bir ayna — gördüğün şey senindir.
          </p>
        </div>
      </div>

      <style jsx global>{`
        .card {
          background: rgba(255,255,255,0.55);
          border: 1px solid rgba(255,255,255,0.60);
          border-radius: 28px;
          padding: 28px;
          box-shadow: 0 2px 8px rgba(15,23,42,0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 8px 16px;
          border-radius: 999px;
          background: rgba(255,255,255,0.70);
          border: 1px solid rgba(255,255,255,0.70);
          font-size: 14px;
          color: #1e293b;
        }
        .animate-fadeUp {
          animation: fadeUp 0.4s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
