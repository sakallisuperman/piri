import Link from 'next/link';

export default function DnaPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl space-y-4">
        <h1 className="text-3xl font-semibold">Decision DNA</h1>
        <p className="opacity-80">12 questions. No advice. Just consequences.</p>
        <Link className="underline" href="/dna/test">
          Start →
        </Link>
      </div>
    </main>
  );
}