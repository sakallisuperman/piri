'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Simülasyon artık sonuç sayfasına entegre — bu sayfa yönlendirme yapar
export default function SimulatePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dna/result');
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="fixed inset-0 bg-gradient-to-b from-[#f8f4ee] via-[#f2ece4] to-[#f8f4ee]" />
      <div className="relative text-slate-500">Yönlendiriliyor...</div>
    </main>
  );
}
