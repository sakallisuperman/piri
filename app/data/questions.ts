export type Question = {
  id: string;
  textEN: string;
  textTR: string;
  optionsEN: string[];
  optionsTR: string[];
};

export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    textEN: 'When you get stuck, what do you avoid first?',
    textTR: 'Tıkandığında ilk neyi yapmamaya çalışırsın?',
    optionsEN: ['Feeling wrong', 'Looking weak', 'Wasting time', 'Disappointing someone'],
    optionsTR: ['Yanlış görünmek', 'Zayıf görünmek', 'Zaman kaybetmek', 'Birini hayal kırıklığına uğratmak'],
  },
  {
    id: 'q2',
    textEN: 'What hurts more: regret or rejection?',
    textTR: 'Hangisi daha çok acıtır: pişmanlık mı reddedilmek mi?',
    optionsEN: ['Regret', 'Rejection', 'Depends', 'Not sure'],
    optionsTR: ['Pişmanlık', 'Reddedilmek', 'Duruma göre', 'Emin değilim'],
  },
  {
    id: 'q3',
    textEN: 'Your default under pressure is…',
    textTR: 'Baskı altında varsayılan tepkin…',
    optionsEN: ['Overthink', 'Overwork', 'Freeze', 'Act fast'],
    optionsTR: ['Çok düşünmek', 'Çok çalışmak', 'Donmak', 'Hızlı hareket etmek'],
  },
  {
    id: 'q4',
    textEN: 'Which cost scares you most?',
    textTR: 'Hangi bedel seni en çok korkutur?',
    optionsEN: ['Time', 'Money', 'Reputation', 'Loneliness'],
    optionsTR: ['Zaman', 'Para', 'İtibar', 'Yalnızlık'],
  },
  {
    id: 'q5',
    textEN: 'What do you want more right now?',
    textTR: 'Şu an daha çok ne istiyorsun?',
    optionsEN: ['Stability', 'Growth', 'Freedom', 'Belonging'],
    optionsTR: ['İstikrar', 'Gelişim', 'Özgürlük', 'Aidiyet'],
  },
  {
    id: 'q6',
    textEN: 'If you choose wrong, you fear…',
    textTR: 'Yanlış seçersen en çok şundan korkarsın…',
    optionsEN: ['Starting over', 'Being judged', 'Losing momentum', 'Losing someone'],
    optionsTR: ['Baştan başlamak', 'Yargılanmak', 'İvmeyi kaybetmek', 'Birini kaybetmek'],
  },
  {
    id: 'q7',
    textEN: 'Your energy is currently…',
    textTR: 'Enerjin şu an…',
    optionsEN: ['Low', 'Medium', 'High', 'Unstable'],
    optionsTR: ['Düşük', 'Orta', 'Yüksek', 'Dengesiz'],
  },
  {
    id: 'q8',
    textEN: 'How much uncertainty can you tolerate?',
    textTR: 'Belirsizliğe ne kadar dayanırsın?',
    optionsEN: ['Very little', 'Some', 'A lot', 'Depends'],
    optionsTR: ['Çok az', 'Biraz', 'Çok', 'Duruma göre'],
  },
  {
    id: 'q9',
    textEN: 'What do you need from the next 90 days?',
    textTR: 'Önümüzdeki 90 günden neye ihtiyacın var?',
    optionsEN: ['Clarity', 'Courage', 'Structure', 'Rest'],
    optionsTR: ['Netlik', 'Cesaret', 'Düzen', 'Dinlenme'],
  },
  {
    id: 'q10',
    textEN: 'When you imagine success, you see…',
    textTR: 'Başarıyı hayal edince şunu görürsün…',
    optionsEN: ['Peace', 'Power', 'Impact', 'Love'],
    optionsTR: ['Huzur', 'Güç', 'Etki', 'Aşk'],
  },
  {
    id: 'q11',
    textEN: 'If you do nothing, what is the likely outcome?',
    textTR: 'Hiçbir şey yapmazsan muhtemel sonuç ne?',
    optionsEN: ['Same loop', 'Slow decay', 'Sudden break', 'Unknown'],
    optionsTR: ['Aynı döngü', 'Yavaş kötüleşme', 'Ani kırılma', 'Bilinmiyor'],
  },
  {
    id: 'q12',
    textEN: 'How honest do you want Piri to be?',
    textTR: 'Piri ne kadar dürüst olsun?',
    optionsEN: ['Gentle', 'Direct', 'Brutal', 'Switch depending on mood'],
    optionsTR: ['Yumuşak', 'Direkt', 'Sert', 'Moduma göre değişsin'],
  },
];