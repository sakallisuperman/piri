'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import PiriOrb from '../../components/PiriOrb';
import { updateProfile } from '../../lib/profile';
import {
  QUESTION_BANK,
  calculateDNA,
  dnaToPromptContext,
  type Schema,
  type PiriDNA,
  type Mode,
  CHOICE_6_SCORE,
} from '../questions';

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

type Phase = 'insight' | 'simulation' | 'dialog';

function signalLabel(signal: Schema) {
  const map: Record<Schema, string> = {
    abandonment: 'Terk Edilme',
    defectiveness: 'Yetersizlik',
    subjugation: 'Boyun Eğme',
    unrelenting: 'Yüksek Standartlar',
    deprivation: 'Duygusal Yoksunluk',
    avoidance: 'Kaçınma',
  };
  return map[signal] || signal;
}

function signalEmoji(signal: Schema) {
  const map: Record<Schema, string> = {
    abandonment: '🌊',
    defectiveness: '🪞',
    subjugation: '🔒',
    unrelenting: '🎯',
    deprivation: '🌑',
    avoidance: '🛡',
  };
  return map[signal] || '◆';
}

function dnaCode(dna: PiriDNA) {
  const band = (v: number) => v <= 33 ? 'L' : v <= 66 ? 'M' : 'H';
  return [
    'AB' + band(dna.schemas.abandonment),
    'DF' + band(dna.schemas.defectiveness),
    'SB' + band(dna.schemas.subjugation),
    'UN' + band(dna.schemas.unrelenting),
    'DP' + band(dna.schemas.deprivation),
    'AV' + band(dna.schemas.avoidance),
  ].join('-');
}

function fallbackComment(topSignals: { key: Schema; value: number }[]) {
  const top = topSignals[0]?.key;
  const second = topSignals[1]?.key;

  const comments: Record<Schema, string[]> = {
    abandonment: [
      'Terk edilme korkusu seni belirsizlikte tutuyor.',
      'Kaybetme ihtimali karar almayı durduruyor.',
    ],
    defectiveness: [
      'Yetersizlik hissi seni hareketsiz bırakıyor.',
      'Kendine güven eksikliği kararları zorlaştırıyor.',
    ],
    subjugation: [
      'Boyun eğme eğilimi seni kendi ihtiyaçlarını erteletiyor.',
      'Başkalarının ihtiyaçları seninkilerden önde geliyor.',
    ],
    unrelenting: [
      'Yüksek standartların seni mükemmelliği beklemeye zorluyor.',
      'Hiçbir şey yeterince iyi değil.',
    ],
    deprivation: [
      'Duygusal yoksunluk hissi seni açgözlü yapıyor.',
      'İhtiyaçların karşılanmamış gibi hissediyorsun.',
    ],
    avoidance: [
      'Kaçınma eğilimi seni sorunlardan uzak tutuyor.',
      'Ama sorunlar seni buluyor.',
    ],
  };

  const topComments = comments[top || 'avoidance'];
  const mainComment = topComments[Math.floor(Math.random() * topComments.length)];

  let secondPart = '';
  if (second) {
    const secondLabels: Record<Schema, string> = {
      abandonment: 'Terk edilme korkun bunu tetikliyor.',
      defectiveness: 'Yetersizlik hissin bunu besliyor.',
      subjugation: 'Boyun eğme eğilimin bunu güçlendiriyor.',
      unrelenting: 'Yüksek standartların bunu derinleştiriyor.',
      deprivation: 'Duygusal yoksunluk hissin bunu pekiştiriyor.',
      avoidance: 'Kaçınma eğilimin bunu destekliyor.',
    };
    secondPart = ' ' + secondLabels[second];
  }

  return mainComment + secondPart;
}

