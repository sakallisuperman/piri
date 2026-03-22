'use client';
import { saveConversation } from "@/lib/saveConversation"
import { useEffect, useRef, useState } from 'react';
import PiriOrb from '../components/PiriOrb';
import { loadProfile } from '../lib/profile';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

type Thread = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
};

function generateId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function loadThreads(): Thread[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('piri_chat_threads');
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

function saveThreads(threads: Thread[]) {
  localStorage.setItem('piri_chat_threads', JSON.stringify(threads));
}

function getProfileForApi() {
  const profile = loadProfile();
  return {
    gender: profile.gender,
    ageRange: profile.ageRange,
    mode: profile.mode,
    sub: profile.sub,
    scores: profile.scores,
    shadow: profile.shadow,
    textAnswers: profile.textAnswers,
    aiAnalysis: profile.aiAnalysis,
  };
}

// Auth Component
function AuthScreen() {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/chat`
      }
    });
    if (error) {
      console.error('Google sign in error:', error);
      setLoading(false);
    }
    // Redirect will happen automatically
  };

  const handleEmailSignIn = async () => {
    if (!email.trim()) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/chat`
      }
    });
    if (error) {
      console.error('Email sign in error:', error);
      setLoading(false);
    } else {
      setEmailSent(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-[#f5faff] via-[#edf6ff] to-[#f5fbff]">
      <div className="w-full max-w-md space-y-8">
        {/* Piri Orb */}
        <div className="flex justify-center">
          <PiriOrb size={80} />
        </div>

        {/* Başlık */}
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-bold text-slate-900">Piri seni tanısın</h1>
          <p className="text-slate-600 leading-relaxed">
            Karar DNA'n kaydedilsin, Piri seni hatırlasın. Ücretsiz.
          </p>
        </div>

        {/* Auth Options */}
        <div className="space-y-4">
          {/* Google Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-slate-700 font-medium">Google ile devam et</span>
          </button>

          {/* Email Option */}
          <div className="text-center">
            <p className="text-sm text-slate-500 mb-3">ya da email ile devam et</p>
            
            {!emailSent ? (
              <div className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email adresin"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                  onKeyDown={(e) => e.key === 'Enter' && handleEmailSignIn()}
                />
                <button
                  onClick={handleEmailSignIn}
                  disabled={loading || !email.trim()}
                  className="w-full px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Gönderiliyor...' : 'Bağlantı gönder'}
                </button>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <p className="text-slate-700">Emailine bir bağlantı gönderdik.</p>
                <p className="text-sm text-slate-500">Tıkla, geri dön.</p>
              </div>
            )}
          </div>
        </div>

        {/* Note for developers */}
        {/*
          NOT: Supabase dashboard'da Google provider'ı aktif etmeniz gerekiyor.
          Authentication > Providers > Google > Enable
          Client ID ve Client Secret'ı Google Cloud Console'dan alın.
        */}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const [offlineIntroShown, setOfflineIntroShown] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auth session kontrolü
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load threads on mount
  useEffect(() => {
    const saved = loadThreads();
    setThreads(saved);
    if (saved.length > 0) {
      setActiveThreadId(saved[0].id);
    }
  }, []);


  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threads, activeThreadId]);

  const activeThread = threads.find(t => t.id === activeThreadId);

  function createThread() {
    const newThread: Thread = {
      id: generateId(),
      title: 'Yeni Sohbet',
      messages: [],
      createdAt: Date.now(),
    };
    const updated = [newThread, ...threads];
    setThreads(updated);
    saveThreads(updated);
    setActiveThreadId(newThread.id);
    setSidebarOpen(false);
    inputRef.current?.focus();
  }

  function deleteThread(id: string) {
    const updated = threads.filter(t => t.id !== id);
    setThreads(updated);
    saveThreads(updated);
    if (activeThreadId === id) {
      setActiveThreadId(updated[0]?.id || null);
    }
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const message = input.trim();
    setInput('');

    // Create thread if none exists
    let threadId = activeThreadId;
    let currentThreads = [...threads];

    if (!threadId) {
      const newThread: Thread = {
        id: generateId(),
        title: message.slice(0, 40) + (message.length > 40 ? '...' : ''),
        messages: [],
        createdAt: Date.now(),
      };
      currentThreads = [newThread, ...currentThreads];
      threadId = newThread.id;
      setActiveThreadId(threadId);
    }

    // Add user message
    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };

    currentThreads = currentThreads.map(t => {
      if (t.id === threadId) {
        const updated = { ...t, messages: [...t.messages, userMsg] };
        // Update title from first message
        if (t.messages.length === 0) {
          updated.title = message.slice(0, 40) + (message.length > 40 ? '...' : '');
        }
        return updated;
      }
      return t;
    });

    setThreads(currentThreads);
    saveThreads(currentThreads);

    if (apiAvailable === false) {
      if (!offlineIntroShown) {
        const offlineMsg: Message = {
          id: generateId(),
          role: 'assistant',
          content: `Ben buradayım.

Ne hakkında konuşmak istiyorsun? Seni tanımaya devam ediyorum.`,
          timestamp: Date.now(),
        };

        const updatedThreads = currentThreads.map(t => {
          if (t.id === threadId) {
            return { ...t, messages: [...t.messages, offlineMsg] };
          }
          return t;
        });

        setThreads(updatedThreads);
        saveThreads(updatedThreads);
        setOfflineIntroShown(true);
      }
      return;
    }

    // Call API
    setLoading(true);
    try {
      const thread = currentThreads.find(t => t.id === threadId);
      const history = (thread?.messages || []).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const profile = getProfileForApi();
await saveConversation("user123", "user", message);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history, profile }),
      });

      const streamingId = generateId();
      setThreads(prev => {
        const updated = prev.map(t => {
          if (t.id === threadId) return { ...t, messages: [...t.messages, { id: streamingId, role: 'assistant' as const, content: '', timestamp: Date.now() }] };
          return t;
        });
        saveThreads(updated);
        return updated;
      });

      let assistantContent = '';
      if (!res.ok || !res.body) {
        assistantContent = 'Bir hata olustu. Biraz sonra tekrar dene.';
        setThreads(prev => {
          const updated = prev.map(t => {
            if (t.id !== threadId) return t;
            return { ...t, messages: t.messages.map(m => m.id === streamingId ? { ...m, content: assistantContent } : m) };
          });
          saveThreads(updated);
          return updated;
        });
      } else {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const token = decoder.decode(value);
          assistantContent += token;
          setThreads(prev => prev.map(t => {
            if (t.id !== threadId) return t;
            return { ...t, messages: t.messages.map(m => m.id === streamingId ? { ...m, content: assistantContent } : m) };
          }));
        }
        setThreads(prev => {
          const updated = prev.map(t => {
            if (t.id !== threadId) return t;
            return { ...t, messages: t.messages.map(m => m.id === streamingId ? { ...m, content: assistantContent } : m) };
          });
          saveThreads(updated);
          return updated;
        });
      }
      await saveConversation("user123", "piri", assistantContent);
      // `streamingId` ile eklenen geçici asistan mesajındaki içerik zaten güncelleniyor.
      // Bu aşamada yeni bir asistan mesajı eklemek, tekrarlı yanıt üretir.
      // Bu yüzden yalnızca mevcut placeholder güncellemesi yeterli.
    } catch {
      const errorMsg: Message = {
        id: generateId(),
        role: 'assistant',
        content: 'Bağlantı kurulamadı. İnternet bağlantını kontrol et.',
        timestamp: Date.now(),
      };

      setThreads(prev => {
        const updated = prev.map(t => {
          if (t.id === threadId) {
            return { ...t, messages: [...t.messages, errorMsg] };
          }
          return t;
        });
        saveThreads(updated);
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // Auth kontrolü
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f5faff] via-[#edf6ff] to-[#f5fbff]">
        <PiriOrb size={60} />
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-b from-[#f5faff] via-[#edf6ff] to-[#f5fbff]">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative z-40 md:z-auto
        w-[260px] h-full flex-shrink-0
        bg-white/70 backdrop-blur-xl border-r border-white/60
        transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-slate-100">
            <button
              onClick={createThread}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white text-sm font-medium transition hover:scale-[1.02] active:scale-[0.98]"
            >
              + Yeni Sohbet
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {threads.map(t => (
              <div
                key={t.id}
                className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all text-sm ${
                  activeThreadId === t.id
                    ? 'bg-slate-900/5 text-slate-900'
                    : 'text-slate-600 hover:bg-white/80'
                }`}
                onClick={() => { setActiveThreadId(t.id); setSidebarOpen(false); }}
              >
                <span className="flex-1 truncate">{t.title}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteThread(t.id); }}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all text-xs px-1"
                >
                  ✕
                </button>
              </div>
            ))}

            {threads.length === 0 && (
              <div className="text-center text-slate-400 text-xs py-8">
                Henüz sohbet yok
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/50 bg-white/40 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-slate-600 hover:text-slate-900 transition p-1"
          >
            ☰
          </button>
          <div className="flex items-center gap-3 flex-1">
            <PiriOrb size={32} />
            <div>
              <p className="text-sm font-medium text-slate-900">Piri</p>
              <p className="text-xs text-slate-400">
                {apiAvailable === false ? 'Çevrimdışı' : 'Hazır'}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {!activeThread || activeThread.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <PiriOrb size={60} />
              <div className="max-w-sm space-y-2">
                <p className="text-lg text-slate-800">Merhaba.</p>
                <p className="text-sm text-slate-500">
                  Karar alma kalıplarını konuşalım. Ne düşünüyorsun?
                </p>
              </div>
            </div>
          ) : (
            activeThread.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] md:max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-slate-900 text-white rounded-br-md'
                      : 'bg-white/70 text-slate-800 border border-white/70 backdrop-blur-sm rounded-bl-md'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/70 border border-white/70 backdrop-blur-sm rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="px-4 pb-4 pt-2">
          <div className="flex items-end gap-2 max-w-3xl mx-auto">
            <div className="flex-1 bg-white/70 border border-white/70 rounded-2xl backdrop-blur-sm overflow-hidden">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Mesajını yaz..."
                rows={1}
                className="w-full px-4 py-3 bg-transparent text-slate-900 text-sm outline-none resize-none"
                style={{ maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
