# Sprint 4.1: Çoklu Karşılaştırma Modu (Split Screen)

## Hedef
1, 2, 3 veya 4 algoritmanın aynı anda ekranda yarışmasını sağlamak, Timeline Scrubber (geriye/ileriye sarma) ve İkili Süre Metriklerini eklemek.

## Talimatlar (Claude İçin)
1. **Grid Sistemi:** `VisualizerArea.jsx`'i güncelle. Seçilen algoritma sayısına göre CSS Grid kullanarak ekranı böl (1x1, 1x2, 2x2). Her bir alt pencere, aynı başlangıç dizisiyle (array) farklı algoritma çalıştırsın.
2. **İkili Süre ve Metrik Gösterimi:** Her algoritmanın paneli altında şu verileri (UI olarak şık bir şekilde) göster:
   - *Gecikmeli Süre:* Animasyonun süresi.
   - *Saf CPU Süresi:* Worker'dan gelen gerçek algoritma performansı (Delay=0'daki süre).
   - *Karşılaştırma (Comparisons)* ve *Dizi Erişimi (Array Accesses)* sayaçları.
3. **Oto-Duraklatma:** Biri algoritmayı bitirdiğinde `isRaceFinished` flag'i true olsun ve diğer motorlar donup kalsın (aradaki hız farkını göstermek için).
4. **Timeline Scrubber:** Alt kısma bir range slider ekle. Geri sarıldığında Zustand array'ini geçmiş adımdaki snapshot'a güncellesin. Animasyonlar yine smooth olsun.

## Çıktı ve Test
- Kullanıcıya: "Sprint 4.1 tamamlandı. Lütfen UI'dan 4 farklı algoritmayı aynı anda yarıştırın. Alt panelde 'Saf CPU Süresi' ve sayaçların düzgün çalıştığını, timeline scrubber'ı test edin." mesajını ver.
