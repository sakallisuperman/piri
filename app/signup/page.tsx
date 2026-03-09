'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfile } from '../lib/profile';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError('İsmini yaz.'); return; }
    if (!email.trim() || !email.includes('@')) { setError('Geçerli bir email gir.'); return; }

    setLoading(true);
    setError('');

    // Save to localStorage (will be replaced with Supabase later)
    localStorage.setItem('piri_user_name', name.trim());
    localStorage.setItem('piri_user_email', email.trim());
    localStorage.setItem('piri_signed_up', 'true');
    updateProfile({ name: name.trim(), email: email.trim() });

    // Small delay for feel
    setTimeout(() => {
      router.push('/dna/test?layer=2');
    }, 400);
  }

  function handleGoogleSignup() {
    // Placeholder — will integrate with Supabase Google OAuth
    setError('Google ile giriş yakında aktif olacak. Şimdilik email ile devam et.');
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="fixed inset-0 bg-gradient-to-b from-[#f5faff] via-[#edf6ff] to-[#f5fbff]" />

      <div className="relative w-full max-w-md space-y-6">
        {/* Mini orb */}
        <div className="flex justify-center mb-2">
          <div
            className="w-16 h-16 rounded-full border border-white/80"
            style={{
              background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.98), rgba(210,230,255,0.9) 30%, rgba(165,200,255,0.8) 58%, rgba(135,180,255,0.4) 80%)',
              boxShadow: '0 12px 40px rgba(90,140,255,0.15)',
              animation: 'orbPulseSmall 3s ease-in-out infinite',
            }}
          />
        </div>

        {/* Piri message */}
        <div className="text-center space-y-2">
          <p className="text-[13px] tracking-widest text-slate-400 uppercase">Piri</p>
          <p className="text-xl text-slate-900 leading-relaxed">
            İlk katmanı geçtin. Sinyallerin oluşuyor.
          </p>
          <p className="text-slate-600">
            Devam etmek için seni kaydetmem lazım. Hızlı olacak.
          </p>
        </div>

        {/* Signup form */}
        <div className="bg-white/55 border border-white/60 rounded-[28px] p-8 shadow-sm ring-1 ring-white/60 backdrop-blur-xl space-y-5">
          {/* Google button */}
          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-white border border-slate-200 text-slate-700 font-medium transition hover:bg-slate-50 hover:scale-[1.01] active:scale-[0.99]"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Google ile devam et
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">veya</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="İsmin"
                className="w-full rounded-2xl border border-white/70 bg-white/75 px-5 py-3.5 text-slate-900 outline-none text-[16px] placeholder:text-slate-400"
              />
            </div>
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email adresin"
                className="w-full rounded-2xl border border-white/70 bg-white/75 px-5 py-3.5 text-slate-900 outline-none text-[16px] placeholder:text-slate-400"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-slate-900 text-white font-medium transition hover:scale-[1.02] active:scale-[0.97] disabled:opacity-50"
            >
              {loading ? 'Kaydediliyor...' : 'Devam et'}
            </button>
          </form>

          <p className="text-[11px] text-slate-400 text-center leading-relaxed">
            Devam ederek gizlilik politikasını kabul etmiş olursun. Verilerini satmıyoruz.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes orbPulseSmall {
          0%, 100% { transform: scale(0.95); opacity: 0.85; }
          50% { transform: scale(1.05); opacity: 1; }
        }
      `}</style>
    </main>
  );
}
