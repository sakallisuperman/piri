'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type Mode = 'work' | 'life' | 'love';
type Phase = 'dark' | 'wake' | 'piri' | 'doors' | 'sub';

type Bubble = {
  id: number; x: number; size: number; delay: number;
  dur: number; drift: number; blur: number; op: number;
};

// ─── Terminal Lines (Matrix-style wake up) ───────────────────────────
const WAKE_LINES = [
  { text: 'Geldin.', pause: 800 },
  { text: 'Karar almışsın.', pause: 1200 },
  { text: '', pause: 600 }, // beat
  { text: 'Artık Piri seninle.', pause: 1400 },
];

const DOOR_PROMPT = 'Yeni kararlar almak için bir kapı seç.';

const DOOR_LINES: Record<Mode, string[]> = {
  work: ['İş kapısı.', 'Düğümü göster.'],
  life: ['Yol kapısı.', 'Neyi değiştirmek istiyorsun?'],
  love: ['Aşk kapısı.', 'Riski göster.'],
};

const SUBS: Record<Mode, { label: string; value: string }[]> = {
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

// ─── Terminal Typing Effect ──────────────────────────────────────────
function useTerminal(lines: { text: string; pause: number }[], active: boolean) {
  const [displayed, setDisplayed] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const [done, setDone] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    if (!active || ran.current) return;
    ran.current = true;

    let cancelled = false;
    let t = 400;

    lines.forEach((line) => {
      if (line.text === '') {
        // empty = dramatic pause
        t += line.pause;
        return;
      }

      const chars = line.text.split('');
      const speed = 38;

      chars.forEach((_, ci) => {
        setTimeout(() => {
          if (cancelled) return;
          setCurrent(line.text.slice(0, ci + 1));
        }, t + ci * speed);
      });

      const end = t + chars.length * speed + 120;
      setTimeout(() => {
        if (cancelled) return;
        setDisplayed((p) => [...p, line.text]);
        setCurrent('');
      }, end);

      t = end + line.pause;
    });

    setTimeout(() => { if (!cancelled) setDone(true); }, t + 200);
    return () => { cancelled = true; };
  }, [active, lines]);

  return { displayed, current, done };
}

