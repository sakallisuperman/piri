'use client';

// Siri-inspired animated orb — Piri's visual identity
// Gradient waves rotating, pulsing glow, breathing animation
// Colors: Piri palette (blue-cyan-purple-white)

export default function PiriOrb({ size = 150, speaking = false }: { size?: number; speaking?: boolean }) {
  const s = size;
  const half = s / 2;

  return (
    <div className="piri-orb-wrap" style={{ width: s, height: s }}>
      {/* Outer glow */}
      <div className="piri-glow" />

      {/* Main orb container */}
      <div className="piri-siri-orb">
        {/* Rotating gradient layers */}
        <div className="grad-layer g1" />
        <div className="grad-layer g2" />
        <div className="grad-layer g3" />

        {/* Core bright center */}
        <div className="orb-center" />

        {/* Shine */}
        <div className="orb-top-shine" />
      </div>

      {/* Pulse ring */}
      <div className="pulse-ring" />

      <style jsx>{`
        .piri-orb-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .piri-glow {
          position: absolute;
          inset: -${s * 0.25}px;
          border-radius: 999px;
          background: radial-gradient(circle,
            rgba(120, 180, 255, ${speaking ? '0.55' : '0.35'}),
            rgba(140, 120, 255, ${speaking ? '0.25' : '0.15'}) 50%,
            transparent 70%
          );
          filter: blur(${s * 0.15}px);
          animation: glowBreathe ${speaking ? '1.2s' : '4s'} ease-in-out infinite;
        }

        @keyframes glowBreathe {
          0%, 100% { transform: scale(${speaking ? '0.9' : '0.95'}); opacity: ${speaking ? '0.8' : '0.7'}; }
          50% { transform: scale(${speaking ? '1.15' : '1.08'}); opacity: 1; }
        }

        .piri-siri-orb {
          position: relative;
          width: ${s}px;
          height: ${s}px;
          border-radius: 999px;
          overflow: hidden;
          animation: orbFloat 6s ease-in-out infinite;
          box-shadow:
            0 0 ${s * 0.4}px rgba(100, 160, 255, 0.2),
            0 0 ${s * 0.13}px rgba(130, 100, 255, 0.15),
            inset 0 0 ${s * 0.2}px rgba(255, 255, 255, 0.3);
        }

        @keyframes orbFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-${s * 0.04}px); }
        }

        /* Gradient layers — rotating in different directions/speeds */
        .grad-layer {
          position: absolute;
          inset: -30%;
          border-radius: 999px;
          mix-blend-mode: screen;
        }

        .g1 {
          background: conic-gradient(
            from 0deg,
            rgba(100, 180, 255, 0.9),
            rgba(160, 120, 255, 0.7),
            rgba(80, 200, 255, 0.8),
            rgba(200, 160, 255, 0.6),
            rgba(100, 180, 255, 0.9)
          );
          animation: spinSlow ${speaking ? '3s' : '8s'} linear infinite;
          filter: blur(${s * 0.12}px);
        }

        .g2 {
          background: conic-gradient(
            from 120deg,
            rgba(255, 255, 255, 0.6),
            rgba(120, 200, 255, 0.5),
            rgba(180, 140, 255, 0.7),
            rgba(100, 220, 255, 0.4),
            rgba(255, 255, 255, 0.6)
          );
          animation: spinMed ${speaking ? '2.5s' : '6s'} linear infinite reverse;
          filter: blur(${s * 0.08}px);
        }

        .g3 {
          background: conic-gradient(
            from 240deg,
            rgba(140, 100, 255, 0.5),
            rgba(80, 200, 240, 0.6),
            rgba(255, 255, 255, 0.4),
            rgba(160, 120, 255, 0.5),
            rgba(140, 100, 255, 0.5)
          );
          animation: spinFast 12s linear infinite;
          filter: blur(${s * 0.15}px);
          opacity: 0.7;
        }

        @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spinMed { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spinFast { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .orb-center {
          position: absolute;
          inset: 25%;
          border-radius: 999px;
          background: radial-gradient(circle,
            rgba(255, 255, 255, 0.95),
            rgba(200, 220, 255, 0.6) 50%,
            rgba(160, 180, 255, 0.1) 100%
          );
          animation: centerPulse ${speaking ? '1s' : '3s'} ease-in-out infinite;
          filter: blur(${s * 0.02}px);
        }

        @keyframes centerPulse {
          0%, 100% { transform: scale(0.92); opacity: 0.8; }
          50% { transform: scale(1.08); opacity: 1; }
        }

        .orb-top-shine {
          position: absolute;
          width: 40%;
          height: 35%;
          top: 10%;
          left: 15%;
          border-radius: 999px;
          background: radial-gradient(circle,
            rgba(255, 255, 255, 0.7),
            rgba(255, 255, 255, 0) 70%
          );
          filter: blur(${s * 0.03}px);
          animation: shineMove 7s ease-in-out infinite;
        }

        @keyframes shineMove {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          33% { transform: translate(${s * 0.02}px, ${s * 0.01}px) scale(1.05); opacity: 0.9; }
          66% { transform: translate(-${s * 0.015}px, -${s * 0.01}px) scale(0.95); opacity: 0.6; }
        }

        .pulse-ring {
          position: absolute;
          inset: -6px;
          border-radius: 999px;
          border: 1px solid rgba(140, 180, 255, 0.2);
          animation: ringPulse 3.5s ease-out infinite;
        }

        @keyframes ringPulse {
          0% { transform: scale(0.96); opacity: 0.5; }
          60% { transform: scale(1.1); opacity: 0; }
          100% { transform: scale(1.1); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
