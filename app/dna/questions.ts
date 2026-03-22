// ═══════════════════════════════════════════════════════════════
// PİRİ — Kendini Keşfet Soru Bankası
// ═══════════════════════════════════════════════════════════════
//
// Çerçeve: Jeffrey E. Young şema terapisi (6 temel şema)
// Carl Jung: Persona / Gölge / Kendilik
//
// 6 Şema:
//   abandonment     → Terk edilme
//   defectiveness   → Yetersizlik / Kusurlu olma
//   subjugation     → Boyun eğme
//   unrelenting     → Yüksek standartlar / Mükemmeliyetçilik
//   deprivation     → Duygusal yoksunluk
//   avoidance       → Kaçınma / Değişim korkusu
//
// Yapı: 3 Kapı × 3 Katman × 9 Soru = 81 soru
//
// Katman 1 — Yüzey: Davranış kalıpları (ne yapıyorsun?)
// Katman 2 — İnanç: Altındaki inanç sistemi (neden yapıyorsun?)
// Katman 3 — Köken: Nereden geliyor? (bu sesi ilk nereden duydun?)
//
// Scoring:
//   CHOICE_5 → [0, 25, 50, 75, 100]
//   reverse: true → [100, 75, 50, 25, 0]
//   Her şemanın skoru = o şemaya bağlı soruların ortalaması
//   Yüksek skor = o şema aktif ve bloke edici
//
// Persona skoru = subjugation + unrelenting ortalaması
// Gölge skoru   = avoidance + deprivation ortalaması
// Şema skoru    = abandonment + defectiveness ortalaması
//
// ═══════════════════════════════════════════════════════════════

export type Mode = 'work' | 'life' | 'love';
export type Layer = 1 | 2 | 3;
export type InputType = 'choice' | 'text';

export type Schema =
  | 'abandonment'    // Terk edilme
  | 'defectiveness'  // Yetersizlik
  | 'subjugation'    // Boyun eğme
  | 'unrelenting'    // Yüksek standartlar
  | 'deprivation'    // Duygusal yoksunluk
  | 'avoidance';     // Kaçınma

export type SchemaGroup = 'schema' | 'persona' | 'shadow';

export const SCHEMA_META: Record<Schema, {
  label: string;
  group: SchemaGroup;
  coreBeliefTR: string;
}> = {
  abandonment:   { group: 'schema',  label: 'Terk Edilme',          coreBeliefTR: 'İnsanlar er ya da geç beni bırakır.' },
  defectiveness: { group: 'schema',  label: 'Yetersizlik',          coreBeliefTR: 'Bir yanlışım var, sevilmeye layık değilim.' },
  subjugation:   { group: 'persona', label: 'Boyun Eğme',           coreBeliefTR: 'Başkalarının istediklerini yapmak zorundayım.' },
  unrelenting:   { group: 'persona', label: 'Yüksek Standartlar',   coreBeliefTR: 'Mükemmel olmazsam kabul görmem.' },
  deprivation:   { group: 'shadow',  label: 'Duygusal Yoksunluk',   coreBeliefTR: 'Kimse beni gerçekten anlamaz, ihtiyaçlarım karşılanmaz.' },
  avoidance:     { group: 'shadow',  label: 'Kaçınma',              coreBeliefTR: 'Zor şeylerle yüzleşmek yerine uzak durmak daha güvenli.' },
};

export type Question = {
  id: string;
  mode: Mode;
  layer: Layer;
  inputType: InputType;
  text: string;
  schema: Schema;          // Hangi şemayı ölçüyor
  reverse?: boolean;       // true → yüksek cevap = düşük şema aktivasyonu
  options?: string[];
  // Katman 3 text soruları için scoring ipucu
  scoringHint?: string;
};

export const CHOICE_5 = [
  '✕',   // 0
  '−',   // 25
  '○',   // 50
  '+',   // 75
  '✓',   // 100
];

export const CHOICE_5_SCORE = [0, 25, 50, 75, 100];

// ═══════════════════════════════════════════════════════════════
// İŞ KAPISI (WORK)
// Odak: Performans, kimlik, güvenlik, değer ispat etme
// ═══════════════════════════════════════════════════════════════

