'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

// ─── Types ───────────────────────────────────────────────────────────
type Mode = 'work' | 'life' | 'love';
type FlowStep = 'intro' | 'doors' | 'sub';

type Bubble = {
  id: number;
  x: number;
  size: number;
  delay: number;
  dur: number;
  drift: number;
  blur: number;
  op: number;
};

type PiriLine = {
  text: string;
  delay: number; // ms before this line starts typing
};

// ─── Piri Script ─────────────────────────────────────────────────────
const INTRO_LINES_TR: PiriLine[] = [
  { text: 'Ben Piri.', delay: 800 },
  { text: 'Sana tavsiye vermeyeceğim. Bunu sana söz veriyorum.', delay: 1800 },
  { text: 'Ama seni bir aynaya tutacağım — bakmak senin kararın.', delay: 2400 },
  { text: 'Bu arada... buraya gelme kararını da sen aldın.', delay: 2200 },
  { text: 'Bir kapı seç. Gerisini konuşuruz.', delay: 2000 },
];

const DOOR_LINES_TR: Record<Mode, PiriLine[]> = {
  work: [
    { text: 'İş kapısı. Ağır kapıdır.', delay: 600 },
    { text: 'Düğümün nerede olduğunu göster bana.', delay: 1600 },
  ],
  life: [
    { text: 'Yol kapısı. Bir şeyi değiştirmek istiyorsun.', delay: 600 },
    { text: 'Neyin değişmesini istediğini seç.', delay: 1600 },
  ],
  love: [
    { text: 'Aşk kapısı. Burası cesaret ister.', delay: 600 },
    { text: 'Risk nerede — onu göster.', delay: 1600 },
  ],
};

const SUBS_TR: Record<Mode, { label: string; value: string }[]> = {
  work: [
    { label: 'İş değiştirmeli miyim?', value: 'İş değiştir' },
    { label: 'Yeni bir şeye başlamalı mıyım?', value: 'Yeni bir şeye başla' },
    { label: 'Kalıp yeniden mi düşünmeliyim?', value: 'Kal & yeniden düşün' },
    { label: 'Başka bir şey...', value: 'Diğer' },
  ],
  life: [
    { label: 'Şehir / ülke değiştirmeli miyim?', value: 'Şehir/ülke değiştir' },
    { label: 'Hayat düzenimi sıfırlamalı mıyım?', value: 'Hayat düzenini sıfırla' },
    { label: 'Para ve istikrar mı önce?', value: 'Para & istikrar' },
    { label: 'Başka bir şey...', value: 'Diğer' },
  ],
  love: [
    { label: 'Devam mı etmeliyim?', value: 'Devam et' },
    { label: 'Bitirmeli miyim?', value: 'Bitir' },
    { label: 'Geleceği tanımlamalı mıyım?', value: 'Geleceği tanımla' },
    { label: 'Başka bir şey...', value: 'Diğer' },
  ],
};

// ─── Typing Hook ─────────────────────────────────────────────────────
function useTypingLines(lines: PiriLine[], active: boolean) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [currentTyping, setCurrentTyping] = useState<string>('');
  const [lineIndex, setLineIndex] = useState(0);
  const [done, setDone] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!active) return;
    if (startedRef.current) return;
    startedRef.current = true;

    let cancelled = false;
    let cumDelay = 0;

    lines.forEach((line, li) => {
      cumDelay += line.delay;
      const startAt = cumDelay;

      // type each character
      const chars = line.text.split('');
      chars.forEach((_, ci) => {
        const charDelay = startAt + ci * 32; // typing speed
        setTimeout(() => {
          if (cancelled) return;
          setLineIndex(li);
          setCurrentTyping(line.text.slice(0, ci + 1));
        }, charDelay);
      });

      // finalize line
      const endDelay = startAt + chars.length * 32 + 200;
      setTimeout(() => {
        if (cancelled) return;
        setVisibleLines((prev) => [...prev, line.text]);
        setCurrentTyping('');
      }, endDelay);

      cumDelay = startAt + chars.length * 32 + 400;
    });

    // all done
    setTimeout(() => {
      if (!cancelled) setDone(true);
    }, cumDelay + 300);

    return () => { cancelled = true; };
  }, [active, lines]);

  return { visibleLines, currentTyping, lineIndex, done };
}

