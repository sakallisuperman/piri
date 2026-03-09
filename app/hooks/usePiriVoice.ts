'use client';

import { useCallback, useRef, useState } from 'react';

// ───────────────────────────────────────────
// Piri Voice Hook
// Manages TTS playback + speaking state for orb sync
// ───────────────────────────────────────────

type VoiceState = 'idle' | 'loading' | 'speaking';

// In-memory cache so repeated lines don't re-fetch
const audioCache = new Map<string, string>(); // text → objectURL

export function usePiriVoice() {
  const [state, setState] = useState<VoiceState>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<{ text: string; resolve: () => void }[]>([]);
  const playingRef = useRef(false);

  const playNext = useCallback(async () => {
    if (playingRef.current) return;
    const item = queueRef.current.shift();
    if (!item) return;

    playingRef.current = true;
    setState('loading');

    try {
      let url = audioCache.get(item.text);

      if (!url) {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: item.text }),
        });

        if (!res.ok) {
          console.warn('TTS unavailable:', res.status);
          // Skip this voice line gracefully — don't block UI
          return;
        }

        const blob = await res.blob();
        url = URL.createObjectURL(blob);
        audioCache.set(item.text, url);
      }

      const audio = new Audio(url);
      audioRef.current = audio;

      setState('speaking');

      await new Promise<void>((resolve, reject) => {
        audio.onended = () => resolve();
        audio.onerror = () => reject(new Error('Audio playback error'));
        audio.play().catch(reject);
      });
    } catch (err) {
      console.warn('Piri voice error:', err);
    } finally {
      playingRef.current = false;
      setState('idle');
      item.resolve();
      // Play next in queue
      if (queueRef.current.length > 0) {
        playNext();
      }
    }
  }, []);

  // Queue a line to speak — returns promise that resolves when done
  const speak = useCallback(
    (text: string): Promise<void> => {
      return new Promise((resolve) => {
        queueRef.current.push({ text, resolve });
        if (!playingRef.current) {
          playNext();
        }
      });
    },
    [playNext]
  );

  // Speak multiple lines sequentially
  const speakLines = useCallback(
    async (lines: string[]) => {
      for (const line of lines) {
        if (line.trim()) {
          await speak(line);
        }
      }
    },
    [speak]
  );

  // Stop current playback
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    queueRef.current = [];
    playingRef.current = false;
    setState('idle');
  }, []);

  return {
    speak,
    speakLines,
    stop,
    isSpeaking: state === 'speaking',
    isLoading: state === 'loading',
    state,
  };
}