const WORK_LAYER_1: Question[] = [
  // Katman 1: Davranış — İş hayatında ne yapıyorsun?
  {
    id: 'w1_1',
    mode: 'work', layer: 1, inputType: 'choice',
    text: 'Bir projede hata yaptığımda, o hatayı kafamdan atmak için uzun süre uğraşırım.',
    schema: 'unrelenting',
    options: CHOICE_5,
  },
  {
    id: 'w1_2',
    mode: 'work', layer: 1, inputType: 'choice',
    text: 'İş yerinde fikirlerimi söylemeden önce "acaba yanlış mı bulurlar?" diye düşünürüm.',
    schema: 'subjugation',
    options: CHOICE_5,
  },
  {
    id: 'w1_3',
    mode: 'work', layer: 1, inputType: 'choice',
    text: 'Yeni bir sorumluluk ya da terfi teklifi geldiğinde içimde ilk hissettığim heyecan değil, kaygıdır.',
    schema: 'defectiveness',
    options: CHOICE_5,
  },
  {
    id: 'w1_4',
    mode: 'work', layer: 1, inputType: 'choice',
    text: 'İş yerinde zor bir durum yaşadığımda bunu kimseyle paylaşmak yerine kendi başıma çözmeye çalışırım.',
    schema: 'deprivation',
    options: CHOICE_5,
  },
  {
    id: 'w1_5',
    mode: 'work', layer: 1, inputType: 'choice',
    text: 'Mevcut işimde mutlu olmasam da bırakmayı düşünmek bile içimi sıkıştırır.',
    schema: 'avoidance',
    options: CHOICE_5,
  },
  {
    id: 'w1_6',
    mode: 'work', layer: 1, inputType: 'choice',
    text: 'Ekipten biri soğuk ya da mesafeli davrandığında bunun benim yüzümden olduğunu düşünürüm.',
    schema: 'abandonment',
    options: CHOICE_5,
  },
  {
    id: 'w1_7',
    mode: 'work', layer: 1, inputType: 'choice',
    text: 'İşimi ne kadar iyi yapsam da "daha iyisini yapabilirdim" hissi peşimi bırakmaz.',
    schema: 'unrelenting',
    options: CHOICE_5,
  },
  {
    id: 'w1_8',
    mode: 'work', layer: 1, inputType: 'choice',
    text: 'Hayır demem gereken bir iş teklifi ya da ricası geldiğinde genellikle kabul ederim.',
    schema: 'subjugation',
    options: CHOICE_5,
  },
  {
    id: 'w1_9',
    mode: 'work', layer: 1, inputType: 'choice',
    text: 'İş hayatında gerçek anlamda takdir gördüğümü, değerimin bilindiğini nadiren hissederim.',
    schema: 'deprivation',
    options: CHOICE_5,
  },
];

const WORK_LAYER_2: Question[] = [
  // Katman 2: İnanç — Bu kalıpların altında ne var?
  {
    id: 'w2_1',
    mode: 'work', layer: 2, inputType: 'choice',
    text: 'İş hayatında başarılı olmak, sevilmek için değil — hayatta kalmak için gerekli gibi hisseder.',
    schema: 'defectiveness',
    options: CHOICE_5,
  },
  {
    id: 'w2_2',
    mode: 'work', layer: 2, inputType: 'choice',
    text: 'Birinin benden memnun olmadığını sezersem, ne yapıp ettim diye zinim çalışmaya başlar.',
    schema: 'abandonment',
    options: CHOICE_5,
  },
  {
    id: 'w2_3',
    mode: 'work', layer: 2, inputType: 'choice',
    text: 'Kendi isteklerimi öne çıkarmak bencillik gibi gelir.',
    schema: 'subjugation',
    options: CHOICE_5,
  },
  {
    id: 'w2_4',
    mode: 'work', layer: 2, inputType: 'choice',
    text: '"Ortalama" olmak benim için kabul edilebilir değil — ya en iyisi olacağım ya da hiç.',
    schema: 'unrelenting',
    options: CHOICE_5,
  },
  {
    id: 'w2_5',
    mode: 'work', layer: 2, inputType: 'choice',
    text: 'İş hayatımda büyük bir değişiklik yapmayı düşündüğümde aklıma önce "ya yanlış giderse" gelir.',
    schema: 'avoidance',
    options: CHOICE_5,
  },
  {
    id: 'w2_6',
    mode: 'work', layer: 2, inputType: 'choice',
    text: 'Ne kadar çalışsam da içimde "aslında yeterince iyi değilim" diyen bir ses var.',
    schema: 'defectiveness',
    options: CHOICE_5,
  },
  {
    id: 'w2_7',
    mode: 'work', layer: 2, inputType: 'choice',
    text: 'Destek istemek ya da "bilmiyorum" demek zayıflık göstergesi gibi gelir.',
    schema: 'deprivation',
    options: CHOICE_5,
  },
  {
    id: 'w2_8',
    mode: 'work', layer: 2, inputType: 'choice',
    text: 'İş yerinde bir şeyler ters gittiğinde çevremdeki insanların beni terk edeceğinden ya da dışlayacağından korkarım.',
    schema: 'abandonment',
    options: CHOICE_5,
  },
  {
    id: 'w2_9',
    mode: 'work', layer: 2, inputType: 'choice',
    text: 'Hata yapmamak için bazen hiç başlamamayı tercih ederim.',
    schema: 'avoidance',
    options: CHOICE_5,
  },
];

