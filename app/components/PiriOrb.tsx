'use client';

// PiriOrb: upgraded visual style with deep breathing and speaking activity.
// Palette: blue-cyan-purple-white (kept exactly as required).

export default function PiriOrb({ size = 150, speaking = false }: { size?: number; speaking?: boolean }) {
  const s = size;
  const breathDuration = speaking ? 1.8 : 4.5;
  const glowDuration = speaking ? 1.5 : 4.5;
  const ring1Duration = speaking ? 6 : 20;
  const ring2Duration = speaking ? 9 : 30;
  const particleDurations = speaking ? [5, 6.5, 8, 7.25, 9.5, 11] : [15, 18, 22, 19, 25, 27];

  return (
    <div className="piri-orb-wrap" style={{ width: s, height: s }}>
      <div className="piri-glow" />

      <div className="orb-ring ring1" />
      <div className="orb-ring ring2" />

      <div className="piri-siri-orb">
        <div className="grad-layer g1" />
        <div className="grad-layer g2" />
        <div className="grad-layer g3" />

        <div className="orb-main">
          <div className="orb-center" />
          <div className="orb-top-shine" />
        </div>
      </div>

      <div className="pulse-ring" />

      <div className="particle particle1" />
      <div className="particle particle2" />
      <div className="particle particle3" />
      <div className="particle particle4" />
      <div className="particle particle5" />
      <div className="particle particle6" />

      <style jsx>{`
        .piri-orb-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .piri-glow {
          position: absolute;
          inset: -${s * 0.3}px;
          border-radius: 999px;
          background: radial-gradient(circle,
            rgba(120, 180, 255, ${speaking ? '0.8' : '0.4'}),
            rgba(140, 120, 255, ${speaking ? '0.45' : '0.25'}) 45%,
            rgba(100, 160, 255, 0.08) 65%,
            transparent 80%
          );
          filter: blur(${s * 0.2}px);
          animation: glowBreathe ${glowDuration}s ease-in-out infinite;
          opacity: ${speaking ? '1' : '0.6'};
        }

        @keyframes glowBreathe {
          0%, 100% { transform: scale(0.95); opacity: ${speaking ? '0.95' : '0.4'}; }
          50% { transform: scale(1.18); opacity: ${speaking ? '1' : '1'}; }
        }

        .piri-siri-orb {
          position: relative;
          width: ${s}px;
          height: ${s}px;
          border-radius: 999px;
          overflow: hidden;
          animation: orbBreathe ${breathDuration}s ease-in-out infinite, orbFloat 6s ease-in-out infinite;
          box-shadow:
            0 0 ${s * 0.5}px rgba(100, 160, 255, ${speaking ? '0.5' : '0.25'}),
            0 0 ${s * 0.18}px rgba(130, 100, 255, ${speaking ? '0.35' : '0.2'}),
            inset 0 0 ${s * 0.24}px rgba(255, 255, 255, 0.35);
        }

        @keyframes orbFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-${s * 0.045}px); }
        }

        @keyframes orbBreathe {
          0%, 100% { transform: scale(0.88); }
          50% { transform: scale(1.12); }
        }

        .orb-ring {
          position: absolute;
          border-radius: 999px;
          border: 1px solid rgba(170, 215, 255, 0.35);
          box-shadow: 0 0 ${s * 0.04}px rgba(120, 190, 255, 0.5);
          width: ${s * 1.3}px;
          height: ${s * 1.3}px;
          top: calc(50% - ${s * 0.65}px);
          left: calc(50% - ${s * 0.65}px);
          mix-blend-mode: screen;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .orb-ring.ring1 { transform: rotate(15deg); animation-name: ringRotate; animation-duration: ${ring1Duration}s; }
        .orb-ring.ring2 { transform: rotate(-20deg); animation-name: ringRotate; animation-duration: ${ring2Duration}s; }

        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .grad-layer {
          position: absolute;
          inset: -40%;
          border-radius: 999px;
          mix-blend-mode: screen;
          opacity: 0.85;
        }

        .g1 {
          background: conic-gradient(
            from 0deg,
            rgba(100, 180, 255, 0.95),
            rgba(160, 120, 255, 0.72),
            rgba(80, 200, 255, 0.85),
            rgba(200, 160, 255, 0.65),
            rgba(100, 180, 255, 0.95)
          );
          animation: spinLayer1 ${speaking ? '12s' : '24s'} linear infinite;
          filter: blur(${s * 0.12}px);
        }

        .g2 {
          background: conic-gradient(
            from 80deg,
            rgba(255, 255, 255, 0.65),
            rgba(120, 200, 255, 0.55),
            rgba(180, 140, 255, 0.75),
            rgba(100, 220, 255, 0.45),
            rgba(255, 255, 255, 0.65)
          );
          animation: spinLayer2 ${speaking ? '10s' : '20s'} reverse linear infinite;
          filter: blur(${s * 0.085}px);
        }

        .g3 {
          background: conic-gradient(
            from 140deg,
            rgba(140, 100, 255, 0.55),
            rgba(80, 200, 240, 0.7),
            rgba(255, 255, 255, 0.45),
            rgba(160, 120, 255, 0.62),
            rgba(140, 100, 255, 0.55)
          );
          animation: spinLayer3 ${speaking ? '8s' : '16s'} linear infinite;
          filter: blur(${s * 0.13}px);
          opacity: 0.8;
        }

        @keyframes spinLayer1 {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(90deg) scale(1.12); }
          50% { transform: rotate(180deg) scale(1.32); }
          75% { transform: rotate(270deg) scale(1.12); }
          100% { transform: rotate(360deg) scale(1); }
        }

        @keyframes spinLayer2 {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-90deg) scale(1.14); }
          50% { transform: rotate(-180deg) scale(1.30); }
          75% { transform: rotate(-270deg) scale(1.08); }
          100% { transform: rotate(-360deg) scale(1); }
        }

        @keyframes spinLayer3 {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.28); }
          100% { transform: rotate(360deg) scale(1); }
        }

        .orb-main {
          position: absolute;
          inset: 18%;
          border-radius: 999px;
          overflow: hidden;
          background: radial-gradient(circle at 25% 25%, rgba(255,255,255,0.95), rgba(156,195,255,0.6) 45%, rgba(110,150,255,0.25) 75%, rgba(35,75,180,0.25) 100%);
          box-shadow: inset 0 0 ${s * 0.2}px rgba(255,255,255,0.45);
        }

        .orb-center {
          position: absolute;
          inset: 28%;
          border-radius: 999px;
          background: radial-gradient(circle,
            rgba(255, 255, 255, 1),
            rgba(210, 230, 255, 0.8) 40%,
            rgba(170, 200, 255, 0.45) 70%,
            rgba(80, 130, 220, 0.2)
          );
          animation: centerPulse ${speaking ? '0.6s' : '2s'} ease-in-out infinite;
          filter: blur(${s * 0.02}px);
        }

        @keyframes centerPulse {
          0%, 100% { transform: scale(0.88); opacity: ${speaking ? '1' : '0.9'}; }
          40% { transform: scale(1.03); opacity: 1; }
          50% { transform: scale(1.12); opacity: 1; box-shadow: 0 0 ${s * 0.04}px rgba(255,255,255,0.9); }
          60% { transform: scale(1.03); opacity: 1; }
        }

        .orb-top-shine {
          position: absolute;
          width: 42%;
          height: 36%;
          top: 9%;
          left: 14%;
          border-radius: 999px;
          background: radial-gradient(circle,
            rgba(255, 255, 255, 0.8),
            rgba(255, 255, 255, 0) 70%
          );
          filter: blur(${s * 0.03}px);
          animation: shineMove ${speaking ? '2.5s' : '7s'} ease-in-out infinite;
        }

        @keyframes shineMove {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.72; }
          33% { transform: translate(${s * 0.02}px, ${s * 0.01}px) scale(1.06); opacity: 0.95; }
          66% { transform: translate(-${s * 0.017}px, -${s * 0.01}px) scale(0.94); opacity: 0.62; }
        }

        .pulse-ring {
          position: absolute;
          inset: -${s * 0.07}px;
          border-radius: 999px;
          border: 1.4px solid rgba(140, 180, 255, 0.28);
          animation: ringPulse ${speaking ? '1.2s' : '3.5s'} ease-out infinite;
          opacity: ${speaking ? '1' : '0.8'};
        }

        @keyframes ringPulse {
          0%, 100% { transform: scale(0.92); opacity: ${speaking ? '0.95' : '0.48'}; }
          50% { transform: scale(1.23); opacity: 0.1; }
        }

        .particle {
          position: absolute;
          width: ${s * 0.06}px;
          height: ${s * 0.06}px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 0 ${s * 0.02}px rgba(255,255,255,0.6);
          transform-origin: center center;
        }

        .particle1 { top: 50%; left: 50%; animation: orbit1 ${particleDurations[0]}s linear infinite; }
        .particle2 { top: 50%; left: 50%; animation: orbit2 ${particleDurations[1]}s linear infinite; }
        .particle3 { top: 50%; left: 50%; animation: orbit3 ${particleDurations[2]}s linear infinite; }
        .particle4 { top: 50%; left: 50%; animation: orbit4 ${particleDurations[3]}s linear infinite; }
        .particle5 { top: 50%; left: 50%; animation: orbit5 ${particleDurations[4]}s linear infinite; }
        .particle6 { top: 50%; left: 50%; animation: orbit6 ${particleDurations[5]}s linear infinite; }

        @keyframes orbit1 { 0% { transform: rotate(0deg) translate(${s * 0.72}px) rotate(0deg); } 100% { transform: rotate(360deg) translate(${s * 0.72}px) rotate(-360deg); } }
        @keyframes orbit2 { 0% { transform: rotate(0deg) translate(${s * 0.58}px) rotate(0deg); } 100% { transform: rotate(-360deg) translate(${s * 0.58}px) rotate(360deg); } }
        @keyframes orbit3 { 0% { transform: rotate(0deg) translate(${s * 0.86}px) rotate(0deg); } 100% { transform: rotate(360deg) translate(${s * 0.86}px) rotate(-360deg); } }
        @keyframes orbit4 { 0% { transform: rotate(0deg) translate(${s * 0.65}px) rotate(0deg); } 100% { transform: rotate(-360deg) translate(${s * 0.65}px) rotate(360deg); } }
        @keyframes orbit5 { 0% { transform: rotate(0deg) translate(${s * 0.95}px) rotate(0deg); } 100% { transform: rotate(360deg) translate(${s * 0.95}px) rotate(-360deg); } }
        @keyframes orbit6 { 0% { transform: rotate(0deg) translate(${s * 1.05}px) rotate(0deg); } 100% { transform: rotate(-360deg) translate(${s * 1.05}px) rotate(360deg); } }
      `}</style>
    </div>
  );
}
