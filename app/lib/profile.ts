// ───────────────────────────────────────────────
// Piri Kullanıcı Profili — Merkezi data katmanı
// Tüm toplanan bilgiler burada birleşir
// ───────────────────────────────────────────────

export type CoreDimension = 'risk' | 'uncertainty' | 'regret' | 'agency' | 'energy' | 'attachment';
export type ShadowSignal = 'perfectionism' | 'approval' | 'abandonment' | 'control' | 'avoidance' | 'innerCritic';

export type PiriProfile = {
  // Demografik
  gender: 'female' | 'male' | null;
  ageRange: '-23' | '23-32' | '32+' | null;

  // Kullanıcı bilgileri
  name: string | null;
  email: string | null;

  // Test verileri
  mode: 'work' | 'life' | 'love' | null;
  sub: string | null;

  // DNA skorları
  scores: Record<CoreDimension, number> | null;
  shadow: Record<ShadowSignal, number> | null;

  // Katman 3 açık uçlu cevaplar
  textAnswers: string[];

  // AI analiz sonucu (cache)
  aiAnalysis: {
    headline: string;
    corePattern: string;
    blindSpot: string;
  } | null;

  // Timestamp
  lastUpdated: number;
};

const STORAGE_KEY = 'piri_profile';

// Profili localStorage'dan yükle
export function loadProfile(): PiriProfile {
  if (typeof window === 'undefined') return getEmptyProfile();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Eski verilerle uyumluluğu koru
      return { ...getEmptyProfile(), ...parsed };
    }
  } catch { /* ignore */ }

  // Eski format verilerini migrate et
  return migrateOldData();
}

// Profili kaydet
export function saveProfile(profile: PiriProfile): void {
  if (typeof window === 'undefined') return;
  profile.lastUpdated = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

// Profili güncelle (partial update)
export function updateProfile(updates: Partial<PiriProfile>): PiriProfile {
  const current = loadProfile();
  const updated = { ...current, ...updates, lastUpdated: Date.now() };
  saveProfile(updated);
  return updated;
}

// Boş profil
export function getEmptyProfile(): PiriProfile {
  return {
    gender: null,
    ageRange: null,
    name: null,
    email: null,
    mode: null,
    sub: null,
    scores: null,
    shadow: null,
    textAnswers: [],
    aiAnalysis: null,
    lastUpdated: 0,
  };
}

// Eski localStorage verilerini yeni profile formatına migrate et
function migrateOldData(): PiriProfile {
  if (typeof window === 'undefined') return getEmptyProfile();

  const profile = getEmptyProfile();

  try {
    profile.gender = (localStorage.getItem('piri_gender') as PiriProfile['gender']) || null;
    profile.ageRange = (localStorage.getItem('piri_age') as PiriProfile['ageRange']) || null;
    profile.name = localStorage.getItem('piri_user_name') || null;
    profile.email = localStorage.getItem('piri_user_email') || null;
    profile.mode = (localStorage.getItem('piri_mode') as PiriProfile['mode']) || null;
    profile.sub = localStorage.getItem('piri_sub') || null;

    // Skorları hesaplamak yerine varsa AI cache'den al
    const mode = profile.mode || 'work';
    const aiCache = localStorage.getItem(`piri_ai_${mode}`);
    if (aiCache) {
      try {
        const ai = JSON.parse(aiCache);
        if (ai.analysis) {
          profile.aiAnalysis = {
            headline: ai.analysis.headline || '',
            corePattern: ai.analysis.corePattern || '',
            blindSpot: ai.analysis.blindSpot || '',
          };
        }
      } catch { /* ignore */ }
    }
  } catch { /* ignore */ }

  if (profile.gender || profile.mode) {
    saveProfile(profile);
  }

  return profile;
}

// API'ye gönderilecek profil özeti (system prompt için)
export function profileToPromptContext(profile: PiriProfile): string {
  const parts: string[] = [];

  if (profile.gender) {
    parts.push(`Cinsiyet: ${profile.gender === 'female' ? 'Kadın' : 'Erkek'}`);
  }

  if (profile.ageRange) {
    const ageLabel = profile.ageRange === '-23' ? '23 yaş altı' : profile.ageRange === '32+' ? '32 yaş üstü' : '23-32 yaş arası';
    parts.push(`Yaş: ${ageLabel}`);
  }

  if (profile.mode) {
    const modeLabel = profile.mode === 'work' ? 'İş' : profile.mode === 'life' ? 'Yol' : 'Aşk';
    parts.push(`Kapı: ${modeLabel}`);
    if (profile.sub) parts.push(`Alt konu: ${profile.sub}`);
  }

  if (profile.scores) {
    const coreLabels: Record<CoreDimension, string> = {
      risk: 'Risk algısı', uncertainty: 'Belirsizlik', regret: 'Pişmanlık',
      agency: 'İrade', energy: 'Enerji', attachment: 'Bağlanma',
    };
    const scoreLine = Object.entries(profile.scores)
      .map(([k, v]) => `${coreLabels[k as CoreDimension]}: ${v}/100`)
      .join(', ');
    parts.push(`DNA Skorları: ${scoreLine}`);
  }

  if (profile.shadow) {
    const shadowLabels: Record<ShadowSignal, string> = {
      perfectionism: 'Mükemmeliyet', approval: 'Onay ihtiyacı', abandonment: 'Terk edilme',
      control: 'Kontrol', avoidance: 'Kaçınma', innerCritic: 'İçsel eleştirmen',
    };
    const topShadow = Object.entries(profile.shadow)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([k, v]) => `${shadowLabels[k as ShadowSignal]}: ${v}/100`)
      .join(', ');
    parts.push(`Baskın blokajlar: ${topShadow}`);
  }

  if (profile.textAnswers.length > 0) {
    parts.push(`Açık uçlu cevaplarından önemli ifadeler:\n${profile.textAnswers.slice(0, 5).map((t, i) => `  ${i + 1}. "${t}"`).join('\n')}`);
  }

  if (profile.aiAnalysis) {
    if (profile.aiAnalysis.corePattern) parts.push(`Tespit edilen karar tuzağı: ${profile.aiAnalysis.corePattern}`);
    if (profile.aiAnalysis.blindSpot) parts.push(`Kör nokta: ${profile.aiAnalysis.blindSpot}`);
  }

  return parts.join('\n');
}
