# Sprint 5.1: Ses Motoru ve 15 Kapsamlı Algoritma

## Hedef
Algoritmalar çalışırken ikonik ses efektlerini (bip sesleri) Web Audio API ile entegre etmek ve söz verdiğimiz **toplam 15 algoritmayı** eksiksiz olarak projeye eklemek.

## Talimatlar (Claude İçin)
1. **Ses Motoru (`src/utils/audioManager.js`):**
   - **Kritik Kural (Browser Autoplay Policy):** `AudioContext`'i sayfa yüklenirken hemen başlatma. Tarayıcılar bunu engeller. Context'i "suspended" durumda tut ve kullanıcının sayfadaki ilk etkileşiminde (Örn: Başlat butonuna basması) `resume()` metodu ile uyandır.
   - `AudioContext` kullanarak bir Oscillator oluştur.
   - Array'in eleman değeri ne kadar yüksekse frekansı (pitch) o kadar yüksek olacak bir formül kur (örn: 200Hz - 1000Hz arası).
   - Sesi yumuşatmak için Triangle wave kullan ve çok hafif bir Gain envelope ekle (çıt-çıt patlamalarını önlemek için).
   - **Mute Mantığı:** UI'daki "Sesi Kapat" butonu aktifse `GainNode` değerini 0'a çek.
2. **Kapsamlı Algoritmalar (Toplam 15 Adet):** 
   - Daha önce yazılan Bubble Sort'a ek olarak şu 14 algoritmayı `src/workers/` altına eksiksiz ekle:
     1. Selection Sort
     2. Insertion Sort
     3. Merge Sort
     4. Quick Sort
     5. Heap Sort
     6. Radix Sort (LSD)
     7. Shell Sort
     8. Cocktail Shaker Sort
     9. Gnome Sort
     10. Bitonic Sort
     11. Pancake Sort
     12. Comb Sort
     13. Odd-Even Sort
     14. Bogo Sort (Eğlence amaçlı)
3. Token Optimizasyonu: Sadece algoritma dosyalarını oluştur ve store içine isimlerini ekle. UI tarafını okumaya çalışma.

## Çıktı ve Test
- Kullanıcıya: "Sprint 5.1 tamamlandı. 15 algoritmanın tamamı eklendi ve Ses motoru bağlandı! Projenin ana özellikleri bitti. Tarayıcınızda sesi açıp algoritmaların yarışırken çıkardıkları stüdyo kalitesindeki ses efektlerini test edebilirsiniz." mesajını ver.
