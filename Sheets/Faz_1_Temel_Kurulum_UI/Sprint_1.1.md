# Sprint 1.1: Proje Kurulumu, Klasör Altyapısı ve Temel UI Tasarımı

## Hedef
Projenin ihtiyaç duyduğu tüm kütüphanelerin (Tailwind, Zustand, Framer vb.) kurulumunu tamamlamak, modüler klasör mimarisini (`src/components`, `src/store` vb.) oluşturmak ve temel "Glassmorphism" arayüz iskeletini inşa etmek.

## Talimatlar (Claude İçin)
1. **Bağımlılıkların Kurulumu:** Terminali kullanarak eksik kütüphaneleri kur:
   - `npm install -D tailwindcss postcss autoprefixer` (ve tailwind init yapıp `tailwind.config.js` ve `index.css` ayarlarını yap).
   - `npm install framer-motion lucide-react zustand`
2. **Klasör Mimarisinin Kurulması:** `src/` dizini altında şu yapıyı oluştur:
   - `src/components/` (UI elementleri için)
   - `src/store/` (Zustand state yönetimi için)
   - `src/workers/` (Web worker algoritmaları için)
   - `src/utils/` (Ses ve yardımcı fonksiyonlar için)
3. **Arayüz İskeleti (UI):** Ekranda iki ana bölüm oluşturan bir `App.jsx` tasarla:
   - **Üst Panel (Header/Controls):** Ayarların bulunacağı alan. Şunları içermeli: Boyut Slider'ı, Gecikme (Delay) Slider'ı, **Dizi Tipi Seçici (Rastgele, Ters Sıralı, Neredeyse Sıralı)**, **Özel Dizi Girdisi (Virgülle ayrılmış sayılar)**, Algoritma Seçimi, Başlat/Durdur butonları ve **Sesi Aç/Kapat (Mute) Butonu**.
   - **Ana Sahne (Main Canvas Area):** Çizimlerin yapılacağı geniş boş alan.
4. Tüm geçişler ve hover efektleri akıcı (smooth) Tailwind sınıflarıyla yapılmalı. Bu sprintte sadece statik UI kodunu yaz, işlevsellik ekleme.

## Çıktı ve Test
- Kullanıcıya: "Sprint 1.1 tamamlandı. Klasör altyapısı kuruldu, Tailwind ayarlandı ve UI tasarımı yapıldı. Lütfen 'npm run dev' ile tarayıcınızdan arayüzü ve animasyonların akıcılığını test edin." mesajını ver.
