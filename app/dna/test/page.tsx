'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getQuestionsForMode,
  type Mode,
  type Question,
} from '../questions';

type AnswerMap = Record<string, number | string>;

type TransitionState = {
  visible: boolean;
  nextLayer: 2 | 3 | null;
  text: string;
};

export default function DnaTestPage() {
  const router = useRouter();

  const mode = ((typeof window !== 'undefined'
    ? localStorage.getItem('piri_mode')
    : null) as Mode | null) ?? 'work';

  const questions = useMemo(() => getQuestionsForMode(mode), [mode]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [textValue, setTextValue] = useState('');
  const [transition, setTransition] = useState<TransitionState>({
    visible: false,
    nextLayer: null,
    text: '',
  });

  const question = questions[currentIndex];

  function nextAfterAnswer(nextAnswers: AnswerMap) {
    const currentLayer = question.layer;
    const nextQuestion = questions[currentIndex + 1];

    if (!nextQuestion) {
      localStorage.setItem(`piri_answers_${mode}`, JSON.stringify(nextAnswers));
      router.push('/dna/result');
      return;
    }

    if (nextQuestion.layer !== currentLayer) {
      const text =
        nextQuestion.layer === 2
          ? 'Bazı sinyaller oluşmaya başladı. Ama henüz yeterli değil.'
          : 'Şimdi seni daha net görüyorum. Ama son parçaya ihtiyacım var.';

      setAnswers(nextAnswers);
      setSelected(null);
      setTextValue('');
      setTransition({
        visible: true,
        nextLayer: nextQuestion.layer as 2 | 3,
        text,
      });
      return;
    }

    setAnswers(nextAnswers);
    setSelected(null);
    setTextValue('');
    setCurrentIndex((v) => v + 1);
  }

  function handleChoice(index: number) {
    setSelected(index);
    const nextAnswers = { ...answers, [question.id]: index };

    setTimeout(() => {
      nextAfterAnswer(nextAnswers);
    }, 220);
  }

  function handleTextSubmit() {
    if (!textValue.trim()) return;
    const nextAnswers = { ...answers, [question.id]: textValue.trim() };
    nextAfterAnswer(nextAnswers);
  }

  function continueLayer() {
    setTransition({
      visible: false,
      nextLayer: null,
      text: '',
    });
    setCurrentIndex((v) => v + 1);
  }

  if (!question) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="text-slate-700">Soru bulunamadı.</div>
      </main>
    );
  }

  const progress = Math.round(((currentIndex + 1) / questions.length) * 100);

  const layerTitle =
    question.layer === 1
      ? 'Katman 1'
      : question.layer === 2
      ? 'Katman 2'
      : 'Katman 3';

  if (transition.visible) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="fixed inset-0 bg-gradient-to-b from-[#EAF6FF] via-[#E6F4F1] to-[#F2F8FF]" />

        <div className="relative w-full max-w-2xl text-center">
          <div className="bg-white/55 border border-white/60 rounded-[28px] p-10 shadow-sm ring-1 ring-white/60 backdrop-blur-xl space-y-6">
            <div className="text-2xl font-semibold text-slate-900">Ben Piri.</div>
            <p className="text-slate-700 text-lg leading-relaxed">{transition.text}</p>

            <button
              onClick={continueLayer}
              className="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium transition hover:scale-[1.02] active:scale-[0.98]"
            >
              Devam et
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="fixed inset-0 bg-gradient-to-b from-[#EAF6FF] via-[#E6F4F1] to-[#F2F8FF]" />

      <div className="relative w-full max-w-2xl space-y-8">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>
              {layerTitle} · {currentIndex + 1} / {questions.length}
            </span>
            <span>
              {question.inputType === 'text'
                ? 'Kısa yaz. Net yaz.'
                : 'İlk tepkin daha doğru cevaptır.'}
            </span>
          </div>

          <div className="h-2 w-full rounded-full bg-slate-900/10 overflow-hidden">
            <div className="h-full bg-slate-900" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="bg-white/55 border border-white/60 rounded-[28px] p-8 shadow-sm ring-1 ring-white/60 backdrop-blur-xl">
          <h1 className="text-2xl font-semibold text-slate-900 leading-relaxed">
            {question.text}
          </h1>

          {question.inputType === 'choice' ? (
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {question.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleChoice(index)}
                  className={`rounded-2xl px-5 py-4 text-left transition border ${
                    selected === index
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white/70 text-slate-800 border-white/70 hover:bg-white'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              <textarea
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                placeholder="Buraya yaz..."
                rows={6}
                className="w-full rounded-2xl border border-white/70 bg-white/75 p-4 text-slate-900 outline-none ring-0 resize-none"
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
    </main>
  );
}