const WORK_LAYER_3: Question[] = [
  // Katman 3: Köken — Bu sesler nereden geliyor?
  {
    id: 'w3_1',
    mode: 'work', layer: 3, inputType: 'text',
    text: 'İş hayatında tekrar tekrar düştüğün tuzak ne? Bir cümleyle yaz.',
    schema: 'avoidance',
    scoringHint: 'Tekrar eden kaçınma kalıbını tespit et',
  },
  {
    id: 'w3_2',
    mode: 'work', layer: 3, inputType: 'text',
    text: '"Yeterince iyi değilim" hissini ilk ne zaman yaşadın? Aklına gelen ilk anı yaz.',
    schema: 'defectiveness',
    scoringHint: 'Yetersizlik şemasının kökenini tespit et',
  },
  {
    id: 'w3_3',
    mode: 'work', layer: 3, inputType: 'text',
    text: 'İş hayatında kimin onayını almak istersin en çok? Bu kişi sana ne ifade ediyor?',
    schema: 'subjugation',
    scoringHint: 'Boyun eğme ve onay ihtiyacının kaynağını tespit et',
  },
  {
    id: 'w3_4',
    mode: 'work', layer: 3, inputType: 'text',
    text: 'Seni işte en çok durduran şey gerçekten dış koşullar mı, yoksa içindeki bir inanç mı?',
    schema: 'avoidance',
    scoringHint: 'İçsel engeli dışsal nedenden ayırt et',
  },
  {
    id: 'w3_5',
    mode: 'work', layer: 3, inputType: 'text',
    text: 'Çocukken ya da gençken "başarılı olmak" sana ne ifade ediyordu? Kim öğretti bunu?',
    schema: 'unrelenting',
    scoringHint: 'Yüksek standartların kökenini tespit et',
  },
  {
    id: 'w3_6',
    mode: 'work', layer: 3, inputType: 'text',
    text: 'İş hayatında gerçekten istediğin ama bir türlü izin veremediğin şey ne?',
    schema: 'deprivation',
    scoringHint: 'Duygusal yoksunluk — bastırılmış ihtiyacı tespit et',
  },
  {
    id: 'w3_7',
    mode: 'work', layer: 3, inputType: 'text',
    text: 'Şu anki işin ya da kariyerin, gerçekten senin seçimin mi? Yoksa başkalarının beklentisi mi?',
    schema: 'subjugation',
    scoringHint: 'Özgün seçim vs boyun eğme',
  },
  {
    id: 'w3_8',
    mode: 'work', layer: 3, inputType: 'text',
    text: 'Bu kararı bir yıl daha ertelersen, hayatında ne değişir — dürüstçe yaz.',
    schema: 'avoidance',
    scoringHint: 'Ertelemenin gerçek bedeli',
  },
  {
    id: 'w3_9',
    mode: 'work', layer: 3, inputType: 'text',
    text: 'Bugün işinde cesur olsaydın, ne yapardın?',
    schema: 'defectiveness',
    scoringHint: 'Yetersizlik şemasına rağmen harekete geçme kapasitesi',
  },
];

// ═══════════════════════════════════════════════════════════════
// HAYAT KAPISI (LIFE)
// Odak: Özgürlük, anlam, yön, kim olmak istiyorum
// ═══════════════════════════════════════════════════════════════

