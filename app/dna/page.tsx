'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DnaPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dna/test');
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="fixed inset-0 bg-gradient-to-b from-[#f5faff] via-[#edf6ff] to-[#f5fbff]" />
      <div className="relative text-slate-500">Yönlendiriliyor...</div>
    </main>
  );
}
