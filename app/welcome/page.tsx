'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const router = useRouter();
  const [decision, setDecision] = useState('');

  function start() {
    if (!decision) return;
    localStorage.setItem('piri_decision', decision);
    router.push('/dna/test');
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-b from-[#0b1020] to-[#02040a] p-6">

      {/* Piri Orb */}
      <div className="w-28 h-28 rounded-full bg-blue-400/40 blur-xl animate-pulse mb-10"></div>

      {/* Messages */}
      <div className="max-w-md text-center space-y-6">

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
          Ben Piri.
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
          Karar vermek zor değildir.
          Sonuçlarını görmek zordur.
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
          Seni buraya getiren karar ne?
        </div>

      </div>

      {/* Input */}
      <div className="mt-8 w-full max-w-md">

        <input
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
          placeholder="örnek: şehir değiştirmek"
          className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-md outline-none"
        />

        <button
          onClick={start}
          className="mt-4 w-full p-4 rounded-xl bg-white text-black font-medium"
        >
          Başla
        </button>

      </div>

    </main>
  );
}