const LIFE_LAYER_1: Question[] = [
  {
    id: 'l1_1',
    mode: 'life', layer: 1, inputType: 'choice',
    text: 'Hayatımda büyük bir değişiklik yapmam gerekse bile "şu an doğru zaman değil" diye ertelerim.',
    schema: 'avoidance',
    options: CHOICE_5,
  },
  {
    id: 'l1_2',
    mode: 'life', layer: 1, inputType: 'choice',
    text: 'Başkalarının benden ne beklediğini düşünerek hayatıma dair kararlar alırım.',
    schema: 'subjugation',
    options: CHOICE_5,
  },
  {
    id: 'l1_3',
    mode: 'life', layer: 1, inputType: 'choice',
    text: 'İçimde olmak istediğim bir yer var ama oraya giden yolu hayal etmek bile korkutucu gelir.',
    schema: 'defectiveness',
    options: CHOICE_5,
  },
  {
    id: 'l1_4',
    mode: 'life', layer: 1, inputType: 'choice',
    text: 'Yaşadığım zorlukları başkalarıyla paylaşmak yerine içimde tutmayı tercih ederim.',
    schema: 'deprivation',
    options: CHOICE_5,
  },
  {
    id: 'l1_5',
    mode: 'life', layer: 1, inputType: 'choice',
    text: 'Hayatımın bir döneminde insanların benden uzaklaştığını ya da beni bıraktığını hissettim.',
    schema: 'abandonment',
    options: CHOICE_5,
  },
  {
    id: 'l1_6',
    mode: 'life', layer: 1, inputType: 'choice',
    text: 'Kendim için bir şey yaparken bile "bu yeterince iyi mi?" diye sorgularım.',
    schema: 'unrelenting',
    options: CHOICE_5,
  },
  {
    id: 'l1_7',
    mode: 'life', layer: 1, inputType: 'choice',
    text: 'Hayatımda neyin eksik olduğunu biliyorum ama değiştirmek için adım atmak yerine olduğu gibi kabul ederim.',
    schema: 'avoidance',
    options: CHOICE_5,
  },
  {
    id: 'l1_8',
    mode: 'life', layer: 1, inputType: 'choice',
    text: 'Kendi ihtiyaçlarımı ifade ettiğimde insanlar benden uzaklaşır gibi hissederim.',
    schema: 'abandonment',
    options: CHOICE_5,
  },
  {
    id: 'l1_9',
    mode: 'life', layer: 1, inputType: 'choice',
    text: 'Gerçekten mutlu olduğumu, hayatımı yaşadığımı hissettiğim anlar çok az.',
    schema: 'deprivation',
    options: CHOICE_5,
  },
];

const LIFE_LAYER_2: Question[] = [
  {
    id: 'l2_1',
    mode: 'life', layer: 2, inputType: 'choice',
    text: 'Hayatımda "bu benim istediğim" diyebileceğim bir şeyin var mı? İçimden gelen cevap genellikle hayır.',
    schema: 'deprivation',
    options: CHOICE_5,
  },
  {
    id: 'l2_2',
    mode: 'life', layer: 2, inputType: 'choice',
    text: 'Hayatımı değiştirmekten çok, mevcut duruma adapte olmak daha gerçekçi gelir.',
    schema: 'avoidance',
    options: CHOICE_5,
  },
  {
    id: 'l2_3',
    mode: 'life', layer: 2, inputType: 'choice',
    text: '"Ben kimim?" sorusu beni heyecanlandırmaktan çok bunaltır.',
    schema: 'defectiveness',
    options: CHOICE_5,
  },
  {
    id: 'l2_4',
    mode: 'life', layer: 2, inputType: 'choice',
    text: 'Etrafımdaki insanları hayal kırıklığına uğratmamak, kendi mutluluğumdan daha önce gelir.',
    schema: 'subjugation',
    options: CHOICE_5,
  },
  {
    id: 'l2_5',
    mode: 'life', layer: 2, inputType: 'choice',
    text: 'Hayatımda istikrarı korumak için bazı şeylerden vazgeçmeyi normal karşılarım.',
    schema: 'abandonment',
    options: CHOICE_5,
  },
  {
    id: 'l2_6',
    mode: 'life', layer: 2, inputType: 'choice',
    text: 'Yaşadığım hayat benim seçimlerimden mi oluşuyor, yoksa koşulların beni getirdiği yerden mi — içimden gelen cevap ikincisi.',
    schema: 'subjugation',
    options: CHOICE_5,
  },
  {
    id: 'l2_7',
    mode: 'life', layer: 2, inputType: 'choice',
    text: 'Bir şeyi "iyi" yapabilmek için çok fazla zaman ve enerji harcarım, "yeterli" benim için yetmez.',
    schema: 'unrelenting',
    options: CHOICE_5,
  },
  {
    id: 'l2_8',
    mode: 'life', layer: 2, inputType: 'choice',
    text: 'Hayatımda birileri beni gerçekten görüyor, anlıyor ve değer veriyor diyemiyorum.',
    schema: 'deprivation',
    options: CHOICE_5,
  },
  {
    id: 'l2_9',
    mode: 'life', layer: 2, inputType: 'choice',
    text: 'Zor bir karar vermem gerektiğinde ilk içgüdüm "bekle, henüz hazır değilim" olmaktadır.',
    schema: 'avoidance',
    options: CHOICE_5,
  },
];

