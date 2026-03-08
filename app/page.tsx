'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type Mode = 'work' | 'life' | 'love';
type Step = 'mode' | 'sub';

type Particle = {
  id: number;
  x: number;      // başlangıçta merkeze yakın
  size: number;
  delay: number;
  dur: number;
  drift: number;  // hafif sağ/sol
  blur: number;
  op: number;
};

export default function Home() {
  const router = useRouter();

  const [isTR, setIsTR] = useState(true);
  const [step, setStep] = useState<Step>('mode');
  const [mode, setMode] = useState<Mode | null>(null);

  // intro zamanlaması
  const [phase, setPhase] = useState(0); // 0 orb uyanır, 1 msg1, 2 msg2, 3 msg3, 4 doors
  const [particles, setParticles] = useState<Particle[]>([]);
  const started = useRef(false);

  const copy = useMemo(() => {
    const en = {
      m1: 'I am Piri.',
      m2: 'What decision brought you here?',
      m3: 'Pick a door. Then we read the pattern.',
      hint: 'No advice. Just outcomes.',
      toggle: 'TR',
      back: 'Back',
      modes: [
        { key: 'work' as const, label: 'Work' },
        { key: 'life' as const, label: 'Life' },
        { key: 'love' as const, label: 'Love' },
      ],
      subTitle: (m: Mode) =>
        m === 'work' ? 'Choose the pressure point.'
        : m === 'life' ? 'Choose the shift.'
        : 'Choose the stake.',
      subs: {
        work: ['Change job', 'Start something new', 'Stay & rethink', 'Other'],
        life: ['Move city/country', 'Lifestyle reset', 'Money & stability', 'Other'],
        love: ['Stay', 'Leave', 'Define the future', 'Other'],
      } as const,
    };

    const tr = {
      m1: 'Ben Piri.',
      m2: 'Seni buraya getiren karar ne?',
      m3: 'Bir kapı seç. Sonra paterni okuyalım.',
      hint: 'Tavsiye yok. Sadece olası sonuçlar.',
      toggle: 'EN',
      back: 'Geri',
      modes: [
        { key: 'work' as const, label: 'İş' },
        { key: 'life' as const, label: 'Yol' },
        { key: 'love' as const, label: 'Aşk' },
      ],
      subTitle: (m: Mode) =>
        m === 'work' ? 'Düğümü seç.' : m === 'life' ? 'Değişimi seç.' : 'Riski seç.',
      subs: {
        work: ['İş değiştir', 'Yeni bir şeye başla', 'Kal & yeniden düşün', 'Diğer'],
        life: ['Şehir/ülke değiştir', 'Hayat düzenini sıfırla', 'Para & istikrar', 'Diğer'],
        love: ['Devam et', 'Bitir', 'Geleceği tanımla', 'Diğer'],
      } as const,
    };

    return isTR ? tr : en;
  }, [isTR]);

  // enerji parçacıkları (alt merkezden doğup orb'a akıyor hissi)
  useEffect(() => {
    const arr: Particle[] = Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      x: 50 + (Math.random() * 10 - 5), // merkeze yakın doğsun
      size: 6 + Math.random() * 14,
      delay: Math.random() * 5,
      dur: 6 + Math.random() * 5,
      drift: Math.random() * 26 - 13,
      blur: Math.random() * 2,
      op: 0.22 + Math.random() * 0.35,
    }));
    setParticles(arr);
  }, []);

  // intro timeline
  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const t1 = setTimeout(() => setPhase(1), 1200);
    const t2 = setTimeout(() => setPhase(2), 2400);
    const t3 = setTimeout(() => setPhase(3), 3800);
    const t4 = setTimeout(() => setPhase(4), 5200);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  function goMode(m: Mode) {
    setMode(m);
    setStep('sub');
  }

  function goBack() {
    setStep('mode');
    setMode(null);
  }

  function pickSub(label: string) {
    if (!mode) return;
    localStorage.setItem('piri_mode', mode);
    localStorage.setItem('piri_sub', label);
    localStorage.setItem('piri_lang', isTR ? 'tr' : 'en');
    router.push('/dna/test');
  }

  const modeLabel = mode ? copy.modes.find(m => m.key === mode)?.label : '';

  return (
    <main className="min-h-screen w-full overflow-hidden relative">
      {/* background */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#f6fbff] via-[#eef7ff] to-[#f7fcff]" />

      {/* atmosfer ışıkları */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absGlow left" />
        <div className="absGlow right" />
      </div>

      {/* alt emitter + enerji parçacıkları */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="emitter" />
        {particles.map(p => (
          <span
            key={p.id}
            className="energy"
            style={{
              left: `${p.x}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
              opacity: p.op,
              filter: `blur(${p.blur}px)`,
              ['--drift' as any]: `${p.drift}px`,
            }}
          />
        ))}
      </div>

      {/* dil */}
      <div className="relative z-30 flex justify-end px-6 pt-6">
        <button
          onClick={() => setIsTR(v => !v)}
          className="rounded-full bg-white/60 px-4 py-2 text-sm text-slate-900 ring-1 ring-white/70 backdrop-blur-md transition hover:bg-white/80"
        >
          {copy.toggle}
        </button>
      </div>

      {/* merkez sahne */}
      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center px-6">
        {/* ORB */}
        <div className="orbWrap">
          <div className="orbAura" />
          <div className={`orb ${phase >= 0 ? 'wake' : ''}`}>
            <div className="core" />
            <div className="shine" />
            <div className="ring r1" />
            <div className="ring r2" />
          </div>
        </div>

        {/* mesaj balonları (orb içinden doğuyor hissi) */}
        <div className="mt-8 max-w-[720px] text-center space-y-3">
          <div className={`msg ${phase >= 1 ? 'show' : ''}`}>{copy.m1}</div>
          <div className={`msg ${phase >= 2 ? 'show' : ''}`}>{copy.m2}</div>
          <div className={`msg soft ${phase >= 3 ? 'show' : ''}`}>{copy.m3}</div>
        </div>

        {/* kapılar */}
        {phase >= 4 && step === 'mode' && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 doors">
            {copy.modes.map(m => (
              <button
                key={m.key}
                onClick={() => goMode(m.key)}
                className="door"
              >
                {m.label}
              </button>
            ))}
          </div>
        )}

        {/* sub seçenekleri */}
        {step === 'sub' && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="msg show">{modeLabel}</div>
            <div className="msg soft show">{mode ? copy.subTitle(mode) : ''}</div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mt-2">
              {(mode ? copy.subs[mode] : []).map(label => (
                <button key={label} onClick={() => pickSub(label)} className="door">
                  {label}
                </button>
              ))}
            </div>

            <button className="back" onClick={goBack}>{copy.back}</button>
          </div>
        )}

        <p className="mt-7 text-sm text-slate-700/80">{copy.hint}</p>
      </div>

      <style jsx global>{`
        /* atmosfer */
        .absGlow {
          position: absolute;
          width: 320px; height: 320px; border-radius: 999px;
          filter: blur(60px); opacity: .55;
        }
        .absGlow.left { left: 16%; bottom: 8%; background: #e4f1ff; }
        .absGlow.right { right: 18%; top: 14%; background: #e8f7ff; }

        /* emitter */
        .emitter{
          position:absolute; left:50%; bottom:-120px; transform:translateX(-50%);
          width:480px; height:260px; border-radius:999px;
          background: radial-gradient(circle at 50% 30%, rgba(170,210,255,.6), rgba(170,210,255,.18) 55%, transparent 70%);
          filter: blur(28px);
        }

        /* enerji parçacıkları */
        .energy{
          position:absolute; bottom:-30px; border-radius:999px;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.95), rgba(180,210,255,.65) 55%, rgba(160,195,255,.15) 100%);
          box-shadow: 0 0 10px rgba(170,210,255,.5), inset 0 0 8px rgba(255,255,255,.45);
          animation: rise linear infinite;
        }
        @keyframes rise{
          0%{ transform: translateY(0) translateX(0) scale(.7); opacity:0; }
          8%{ opacity:1; }
          55%{ transform: translateY(-42vh) translateX(var(--drift)) scale(1); }
          100%{ transform: translateY(-78vh) translateX(calc(var(--drift)*-0.6)) scale(1.25); opacity:0; }
        }

        /* ORB */
        .orbWrap{ position:relative; }
        .orbAura{
          position:absolute; inset:-40px; border-radius:999px;
          background: radial-gradient(circle, rgba(180,210,255,.55), rgba(180,210,255,.15) 60%, transparent 70%);
          filter: blur(22px);
        }
        .orb{
          position:relative; width:220px; height:220px; border-radius:999px;
          background: radial-gradient(circle at 35% 30%, rgba(255,255,255,.98), rgba(214,232,255,.92) 32%, rgba(168,203,255,.82) 60%, rgba(140,186,255,.42) 82%, rgba(120,170,255,.18) 100%);
          border:1px solid rgba(255,255,255,.8);
          box-shadow: 0 24px 80px rgba(95,146,255,.18), 0 0 0 12px rgba(255,255,255,.14), inset 0 0 28px rgba(255,255,255,.45);
          overflow:hidden;
          animation: float 7.2s ease-in-out infinite;
          backdrop-filter: blur(10px);
        }
        .orb.wake{ animation-duration:6s; }

        @keyframes float{
          0%{ transform: translateY(0) scale(1); }
          50%{ transform: translateY(-6px) scale(1.018); }
          100%{ transform: translateY(0) scale(1); }
        }

        .core{
          position:absolute; inset:24%; border-radius:999px;
          background: radial-gradient(circle, rgba(255,255,255,.96) 0%, rgba(235,245,255,.8) 48%, rgba(190,220,255,.25) 100%);
          animation: pulse 3.8s ease-in-out infinite;
          filter: blur(1px);
        }
        @keyframes pulse{
          0%{ transform: scale(.98); opacity:.9; }
          50%{ transform: scale(1.05); opacity:1; }
          100%{ transform: scale(.98); opacity:.9; }
        }

        .shine{
          position:absolute; width:42%; height:42%; top:16%; left:18%; border-radius:999px;
          background: radial-gradient(circle, rgba(255,255,255,.9), rgba(255,255,255,.18) 65%, transparent 100%);
          filter: blur(6px);
        }

        .ring{
          position:absolute; inset:12%; border-radius:999px;
          border:1px solid rgba(255,255,255,.18);
          animation: spin 18s linear infinite;
        }
        .ring.r2{ inset:18%; animation-duration:24s; animation-direction: reverse; }
        @keyframes spin{
          0%{ transform: rotate(0deg) scale(1); }
          50%{ transform: rotate(180deg) scale(1.01); }
          100%{ transform: rotate(360deg) scale(1); }
        }

        /* mesaj balonları */
        .msg{
          display:inline-block; max-width:640px;
          padding:14px 20px; border-radius:999px;
          background: rgba(255,255,255,.55);
          border:1px solid rgba(255,255,255,.8);
          box-shadow: 0 8px 24px rgba(15,23,42,.06), inset 0 1px 0 rgba(255,255,255,.6);
          color:#0f172a; backdrop-filter: blur(14px);
          opacity:0; transform: translateY(10px) scale(.98);
          transition: opacity .7s ease, transform .7s ease;
          font-size:18px; line-height:28px; letter-spacing:-.01em;
        }
        .msg.soft{ color: rgba(15,23,42,.82); font-size:16px; }
        .msg.show{ opacity:1; transform: translateY(0) scale(1); }

        /* kapılar */
        .doors{ animation: doorsIn .6s ease both; }
        @keyframes doorsIn{
          from{ opacity:0; transform: translateY(12px) scale(.98); }
          to{ opacity:1; transform: translateY(0) scale(1); }
        }

        .door{
          border-radius:999px; padding:12px 22px; font-size:16px;
          background: rgba(255,255,255,.6);
          border:1px solid rgba(255,255,255,.8);
          box-shadow: 0 6px 18px rgba(15,23,42,.06);
          backdrop-filter: blur(12px);
          transition: transform .12s ease, background .2s ease;
          color:#0f172a;
        }
        .door:hover{ background: rgba(255,255,255,.82); transform: scale(1.02); }

        .back{
          margin-top:8px; padding:8px 16px; border-radius:999px;
          background: rgba(255,255,255,.5);
          border:1px solid rgba(255,255,255,.7);
          backdrop-filter: blur(10px);
          color:#334155;
        }
      `}</style>
    </main>
  );
}