// ─── Component ───────────────────────────────────────────────────────
export default function Home() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('dark');
  const [mode, setMode] = useState<Mode | null>(null);
  const [showDoors, setShowDoors] = useState(false);
  const [showDoorPrompt, setShowDoorPrompt] = useState(false);
  const [showSubs, setShowSubs] = useState(false);
  const [subText, setSubText] = useState<string[]>([]);
  const [subCurrent, setSubCurrent] = useState('');
  const [orbVisible, setOrbVisible] = useState(false);

  const [bubbles] = useState<Bubble[]>(() =>
    Array.from({ length: 28 }).map((_, i) => ({
      id: i, x: 50 + (Math.random() * 14 - 7),
      size: 4 + Math.random() * 12, delay: Math.random() * 6,
      dur: 5 + Math.random() * 5, drift: Math.random() * 30 - 15,
      blur: Math.random() * 2.5, op: 0.15 + Math.random() * 0.35,
    }))
  );

  const wake = useTerminal(WAKE_LINES, phase === 'wake');

  // Start: dark screen → wake
  useEffect(() => {
    const t = setTimeout(() => setPhase('wake'), 800);
    return () => clearTimeout(t);
  }, []);

  // After wake text → transition to light + orb
  useEffect(() => {
    if (wake.done) {
      const t1 = setTimeout(() => {
        setPhase('piri');
        setOrbVisible(true);
      }, 600);
      const t2 = setTimeout(() => {
        setShowDoorPrompt(true);
      }, 1800);
      const t3 = setTimeout(() => {
        setPhase('doors');
        setShowDoors(true);
      }, 2800);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [wake.done]);

  // Door sub-lines typing
  useEffect(() => {
    if (phase !== 'sub' || !mode) return;
    const lines = DOOR_LINES[mode];
    let cancelled = false;
    let t = 300;

    lines.forEach((line) => {
      const chars = line.split('');
      chars.forEach((_, ci) => {
        setTimeout(() => {
          if (cancelled) return;
          setSubCurrent(line.slice(0, ci + 1));
        }, t + ci * 30);
      });
      const end = t + chars.length * 30 + 120;
      setTimeout(() => {
        if (cancelled) return;
        setSubText((p) => [...p, line]);
        setSubCurrent('');
      }, end);
      t = end + 500;
    });

    setTimeout(() => { if (!cancelled) setShowSubs(true); }, t + 200);
    return () => { cancelled = true; };
  }, [phase, mode]);

  function selectDoor(m: Mode) {
    setMode(m);
    setPhase('sub');
    setShowDoors(false);
    setShowDoorPrompt(false);
    setShowSubs(false);
    setSubText([]);
    setSubCurrent('');
  }

  function selectSub(value: string) {
    if (!mode) return;
    localStorage.setItem('piri_mode', mode);
    localStorage.setItem('piri_sub', value);
    localStorage.setItem('piri_lang', 'tr');
    router.push('/dna/test');
  }

  function goBack() {
    setMode(null);
    setPhase('doors');
    setShowDoors(true);
    setShowDoorPrompt(true);
    setShowSubs(false);
    setSubText([]);
    setSubCurrent('');
  }

  const isDark = phase === 'dark' || phase === 'wake';
  const modeLabels: Record<Mode, string> = { work: 'İş', life: 'Yol', love: 'Aşk' };
  const modeIcons: Record<Mode, string> = { work: '⬡', life: '◇', love: '○' };

  return (
    <main className="min-h-screen w-full overflow-hidden relative select-none">
      {/* Background transition: dark → light */}
      <div
        className="fixed inset-0 transition-all duration-[2000ms] ease-in-out"
        style={{
          background: isDark
            ? 'linear-gradient(to bottom, #0a0d14, #050709)'
            : 'linear-gradient(to bottom, #f5faff, #edf6ff, #f5fbff)',
        }}
      />

      {/* Ambient glow (only in light phase) */}
      <div
        className="pointer-events-none fixed inset-0 transition-opacity duration-[2000ms]"
        style={{ opacity: isDark ? 0 : 1 }}
      >
        <div className="absolute w-[360px] h-[360px] rounded-full left-[12%] bottom-[6%] bg-[#deeeff] opacity-50 blur-[70px]" />
        <div className="absolute w-[280px] h-[280px] rounded-full right-[14%] top-[10%] bg-[#e3f2ff] opacity-40 blur-[60px]" />
      </div>

      {/* Bubbles (only in light phase) */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden transition-opacity duration-[2000ms]"
        style={{ opacity: isDark ? 0 : 1 }}
      >
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[-100px] w-[420px] h-[220px] rounded-full bg-[rgba(160,200,255,0.35)] blur-[30px]" />
        {bubbles.map((b) => (
          <span
            key={b.id}
            className="bubble-particle"
            style={{
              left: `${b.x}%`, width: `${b.size}px`, height: `${b.size}px`,
              animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s`,
              opacity: b.op, filter: `blur(${b.blur}px)`,
              ['--drift' as string]: `${b.drift}px`,
            }}
          />
        ))}
      </div>

      {/* Main scene */}
      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center px-5">

        {/* ── Dark Phase: Terminal Text ── */}
        {isDark && (
          <div className="w-full max-w-[500px] text-center space-y-4 min-h-[180px] flex flex-col items-center justify-center">
            {wake.displayed.map((line, i) => (
              <p key={i} className="terminal-line">{line}</p>
            ))}
            {wake.current && (
              <p className="terminal-line">
                {wake.current}
                <span className="terminal-cursor">_</span>
              </p>
            )}
          </div>
        )}

        {/* ── Light Phase: Orb + Doors ── */}
        {!isDark && (
          <>
            {/* Orb */}
            <div className={`relative mb-10 transition-all duration-1000 ${orbVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
              <div className="absolute inset-[-36px] rounded-full bg-[rgba(170,210,255,0.4)] blur-[24px]" />
              <div className="piri-orb">
                <div className="orb-core" />
                <div className="orb-shine" />
                <div className="orb-ring r1" />
                <div className="orb-ring r2" />
              </div>
            </div>

            {/* Door prompt */}
            {showDoorPrompt && (
              <p className="text-lg text-slate-700 mb-8 animate-fadeUp text-center">{DOOR_PROMPT}</p>
            )}

            {/* Sub-category text */}
            {phase === 'sub' && (
              <div className="w-full max-w-[500px] text-center space-y-2 mb-8">
                {subText.map((line, i) => (
                  <p key={i} className="text-lg text-slate-800">{line}</p>
                ))}
                {subCurrent && (
                  <p className="text-lg text-slate-800">
                    {subCurrent}<span className="typing-cursor">|</span>
                  </p>
                )}
              </div>
            )}

            {/* Doors */}
            {showDoors && phase === 'doors' && (
              <div className="flex items-center justify-center gap-5 animate-fadeUp">
                {(['work', 'life', 'love'] as Mode[]).map((m) => (
                  <button key={m} onClick={() => selectDoor(m)} className="door-btn">
                    <span className="door-icon">{modeIcons[m]}</span>
                    <span className="door-label">{modeLabels[m]}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Sub-categories */}
            {showSubs && phase === 'sub' && mode && (
              <div className="w-full max-w-[440px] space-y-3 animate-fadeUp">
                {SUBS[mode].map((sub) => (
                  <button key={sub.value} onClick={() => selectSub(sub.value)} className="sub-btn">
                    {sub.label}
                  </button>
                ))}
                <div className="text-center mt-4">
                  <button onClick={goBack} className="back-btn">← Kapılara dön</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx global>{`
        /* Terminal text (dark phase) */
        .terminal-line {
          font-size: 22px; line-height: 36px; color: #e2e8f0;
          letter-spacing: 0.02em; font-weight: 300;
          animation: termFadeIn 0.4s ease both;
        }
        @keyframes termFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .terminal-cursor {
          animation: termBlink 0.7s step-end infinite;
          color: #64748b; margin-left: 2px;
        }
        @keyframes termBlink { 0%,100%{opacity:1} 50%{opacity:0} }

        /* Bubbles */
        .bubble-particle {
          position: absolute; bottom: -20px; border-radius: 999px;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(180,215,255,0.6) 50%, rgba(160,200,255,0.12) 100%);
          box-shadow: 0 0 8px rgba(160,200,255,0.4), inset 0 0 6px rgba(255,255,255,0.4);
          animation: bubbleRise linear infinite;
        }
        @keyframes bubbleRise {
          0% { transform: translateY(0) translateX(0) scale(0.5); opacity: 0; }
          6% { opacity: 1; }
          50% { transform: translateY(-45vh) translateX(var(--drift)) scale(0.9); }
          85% { opacity: 0.3; }
          100% { transform: translateY(-85vh) translateX(calc(var(--drift)*-0.5)) scale(1.1); opacity: 0; }
        }

        /* Orb */
        .piri-orb {
          position: relative; width: 150px; height: 150px; border-radius: 999px;
          background: radial-gradient(circle at 35% 30%, rgba(255,255,255,0.98), rgba(210,230,255,0.9) 30%, rgba(165,200,255,0.8) 58%, rgba(135,180,255,0.4) 80%, rgba(120,165,255,0.15) 100%);
          border: 1px solid rgba(255,255,255,0.85);
          box-shadow: 0 20px 60px rgba(90,140,255,0.15), 0 0 0 10px rgba(255,255,255,0.12), inset 0 0 24px rgba(255,255,255,0.5);
          overflow: hidden; animation: orbFloat 7s ease-in-out infinite;
        }
        @keyframes orbFloat { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-5px) scale(1.015)} }
        .orb-core {
          position: absolute; inset: 22%; border-radius: 999px;
          background: radial-gradient(circle, rgba(255,255,255,0.95), rgba(230,242,255,0.7) 50%, rgba(185,215,255,0.2) 100%);
          animation: orbPulse 3.5s ease-in-out infinite; filter: blur(1px);
        }
        @keyframes orbPulse { 0%,100%{transform:scale(0.97);opacity:0.85} 50%{transform:scale(1.06);opacity:1} }
        .orb-shine {
          position: absolute; width: 40%; height: 40%; top: 14%; left: 16%; border-radius: 999px;
          background: radial-gradient(circle, rgba(255,255,255,0.85), rgba(255,255,255,0.15) 60%, transparent 100%);
          filter: blur(5px);
        }
        .orb-ring { position: absolute; inset: 10%; border-radius: 999px; border: 1px solid rgba(255,255,255,0.15); animation: orbSpin 20s linear infinite; }
        .orb-ring.r2 { inset: 16%; animation-duration: 26s; animation-direction: reverse; }
        @keyframes orbSpin { from{transform:rotate(0)} to{transform:rotate(360deg)} }

        .typing-cursor { animation: termBlink 0.5s step-end infinite; color: #94a3b8; font-weight: 300; margin-left: 1px; }

        /* Doors */
        .door-btn {
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          padding: 24px 28px; border-radius: 24px;
          background: rgba(255,255,255,0.55); border: 1px solid rgba(255,255,255,0.8);
          box-shadow: 0 6px 20px rgba(15,23,42,0.05); backdrop-filter: blur(14px);
          transition: transform 0.15s ease, background 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer; min-width: 100px;
        }
        .door-btn:hover { background: rgba(255,255,255,0.8); transform: translateY(-2px) scale(1.02); box-shadow: 0 10px 30px rgba(15,23,42,0.08); }
        .door-btn:active { transform: scale(0.97); }
        .door-icon { font-size: 28px; color: #475569; transition: color 0.2s; }
        .door-btn:hover .door-icon { color: #1e293b; }
        .door-label { font-size: 15px; font-weight: 500; color: #334155; letter-spacing: 0.02em; }

        /* Subs */
        .sub-btn {
          display: block; width: 100%; text-align: center;
          padding: 16px 22px; border-radius: 18px;
          background: rgba(255,255,255,0.55); border: 1px solid rgba(255,255,255,0.75);
          box-shadow: 0 4px 14px rgba(15,23,42,0.04); backdrop-filter: blur(12px);
          font-size: 16px; color: #1e293b; cursor: pointer;
          transition: transform 0.12s ease, background 0.2s ease;
        }
        .sub-btn:hover { background: rgba(255,255,255,0.8); transform: scale(1.015); }
        .sub-btn:active { transform: scale(0.98); }
        .back-btn {
          padding: 8px 16px; border-radius: 999px; background: transparent;
          border: none; color: #94a3b8; font-size: 14px; cursor: pointer; transition: color 0.2s;
        }
        .back-btn:hover { color: #475569; }

        .animate-fadeUp { animation: fadeUp 0.5s ease both; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </main>
  );
}