const LIFE_LAYER_3: Question[] = [
  {
    id: 'l3_1',
    mode: 'life', layer: 3, inputType: 'text',
    text: 'Hayatında sürekli tekrar eden bir kalıp var mı? Her seferinde aynı noktada mı tıkanıyorsun?',
    schema: 'avoidance',
    scoringHint: 'Tekrar eden kaçınma veya tıkanma kalıbı',
  },
  {
    id: 'l3_2',
    mode: 'life', layer: 3, inputType: 'text',
    text: 'Kimsenin seni yargılamayacağını bilsen, hayatında ne değiştirirdin?',
    schema: 'subjugation',
    scoringHint: 'Boyun eğme şemasının bastırdığı özgün istek',
  },
  {
    id: 'l3_3',
    mode: 'life', layer: 3, inputType: 'text',
    text: 'Hayatında neyi kaybetmekten bu kadar korkuyorsun ki yerinden kıpırdayamıyorsun?',
    schema: 'abandonment',
    scoringHint: 'Terk edilme korkusunun hareketi nasıl dondurduğu',
  },
  {
    id: 'l3_4',
    mode: 'life', layer: 3, inputType: 'text',
    text: 'Seni en iyi tanıyan biri seni nasıl tanımlar? Sen kendinizi nasıl tanımlarsınız? Fark var mı?',
    schema: 'defectiveness',
    scoringHint: 'Persona ile gerçek kendilik arasındaki fark',
  },
  {
    id: 'l3_5',
    mode: 'life', layer: 3, inputType: 'text',
    text: 'Hayatını değiştirmeni engelleyen şey gerçekten koşullar mı, yoksa içindeki bir inanç mı?',
    schema: 'avoidance',
    scoringHint: 'İçsel engeli dışsal nedenden ayırt et',
  },
  {
    id: 'l3_6',
    mode: 'life', layer: 3, inputType: 'text',
    text: 'Çocukken en çok ne için onaylanırdın? Bu onay bugün hâlâ seni yönlendiriyor mu?',
    schema: 'unrelenting',
    scoringHint: 'Yüksek standartların ve onay arayışının kökeni',
  },
  {
    id: 'l3_7',
    mode: 'life', layer: 3, inputType: 'text',
    text: 'Hayatında kendine hakkını vermediğin şey ne?',
    schema: 'deprivation',
    scoringHint: 'Bastırılmış ihtiyaç ve duygusal yoksunluk',
  },
  {
    id: 'l3_8',
    mode: 'life', layer: 3, inputType: 'text',
    text: 'Şu an yaşadığın hayatın mimarı gerçekten sen misin?',
    schema: 'subjugation',
    scoringHint: 'Özgün seçim kapasitesi',
  },
  {
    id: 'l3_9',
    mode: 'life', layer: 3, inputType: 'text',
    text: '5 yıl sonra bu anı hatırladığında, kendine ne demiş olmak istersin?',
    schema: 'defectiveness',
    scoringHint: 'Gelecek benliğin şimdiki benliğe mesajı — yetersizlik şemasına rağmen',
  },
];

// ═══════════════════════════════════════════════════════════════
// AŞK KAPISI (LOVE)
// Odak: Bağlanma, güven, kayıp korkusu, yakınlık
// ═══════════════════════════════════════════════════════════════

