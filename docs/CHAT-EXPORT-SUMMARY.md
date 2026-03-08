# Piri Projesi — Sohbet Dışa Aktarım Özeti

Bu belge Onur'un ChatGPT ile yaptığı sohbetten çıkan kararları ve mevcut durumu özetler.

## Mevcut Durum
- Next.js / App Router çalışıyor
- Giriş ekranı + test + sonuç + simülasyon akışı ayağa kalktı
- İş / Yol / Aşk kapıları var, her kapı kendi test bankasına bağlanıyor
- Her kapı: 3 katman × 9 soru = 27 soru
- Katman 1-2 seçenekli, Katman 3 text input
- Decision Signature / Karar Haritası mantığı çalışıyor
- Uzun vadede kapılar tek çekirdek kişilik omurgasında birleşecek

## Ürün Kimliği
- Tavsiye uygulaması, motivasyon aracı veya terapist DEĞİL
- Karar örüntüsünü ve olası sonuç yollarını görünür kılıyor
- Ton: dostça ama mesafeli, net ama yargılamayan, sakin zekâ
- Kullanıcıya 'sen' diye hitap

## Temel Felsefe
- Karar tek başına analiz edilmez; tıkanma nedeni de anlaşılır
- Şema dili arka planda kullanılabilir ama terapötik etiketler sunulmaz
- Kapılar bağımsız değil: farklı alanlardaki davranış farkları ileride birleştirilecek

## Kapılar
- **Work:** kariyer, statü, risk, yön değişimi, performans, kontrol
- **Life/Yol:** şehir/ülke, düzen, güvenlik, değişim, yaşam yönü, istikrar
- **Love:** bağlanma, terk edilme hassasiyeti, netlik ihtiyacı, kalma/bitirme

## Test Mimarisi
- Ortak test reddedildi → kapıya özel test benimsendi
- Katman 1: hızlı davranış profili, kısa ve sürükleyici
- Katman 2: psikolojik dinamik ve karar blokajı
- Katman 3: kısa yazılı cevaplar, anlatı katmanı
- Katman geçişlerinde Piri geçiş mesajları var

## Ölçülen Omurga (Core Profile)
risk, uncertainty, regret, agency, energy, attachment

## Gizli Blokaj Sinyalleri (Shadow Signals)
perfectionism, approval, abandonment, control, avoidance, innerCritic

## Çapraz Analiz Vizyonu
- Tek kapı → kapıya özel karar imzası
- 2-3 kapı → kapılar arası farklar görünür
- Hedef: "İşte hızlısın, aşkta belirsizlik seni kilitliyor, hayat kararlarında erteleme baskın"
- Uzun vadede global signature üretilecek

## Arayüz & Görsel Kimlik
- Piri = yüz değil, bilinç formu / ışık küresi
- Referanslar: Interstellar, Huawei charging animation
- Alttan doğan enerji → merkez orb → orb içinden mesaj baloncukları
- Şimdiki görsel geçici prototip, rafine edilecek

## Kararlaştırılan Sıradaki Adımlar
1. 81 soruluk bankayı (3×27) tam doldurup stabilize etmek
2. Katman geçişlerinde Piri baloncuğu ile akışı iyileştirmek
3. Result'ta tek kapı vs global profil mantığını ayırmak
4. Simülasyon motorunu kapı + profile göre özelleştirmek
5. Giriş ekranı ve genel UI'ı premium seviyeye taşımak
