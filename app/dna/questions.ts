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

export const CHOICE_6 = [
  'Hiç ben değil',
  'Pek değil',
  'Biraz',
  'Oldukça',
  'Çok',
  'Tam ben',
];

export const CHOICE_5 = [
  'Kesinlikle katılmıyorum',
  'Katılmıyorum',
  'Kararsızım',
  'Katılıyorum',
  'Kesinlikle katılıyorum',
];

export const QUESTION_BANK: Question[] = [
  // =========================================
  // WORK — LAYER 1 (9)
  // =========================================
  {
    id: 'work_l1_q1',
    mode: 'work',
    layer: 1,
    inputType: 'choice',
    text: 'Yeni bir iş fırsatı bende heyecan yaratır.',
    primary: 'risk',
    secondary: ['control'],
    options: CHOICE_6,
  },
  {
    id: 'work_l1_q2',
    mode: 'work',
    layer: 1,
    inputType: 'choice',
    text: 'Rol net değilse geri çekilirim.',
    primary: 'uncertainty',
    secondary: ['avoidance'],
    options: CHOICE_6,
  },
  {
    id: 'work_l1_q3',
    mode: 'work',
    layer: 1,
    inputType: 'choice',
    text: 'Karar aldıktan sonra planı tekrar tekrar kontrol ederim.',
    primary: 'agency',
    secondary: ['control'],
    options: CHOICE_6,
  },
  {
    id: 'work_l1_q4',
    mode: 'work',
    layer: 1,
    inputType: 'choice',
    text: 'Yanlış bir iş kararı uzun süre aklımda kalır.',
    primary: 'regret',
    secondary: ['innerCritic'],
    options: CHOICE_6,
  },
  {
    id: 'work_l1_q5',
    mode: 'work',
    layer: 1,
    inputType: 'choice',
    text: 'Baskı altında da enerjimi koruyabilirim.',
    primary: 'energy',
    secondary: ['control'],
    reverse: true,
    options: CHOICE_6,
  },
  {
    id: 'work_l1_q6',
    mode: 'work',
    layer: 1,
    inputType: 'choice',
    text: 'Alıştığım iş düzenini bırakmak kolay değildir.',
    primary: 'attachment',
    secondary: ['avoidance'],
    options: CHOICE_6,
  },
  {
    id: 'work_l1_q7',
    mode: 'work',
    layer: 1,
    inputType: 'choice',
    text: 'Risk alırım ama ipler bende değilse huzursuz olurum.',
    primary: 'agency',
    secondary: ['control'],
    options: CHOICE_6,
  },
  {
    id: 'work_l1_q8',
    mode: 'work',
    layer: 1,
    inputType: 'choice',
    text: 'Belirsizlik olsa da yolda netleşebileceğine inanırım.',
    primary: 'uncertainty',
    reverse: true,
    options: CHOICE_6,
  },
  {
    id: 'work_l1_q9',
    mode: 'work',
    layer: 1,
    inputType: 'choice',
    text: 'Kariyerimde yön değiştirmek beni diri tutar.',
    primary: 'risk',
    
    options: CHOICE_6,
  },

  // =========================================
  // WORK — LAYER 2 (9)
  // =========================================
  {
    id: 'work_l2_q1',
    mode: 'work',
    layer: 2,
    inputType: 'choice',
    text: 'Bir iş kararında hata yapmak, yetersiz görünmek gibi hissettirir.',
    primary: 'regret',
    secondary: ['innerCritic', 'perfectionism'],
    options: CHOICE_6,
  },
  {
    id: 'work_l2_q2',
    mode: 'work',
    layer: 2,
    inputType: 'choice',
    text: 'Başkalarının fikri iş kararlarımı düşündüğümden fazla etkiler.',
    primary: 'attachment',
    secondary: ['approval'],
    options: CHOICE_6,
  },
  {
    id: 'work_l2_q3',
    mode: 'work',
    layer: 2,
    inputType: 'choice',
    text: 'Mükemmel plan yoksa harekete geçmek zor gelir.',
    primary: 'uncertainty',
    secondary: ['perfectionism', 'avoidance'],
    options: CHOICE_6,
  },
  {
    id: 'work_l2_q4',
    mode: 'work',
    layer: 2,
    inputType: 'choice',
    text: 'Yorulsam bile “devam etmeliyim” baskısı hissederim.',
    primary: 'energy',
    secondary: ['perfectionism'],
    options: CHOICE_6,
  },
  {
    id: 'work_l2_q5',
    mode: 'work',
    layer: 2,
    inputType: 'choice',
    text: 'Kararı geciktirmek bazen beni geçici olarak rahatlatır.',
    primary: 'attachment',
    secondary: ['avoidance'],
    options: CHOICE_6,
  },
  {
    id: 'work_l2_q6',
    mode: 'work',
    layer: 2,
    inputType: 'choice',
    text: 'Kontrol kaybı, başarısızlıktan daha çok zorlar.',
    primary: 'agency',
    secondary: ['control'],
    options: CHOICE_6,
  },
  {
    id: 'work_l2_q7',
    mode: 'work',
    layer: 2,
    inputType: 'choice',
    text: 'İş kararlarında “keşke” duygusu bende geç söner.',
    primary: 'regret',
    secondary: ['innerCritic'],
    options: CHOICE_6,
  },
  {
    id: 'work_l2_q8',
    mode: 'work',
    layer: 2,
    inputType: 'choice',
    text: 'İnsanların benden beklentisi, kendi isteğimin önüne geçebilir.',
    primary: 'attachment',
    secondary: ['approval'],
    options: CHOICE_6,
  },
  {
    id: 'work_l2_q9',
    mode: 'work',
    layer: 2,
    inputType: 'choice',
    text: 'Yeni bir başlangıç, içimde hem heyecan hem alarm yaratır.',
    primary: 'risk',
    
    options: CHOICE_6,
  },

  // =========================================
  // WORK — LAYER 3 (9)
  // =========================================
  {
    id: 'work_l3_q1',
    mode: 'work',
    layer: 3,
    inputType: 'text',
    text: 'Şu anda iş hayatında seni en çok düşündüren karar ne?',
    primary: 'agency',
  },
  {
    id: 'work_l3_q2',
    mode: 'work',
    layer: 3,
    inputType: 'text',
    text: 'Bu kararı vermeni zorlaştıran asıl şey ne olabilir?',
    primary: 'uncertainty',
  },
  {
    id: 'work_l3_q3',
    mode: 'work',
    layer: 3,
    inputType: 'text',
    text: 'Yanlış karar verirsen en çok ne kaybetmekten korkuyorsun?',
    primary: 'regret',
  },
  {
    id: 'work_l3_q4',
    mode: 'work',
    layer: 3,
    inputType: 'text',
    text: 'Bu kararı ertelemenin sana sağladığı geçici rahatlık ne?',
    primary: 'attachment',
  },
  {
    id: 'work_l3_q5',
    mode: 'work',
    layer: 3,
    inputType: 'text',
    text: 'Bu konuda kimin sesi senin sesinin önüne geçiyor?',
    primary: 'attachment',
  },
  {
    id: 'work_l3_q6',
    mode: 'work',
    layer: 3,
    inputType: 'text',
    text: 'Bu karar sonrası hayatında en çok neyin değişmesini istiyorsun?',
    primary: 'energy',
  },
  {
    id: 'work_l3_q7',
    mode: 'work',
    layer: 3,
    inputType: 'text',
    text: 'Şu anda gerçekten yapmak istediğin şey ne?',
    primary: 'risk',
  },
  {
    id: 'work_l3_q8',
    mode: 'work',
    layer: 3,
    inputType: 'text',
    text: 'Seni durduran şey mantık mı, korku mu, alışkanlık mı?',
    primary: 'uncertainty',
  },
  {
    id: 'work_l3_q9',
    mode: 'work',
    layer: 3,
    inputType: 'text',
    text: 'Bu kararı alırsan hangi tarafın rahatlayacak?',
    primary: 'agency',
  },

  // =========================================
  // LIFE — LAYER 1 (9)
  // =========================================
  {
    id: 'life_l1_q1',
    mode: 'life',
    layer: 1,
    inputType: 'choice',
    text: 'Büyük bir hayat değişimi fikri beni canlı tutar.',
    primary: 'risk',
    
    options: CHOICE_6,
  },
  {
    id: 'life_l1_q2',
    mode: 'life',
    layer: 1,
    inputType: 'choice',
    text: 'Net plan yoksa büyük adım atmak istemem.',
    primary: 'uncertainty',
    secondary: ['control'],
    options: CHOICE_6,
  },
  {
    id: 'life_l1_q3',
    mode: 'life',
    layer: 1,
    inputType: 'choice',
    text: 'Hayat kararlarında kontrol duygusu benim için kritiktir.',
    primary: 'agency',
    secondary: ['control'],
    options: CHOICE_6,
  },
  {
    id: 'life_l1_q4',
    mode: 'life',
    layer: 1,
    inputType: 'choice',
    text: 'Yanlış bir hayat kararı beni uzun süre geri götürür.',
    primary: 'regret',
    secondary: ['innerCritic'],
    options: CHOICE_6,
  },
  {
    id: 'life_l1_q5',
    mode: 'life',
    layer: 1,
    inputType: 'choice',
    text: 'Yeni düzene adapte olmak bende hızlı olur.',
    primary: 'energy',
    reverse: true,
    options: CHOICE_6,
  },
  {
    id: 'life_l1_q6',
    mode: 'life',
    layer: 1,
    inputType: 'choice',
    text: 'Alıştığım hayat düzeninden kopmak zor gelir.',
    primary: 'attachment',
    secondary: ['avoidance'],
    options: CHOICE_6,
  },
  {
    id: 'life_l1_q7',
    mode: 'life',
    layer: 1,
    inputType: 'choice',
    text: 'Belirsizlik arttıkça karar erteleme eğilimim artar.',
    primary: 'uncertainty',
    secondary: ['avoidance'],
    options: CHOICE_6,
  },
  {
    id: 'life_l1_q8',
    mode: 'life',
    layer: 1,
    inputType: 'choice',
    text: 'Hayatımı yeniden kurma fikri gözümü korkutmaz.',
    primary: 'risk',
    reverse: true,
    options: CHOICE_6,
  },
  {
    id: 'life_l1_q9',
    mode: 'life',
    layer: 1,
    inputType: 'choice',
    text: 'Büyük kararlar bende enerji yükseltir.',
    primary: 'energy',
    options: CHOICE_6,
  },

  // =========================================
  // LIFE — LAYER 2 (9)
  // =========================================
  {
    id: 'life_l2_q1',
    mode: 'life',
    layer: 2,
    inputType: 'choice',
    text: 'Mükemmel koşullar oluşmadan adım atmak bana eksik hissettirir.',
    primary: 'uncertainty',
    secondary: ['perfectionism'],
    options: CHOICE_6,
  },
  {
    id: 'life_l2_q2',
    mode: 'life',
    layer: 2,
    inputType: 'choice',
    text: 'Başkalarının “doğru hayat” tanımı beni etkiler.',
    primary: 'attachment',
    secondary: ['approval'],
    options: CHOICE_6,
  },
  {
    id: 'life_l2_q3',
    mode: 'life',
    layer: 2,
    inputType: 'choice',
    text: 'Hayat kararlarında hata yapmak, kendime güvenimi sarsar.',
    primary: 'regret',
    secondary: ['innerCritic'],
    options: CHOICE_6,
  },
  {
    id: 'life_l2_q4',
    mode: 'life',
    layer: 2,
    inputType: 'choice',
    text: 'Belirsizlik yerine sınırlı ama tanıdık bir düzeni seçebilirim.',
    primary: 'attachment',
    secondary: ['avoidance'],
    options: CHOICE_6,
  },
  {
    id: 'life_l2_q5',
    mode: 'life',
    layer: 2,
    inputType: 'choice',
    text: 'Kontrol hissim kaybolduğunda karar verme isteğim de düşer.',
    primary: 'agency',
    secondary: ['control'],
    options: CHOICE_6,
  },
  {
    id: 'life_l2_q6',
    mode: 'life',
    layer: 2,
    inputType: 'choice',
    text: '“Daha iyisi olabilir” düşüncesi beni yerimde tutar.',
    primary: 'regret',
    secondary: ['perfectionism'],
    options: CHOICE_6,
  },
  {
    id: 'life_l2_q7',
    mode: 'life',
    layer: 2,
    inputType: 'choice',
    text: 'Büyük değişim düşüncesi bende hem umut hem yorgunluk yaratır.',
    primary: 'energy',
    
    options: CHOICE_6,
  },
  {
    id: 'life_l2_q8',
    mode: 'life',
    layer: 2,
    inputType: 'choice',
    text: 'Karar vermeyince sorun çözülmese de tansiyonum düşer.',
    primary: 'attachment',
    secondary: ['avoidance'],
    options: CHOICE_6,
  },
  {
    id: 'life_l2_q9',
    mode: 'life',
    layer: 2,
    inputType: 'choice',
    text: 'Hayatımı yeniden yönlendirmek içten içe bana çekici gelir.',
    primary: 'risk',
    
    options: CHOICE_6,
  },

  // =========================================
  // LIFE — LAYER 3 (9)
  // =========================================
  {
    id: 'life_l3_q1',
    mode: 'life',
    layer: 3,
    inputType: 'text',
    text: 'Şu anda hayatında yön değiştirmek istediğin konu ne?',
    primary: 'agency',
  },
  {
    id: 'life_l3_q2',
    mode: 'life',
    layer: 3,
    inputType: 'text',
    text: 'Bu değişimi geciktirmenin görünmeyen nedeni ne olabilir?',
    primary: 'uncertainty',
  },
  {
    id: 'life_l3_q3',
    mode: 'life',
    layer: 3,
    inputType: 'text',
    text: 'Yanlış seçim yaparsan en çok ne dağılır diye korkuyorsun?',
    primary: 'regret',
  },
  {
    id: 'life_l3_q4',
    mode: 'life',
    layer: 3,
    inputType: 'text',
    text: 'Şu anki düzen sana ne sağlıyor?',
    primary: 'attachment',
  },
  {
    id: 'life_l3_q5',
    mode: 'life',
    layer: 3,
    inputType: 'text',
    text: 'Bu konuda en çok hangi sesi susturamıyorsun?',
    primary: 'attachment',
  },
  {
    id: 'life_l3_q6',
    mode: 'life',
    layer: 3,
    inputType: 'text',
    text: 'Değişim gerçekleşirse hayatında ilk ne hafifleyecek?',
    primary: 'energy',
  },
  {
    id: 'life_l3_q7',
    mode: 'life',
    layer: 3,
    inputType: 'text',
    text: 'Gerçekte hangi hayatı istiyorsun ama yüksek sesle söylemiyorsun?',
    primary: 'risk',
  },
  {
    id: 'life_l3_q8',
    mode: 'life',
    layer: 3,
    inputType: 'text',
    text: 'Bu kararı ertelemenin sana ödediği görünmez bedel ne?',
    primary: 'regret',
  },
  {
    id: 'life_l3_q9',
    mode: 'life',
    layer: 3,
    inputType: 'text',
    text: 'Bu konuda bugün tek bir adım atsan o ne olurdu?',
    primary: 'agency',
  },

  // =========================================
  // LOVE — LAYER 1 (9)
  // =========================================
  {
    id: 'love_l1_q1',
    mode: 'love',
    layer: 1,
    inputType: 'choice',
    text: 'İlişkide belirsizlik bende hızlı tetiklenir.',
    primary: 'uncertainty',
    secondary: ['abandonment'],
    options: CHOICE_6,
  },
  {
    id: 'love_l1_q2',
    mode: 'love',
    layer: 1,
    inputType: 'choice',
    text: 'Bir şey ters gidince hemen netleştirmek isterim.',
    primary: 'agency',
    secondary: ['control'],
    options: CHOICE_6,
  },
  {
    id: 'love_l1_q3',
    mode: 'love',
    layer: 1,
    inputType: 'choice',
    text: 'Duygusal risk almak bana doğal gelir.',
    primary: 'risk',
    reverse: true,
    options: CHOICE_6,
  },
  {
    id: 'love_l1_q4',
    mode: 'love',
    layer: 1,
    inputType: 'choice',
    text: 'Yanlış kişide kalmak fikri beni uzun süre düşündürür.',
    primary: 'regret',
    secondary: ['innerCritic'],
    options: CHOICE_6,
  },
  {
    id: 'love_l1_q5',
    mode: 'love',
    layer: 1,
    inputType: 'choice',
    text: 'Yakınlık arttıkça içimde geri çekilme isteği oluşabilir.',
    primary: 'attachment',
    secondary: ['avoidance'],
    options: CHOICE_6,
  },
  {
    id: 'love_l1_q6',
    mode: 'love',
    layer: 1,
    inputType: 'choice',
    text: 'İlişkide emek ve enerji koymak benim için kolaydır.',
    primary: 'energy',
    reverse: true,
    options: CHOICE_6,
  },
  {
    id: 'love_l1_q7',
    mode: 'love',
    layer: 1,
    inputType: 'choice',
    text: 'Belirsizlik uzadığında zihnim senaryo üretmeye başlar.',
    primary: 'uncertainty',
    secondary: ['abandonment'],
    options: CHOICE_6,
  },
  {
    id: 'love_l1_q8',
    mode: 'love',
    layer: 1,
    inputType: 'choice',
    text: 'Bir karar alınca (kalmak/bitirmek) geri dönüp sorgularım.',
    primary: 'regret',
    secondary: ['innerCritic'],
    options: CHOICE_6,
  },
  {
    id: 'love_l1_q9',
    mode: 'love',
    layer: 1,
    inputType: 'choice',
    text: 'Birine bağlanınca koparmak benim için zordur.',
    primary: 'attachment',
    reverse: true,
    options: CHOICE_6,
  },

  // =========================================
  // LOVE — LAYER 2 (9)
  // =========================================
  {
    id: 'love_l2_q1',
    mode: 'love',
    layer: 2,
    inputType: 'choice',
    text: 'Netlik gelmeyince kendimde bir sorun arayabilirim.',
    primary: 'regret',
    secondary: ['abandonment', 'innerCritic'],
    options: CHOICE_6,
  },
  {
    id: 'love_l2_q2',
    mode: 'love',
    layer: 2,
    inputType: 'choice',
    text: 'Sevilmek kadar seçilmek de benim için önemlidir.',
    primary: 'attachment',
    secondary: ['approval'],
    options: CHOICE_6,
  },
  {
    id: 'love_l2_q3',
    mode: 'love',
    layer: 2,
    inputType: 'choice',
    text: 'Aşkta hata yapmak, kendime duyduğum saygıyı etkiler.',
    primary: 'regret',
    secondary: ['innerCritic'],
    options: CHOICE_6,
  },
  {
    id: 'love_l2_q4',
    mode: 'love',
    layer: 2,
    inputType: 'choice',
    text: 'Duygusal olarak emin olmadan bağlanmak bana zor gelir.',
    primary: 'uncertainty',
    secondary: ['control'],
    options: CHOICE_6,
  },
  {
    id: 'love_l2_q5',
    mode: 'love',
    layer: 2,
    inputType: 'choice',
    text: 'Kararsız kaldığımda geri çekilmek geçici bir güven sağlar.',
    primary: 'attachment',
    secondary: ['avoidance'],
    options: CHOICE_6,
  },
  {
    id: 'love_l2_q6',
    mode: 'love',
    layer: 2,
    inputType: 'choice',
    text: 'İlişkide kontrol bende değilse huzursuz olurum.',
    primary: 'agency',
    secondary: ['control'],
    options: CHOICE_6,
  },
  {
    id: 'love_l2_q7',
    mode: 'love',
    layer: 2,
    inputType: 'choice',
    text: 'Beni seçmeyen birine duygusal olarak daha çok takılabilirim.',
    primary: 'attachment',
    secondary: ['abandonment', 'approval'],
    options: CHOICE_6,
  },
  {
    id: 'love_l2_q8',
    mode: 'love',
    layer: 2,
    inputType: 'choice',
    text: 'Aşkta “en doğru kişi” fikri kararımı zorlaştırır.',
    primary: 'uncertainty',
    secondary: ['perfectionism'],
    options: CHOICE_6,
  },
  {
    id: 'love_l2_q9',
    mode: 'love',
    layer: 2,
    inputType: 'choice',
    text: 'Kalmak da gitmek de bazen aynı anda beni korkutur.',
    primary: 'risk',
    
    options: CHOICE_6,
  },

  // =========================================
  // LOVE — LAYER 3 (9)
  // =========================================
  {
    id: 'love_l3_q1',
    mode: 'love',
    layer: 3,
    inputType: 'text',
    text: 'Şu anda aşkta seni en çok düşündüren karar ne?',
    primary: 'agency',
  },
  {
    id: 'love_l3_q2',
    mode: 'love',
    layer: 3,
    inputType: 'text',
    text: 'Bu kararı verememenin gerçek nedeni ne olabilir?',
    primary: 'uncertainty',
  },
  {
    id: 'love_l3_q3',
    mode: 'love',
    layer: 3,
    inputType: 'text',
    text: 'Yanlış seçim yaparsan en çok neyin tekrarlanmasından korkuyorsun?',
    primary: 'regret',
  },
  {
    id: 'love_l3_q4',
    mode: 'love',
    layer: 3,
    inputType: 'text',
    text: 'Bu ilişkide seni tutan şey ne?',
    primary: 'attachment',
  },
  {
    id: 'love_l3_q5',
    mode: 'love',
    layer: 3,
    inputType: 'text',
    text: 'Bu ilişkide seni iten şey ne?',
    primary: 'risk',
  },
  {
    id: 'love_l3_q6',
    mode: 'love',
    layer: 3,
    inputType: 'text',
    text: 'Bu konuda en çok hangi cümleyi kendine söylüyorsun?',
    primary: 'regret',
  },
  {
    id: 'love_l3_q7',
    mode: 'love',
    layer: 3,
    inputType: 'text',
    text: 'Gerçekte ne olmasını istiyorsun?',
    primary: 'agency',
  },
  {
    id: 'love_l3_q8',
    mode: 'love',
    layer: 3,
    inputType: 'text',
    text: 'Bugün bu kararı vermeyi geciktirmenin sana sağladığı şey ne?',
    primary: 'attachment',
  },
  {
    id: 'love_l3_q9',
    mode: 'love',
    layer: 3,
    inputType: 'text',
    text: 'Bu konuda bir adım atsaydın, en dürüst adım ne olurdu?',
    primary: 'energy',
  },
];

export function getQuestionsForMode(mode: Mode) {
  return QUESTION_BANK.filter((q) => q.mode === mode);
}

export function getQuestionsForModeAndLayer(mode: Mode, layer: Layer) {
  return QUESTION_BANK.filter((q) => q.mode === mode && q.layer === layer);
}

export function scoreChoiceIndex(index: number) {
  // 0..4 => 0..4 (5-point scale, direct mapping)
  return index;
}

export function scoreChoiceIndex6(index: number) {
  // Legacy 6-point: 0..5 => 0..3
  if (index <= 1) return 0;
  if (index === 2) return 1;
  if (index === 3) return 2;
  return 3;
}