const LOVE_LAYER_1: Question[] = [
  {
    id: 'v1_1',
    mode: 'love', layer: 1, inputType: 'choice',
    text: 'Bir ilişkide karşımdaki kişi mesafe koyduğunda ya da geç cevap verdiğinde içim sıkışır.',
    schema: 'abandonment',
    options: CHOICE_5,
  },
  {
    id: 'v1_2',
    mode: 'love', layer: 1, inputType: 'choice',
    text: 'Sevdiğim insanı memnun etmek için kendi isteklerimden vazgeçmek bana doğal gelir.',
    schema: 'subjugation',
    options: CHOICE_5,
  },
  {
    id: 'v1_3',
    mode: 'love', layer: 1, inputType: 'choice',
    text: 'Bir ilişkide tamamen kendim olursam, karşımdaki beni sevmeyebilir diye düşünürüm.',
    schema: 'defectiveness',
    options: CHOICE_5,
  },
  {
    id: 'v1_4',
    mode: 'love', layer: 1, inputType: 'choice',
    text: 'Sevdiğim insanlardan gerçek anlamda destek, anlayış ya da yakınlık almakta zorlanırım.',
    schema: 'deprivation',
    options: CHOICE_5,
  },
  {
    id: 'v1_5',
    mode: 'love', layer: 1, inputType: 'choice',
    text: 'Bir ilişkide sorun çıktığında önce "bu ilişkiyi kurtarmak için ne yapabilirim?" diye düşünürüm.',
    schema: 'abandonment',
    options: CHOICE_5,
  },
  {
    id: 'v1_6',
    mode: 'love', layer: 1, inputType: 'choice',
    text: 'Duygusal olarak yakın olmak beni hem çeker hem de ürpertir.',
    schema: 'avoidance',
    options: CHOICE_5,
  },
  {
    id: 'v1_7',
    mode: 'love', layer: 1, inputType: 'choice',
    text: 'Sevdiğim kişiye kızdığımda bunu ifade etmek yerine içime atarım.',
    schema: 'subjugation',
    options: CHOICE_5,
  },
  {
    id: 'v1_8',
    mode: 'love', layer: 1, inputType: 'choice',
    text: 'Bir ilişkide "yeterince güzel/zeki/ilginç değilim" hissi aklıma gelir.',
    schema: 'defectiveness',
    options: CHOICE_5,
  },
  {
    id: 'v1_9',
    mode: 'love', layer: 1, inputType: 'choice',
    text: 'Gerçekten sevdiğim birine "seni seviyorum" demek ya da ihtiyacım olduğunu söylemek zor gelir.',
    schema: 'deprivation',
    options: CHOICE_5,
  },
];

const LOVE_LAYER_2: Question[] = [
  {
    id: 'v2_1',
    mode: 'love', layer: 2, inputType: 'choice',
    text: 'Bir ilişkide ne kadar iyi davranırsam davranayım, er ya da geç yalnız kalacağıma inanırım.',
    schema: 'abandonment',
    options: CHOICE_5,
  },
  {
    id: 'v2_2',
    mode: 'love', layer: 2, inputType: 'choice',
    text: 'Sevilmek için "iyi biri" olmam, kendim olmamdan daha önemli gibi hisseder.',
    schema: 'subjugation',
    options: CHOICE_5,
  },
  {
    id: 'v2_3',
    mode: 'love', layer: 2, inputType: 'choice',
    text: 'Gerçek anlamda bir yakınlık kurmak, aynı zamanda zarar görme riskini de taşır — bu yüzden mesafe daha güvenli.',
    schema: 'avoidance',
    options: CHOICE_5,
  },
  {
    id: 'v2_4',
    mode: 'love', layer: 2, inputType: 'choice',
    text: 'Kusurlarımı ya da zayıf taraflarımı gören biri beni seviyor olamaz diye düşünürüm.',
    schema: 'defectiveness',
    options: CHOICE_5,
  },
  {
    id: 'v2_5',
    mode: 'love', layer: 2, inputType: 'choice',
    text: 'Bir ilişkide gerçek ihtiyaçlarımı ifade etmek, karşımdakini yüklemek gibi hisseder.',
    schema: 'deprivation',
    options: CHOICE_5,
  },
  {
    id: 'v2_6',
    mode: 'love', layer: 2, inputType: 'choice',
    text: 'Bir ilişkiyi "mükemmel" hale getirmeye çalışmak yerine var olduğu haliyle kabul etmekte zorlanırım.',
    schema: 'unrelenting',
    options: CHOICE_5,
  },
  {
    id: 'v2_7',
    mode: 'love', layer: 2, inputType: 'choice',
    text: 'Biri beni terk edebilir diye düşününce, önlem olarak önce ben mesafe koyarım.',
    schema: 'abandonment',
    options: CHOICE_5,
  },
  {
    id: 'v2_8',
    mode: 'love', layer: 2, inputType: 'choice',
    text: 'Sevgi göstermek ya da almak bende bir şeylerin ters gideceği hissini uyandırır.',
    schema: 'avoidance',
    options: CHOICE_5,
  },
  {
    id: 'v2_9',
    mode: 'love', layer: 2, inputType: 'choice',
    text: 'Bir ilişkide kendim olduğumda sevilmek, bir rol oynadığımda sevilmekten daha az inanılır gelir.',
    schema: 'defectiveness',
    options: CHOICE_5,
  },
];

