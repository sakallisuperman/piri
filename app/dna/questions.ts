export type Mode = 'work' | 'life' | 'love';

export type Layer = 1 | 2 | 3;

export type CoreDimension =
  | 'risk'
  | 'uncertainty'
  | 'regret'
  | 'agency'
  | 'energy'
  | 'attachment';

export type ShadowSignal =
  | 'perfectionism'
  | 'approval'
  | 'abandonment'
  | 'control'
  | 'avoidance'
  | 'innerCritic';

export type InputType = 'choice' | 'text';

export type Question = {
  id: string;
  mode: Mode;
  layer: Layer;
  inputType: InputType;
  text: string;
  primary: CoreDimension;
  secondary?: ShadowSignal[];
  reverse?: boolean;
  options?: string[];
};

// ───────────────────────────────────────────────
// İlham: Jeffrey E. Young & Janet S. Klosko
// "Reinventing Your Life" (Hayatı Yeniden Keşfedin)
// Şema terapisi: erken dönem yaşam tuzakları (lifetraps)
// ve karar alma kalıplarına etkisi
// ───────────────────────────────────────────────

export const CHOICE_5 = [
  'Kesinlikle katılmıyorum',
  'Katılmıyorum',
  'Kararsızım',
  'Katılıyorum',
  'Kesinlikle katılıyorum',
];

export const CHOICE_6 = [
  'Hiç ben değil',
  'Pek değil',
  'Biraz',
  'Oldukça',
  'Çok',
  'Tam ben',
];

