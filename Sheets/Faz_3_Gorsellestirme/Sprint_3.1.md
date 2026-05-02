# Sprint 3.1: Canvas Çizimi ve Akıcı Animasyonlar

## Hedef
Zustand'dan gelen anlık array durumunu ekrana performanslı bir şekilde yansıtmak. Büyük array'ler için Canvas API kullanmak, geçişlerin "keskin (sharp)" olmamasını sağlamak.

## Talimatlar (Claude İçin)
1. `src/components/CanvasRenderer.jsx` oluştur.
2. **Performans (Canvas API) ve Dinamik Çizim:** DOM node'ları yerine direkt `<canvas>` kullan. Array boyutuna göre çubukların genişliğini otomatik hesapla.
   - Eğer Dizi Boyutu < 1000 ise: Klasik **Bar Chart (Çubuk)** çizimi yap.
   - Eğer Dizi Boyutu >= 1000 ise: Performans için **Scatter Plot (Nokta Bulutu)** veya **Color Gradient (Renk Şeridi)** çizimine geç.
   - **Kritik Performans Kuralı:** Her `swap` işleminde React render'ı tetiklemek DOM'u kilitler. Zustand'dan gelen değişimleri takip et ancak Canvas çizimini bir `useRef` ve `requestAnimationFrame` döngüsü içinde yaparak React'in yaşam döngüsünü (lifecycle) bypass et.
3. **Çizim Mantığı (Renkler):**
   - Karşılaştırılan elemanlar (Comparing) için Sarı renk parlaması (glow).
   - Yer değiştiren elemanlar (Swapping) için Kırmızı.
   - Sıralananlar için Yeşil.
4. **Akıcılık (Smoothness):** requestAnimationFrame kullanarak Canvas üzerinde çubukların boy değişimi veya yer değişimi sırasında yumuşak bir interpolasyon (easing) yap. Keskin sıçramalar olmamalı.

## Çıktı ve Test
- Kullanıcıya: "Sprint 3.1 tamamlandı. Artık 'Başlat' butonuna bastığınızda Canvas üzerinde algoritmanın yumuşak geçişlerle çizildiğini, array çok büyükse nokta bulutuna dönüştüğünü test edebilirsiniz." mesajını ver.