const LOVE_LAYER_3: Question[] = [
  {
    id: 'v3_1',
    mode: 'love', layer: 3, inputType: 'text',
    text: 'İlişkilerinde tekrar eden bir kalıp var mı? Her seferinde aynı noktada mı tıkanıyorsun?',
    schema: 'avoidance',
    scoringHint: 'İlişkilerdeki tekrar eden kaçınma veya tıkanma kalıbı',
  },
  {
    id: 'v3_2',
    mode: 'love', layer: 3, inputType: 'text',
    text: 'Bu ilişkide ya da aşkta seni tutan şey gerçekten sevgi mi, alışkanlık mı, yoksa yalnızlık korkusu mu?',
    schema: 'abandonment',
    scoringHint: 'Terk edilme korkusunun ilişkiyi sürdürmedeki rolü',
  },
  {
    id: 'v3_3',
    mode: 'love', layer: 3, inputType: 'text',
    text: 'Kendin olduğun için sevildiğini en son ne zaman hissettin?',
    schema: 'defectiveness',
    scoringHint: 'Koşulsuz kabul deneyimi — yetersizlik şemasının derinliği',
  },
  {
    id: 'v3_4',
    mode: 'love', layer: 3, inputType: 'text',
    text: 'Bu ilişkide korktuğun şey gerçekten karşındaki kişiyle mi ilgili, yoksa içindeki bir inançla mı?',
    schema: 'defectiveness',
    scoringHint: 'Dışsal vs içsel korku kaynağı',
  },
  {
    id: 'v3_5',
    mode: 'love', layer: 3, inputType: 'text',
    text: 'Sevgi almakta mı zorlanırsın, vermekte mi? Neden?',
    schema: 'deprivation',
    scoringHint: 'Duygusal yoksunluk şemasının yönü',
  },
  {
    id: 'v3_6',
    mode: 'love', layer: 3, inputType: 'text',
    text: 'Bu kalıbı ilk nerede öğrendin? İlk aile ortamında mı, yoksa ilk ilişkinde mi?',
    schema: 'abandonment',
    scoringHint: 'Terk edilme şemasının kökeni',
  },
  {
    id: 'v3_7',
    mode: 'love', layer: 3, inputType: 'text',
    text: 'Bu ilişki hakkında kendine söylediğin ama doğru olmadığını bildiğin şey ne?',
    schema: 'avoidance',
    scoringHint: 'Kaçınma mekanizması — kendini kandırma',
  },
  {
    id: 'v3_8',
    mode: 'love', layer: 3, inputType: 'text',
    text: 'Eğer bu kararın sonucunda acı çekeceksen, hangi acı seni büyütür?',
    schema: 'avoidance',
    scoringHint: 'Büyüme acısı vs kaçınma acısı',
  },
  {
    id: 'v3_9',
    mode: 'love', layer: 3, inputType: 'text',
    text: 'Aşkta şu an en dürüst adımın ne olurdu?',
    schema: 'subjugation',
    scoringHint: 'Boyun eğme şemasına rağmen özgün hareket kapasitesi',
  },
];

// ═══════════════════════════════════════════════════════════════
// ANA SORU BANKASI
// ═══════════════════════════════════════════════════════════════

export const QUESTION_BANK: Question[] = [
  ...WORK_LAYER_1,
  ...WORK_LAYER_2,
  ...WORK_LAYER_3,
  ...LIFE_LAYER_1,
  ...LIFE_LAYER_2,
  ...LIFE_LAYER_3,
  ...LOVE_LAYER_1,
  ...LOVE_LAYER_2,
  ...LOVE_LAYER_3,
];

// ═══════════════════════════════════════════════════════════════
// SKOR HESAPLAMA
// ═══════════════════════════════════════════════════════════════

export type SchemaScores = Record<Schema, number>;

export type PiriDNA = {
  schemas: SchemaScores;
  // Gruplar (0-100)
  schemaScore: number;   // abandonment + defectiveness
  personaScore: number;  // subjugation + unrelenting
  shadowScore: number;   // deprivation + avoidance
  // Dominant şema
  dominant: Schema;
  // Grup karakter
  profile: 'schema_driven' | 'persona_driven' | 'shadow_driven';
};