export const QUESTION_BANK: Question[] = [
  // ═══════════════════════════════════════════
  // İŞ (WORK) — KATMAN 1: Yüzey Kalıpları
  // ═══════════════════════════════════════════
  {
    id: 'work_l1_q1',
    mode: 'work',
    layer: 1,
    inputType: 'choice',
    text: 'İş hayatında bir şeylerin yanlış gideceği hissini sık sık yaşarım.',
    primary: 'uncertainty',
    secondary: ['control'],
    options: CHOICE_6,
  },
  {
    id: 'work_l1_q2',
    mode: 'work',
    layer: 1,
    inputType: 'choice',
    text: 'Bir karar verirken "ya başarısız olursam" düşüncesi beni durdurur.',
    primary: 'risk',
    secondary: ['innerCritic'],
    options: CHOICE_6,
  },
  {
    id: 'work_l1_q3',
    mode: 'work',
    layer: 1,
    inputType: 'choice',
    text: 'Başkalarının beni yetersiz bulacağı endişesi iş kararlarımı etkiler.',
    primary: 'agency',
    secondary: ['approval', 'innerCritic'],
    options: CHOICE_6,
  },
  {
    id: 'work_l1_q4',
    mode: 'work',
    layer: 1,
    inputType: 'choice',
    text: 'Her şeyi mükemmel planlamadan harekete geçmek bana güvensiz gelir.',
    primary: 'uncertainty',
    secondary: ['perfectionism', 'control'],
    options: CHOICE_6,
  },
  {
    id: 'work_l1_q5',
    mode: 'work',
    layer: 1,
    inputType: 'choice',
    text: 'Hata yaptığımda kendimi uzun süre affetmekte zorlanırım.',
    primary: 'regret',
    secondary: ['innerCritic'],
    options: CHOICE_6,
  },
  {
    id: 'work_l1_q6',
    mode: 'work',
    layer: 1,
    inputType: 'choice',
    text: 'İş yerinde kendimi kanıtlama ihtiyacı hiç bitmez gibi hissederim.',
    primary: 'energy',
    secondary: ['approval', 'perfectionism'],
    options: CHOICE_6,
  },
  {
    id: 'work_l1_q7',
    mode: 'work',
    layer: 1,
    inputType: 'choice',
    text: 'Zor bir karar vermektense mevcut duruma katlanmayı tercih ederim.',
    primary: 'attachment',
    secondary: ['avoidance'],
    options: CHOICE_6,
  },
  {
    id: 'work_l1_q8',
    mode: 'work',
    layer: 1,
    inputType: 'choice',
    text: 'Kontrolüm dışında gelişen durumlar beni orantısız derecede huzursuz eder.',
    primary: 'agency',
    secondary: ['control'],
    options: CHOICE_6,
  },
  {
    id: 'work_l1_q9',
    mode: 'work',
    layer: 1,
    inputType: 'choice',
    text: 'İş hayatında yeni bir yola çıkmak bende daha çok heyecan değil, kaygı yaratır.',
    primary: 'risk',
    secondary: ['avoidance'],
    options: CHOICE_6,
  },

  // ═══════════════════════════════════════════
  // İŞ (WORK) — KATMAN 2: Derin Kalıplar
  // Şema tuzakları: Başarısızlık, Yüksek Standartlar,
  // Boyun Eğme, Onay Arayışı
  // ═══════════════════════════════════════════
  {
    id: 'work_l2_q1',
    mode: 'work',
    layer: 2,
    inputType: 'choice',
    text: 'İçimde bir ses "ne yaparsan yap, yetmeyecek" der.',
    primary: 'regret',
    secondary: ['innerCritic', 'perfectionism'],
    options: CHOICE_6,
  },
  {
    id: 'work_l2_q2',
    mode: 'work',
    layer: 2,
    inputType: 'choice',
    text: 'Başkalarının beklentilerini karşılamak, kendi isteklerimin önüne geçer.',
    primary: 'attachment',
    secondary: ['approval'],
    options: CHOICE_6,
  },
  {
    id: 'work_l2_q3',
    mode: 'work',
    layer: 2,
    inputType: 'choice',
    text: 'Başarısızlık benim için sonuç değil, kimlik meselesidir — başarısız olmak "başarısız biri olmak" demektir.',
    primary: 'regret',
    secondary: ['innerCritic'],
    options: CHOICE_6,
  },
  {
    id: 'work_l2_q4',
    mode: 'work',
    layer: 2,
    inputType: 'choice',
    text: 'Kendi yolumu çizme fikri beni heyecanlandırsa da, bir o kadar da suçluluk duyarım.',
    primary: 'agency',
    secondary: ['approval'],
    options: CHOICE_6,
  },
  {
    id: 'work_l2_q5',
    mode: 'work',
    layer: 2,
    inputType: 'choice',
    text: 'Bir karar vermeden önce güvende hissetmem neredeyse imkansızdır.',
    primary: 'uncertainty',
    secondary: ['control', 'avoidance'],
    options: CHOICE_6,
  },
  {
    id: 'work_l2_q6',
    mode: 'work',
    layer: 2,
    inputType: 'choice',
    text: 'Durmak bile bir seçenekken, "durmamalıyım" baskısı beni tüketir.',
    primary: 'energy',
    secondary: ['perfectionism'],
    options: CHOICE_6,
  },
  {
    id: 'work_l2_q7',
    mode: 'work',
    layer: 2,
    inputType: 'choice',
    text: 'Geçmişteki yanlış kararların ağırlığını hâlâ taşıyorum.',
    primary: 'regret',
    secondary: ['innerCritic'],
    options: CHOICE_6,
  },
  {
    id: 'work_l2_q8',
    mode: 'work',
    layer: 2,
    inputType: 'choice',
    text: 'Tanıdık mutsuzluk, belirsiz bir mutluluktan daha güvenli gelir.',
    primary: 'attachment',
    secondary: ['avoidance'],
    options: CHOICE_6,
  },
  {
    id: 'work_l2_q9',
    mode: 'work',
    layer: 2,
    inputType: 'choice',
    text: 'Risk aldığımda başarılı olsam bile "şansımdı" diye düşünürüm.',
    primary: 'risk',
    secondary: ['innerCritic'],
    options: CHOICE_6,
  },

  // ═══════════════════════════════════════════
  // İŞ (WORK) — KATMAN 3: Anlatı
  // ═══════════════════════════════════════════
  {
    id: 'work_l3_q1',
    mode: 'work',
    layer: 3,
    inputType: 'text',
    text: 'İş hayatında tekrar tekrar düştüğün aynı tuzak ne?',
    primary: 'agency',
  },
  {
    id: 'work_l3_q2',
    mode: 'work',
    layer: 3,
    inputType: 'text',
    text: 'Bu kararı verirken içinde hangi sesin ağır bastığını fark ediyorsun — senin sesin mi, başka birinin sesi mi?',
    primary: 'attachment',
  },
  {
    id: 'work_l3_q3',
    mode: 'work',
    layer: 3,
    inputType: 'text',
    text: 'Yanlış karar verirsen, kendine ne söylersin? Bu cümleyi daha önce kimden duydun?',
    primary: 'regret',
  },
  {
    id: 'work_l3_q4',
    mode: 'work',
    layer: 3,
    inputType: 'text',
    text: 'Bu kararı ertelemenin sana verdiği "sahte güvenlik" ne?',
    primary: 'uncertainty',
  },
  {
    id: 'work_l3_q5',
    mode: 'work',
    layer: 3,
    inputType: 'text',
    text: 'Mükemmel koşullar oluşsa bile harekete geçer miydin? Dürüstçe düşün.',
    primary: 'risk',
  },
  {
    id: 'work_l3_q6',
    mode: 'work',
    layer: 3,
    inputType: 'text',
    text: 'Kimin onayını alırsan bu kararı daha rahat verirdin?',
    primary: 'attachment',
  },
  {
    id: 'work_l3_q7',
    mode: 'work',
    layer: 3,
    inputType: 'text',
    text: 'Bu karardan kaçınırken kendini nasıl haklı çıkarıyorsun?',
    primary: 'agency',
  },
  {
    id: 'work_l3_q8',
    mode: 'work',
    layer: 3,
    inputType: 'text',
    text: 'Şu anda gerçekten istediğin şeyi bir cümlede söyle.',
    primary: 'energy',
  },
  {
    id: 'work_l3_q9',
    mode: 'work',
    layer: 3,
    inputType: 'text',
    text: '5 yıl sonra bu anı hatırladığında, kendine ne demiş olmak istersin?',
    primary: 'regret',
  },

  // ═══════════════════════════════════════════
  // YOL (LIFE) — KATMAN 1: Yüzey Kalıpları
  // ═══════════════════════════════════════════
  {
    id: 'life_l1_q1',
    mode: 'life',
    layer: 1,
    inputType: 'choice',
    text: 'Hayatımı değiştirme fikri hep aklımda ama bir türlü harekete geçemiyorum.',
    primary: 'risk',
    secondary: ['avoidance'],
    options: CHOICE_6,
  },
  {
    id: 'life_l1_q2',
    mode: 'life',
    layer: 1,
    inputType: 'choice',
    text: 'Başkalarının yaşamlarına bakınca "ben nerede hata yaptım" diye düşünürüm.',
    primary: 'regret',
    secondary: ['innerCritic'],
    options: CHOICE_6,
  },
  {
    id: 'life_l1_q3',
    mode: 'life',
    layer: 1,
    inputType: 'choice',
    text: 'Hayatımda bir şeylerin eksik olduğu hissi yakamı bırakmaz.',
    primary: 'energy',
    secondary: ['abandonment'],
    options: CHOICE_6,
  },
  {
    id: 'life_l1_q4',
    mode: 'life',
    layer: 1,
    inputType: 'choice',
    text: 'Büyük değişimlerden önce kendimi hazır hissetmem neredeyse imkansızdır.',
    primary: 'uncertainty',
    secondary: ['perfectionism', 'control'],
    options: CHOICE_6,
  },
  {
    id: 'life_l1_q5',
    mode: 'life',
    layer: 1,
    inputType: 'choice',
    text: 'Alışkanlıklarımı bırakmak, bir parçamı kaybetmek gibi gelir.',
    primary: 'attachment',
    secondary: ['avoidance'],
    options: CHOICE_6,
  },
  {
    id: 'life_l1_q6',
    mode: 'life',
    layer: 1,
    inputType: 'choice',
    text: 'Yanlış bir hayat kararı beni yıllarca geriye götürür diye düşünürüm.',
    primary: 'regret',
    secondary: ['innerCritic', 'control'],
    options: CHOICE_6,
  },
  {
    id: 'life_l1_q7',
    mode: 'life',
    layer: 1,
    inputType: 'choice',
    text: 'Hayatımın kontrolü başka insanların elindeymiş gibi hissederim.',
    primary: 'agency',
    secondary: ['control', 'abandonment'],
    options: CHOICE_6,
  },
  {
    id: 'life_l1_q8',
    mode: 'life',
    layer: 1,
    inputType: 'choice',
    text: 'Belirsizlik zamanlarında enerjim çok hızlı düşer.',
    primary: 'energy',
    secondary: ['avoidance'],
    options: CHOICE_6,
  },
  {
    id: 'life_l1_q9',
    mode: 'life',
    layer: 1,
    inputType: 'choice',
    text: 'Kendi ihtiyaçlarımı seslendirmek bana bencillik gibi gelir.',
    primary: 'agency',
    secondary: ['approval'],
    options: CHOICE_6,
  },

  // ═══════════════════════════════════════════
  // YOL (LIFE) — KATMAN 2: Derin Kalıplar
  // Şema tuzakları: Bağımlılık, Dayanıksızlık,
  // Duygusal Yoksunluk, İç İçe Geçme
  // ═══════════════════════════════════════════
  {
    id: 'life_l2_q1',
    mode: 'life',
    layer: 2,
    inputType: 'choice',
    text: 'Kendi başıma doğru kararı verebileceğime tam olarak güvenmiyorum.',
    primary: 'agency',
    secondary: ['control'],
    options: CHOICE_6,
  },
  {
    id: 'life_l2_q2',
    mode: 'life',
    layer: 2,
    inputType: 'choice',
    text: 'Hayatta her şey "bir gün" başlayacakmış gibi beklerim ama o gün gelmez.',
    primary: 'risk',
    secondary: ['avoidance'],
    options: CHOICE_6,
  },
  {
    id: 'life_l2_q3',
    mode: 'life',
    layer: 2,
    inputType: 'choice',
    text: 'İhtiyaçlarımın tam olarak karşılanacağına inancım düşüktür.',
    primary: 'attachment',
    secondary: ['abandonment'],
    options: CHOICE_6,
  },
  {
    id: 'life_l2_q4',
    mode: 'life',
    layer: 2,
    inputType: 'choice',
    text: 'Değişim istesem de "bu benim için fazla" duygusu ağır basar.',
    primary: 'uncertainty',
    secondary: ['innerCritic'],
    options: CHOICE_6,
  },
  {
    id: 'life_l2_q5',
    mode: 'life',
    layer: 2,
    inputType: 'choice',
    text: 'Başkalarını mutlu etmek için kendi yolumdan çıktığımı fark ederim.',
    primary: 'attachment',
    secondary: ['approval'],
    options: CHOICE_6,
  },
  {
    id: 'life_l2_q6',
    mode: 'life',
    layer: 2,
    inputType: 'choice',
    text: 'Bir felaket olacakmış gibi hissetmek, gerçek bir tehlike olmasa bile beni durdurmaya yeter.',
    primary: 'risk',
    secondary: ['control'],
    options: CHOICE_6,
  },
  {
    id: 'life_l2_q7',
    mode: 'life',
    layer: 2,
    inputType: 'choice',
    text: 'Mutlu olma hakkım olduğundan bazen emin değilim.',
    primary: 'energy',
    secondary: ['innerCritic'],
    options: CHOICE_6,
  },
  {
    id: 'life_l2_q8',
    mode: 'life',
    layer: 2,
    inputType: 'choice',
    text: 'Karar vermemek aslında benim için bir karar vermek — güvenli olanda kalmak.',
    primary: 'attachment',
    secondary: ['avoidance'],
    options: CHOICE_6,
  },
  {
    id: 'life_l2_q9',
    mode: 'life',
    layer: 2,
    inputType: 'choice',
    text: 'Hayatım değişse bile eski kalıplara geri döneceğimden korkuyorum.',
    primary: 'regret',
    secondary: ['perfectionism'],
    options: CHOICE_6,
  },

  // ═══════════════════════════════════════════
  // YOL (LIFE) — KATMAN 3: Anlatı
  // ═══════════════════════════════════════════
  {
    id: 'life_l3_q1',
    mode: 'life',
    layer: 3,
    inputType: 'text',
    text: 'Hayatında hangi kalıp sürekli tekrarlıyor?',
    primary: 'agency',
  },
  {
    id: 'life_l3_q2',
    mode: 'life',
    layer: 3,
    inputType: 'text',
    text: 'Bu kalıp sana ne zaman başladı? En eski hatırladığın an ne?',
    primary: 'attachment',
  },
  {
    id: 'life_l3_q3',
    mode: 'life',
    layer: 3,
    inputType: 'text',
    text: 'Hayatını değiştirmeni engelleyen şey gerçekten koşullar mı, yoksa içindeki bir inanç mı?',
    primary: 'uncertainty',
  },
  {
    id: 'life_l3_q4',
    mode: 'life',
    layer: 3,
    inputType: 'text',
    text: 'Mevcut düzenin sana verdiği "gizli kazanç" ne?',
    primary: 'attachment',
  },
  {
    id: 'life_l3_q5',
    mode: 'life',
    layer: 3,
    inputType: 'text',
    text: 'Kimsenin seni yargılamayacağını bilsen, ne yapardın?',
    primary: 'risk',
  },
  {
    id: 'life_l3_q6',
    mode: 'life',
    layer: 3,
    inputType: 'text',
    text: 'Hayatında neyi kaybetmekten bu kadar korkuyorsun ki yerinden kıpırdayamıyorsun?',
    primary: 'regret',
  },
  {
    id: 'life_l3_q7',
    mode: 'life',
    layer: 3,
    inputType: 'text',
    text: 'Kendine hakkını vermediğin şey ne?',
    primary: 'energy',
  },
  {
    id: 'life_l3_q8',
    mode: 'life',
    layer: 3,
    inputType: 'text',
    text: 'Bu kararı verdiğinde kaybedeceğin şey ile kazanacağın şeyi yan yana koy.',
    primary: 'agency',
  },
  {
    id: 'life_l3_q9',
    mode: 'life',
    layer: 3,
    inputType: 'text',
    text: 'Bugün yapabileceğin en küçük ama en dürüst adım ne olurdu?',
    primary: 'risk',
  },

  // ═══════════════════════════════════════════
  // AŞK (LOVE) — KATMAN 1: Yüzey Kalıpları
  // ═══════════════════════════════════════════
  {
    id: 'love_l1_q1',
    mode: 'love',
    layer: 1,
    inputType: 'choice',
    text: 'İlişkide bir sorun olduğunu hissedince hemen en kötü senaryoya atlarım.',
    primary: 'uncertainty',
    secondary: ['abandonment'],
    options: CHOICE_6,
  },
  {
    id: 'love_l1_q2',
    mode: 'love',
    layer: 1,
    inputType: 'choice',
    text: 'Sevilmek için kendimden ödün vermem gerektiğini hissederim.',
    primary: 'attachment',
    secondary: ['approval'],
    options: CHOICE_6,
  },
  {
    id: 'love_l1_q3',
    mode: 'love',
    layer: 1,
    inputType: 'choice',
    text: 'Yakınlık arttıkça içimde bir savunma mekanizması devreye girer.',
    primary: 'risk',
    secondary: ['avoidance', 'abandonment'],
    options: CHOICE_6,
  },
  {
    id: 'love_l1_q4',
    mode: 'love',
    layer: 1,
    inputType: 'choice',
    text: 'İlişkide hata yapmaktan çok, aynı hatayı tekrarlamaktan korkarım.',
    primary: 'regret',
    secondary: ['innerCritic'],
    options: CHOICE_6,
  },
  {
    id: 'love_l1_q5',
    mode: 'love',
    layer: 1,
    inputType: 'choice',
    text: 'Karşımdaki kişinin ne düşündüğünü bilmemek beni tüketir.',
    primary: 'uncertainty',
    secondary: ['control', 'abandonment'],
    options: CHOICE_6,
  },
  {
    id: 'love_l1_q6',
    mode: 'love',
    layer: 1,
    inputType: 'choice',
    text: 'İlişkide duygusal olarak çok fazla enerji harcadığımı hissediyorum.',
    primary: 'energy',
    secondary: ['approval'],
    options: CHOICE_6,
  },
  {
    id: 'love_l1_q7',
    mode: 'love',
    layer: 1,
    inputType: 'choice',
    text: 'Bitmesi gereken bir şeyi bitirmek, başlamaktan daha zor gelir.',
    primary: 'attachment',
    secondary: ['avoidance'],
    options: CHOICE_6,
  },
  {
    id: 'love_l1_q8',
    mode: 'love',
    layer: 1,
    inputType: 'choice',
    text: 'Terk edilme korkusu kararlarımı fark etmeden yönlendirir.',
    primary: 'agency',
    secondary: ['abandonment'],
    options: CHOICE_6,
  },
  {
    id: 'love_l1_q9',
    mode: 'love',
    layer: 1,
    inputType: 'choice',
    text: 'İlişkide ne istediğimi biliyorum ama söylemeye cesaret edemiyorum.',
    primary: 'agency',
    secondary: ['approval', 'avoidance'],
    options: CHOICE_6,
  },

  // ═══════════════════════════════════════════
  // AŞK (LOVE) — KATMAN 2: Derin Kalıplar
  // Şema tuzakları: Terk Edilme, Duygusal Yoksunluk,
  // Kusurlu Olma, Boyun Eğme
  // ═══════════════════════════════════════════
  {
    id: 'love_l2_q1',
    mode: 'love',
    layer: 2,
    inputType: 'choice',
    text: 'İçimde "gerçek beni görürlerse beni sevmezler" korkusu var.',
    primary: 'attachment',
    secondary: ['innerCritic', 'abandonment'],
    options: CHOICE_6,
  },
  {
    id: 'love_l2_q2',
    mode: 'love',
    layer: 2,
    inputType: 'choice',
    text: 'Beni seçmeyen birine duygusal olarak daha çok bağlanırım.',
    primary: 'attachment',
    secondary: ['abandonment', 'approval'],
    options: CHOICE_6,
  },
  {
    id: 'love_l2_q3',
    mode: 'love',
    layer: 2,
    inputType: 'choice',
    text: 'Duygusal ihtiyaçlarımı dile getirmek bana zayıflık gibi gelir.',
    primary: 'agency',
    secondary: ['avoidance'],
    options: CHOICE_6,
  },
  {
    id: 'love_l2_q4',
    mode: 'love',
    layer: 2,
    inputType: 'choice',
    text: 'İlişkide acı çekmek, yalnız kalmaktan daha katlanılır gelir.',
    primary: 'risk',
    secondary: ['abandonment'],
    options: CHOICE_6,
  },
  {
    id: 'love_l2_q5',
    mode: 'love',
    layer: 2,
    inputType: 'choice',
    text: 'Aşkta "doğru kişi" arayışı beni hiçbir zaman tatmin etmiyor.',
    primary: 'uncertainty',
    secondary: ['perfectionism'],
    options: CHOICE_6,
  },
  {
    id: 'love_l2_q6',
    mode: 'love',
    layer: 2,
    inputType: 'choice',
    text: 'Karşımdakini kaybetmemek için kendimi küçültebilirim.',
    primary: 'attachment',
    secondary: ['approval', 'abandonment'],
    options: CHOICE_6,
  },
  {
    id: 'love_l2_q7',
    mode: 'love',
    layer: 2,
    inputType: 'choice',
    text: 'İlişkide kontrol bende değilse sürekli bir tehdit algılarım.',
    primary: 'agency',
    secondary: ['control'],
    options: CHOICE_6,
  },
  {
    id: 'love_l2_q8',
    mode: 'love',
    layer: 2,
    inputType: 'choice',
    text: 'Geçmişteki ilişki acıları bugünkü kararlarımı hâlâ şekillendiriyor.',
    primary: 'regret',
    secondary: ['innerCritic'],
    options: CHOICE_6,
  },
  {
    id: 'love_l2_q9',
    mode: 'love',
    layer: 2,
    inputType: 'choice',
    text: 'Kalmak da gitmek de aynı anda beni korkutuyor çünkü ikisinde de kaybedecek bir şey var.',
    primary: 'risk',
    secondary: ['avoidance'],
    options: CHOICE_6,
  },

  // ═══════════════════════════════════════════
  // AŞK (LOVE) — KATMAN 3: Anlatı
  // ═══════════════════════════════════════════
  {
    id: 'love_l3_q1',
    mode: 'love',
    layer: 3,
    inputType: 'text',
    text: 'İlişkilerinde tekrar eden kalıp ne? Her seferinde aynı noktada mı tıkanıyorsun?',
    primary: 'agency',
  },
  {
    id: 'love_l3_q2',
    mode: 'love',
    layer: 3,
    inputType: 'text',
    text: 'Bu kalıbı ilk nerede öğrendin? İlk aile ortamında mı, yoksa ilk ilişkinde mi?',
    primary: 'attachment',
  },
  {
    id: 'love_l3_q3',
    mode: 'love',
    layer: 3,
    inputType: 'text',
    text: 'Bu ilişkide korktuğun şey gerçekten karşındaki kişiyle mi ilgili, yoksa kendi içindeki bir inançla mı?',
    primary: 'uncertainty',
  },
  {
    id: 'love_l3_q4',
    mode: 'love',
    layer: 3,
    inputType: 'text',
    text: 'Bu ilişkide seni tutan şey sevgi mi, alışkanlık mı, yoksa yalnızlık korkusu mu?',
    primary: 'attachment',
  },
  {
    id: 'love_l3_q5',
    mode: 'love',
    layer: 3,
    inputType: 'text',
    text: 'Kendin olduğun için sevildiğini en son ne zaman hissettin?',
    primary: 'energy',
  },
  {
    id: 'love_l3_q6',
    mode: 'love',
    layer: 3,
    inputType: 'text',
    text: 'Bu kararı verirken en çok kimin sesini duyuyorsun — kendi sesin mi?',
    primary: 'agency',
  },
  {
    id: 'love_l3_q7',
    mode: 'love',
    layer: 3,
    inputType: 'text',
    text: 'Bu ilişki hakkında kendine söylediğin ama doğru olmadığını bildiğin şey ne?',
    primary: 'regret',
  },
  {
    id: 'love_l3_q8',
    mode: 'love',
    layer: 3,
    inputType: 'text',
    text: 'Eğer bu kararın sonucunda acı çekeceksen, hangi acı seni büyütür?',
    primary: 'risk',
  },
  {
    id: 'love_l3_q9',
    mode: 'love',
    layer: 3,
    inputType: 'text',
    text: 'Şu anda aşkta en dürüst adımın ne olurdu?',
    primary: 'agency',
  },
];

export function getQuestionsForMode(mode: Mode) {
  return QUESTION_BANK.filter((q) => q.mode === mode);
}

export function getQuestionsForModeAndLayer(mode: Mode, layer: Layer) {
  return QUESTION_BANK.filter((q) => q.mode === mode && q.layer === layer);
}

export function scoreChoiceIndex(index: number) {
  return index;
}

export function scoreChoiceIndex6(index: number) {
  if (index <= 1) return 0;
  if (index === 2) return 1;
  if (index === 3) return 2;
  return 3;
}
