'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import PiriOrb from './components/PiriOrb';
import { usePiriVoice } from './hooks/usePiriVoice';
import { updateProfile } from './lib/profile';

type Mode = 'work' | 'life' | 'love';
type Phase = 'dark' | 'wake' | 'fade' | 'profile' | 'light' | 'sub';
type Gender = 'female' | 'male';
type AgeRange = '-23' | '23-32' | '32+';

type Bubble = {
  id: number; x: number; size: number; delay: number;
  dur: number; drift: number; blur: number; op: number;
};

// ── Voice lines ──
const VOICE_WAKE = 'Geldin. Karar almışsın. Artık Piri seninle.';
const VOICE_PROFILE_GENDER = 'Seni tanımam lazım. Sadece iki soru.';
const VOICE_PROFILE_AGE = 'Yaş aralığın?';
const VOICE_DOORS = 'Yeni kararlar almak için bir kapı seç.';
const VOICE_DOOR: Record<Mode, string> = {
  work: 'İş kapısı. Düğümü göster.',
  life: 'Yol kapısı. Neyi değiştirmek istiyorsun?',
  love: 'Aşk kapısı. Riski göster.',
};

// ── Terminal lines (visual only) ──
const WAKE_LINES = [
  { text: 'Geldin.', pause: 800 },
  { text: 'Karar almışsın.', pause: 1200 },
  { text: '', pause: 600 },
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

function useTerminal(lines: { text: string; pause: number }[], active: boolean, onLineComplete?: (text: string) => void) {
  const [displayed, setDisplayed] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const [done, setDone] = useState(false);
  const ran = useRef(false);
  const onLineCompleteRef = useRef(onLineComplete);

  useEffect(() => {
    onLineCompleteRef.current = onLineComplete;
  });

  useEffect(() => {
    if (!active || ran.current) return;
    ran.current = true;
    let cancelled = false;
    let t = 400;

    lines.forEach((line) => {
      if (line.text === '') { t += line.pause; return; }
      const chars = line.text.split('');
      const speed = 38;
      chars.forEach((_, ci) => {
        setTimeout(() => { if (!cancelled) setCurrent(line.text.slice(0, ci + 1)); }, t + ci * speed);
      });
      const end = t + chars.length * speed + 120;
      setTimeout(() => { if (!cancelled) { setDisplayed((p) => [...p, line.text]); onLineCompleteRef.current?.(line.text); setCurrent(''); } }, end);
      t = end + line.pause;
    });

    setTimeout(() => { if (!cancelled) setDone(true); }, t + 200);
    return () => { cancelled = true; };
  }, [active, lines]);

  return { displayed, current, done };
}

export default function Home() {
  const router = useRouter();
  const voice = usePiriVoice();
  const [phase, setPhase] = useState<Phase>('dark');
  const [mode, setMode] = useState<Mode | null>(null);
  const [, setGender] = useState<Gender | null>(null);
  const [, setAgeRange] = useState<AgeRange | null>(null);
  const [profileStep, setProfileStep] = useState<'gender' | 'age' | 'done'>('gender');
  const [showDoors, setShowDoors] = useState(false);
  const [showDoorPrompt, setShowDoorPrompt] = useState(false);
  const [showSubs, setShowSubs] = useState(false);
  const [subText, setSubText] = useState<string[]>([]);
  const [subCurrent, setSubCurrent] = useState('');
  const [orbVisible, setOrbVisible] = useState(false);
  const [orbSide, setOrbSide] = useState(false); // orb docked to side
  const [userInteracted, setUserInteracted] = useState(false);

  // Track voice triggers to avoid double-firing
  const voiceFired = useRef<Set<string>>(new Set());
  // Stable ref for voice.speak to avoid effect re-triggers
  const voiceSpeakRef = useRef(voice.speak);
  const voiceStopRef = useRef(voice.stop);
  voiceSpeakRef.current = voice.speak;
  voiceStopRef.current = voice.stop;

  const [bubbles] = useState<Bubble[]>(() =>
    Array.from({ length: 28 }).map((_, i) => ({
      id: i, x: 50 + (Math.random() * 14 - 7),
      size: 4 + Math.random() * 12, delay: Math.random() * 6,
      dur: 5 + Math.random() * 5, drift: Math.random() * 30 - 15,
      blur: Math.random() * 2.5, op: 0.15 + Math.random() * 0.35,
    }))
  );

  const wake = useTerminal(WAKE_LINES, phase === 'wake', (text) => voiceSpeakRef.current(text));

  // Trigger voice only once per key (stable — no deps on voice object)
  const fireVoice = useCallback((key: string, text: string) => {
    if (voiceFired.current.has(key)) return;
    voiceFired.current.add(key);
    voiceSpeakRef.current(text);
  }, []);

  // ── Phase transitions ──

  useEffect(() => {
    const t = setTimeout(() => setPhase('wake'), 800);
    return () => clearTimeout(t);
  }, []);

  // Voice: wake line (now synced with text via useTerminal callback)
  // Removed separate voice trigger

  // After wake → clean fade to white
  useEffect(() => {
    if (!wake.done) return;
    const t0 = setTimeout(() => setPhase('fade'), 500);
    const t1 = setTimeout(() => {
      setPhase('profile');
      setOrbVisible(true);
    }, 2800);
    return () => { [t0, t1].forEach(clearTimeout); };
  }, [wake.done]);

  // Voice: profile gender step
  useEffect(() => {
    if (phase === 'profile' && profileStep === 'gender') {
      const t = setTimeout(() => fireVoice('profile_gender', VOICE_PROFILE_GENDER), 800);
      return () => clearTimeout(t);
    }
  }, [phase, profileStep, fireVoice]);

  // Voice: profile age step
  useEffect(() => {
    if (phase === 'profile' && profileStep === 'age') {
      fireVoice('profile_age', VOICE_PROFILE_AGE);
    }
  }, [phase, profileStep, fireVoice]);

  // Voice: doors prompt
  useEffect(() => {
    if (showDoorPrompt && phase === 'light') {
      const t = setTimeout(() => fireVoice('doors', VOICE_DOORS), 300);
      return () => clearTimeout(t);
    }
  }, [showDoorPrompt, phase, fireVoice]);

  // Voice + typing: sub phase (door selected)
  useEffect(() => {
    if (phase !== 'sub' || !mode) return;

    // Voice (now synced with typing)
    // Removed separate voice trigger

    // Typing animation
    const lines = DOOR_LINES[mode];
    let cancelled = false;
    let t = 300;

    lines.forEach((line) => {
      const chars = line.split('');
      chars.forEach((_, ci) => {
        setTimeout(() => { if (!cancelled) setSubCurrent(line.slice(0, ci + 1)); }, t + ci * 30);
      });
      const end = t + chars.length * 30 + 120;
      setTimeout(() => { if (!cancelled) { setSubText((p) => [...p, line]); voiceSpeakRef.current(line); setSubCurrent(''); } }, end);
      t = end + 500;
    });

    setTimeout(() => {
      if (!cancelled) {
        setShowSubs(true);
        // Orb moves to side when subs appear
        setOrbSide(true);
      }
    }, t + 200);

    return () => { cancelled = true; };
  }, [phase, mode]);

  // ── User interactions ──

  // Enable audio on first interaction (browser autoplay policy)
  function handleInteraction() {
    if (!userInteracted) setUserInteracted(true);
  }

  function selectGender(g: Gender) {
    handleInteraction();
    setGender(g);
    localStorage.setItem('piri_gender', g);
    updateProfile({ gender: g });
    setProfileStep('age');
  }

  function selectAge(a: AgeRange) {
    handleInteraction();
    setAgeRange(a);
    localStorage.setItem('piri_age', a);
    updateProfile({ ageRange: a });
    setProfileStep('done');
    setTimeout(() => {
      setPhase('light');
      setShowDoorPrompt(true);
    }, 300);
    setTimeout(() => setShowDoors(true), 800);
  }

  function selectDoor(m: Mode) {
    handleInteraction();
    voiceStopRef.current(); // stop current voice if playing
    // Reset voice trigger for door so it can fire for new mode
    voiceFired.current.delete(`door_${m}`);
    setMode(m);
    setPhase('sub');
    setShowDoors(false);
    setShowDoorPrompt(false);
    setShowSubs(false);
    setOrbSide(false);
    setSubText([]);
    setSubCurrent('');
  }

  function selectSub(value: string) {
    if (!mode) return;
    voiceStopRef.current();
    localStorage.setItem('piri_mode', mode);
    localStorage.setItem('piri_sub', value);
    localStorage.setItem('piri_lang', 'tr');
    updateProfile({ mode, sub: value });
    router.push('/dna/test');
  }

  function goBack() {
    voiceStopRef.current();
    setMode(null);
    setPhase('light');
    setShowDoors(true);
    setShowDoorPrompt(true);
    setShowSubs(false);
    setOrbSide(false);
    setSubText([]);
    setSubCurrent('');
  }

  const isDark = phase === 'dark' || phase === 'wake';
  const isFade = phase === 'fade';
  const isProfile = phase === 'profile';
  const isLight = phase === 'light' || phase === 'sub' || isProfile;
  const modeLabels: Record<Mode, string> = { work: 'İş', life: 'Yol', love: 'Aşk' };
  const modeIcons: Record<Mode, string> = { work: '⬡', life: '◇', love: '○' };

  return (
    <main className="min-h-screen w-full overflow-hidden relative select-none">
      {/* Light background */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#f5faff] via-[#edf6ff] to-[#f5fbff]" />

      {/* Dark overlay — clean fade */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, #0a0d14, #050709)',
          opacity: isDark ? 1 : isFade ? 0 : 0,
          transition: 'opacity 2s ease-out',
        }}
      />

      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 z-[2] transition-opacity duration-[1500ms]"
        style={{ opacity: isLight ? 1 : 0 }}
      >
        <div className="absolute w-[360px] h-[360px] rounded-full left-[12%] bottom-[6%] bg-[#deeeff] opacity-50 blur-[70px]" />
        <div className="absolute w-[280px] h-[280px] rounded-full right-[14%] top-[10%] bg-[#e3f2ff] opacity-40 blur-[60px]" />
      </div>

      {/* Bubbles */}
      <div
        className="pointer-events-none fixed inset-0 z-[2] overflow-hidden transition-opacity duration-[2000ms]"
        style={{ opacity: isLight ? 1 : 0 }}
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

      {/* ── Orb (centered top for profile/light, hidden in sub phase) ── */}
      {isLight && !orbSide && (
        <div
          className="fixed z-[15] transition-all duration-[800ms] ease-in-out"
          style={{
            top: '50%',
            left: '50%',
            opacity: orbVisible ? 1 : 0,
            transform: orbVisible
              ? 'translate(-50%, -50%) translateY(-120px) scale(1)'
              : 'translate(-50%, -50%) translateY(-120px) scale(0.6)',
          }}
        >
          <PiriOrb size={140} speaking={voice.isSpeaking} />
        </div>
      )}

      {/* Content */}
      <div className="relative z-[10] flex min-h-screen flex-col items-center justify-center px-5">

        {/* Dark: terminal */}
        {(isDark || isFade) && (
          <div
            className="w-full max-w-[500px] text-center space-y-4 min-h-[180px] flex flex-col items-center justify-center"
            style={{
              opacity: isFade ? 0 : 1,
              transition: 'opacity 1.2s ease',
            }}
          >
            {wake.displayed.map((line, i) => (
              <p key={i} className="terminal-line">{line}</p>
            ))}
            {wake.current && (
              <p className="terminal-line">
                {wake.current}<span className="terminal-cursor">_</span>
              </p>
            )}
          </div>
        )}

        {/* Light: content (orb is separate fixed element now) */}
        {isLight && (
          <>
            {/* Spacer for center orb */}
            {!orbSide && <div className="h-[180px]" />}

            {/* Profile: Gender */}
            {isProfile && profileStep === 'gender' && (
              <div className="w-full max-w-[440px] text-center space-y-5 animate-fadeUp">
                <p className="piri-label">Piri</p>
                <p className="text-xl text-slate-900">Seni tanımam lazım.</p>
                <p className="text-slate-500 text-sm">Sadece iki soru.</p>
                <div className="flex items-center justify-center gap-5 pt-2">
                  <button onClick={() => selectGender('female')} className="gender-btn gender-female">Kadın</button>
                  <button onClick={() => selectGender('male')} className="gender-btn gender-male">Erkek</button>
                </div>
              </div>
            )}

            {/* Profile: Age */}
            {isProfile && profileStep === 'age' && (
              <div className="w-full max-w-[440px] text-center space-y-5 animate-fadeUp">
                <p className="piri-label">Piri</p>
                <p className="text-xl text-slate-900">Yaş aralığın?</p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  {(['-23', '23-32', '32+'] as AgeRange[]).map((a) => (
                    <button key={a} onClick={() => selectAge(a)} className="profile-btn">
                      {a === '-23' ? '23 altı' : a === '32+' ? '32 üstü' : a}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Door prompt */}
            {showDoorPrompt && (
              <p className="text-lg text-slate-700 mb-8 animate-fadeUp text-center">{DOOR_PROMPT}</p>
            )}

            {/* Sub typing */}
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

            {/* Door buttons */}
            {showDoors && phase === 'light' && (
              <div className="flex items-center justify-center gap-5 animate-fadeUp">
                {(['work', 'life', 'love'] as Mode[]).map((m) => (
                  <button key={m} onClick={() => selectDoor(m)} className="door-btn">
                    <span className="door-icon">{modeIcons[m]}</span>
                    <span className="door-label">{modeLabels[m]}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Sub-category buttons */}
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
                {/* Inline breathing orb below sub buttons */}
                <div className="flex justify-center pt-6 animate-fadeUp">
                  <PiriOrb size={70} speaking={voice.isSpeaking} />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Piri speaking indicator (centered under orb) ── */}
      {voice.isSpeaking && (
        <div className="fixed z-[16] animate-fadeUp" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%) translateY(10px)' }}>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl px-4 py-2 shadow-sm border border-white/70">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .terminal-line {
          font-size: 22px; line-height: 36px; color: #e2e8f0;
          letter-spacing: 0.02em; font-weight: 300;
          animation: termFadeIn 0.4s ease both;
        }
        @keyframes termFadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        .terminal-cursor { animation: termBlink 0.7s step-end infinite; color: #64748b; margin-left: 2px; }
        @keyframes termBlink { 0%,100%{opacity:1} 50%{opacity:0} }

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

        .typing-cursor { animation: termBlink 0.5s step-end infinite; color: #94a3b8; font-weight: 300; margin-left: 1px; }

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
        .back-btn { padding: 8px 16px; border-radius: 999px; background: transparent; border: none; color: #94a3b8; font-size: 14px; cursor: pointer; transition: color 0.2s; }
        .back-btn:hover { color: #475569; }

        .piri-label {
          font-size: 22px; font-weight: 300; letter-spacing: 0.25em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #6b8cff, #a78bfa, #7dd3fc);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .gender-btn {
          padding: 18px 36px; border-radius: 20px;
          font-size: 17px; font-weight: 600; cursor: pointer;
          border: none; color: white; min-width: 130px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          transition: transform 0.15s ease, box-shadow 0.2s ease;
        }
        .gender-btn:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 12px 32px rgba(0,0,0,0.15); }
        .gender-btn:active { transform: scale(0.97); }

        .gender-female {
          background: linear-gradient(135deg, rgba(160,120,255,0.20), rgba(140,100,255,0.20), rgba(180,140,255,0.20));
          color: #7c5cc7;
        }
        .gender-male {
          background: linear-gradient(135deg, rgba(100,180,255,0.20), rgba(80,200,255,0.20), rgba(120,200,255,0.20));
          color: #3b8fd4;
        }

        .profile-btn {
          padding: 14px 24px; border-radius: 18px;
          background: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.8);
          box-shadow: 0 4px 14px rgba(15,23,42,0.05); backdrop-filter: blur(12px);
          font-size: 16px; font-weight: 500; color: #334155; cursor: pointer;
          transition: transform 0.12s ease, background 0.2s ease;
        }
        .profile-btn:hover { background: rgba(255,255,255,0.85); transform: scale(1.03); }
        .profile-btn:active { transform: scale(0.97); }

        .animate-fadeUp { animation: fadeUp 0.5s ease both; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </main>
  );
}