// Choice cevabını skora çevir
export function choiceToScore(answerIndex: number, reverse = false): number {
  const scores = [0, 25, 50, 75, 100];
  const score = scores[answerIndex] ?? 0;
  return reverse ? 100 - score : score;
}

// Tüm cevaplardan DNA hesapla
export function calculateDNA(
  answers: Record<string, number | string>, // questionId → answerIndex (choice) | string (text)
  questions: Question[],
  mode: Mode
): PiriDNA {
  const schemaAccumulator: Record<Schema, number[]> = {
    abandonment: [], defectiveness: [], subjugation: [],
    unrelenting: [], deprivation: [], avoidance: [],
  };

  const modeQuestions = questions.filter(q => q.mode === mode);

  for (const q of modeQuestions) {
    const answer = answers[q.id];
    if (q.inputType === 'choice' && typeof answer === 'number') {
      const score = choiceToScore(answer, q.reverse);
      schemaAccumulator[q.schema].push(score);
    }
    // Text soruları AI tarafından analiz edilir, burada scoring yapılmaz
  }

  const avg = (arr: number[]) =>
    arr.length === 0 ? 0 : Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);

  const schemas: SchemaScores = {
    abandonment:   avg(schemaAccumulator.abandonment),
    defectiveness: avg(schemaAccumulator.defectiveness),
    subjugation:   avg(schemaAccumulator.subjugation),
    unrelenting:   avg(schemaAccumulator.unrelenting),
    deprivation:   avg(schemaAccumulator.deprivation),
    avoidance:     avg(schemaAccumulator.avoidance),
  };

  const schemaScore  = avg([schemas.abandonment, schemas.defectiveness]);
  const personaScore = avg([schemas.subjugation, schemas.unrelenting]);
  const shadowScore  = avg([schemas.deprivation, schemas.avoidance]);

  // Dominant şema
  const dominant = (Object.entries(schemas) as [Schema, number][])
    .sort(([, a], [, b]) => b - a)[0][0];

  // Dominant grup
  const groupScores = { schema_driven: schemaScore, persona_driven: personaScore, shadow_driven: shadowScore };
  const profile = (Object.entries(groupScores) as [PiriDNA['profile'], number][])
    .sort(([, a], [, b]) => b - a)[0][0];

  return { schemas, schemaScore, personaScore, shadowScore, dominant, profile };
}

// ═══════════════════════════════════════════════════════════════
// YARDIMCI FONKSİYONLAR
// ═══════════════════════════════════════════════════════════════

// Belirli mod ve katman için soruları getir
export function getQuestions(mode: Mode, layer: Layer): Question[] {
  return QUESTION_BANK.filter(q => q.mode === mode && q.layer === layer);
}

// DNA'ya göre Piri'nin chat'te kullanacağı gizli context
export function dnaToPromptContext(dna: PiriDNA, textAnswers: string[]): string {
  const schemaLabels: Record<Schema, string> = {
    abandonment:   'Terk edilme',
    defectiveness: 'Yetersizlik',
    subjugation:   'Boyun eğme',
    unrelenting:   'Yüksek standartlar',
    deprivation:   'Duygusal yoksunluk',
    avoidance:     'Kaçınma',
  };

  const topSchemas = (Object.entries(dna.schemas) as [Schema, number][])
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([k, v]) => `${schemaLabels[k]}: ${v}/100`)
    .join(', ');

  const profileLabel = {
    schema_driven:  'Şema güdümlü — temel inanç sistemi kararlarını bloke ediyor',
    persona_driven: 'Persona güdümlü — sosyal maske gerçek benliği gizliyor',
    shadow_driven:  'Gölge güdümlü — bastırılmış ihtiyaçlar ve kaçınma hâkim',
  }[dna.profile];

  const dominantBelief = SCHEMA_META[dna.dominant].coreBeliefTR;

  let context = `[PİRİ GİZLİ CONTEXT — KULLANICIYA SÖYLEME]
Dominant şema: ${schemaLabels[dna.dominant]} (${dna.schemas[dna.dominant]}/100)
Temel inanç: "${dominantBelief}"
Profil tipi: ${profileLabel}
Aktif şemalar: ${topSchemas}
Şema skoru: ${dna.schemaScore}/100 | Persona skoru: ${dna.personaScore}/100 | Gölge skoru: ${dna.shadowScore}/100`;

  if (textAnswers.length > 0) {
    context += `\nKullanıcının kendi sözleri:\n${textAnswers.slice(0, 6).map((t, i) => `  ${i + 1}. "${t}"`).join('\n')}`;
  }

  return context;
}