// ─── Component ───────────────────────────────────────────────────────
export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState<FlowStep>('intro');
  const [mode, setMode] = useState<Mode | null>(null);
  const [orbAwake, setOrbAwake] = useState(false);
  const [showDoors, setShowDoors] = useState(false);
  const [showSubs, setShowSubs] = useState(false);

  // bubbles
  const [bubbles] = useState<Bubble[]>(() =>
    Array.from({ length: 32 }).map((_, i) => ({
      id: i,
      x: 50 + (Math.random() * 14 - 7),
      size: 4 + Math.random() * 12,
      delay: Math.random() * 6,
      dur: 5 + Math.random() * 5,
      drift: Math.random() * 30 - 15,
      blur: Math.random() * 2.5,
      op: 0.15 + Math.random() * 0.35,
    }))
  );

  // intro typing
  const intro = useTypingLines(INTRO_LINES_TR, step === 'intro');

  // door typing
  const doorLines = mode ? DOOR_LINES_TR[mode] : [];
  const door = useTypingLines(doorLines, step === 'sub');

  // orb wakes up immediately
  useEffect(() => {
    const t = setTimeout(() => setOrbAwake(true), 400);
    return () => clearTimeout(t);
  }, []);

  // show doors after intro finishes
  useEffect(() => {
    if (intro.done) {
      const t = setTimeout(() => setShowDoors(true), 300);
      return () => clearTimeout(t);
    }
  }, [intro.done]);

  // show subs after door lines finish
  useEffect(() => {
    if (door.done) {
      const t = setTimeout(() => setShowSubs(true), 300);
      return () => clearTimeout(t);
    }
  }, [door.done]);

  function selectDoor(m: Mode) {
    setMode(m);
    setStep('sub');
    setShowDoors(false);
    setShowSubs(false);
  }

  function selectSub(value: string) {
    if (!mode) return;
    localStorage.setItem('piri_mode', mode);
    localStorage.setItem('piri_sub', value);
    localStorage.setItem('piri_lang', 'tr');
    router.push('/dna/test');
  }

  function goBackToDoors() {
    setStep('intro');
    setMode(null);
    setShowDoors(true);
    setShowSubs(false);
  }

  const modeLabels: Record<Mode, string> = {
    work: 'İş',
    life: 'Yol',
    love: 'Aşk',
  };

  const modeIcons: Record<Mode, string> = {
    work: '⬡',
    life: '◇',
    love: '○',
  };

  return (
    <main className="min-h-screen w-full overflow-hidden relative select-none">
      {/* ── Background ── */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#f5faff] via-[#edf6ff] to-[#f5fbff]" />

      {/* ── Ambient glow ── */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute w-[360px] h-[360px] rounded-full left-[12%] bottom-[6%] bg-[#deeeff] opacity-50 blur-[70px]" />
        <div className="absolute w-[280px] h-[280px] rounded-full right-[14%] top-[10%] bg-[#e3f2ff] opacity-40 blur-[60px]" />
      </div>

      {/* ── Bubbles (Huawei-inspired rising) ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* emitter glow at bottom */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[-100px] w-[420px] h-[220px] rounded-full bg-gradient-radial from-[rgba(160,200,255,0.5)] to-transparent blur-[30px]" />
        {bubbles.map((b) => (
          <span
            key={b.id}
            className="bubble-particle"
            style={{
              left: `${b.x}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              animationDuration: `${b.dur}s`,
              animationDelay: `${b.delay}s`,
              opacity: b.op,
              filter: `blur(${b.blur}px)`,
              ['--drift' as string]: `${b.drift}px`,
            }}
          />
        ))}
      </div>

      {/* ── Main scene ── */}
      <div className="relative z-20 flex min-h-screen flex-col items-center justify-start px-5 pt-[8vh]">
        {/* ── Orb ── */}
        <div className="relative mb-6">
          <div className="absolute inset-[-36px] rounded-full bg-gradient-radial from-[rgba(170,210,255,0.5)] to-transparent blur-[24px]" />
          <div className={`piri-orb ${orbAwake ? 'awake' : ''}`}>
            <div className="orb-core" />
            <div className="orb-shine" />
            <div className="orb-ring r1" />
            <div className="orb-ring r2" />
          </div>
        </div>

        {/* ── Piri Speech Area ── */}
        <div className="w-full max-w-[520px] space-y-3 mb-8">
          {/* intro lines */}
          {step === 'intro' && (
            <>
              {intro.visibleLines.map((line, i) => (
                <div key={i} className="piri-bubble show">{line}</div>
              ))}
              {intro.currentTyping && (
                <div className="piri-bubble show typing">
                  {intro.currentTyping}
                  <span className="cursor">|</span>
                </div>
              )}
            </>
          )}

          {/* door-selected lines */}
          {step === 'sub' && (
            <>
              {door.visibleLines.map((line, i) => (
                <div key={`d${i}`} className="piri-bubble show">{line}</div>
              ))}
              {door.currentTyping && (
                <div className="piri-bubble show typing">
                  {door.currentTyping}
                  <span className="cursor">|</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Doors (WLL) ── */}
        {showDoors && step === 'intro' && (
          <div className="flex items-center justify-center gap-4 animate-fadeUp">
            {(['work', 'life', 'love'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => selectDoor(m)}
                className="door-btn group"
              >
                <span className="door-icon">{modeIcons[m]}</span>
                <span className="door-label">{modeLabels[m]}</span>
              </button>
            ))}
          </div>
        )}

        {/* ── Sub-categories ── */}
        {showSubs && step === 'sub' && mode && (
          <div className="w-full max-w-[520px] space-y-3 animate-fadeUp">
            {SUBS_TR[mode].map((sub) => (
              <button
                key={sub.value}
                onClick={() => selectSub(sub.value)}
                className="sub-btn"
              >
                {sub.label}
              </button>
            ))}
            <button onClick={goBackToDoors} className="back-btn">
              ← Kapılara dön
            </button>
          </div>
        )}

        {/* ── Hint ── */}
        <p className="mt-8 text-[13px] text-slate-500/70 tracking-wide">
          Tavsiye yok. Sadece olası sonuçlar.
        </p>
      </div>

      {/* ── Styles ── */}
      <style jsx global>{`
        /* ── Bubble particles (Huawei-style) ── */
        .bubble-particle {
          position: absolute;
          bottom: -20px;
          border-radius: 999px;
          background: radial-gradient(
            circle at 30% 30%,
            rgba(255, 255, 255, 0.95),
            rgba(180, 215, 255, 0.6) 50%,
            rgba(160, 200, 255, 0.12) 100%
          );
          box-shadow:
            0 0 8px rgba(160, 200, 255, 0.4),
            inset 0 0 6px rgba(255, 255, 255, 0.4);
          animation: bubbleRise linear infinite;
        }

        @keyframes bubbleRise {
          0% {
            transform: translateY(0) translateX(0) scale(0.5);
            opacity: 0;
          }
          6% {
            opacity: 1;
          }
          50% {
            transform: translateY(-45vh) translateX(var(--drift)) scale(0.9);
          }
          85% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-85vh) translateX(calc(var(--drift) * -0.5)) scale(1.1);
            opacity: 0;
          }
        }

        /* ── Orb ── */
        .piri-orb {
          position: relative;
          width: 160px;
          height: 160px;
          border-radius: 999px;
          background: radial-gradient(
            circle at 35% 30%,
            rgba(255, 255, 255, 0.98),
            rgba(210, 230, 255, 0.9) 30%,
            rgba(165, 200, 255, 0.8) 58%,
            rgba(135, 180, 255, 0.4) 80%,
            rgba(120, 165, 255, 0.15) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.85);
          box-shadow:
            0 20px 60px rgba(90, 140, 255, 0.15),
            0 0 0 10px rgba(255, 255, 255, 0.12),
            inset 0 0 24px rgba(255, 255, 255, 0.5);
          overflow: hidden;
          animation: orbFloat 7s ease-in-out infinite;
          transform: scale(0.8);
          opacity: 0.4;
          transition: transform 1.2s ease, opacity 1.2s ease;
        }

        .piri-orb.awake {
          transform: scale(1);
          opacity: 1;
        }

        @keyframes orbFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-5px) scale(1.015); }
        }

        .orb-core {
          position: absolute;
          inset: 22%;
          border-radius: 999px;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.95) 0%,
            rgba(230, 242, 255, 0.7) 50%,
            rgba(185, 215, 255, 0.2) 100%
          );
          animation: orbPulse 3.5s ease-in-out infinite;
          filter: blur(1px);
        }

        @keyframes orbPulse {
          0%, 100% { transform: scale(0.97); opacity: 0.85; }
          50% { transform: scale(1.06); opacity: 1; }
        }

        .orb-shine {
          position: absolute;
          width: 40%;
          height: 40%;
          top: 14%;
          left: 16%;
          border-radius: 999px;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.85),
            rgba(255, 255, 255, 0.15) 60%,
            transparent 100%
          );
          filter: blur(5px);
        }

        .orb-ring {
          position: absolute;
          inset: 10%;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          animation: orbSpin 20s linear infinite;
        }
        .orb-ring.r2 {
          inset: 16%;
          animation-duration: 26s;
          animation-direction: reverse;
        }

        @keyframes orbSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* ── Piri Speech Bubble ── */
        .piri-bubble {
          display: block;
          padding: 14px 20px;
          border-radius: 20px 20px 20px 6px;
          background: rgba(255, 255, 255, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow:
            0 4px 16px rgba(15, 23, 42, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
          color: #1e293b;
          backdrop-filter: blur(16px);
          font-size: 17px;
          line-height: 26px;
          letter-spacing: -0.01em;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .piri-bubble.show {
          opacity: 1;
          transform: translateY(0);
        }

        .piri-bubble.typing .cursor {
          display: inline;
          animation: blink 0.6s step-end infinite;
          color: #94a3b8;
          font-weight: 300;
          margin-left: 1px;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        /* ── Door buttons ── */
        .door-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 24px 28px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 6px 20px rgba(15, 23, 42, 0.05);
          backdrop-filter: blur(14px);
          transition: transform 0.15s ease, background 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
          min-width: 100px;
        }

        .door-btn:hover {
          background: rgba(255, 255, 255, 0.8);
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
        }

        .door-btn:active {
          transform: scale(0.97);
        }

        .door-icon {
          font-size: 28px;
          color: #475569;
          transition: color 0.2s;
        }

        .door-btn:hover .door-icon {
          color: #1e293b;
        }

        .door-label {
          font-size: 15px;
          font-weight: 500;
          color: #334155;
          letter-spacing: 0.02em;
        }

        /* ── Sub buttons ── */
        .sub-btn {
          display: block;
          width: 100%;
          text-align: left;
          padding: 16px 22px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.75);
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
          backdrop-filter: blur(12px);
          font-size: 16px;
          color: #1e293b;
          cursor: pointer;
          transition: transform 0.12s ease, background 0.2s ease;
        }

        .sub-btn:hover {
          background: rgba(255, 255, 255, 0.8);
          transform: translateX(4px);
        }

        .sub-btn:active {
          transform: scale(0.98);
        }

        .back-btn {
          display: inline-block;
          margin-top: 8px;
          padding: 8px 16px;
          border-radius: 999px;
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 14px;
          cursor: pointer;
          transition: color 0.2s;
        }

        .back-btn:hover {
          color: #475569;
        }

        /* ── Animations ── */
        .animate-fadeUp {
          animation: fadeUp 0.5s ease both;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ── Radial gradient utility ── */
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </main>
  );
}