// Hardcoded scenarios for when AI is unavailable
function getHardcodedScenarios(mode: string): Scenario[] {
  if (mode === 'work') {
    return [
      {
        title: 'Hemen hareket edersen',
        timeline: [
          { period: 'İlk 7 gün', text: 'Karar vermenin verdiği enerji ve rahatlama. Ama hemen ardından şüphe dalgası gelir.' },
          { period: '1-2 ay', text: 'Yeni düzene alışma sancıları. Eski kalıplar geri çekmeye çalışır.' },
          { period: '3-6 ay', text: 'Ya adapte olmuşsundur ya da eski düzene geri dönmüşsündür. Arada yoktur.' },
        ],
        risk: 'Hazırlıksız hareket, pişmanlığa dönüşebilir.',
        gain: 'Erteleme döngüsünü kırarsın. Karar kasın güçlenir.',
      },
      {
        title: 'Kontrollü ilerlersen',
        timeline: [
          { period: 'İlk 7 gün', text: 'Küçük adımlar atarsın. Araştırma, konuşma, gözlem.' },
          { period: '1-2 ay', text: 'Netleşme başlar. Ama "biraz daha bekleyeyim" tuzağı kapıda.' },
          { period: '3-6 ay', text: 'Ya somut bir geçiş planın vardır ya da kontrollü ilerleme ertelemeye dönmüştür.' },
        ],
        risk: 'Kontrol, kaçınmanın kibar hali olabilir.',
        gain: 'Bilinçli bir geçiş yaparsın, sürprizleri azaltırsın.',
      },
      {
        title: 'Ertelersen',
        timeline: [
          { period: 'İlk 7 gün', text: 'Geçici rahatlama. "Doğru zamanı bekleyeyim" diye ikna edersin kendini.' },
          { period: '1-2 ay', text: 'Aynı düşünceler dönmeye devam eder. Enerji düşer.' },
          { period: '3-6 ay', text: 'Ya karar seni bulur (kriz olarak) ya da alışırsın mutsuzluğa.' },
        ],
        risk: 'Erteleme kalıcılaşır. Karar alma kapasiten zayıflar.',
        gain: 'Stabilite korunur. Ama bedeli gizli kalır.',
      },
    ];
  }
  if (mode === 'love') {
    return [
      {
        title: 'Yüzleşirsen',
        timeline: [
          { period: 'İlk 7 gün', text: 'Konuşmanın getirdiği rahatlama veya sancı. Her iki durumda da netlik.' },
          { period: '1-2 ay', text: 'Ya yeni bir denge kurulur ya da ayrılık netleşir.' },
          { period: '3-6 ay', text: 'Hangisi olduysa, artık o belirsizlik yok.' },
        ],
        risk: 'Yüzleşme acı getirebilir.',
        gain: 'Belirsizliğin yerini netlik alır.',
      },
      {
        title: 'Sınır koyarsan',
        timeline: [
          { period: 'İlk 7 gün', text: 'İhtiyaçlarını dile getirmek zor ama özgürleştirici.' },
          { period: '1-2 ay', text: 'Karşı tarafın tepkisi gerçeği gösterir.' },
          { period: '3-6 ay', text: 'Ya ilişki dönüşür ya da gerçek kapasitesi ortaya çıkar.' },
        ],
        risk: 'Sınır koymak ilişkiyi sarsabilir.',
        gain: 'Kendine saygın artar. Doğru ilişki buna dayanır.',
      },
      {
        title: 'Beklemen durumunda',
        timeline: [
          { period: 'İlk 7 gün', text: '"Belki düzelir" umudu. Geçici huzur.' },
          { period: '1-2 ay', text: 'Aynı kalıp tekrarlar. Enerji aşınır.' },
          { period: '3-6 ay', text: 'Ya tolerans artar (sağlıksız) ya da kriz noktası gelir.' },
        ],
        risk: 'Kendin olmaktan uzaklaşırsın.',
        gain: 'Stabilite devam eder. Ama hangi bedelle?',
      },
    ];
  }
  // life (default)
  return [
    {
      title: 'Değişimi başlatırsan',
      timeline: [
        { period: 'İlk 7 gün', text: 'İlk adımın verdiği enerji. Ama korku hemen arkadan gelir.' },
        { period: '1-2 ay', text: 'Eski düzen çekmeye çalışır. Disiplin test edilir.' },
        { period: '3-6 ay', text: 'Ya yeni bir normal kurmuşsundur ya da eski kalıba geri dönmüşsündür.' },
      ],
      risk: 'Hazırlıksız değişim tükenmişliğe yol açabilir.',
      gain: 'Atalet kırılır. Kendine güvenin artar.',
    },
    {
      title: 'Adım adım gidersen',
      timeline: [
        { period: 'İlk 7 gün', text: 'Küçük ama somut değişiklikler. Günlük rutinde bir şeyi değiştir.' },
        { period: '1-2 ay', text: 'Küçük kazanımlar birikir. Ama sabırsızlık kapıda.' },
        { period: '3-6 ay', text: 'Kümülatif etki görünür hale gelir.' },
      ],
      risk: '"Adım adım" ertelemenin maskesi olabilir.',
      gain: 'Sürdürülebilir dönüşüm. Daha az sarsıntı.',
    },
    {
      title: 'Hiçbir şey yapmazsan',
      timeline: [
        { period: 'İlk 7 gün', text: 'Karar vermemenin verdiği sahte huzur.' },
        { period: '1-2 ay', text: 'İçsel huzursuzluk büyür ama dışarıdan görünmez.' },
        { period: '3-6 ay', text: 'Ya kriz tetikler zorla değişimi ya da kabulleniş derinleşir.' },
      ],
      risk: 'Hayat senin yerine karar verir. Ve genellikle acıyla.',
      gain: 'Mevcut düzen korunur. Ama soru hep orada kalır.',
    },
  ];
}

