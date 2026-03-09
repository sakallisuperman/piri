'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getQuestionsForMode,
  CHOICE_5,
  type Mode,
  type Question,
} from '../questions';

type AnswerMap = Record<string, number | string>;

type TransitionState = {
  visible: boolean;
  nextLayer: 2 | 3 | null;
  text: string;
};

// 5-button colors: red → orange → gray → green → dark green
const AGREE_COLORS = [
  { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', text: '#dc2626', hoverBg: 'rgba(239,68,68,0.22)' },
  { bg: 'rgba(249,115,22,0.10)', border: 'rgba(249,115,22,0.25)', text: '#ea580c', hoverBg: 'rgba(249,115,22,0.20)' },
  { bg: 'rgba(148,163,184,0.10)', border: 'rgba(148,163,184,0.25)', text: '#64748b', hoverBg: 'rgba(148,163,184,0.20)' },
  { bg: 'rgba(34,197,94,0.10)', border: 'rgba(34,197,94,0.25)', text: '#16a34a', hoverBg: 'rgba(34,197,94,0.20)' },
  { bg: 'rgba(22,163,74,0.12)', border: 'rgba(22,163,74,0.3)', text: '#15803d', hoverBg: 'rgba(22,163,74,0.22)' },
];

const AGREE_LABELS_SHORT = ['✕', '−', '○', '+', '✓'];

function DnaTestInner() {
  const router = useRouter();

  const mode = ((typeof window !== 'undefined'
    ? localStorage.getItem('piri_mode')
    : null) as Mode | null) ?? 'work';

  const questions = useMemo(() => getQuestionsForMode(mode), [mode]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>(() => {
    if (typeof window === 'undefined') return {};
    // Restore partial answers from layer 1 if returning from signup
    const partial = localStorage.getItem(`piri_answers_${mode}_partial`);
    if (partial) {
      try { return JSON.parse(partial); } catch { return {}; }
    }
    return {};
  });
  const [selected, setSelected] = useState<number | null>(null);
  const [textValue, setTextValue] = useState('');
  const [transition, setTransition] = useState<TransitionState>({
    visible: false,
    nextLayer: null,
    text: '',
  });
  const [animating, setAnimating] = useState(false);
  const initializedRef = useRef(false);

  // Set initial index based on ?layer=2 param (after signup)
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const layerParam = new URLSearchParams(window.location.search).get('layer');
    const isSignedUp = localStorage.getItem('piri_signed_up') === 'true';

    if (layerParam === '2' && isSignedUp) {
      const qs = getQuestionsForMode(mode);
      const idx = qs.findIndex(q => q.layer === 2);
      if (idx >= 0) {
        setCurrentIndex(idx);
      }
    }
  }, [mode]);

  const question = questions[currentIndex];

  function nextAfterAnswer(nextAnswers: AnswerMap) {
    const currentLayer = question.layer;
    const nextQuestion = questions[currentIndex + 1];

    if (!nextQuestion) {
      localStorage.setItem(`piri_answers_${mode}`, JSON.stringify(nextAnswers));
      // Clean up partial answers
      localStorage.removeItem(`piri_answers_${mode}_partial`);
      router.push('/dna/result');
      return;
    }

    if (nextQuestion.layer !== currentLayer) {
      // After Layer 1 → redirect to signup if not signed up
      if (currentLayer === 1) {
        const isSignedUp = typeof window !== 'undefined' && localStorage.getItem('piri_signed_up') === 'true';
        if (!isSignedUp) {
          // Save current answers before redirect
          localStorage.setItem(`piri_answers_${mode}_partial`, JSON.stringify(nextAnswers));
          router.push('/signup');
          return;
        }
      }

      const text =
        nextQuestion.layer === 2
          ? 'Sinyallerin oluşuyor. Ama henüz yüzeyde kalıyoruz. Şimdi daha derine ineceğiz.'
          : 'Seni görmeye başladım. Ama son katman senin sesin olacak. Hazır mısın?';

      setAnswers(nextAnswers);
      setSelected(null);
      setTextValue('');
      setTransition({ visible: true, nextLayer: nextQuestion.layer as 2 | 3, text });
      return;
    }

    // Animate out → in
    setAnimating(true);
    setTimeout(() => {
      setAnswers(nextAnswers);
      setSelected(null);
      setTextValue('');
      setCurrentIndex((v) => v + 1);
      setAnimating(false);
    }, 250);
  }

  function handleChoice(index: number) {
    setSelected(index);
    const nextAnswers = { ...answers, [question.id]: index };
    setTimeout(() => nextAfterAnswer(nextAnswers), 350);
  }

  function handleTextSubmit() {
    if (!textValue.trim()) return;
    const nextAnswers = { ...answers, [question.id]: textValue.trim() };
    nextAfterAnswer(nextAnswers);
  }

  function continueLayer() {
    setTransition({ visible: false, nextLayer: null, text: '' });
    setCurrentIndex((v) => v + 1);
  }

  if (!question) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="text-slate-700">Soru bulunamadı.</div>
      </main>
    );
  }

  // Layer-based progress
  const layerQuestions = questions.filter((q) => q.layer === question.layer);
  const indexInLayer = layerQuestions.indexOf(question) + 1;
  const layerLabel = `${question.layer}.${indexInLayer}`;
  const layerProgress = Math.round((indexInLayer / layerQuestions.length) * 100);

  // Transition screen
  if (transition.visible) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="fixed inset-0 bg-gradient-to-b from-[#f5faff] via-[#edf6ff] to-[#f5fbff]" />

        <div className="relative w-full max-w-lg text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white via-[rgba(210,230,255,0.9)] to-[rgba(165,200,255,0.4)] border border-white/80 shadow-[0_12px_40px_rgba(90,140,255,0.15)]" style={{ animation: 'orbPulseSmall 3s ease-in-out infinite' }} />
          </div>

          <div className="space-y-3">
            <p className="text-[13px] tracking-widest text-slate-400 uppercase">Piri</p>
            <p className="text-xl text-slate-900 leading-relaxed px-4">{transition.text}</p>
          </div>

          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((l) => (
              <div key={l} className={`w-2 h-2 rounded-full transition-all ${l <= (transition.nextLayer ?? 1) ? 'bg-slate-900 scale-110' : 'bg-slate-300'}`} />
            ))}
          </div>

          <button onClick={continueLayer} className="px-8 py-3.5 rounded-2xl bg-slate-900 text-white font-medium transition hover:scale-[1.02] active:scale-[0.97]">
            Devam et
          </button>
        </div>

        <style jsx>{`
          @keyframes orbPulseSmall { 0%,100%{transform:scale(0.95);opacity:0.85} 50%{transform:scale(1.05);opacity:1} }
        `}</style>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="fixed inset-0 bg-gradient-to-b from-[#f5faff] via-[#edf6ff] to-[#f5fbff]" />

      <div className={`relative w-full max-w-2xl space-y-8 transition-all duration-200 ${animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
        {/* Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span className="font-medium">Bölüm {question.layer} · Soru {layerLabel}</span>
            <span className="text-slate-400">
              {question.inputType === 'text' ? 'Kısa yaz. Net yaz.' : 'İlk tepkin daha doğru.'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((l) => (
              <div key={l} className="flex-1 h-1.5 rounded-full overflow-hidden bg-slate-900/10">
                <div
                  className="h-full bg-slate-900 transition-all duration-300"
                  style={{ width: l < question.layer ? '100%' : l === question.layer ? `${layerProgress}%` : '0%' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="bg-white/55 border border-white/60 rounded-[28px] p-8 shadow-sm ring-1 ring-white/60 backdrop-blur-xl">
          <h1 className="text-2xl font-semibold text-slate-900 leading-relaxed">{question.text}</h1>

          {question.inputType === 'choice' ? (
            <div className="mt-8">
              {/* 5-button agree/disagree row */}
              <div className="flex items-stretch gap-2">
                {CHOICE_5.map((label, index) => {
                  const c = AGREE_COLORS[index];
                  const isSelected = selected === index;
                  return (
                    <button
                      key={index}
                      onClick={() => handleChoice(index)}
                      className="agree-btn flex-1 group"
                      style={{
                        background: isSelected ? c.hoverBg : c.bg,
                        borderColor: isSelected ? c.text : c.border,
                        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                      }}
                    >
                      <span className="agree-symbol" style={{ color: c.text }}>{AGREE_LABELS_SHORT[index]}</span>
                      <span className="agree-label" style={{ color: c.text }}>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              <textarea
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                placeholder="Buraya yaz..."
                rows={5}
                className="w-full rounded-2xl border border-white/70 bg-white/75 p-4 text-slate-900 outline-none ring-0 resize-none text-[16px]"
              />
              <button
                onClick={handleTextSubmit}
                className="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium transition hover:scale-[1.02] active:scale-[0.98]"
              >
                Devam et
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .agree-btn {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 6px; padding: 16px 4px; border-radius: 16px;
          border: 2px solid; cursor: pointer;
          transition: transform 0.12s ease, background 0.15s ease, border-color 0.15s ease;
          min-height: 90px;
        }
        .agree-btn:hover { transform: scale(1.06) !important; }
        .agree-btn:active { transform: scale(0.97) !important; }

        .agree-symbol { font-size: 22px; font-weight: 600; line-height: 1; }
        .agree-label { font-size: 11px; line-height: 14px; text-align: center; font-weight: 500; opacity: 0.85; }

        @media (max-width: 640px) {
          .agree-label { display: none; }
          .agree-btn { min-height: 70px; padding: 14px 8px; }
          .agree-symbol { font-size: 26px; }
        }
      `}</style>
    </main>
  );
}

export default function DnaTestPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="fixed inset-0 bg-gradient-to-b from-[#f5faff] via-[#edf6ff] to-[#f5fbff]" />
        <div className="relative text-slate-500">Yükleniyor...</div>
      </main>
    }>
      <DnaTestInner />
    </Suspense>
  );
}