export default function DnaResultPage() {
  const router = useRouter();
  const [dna, setDna] = useState<PiriDNA | null>(null);
  const [textAnswers, setTextAnswers] = useState<string[]>([]);
  const [aiResult, setAiResult] = useState<AIAnalysis | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);
  const [activeScenario, setActiveScenario] = useState(0);
  const [phase, setPhase] = useState<Phase>('insight');
  const [dnaOpen, setDnaOpen] = useState(false);

  const mode = ((typeof window !== 'undefined'
    ? localStorage.getItem('piri_mode')
    : null) as Mode | null) ?? 'work';

  const sub = (typeof window !== 'undefined'
    ? localStorage.getItem('piri_sub')
    : null) ?? '';

  // Calculate DNA
  useEffect(() => {
    const rawStored = localStorage.getItem(`piri_answers_${mode}`);
    if (!rawStored) return;

    const answers: AnswerMap = JSON.parse(rawStored);
    const texts: string[] = [];

    // Extract text answers
    Object.values(answers).forEach((answer) => {
      if (typeof answer === 'string' && answer.trim()) {
        texts.push(answer.trim());
      }
    });

    const newDna = calculateDNA(answers, QUESTION_BANK, mode);
    setDna(newDna);
    setTextAnswers(texts);

    // Profili güncelle — tüm veriler merkezi profile'a kaydedilir
    if (dna) {
      updateProfile({
        scores: dna.schemas as unknown as Record<string, number>,
        shadow: { dominantGroup: dna.profile } as unknown as Record<string, number>,
        textAnswers: texts,
      });
    }
  }, [mode]);

  // Call AI once dna is ready
  useEffect(() => {
    if (!dna) return;

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
        schemas: dna.schemas,
        dominantSchema: Object.entries(dna.schemas).sort(([, a], [, b]) => b - a)[0][0] as any,
        profile: dna.profile,
        textAnswers,
        lang: 'tr'
      }),
    })
      .then((r) => {
        if (!r.ok) throw new Error('API error');
        return r.json();
      })
      .then((data: AIAnalysis) => {
        setAiResult(data);
        localStorage.setItem(`piri_ai_${mode}`, JSON.stringify(data));
        // AI analizini profile'a kaydet
        if (data.analysis) {
          updateProfile({
            aiAnalysis: {
              headline: data.analysis.headline || '',
              corePattern: data.analysis.corePattern || '',
              blindSpot: data.analysis.blindSpot || '',
            },
          });
        }
      })
      .catch(() => setAiError(true))
      .finally(() => setAiLoading(false));
  }, [dna, mode, sub, textAnswers]);

  const topSignals = useMemo(() => {
    if (!dna) return [];
    return (Object.entries(dna.schemas) as [Schema, number][])
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([key, value]) => ({ key, value }));
  }, [dna]);

  if (!dna) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="fixed inset-0 bg-gradient-to-b from-[#f5faff] via-[#edf6ff] to-[#f5fbff]" />
        <div className="relative text-slate-700">Sonuç bulunamadı. Önce testi çöz.</div>
      </main>
    );
  }

  const rows = [
    { key: 'abandonment' as Schema, label: 'Terk Edilme', value: dna.schemas.abandonment },
    { key: 'defectiveness' as Schema, label: 'Yetersizlik', value: dna.schemas.defectiveness },
    { key: 'subjugation' as Schema, label: 'Boyun Eğme', value: dna.schemas.subjugation },
    { key: 'unrelenting' as Schema, label: 'Yüksek Standartlar', value: dna.schemas.unrelenting },
    { key: 'deprivation' as Schema, label: 'Duygusal Yoksunluk', value: dna.schemas.deprivation },
    { key: 'avoidance' as Schema, label: 'Kaçınma', value: dna.schemas.avoidance },
  ] as const;

  const ai = aiResult;
  const scenarios = ai
    ? [ai.simulation.scenarioA, ai.simulation.scenarioB, ai.simulation.scenarioC]
    : getHardcodedScenarios(mode);

  const activeData = scenarios[activeScenario];

  return (
    <main className="min-h-screen flex items-start justify-center p-6">
      <div className="fixed inset-0 bg-gradient-to-b from-[#f5faff] via-[#edf6ff] to-[#f5fbff]" />

      <div className="relative w-full max-w-2xl space-y-8 py-10">

        {/* ── Faz 1: Kısa Insight ── */}
        <div className="text-center space-y-5 animate-fadeUp">
          {/* Small orb */}
          <div className="flex justify-center">
            <PiriOrb size={80} />
          </div>

          <p className="text-[13px] tracking-[0.25em] text-slate-400 uppercase">Piri</p>

          {/* Top 2 signals */}
          <div className="flex items-center justify-center gap-3">
            {topSignals.slice(0, 2).map((s) => (
              <span key={s.key} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-white/70 text-sm text-slate-700 backdrop-blur-sm">
                <span>{signalEmoji(s.key)}</span>
                <span>{signalLabel(s.key)}</span>
                <span className="text-slate-400 text-xs">{s.value}</span>
              </span>
            ))}
          </div>

          {/* Main insight comment */}
          <div className="max-w-lg mx-auto">
            {ai ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-slate-900">{ai.analysis.headline}</h2>
                {ai.analysis.paragraphs.slice(0, 1).map((p, i) => (
                  <p key={i} className="text-slate-600 leading-relaxed">{p}</p>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xl text-slate-900 leading-relaxed font-medium">
                  Seni tanımaya başladım.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  {fallbackComment(topSignals)}
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  Ama bu sadece yüzey.
                </p>
              </div>
            )}
          </div>

          {/* AI loading indicator */}
          {aiLoading && (
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/55 border border-white/60 backdrop-blur-xl">
              <div className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
              <span className="text-sm text-slate-600">Piri derinlemesine analiz ediyor...</span>
            </div>
          )}
        </div>

        {/* ── Faz 2: Simülasyon ── */}
        {phase === 'insight' && (
          <div className="text-center animate-fadeUp">
            <button
              onClick={() => setPhase('simulation')}
              className="px-8 py-4 rounded-2xl bg-white/60 border border-white/70 text-slate-800 font-medium backdrop-blur-sm transition-all hover:bg-white/80 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
            >
              Şimdi sana olası senaryoları göstereyim →
            </button>
          </div>
        )}

        {(phase === 'simulation' || phase === 'dialog') && (
          <div className="card space-y-6 animate-fadeUp">
            <p className="text-xs tracking-widest text-slate-400 uppercase">Simülasyon</p>

            {/* Scenario tabs */}
            <div className="flex gap-2">
              {scenarios.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setActiveScenario(i)}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                    activeScenario === i
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white/60 text-slate-600 hover:bg-white/80'
                  }`}
                >
                  {s.title}
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

            {/* Piri ile Konuş Daveti - Simülasyon altında sabit */}
            <div className="text-center space-y-6 animate-fadeUp py-4">
              <div className="max-w-md mx-auto space-y-3">
                <p className="text-lg text-slate-800 leading-relaxed">
                  Seni tanımaya devam edeceğim.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Peki sen ne yapmak istiyorsun? Hangi konuda karar almak istiyor ama uygulayamıyorsun?
                </p>
                <p className="text-slate-500 text-sm italic">
                  Anlat. Sorunlarını birlikte çözelim.
                </p>
              </div>

              <button
                onClick={() => router.push('/chat')}
                className="px-10 py-4 rounded-2xl bg-slate-900 text-white font-medium text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-slate-900/20"
              >
                Piri ile Konuş
              </button>
            </div>
          </div>
        )}

        {/* ── AI detailed analysis (only if AI available) ── */}
        {ai && (phase === 'simulation' || phase === 'dialog') && (
          <div className="card space-y-5 animate-fadeUp">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white via-[rgba(210,230,255,0.9)] to-[rgba(165,200,255,0.4)] border border-white/80 shadow-sm flex-shrink-0" />
              <div>
                <p className="text-xs tracking-widest text-slate-400 uppercase">Piri Analizi</p>
                {ai.analysis.corePattern && (
                  <p className="text-sm font-medium text-slate-700">{ai.analysis.corePattern}</p>
                )}
              </div>
            </div>
            {ai.analysis.paragraphs.slice(1).map((p, i) => (
              <p key={i} className="text-slate-700 leading-relaxed text-sm">{p}</p>
            ))}
            {ai.analysis.blindSpot && (
              <div className="rounded-2xl bg-slate-900/[0.03] border border-slate-900/[0.06] p-4">
                <p className="text-xs tracking-widest text-slate-400 uppercase mb-1.5">Kör Nokta</p>
                <p className="text-slate-800 text-sm font-medium">{ai.analysis.blindSpot}</p>
              </div>
            )}
          </div>
        )}

        {/* ── Faz 3: Piri ile Diyalog Daveti ── */}
        {phase === 'dialog' && (
          <div className="text-center space-y-6 animate-fadeUp py-4">
            <div className="max-w-md mx-auto space-y-3">
              <p className="text-lg text-slate-800 leading-relaxed">
                Seni tanımaya devam edeceğim.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Peki sen ne yapmak istiyorsun? Hangi konuda karar almak istiyor ama uygulayamıyorsun?
              </p>
              <p className="text-slate-500 text-sm italic">
                Anlat. Sorunlarını birlikte çözelim.
              </p>
            </div>

            <button
              onClick={() => router.push('/chat')}
              className="px-10 py-4 rounded-2xl bg-slate-900 text-white font-medium text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-slate-900/20"
            >
              Piri ile Konuş
            </button>
          </div>
        )}

        {/* ── DNA Skorları (katlanabilir) ── */}
        <div className="animate-fadeUp">
          <div className="text-center">
            <p className="text-lg text-slate-800 leading-relaxed">
              Karar DNA'n hazır.
            </p>
          </div>
        </div>

        {/* ── AI Error fallback ── */}
        {aiError && (
          <div className="text-center text-sm text-slate-400">
            Piri şu an derinlemesine analiz yapamıyor. Temel haritanı yukarıda görebilirsin.
          </div>
        )}

        {/* ── Footer actions ── */}
        <div className="text-center space-y-3 pt-2">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => router.push('/')}
              className="px-5 py-2.5 rounded-xl bg-white/60 text-slate-600 border border-white/60 text-sm font-medium transition hover:scale-[1.02] active:scale-[0.98]"
            >
              Başka Kapı Aç
            </button>
            <button
              onClick={() => {
                localStorage.removeItem(`piri_ai_${mode}`);
                window.location.reload();
              }}
              className="px-5 py-2.5 rounded-xl bg-white/60 text-slate-600 border border-white/60 text-sm font-medium transition hover:scale-[1.02] active:scale-[0.98]"
            >
              Yeniden Analiz Et
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Bu bir tavsiye değil. Karar haritası bir ayna — gördüğün şey senindir.
          </p>
        </div>
      </div>

      <style jsx global>{`
        .card {
          background: rgba(255,255,255,0.55);
          border: 1px solid rgba(255,255,255,0.60);
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(15,23,42,0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.65);
          border: 1px solid rgba(255,255,255,0.70);
          font-size: 13px;
          color: #1e293b;
        }
        .animate-fadeUp {
          animation: fadeUp 0.5s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
