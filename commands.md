# 🗣️ Claude Code Komut Listesi (Copy-Paste Prompts)

Bu dosya, Claude Code'u terminalden yönlendirirken kopyalayıp yapıştırabileceğin hazır komutları içerir. Her bir sprint'i sırasıyla vererek projenin modüler ve hatasız ilerlemesini sağlayabilirsin.

---

### 🟢 Faz 1: Başlangıç ve UI
Claude Code'u başlattığında ilk olarak bu komutu ver:

```text
Lütfen öncelikle CLAUDE.md dosyasındaki global kuralları oku. Ardından Sheets/Faz_1_Temel_Kurulum_UI/Sprint_1.1.md dosyasını oku ve oradaki talimatları harfiyen uygula. Sadece benden istenilen UI dosyalarını oluştur. İşini bitirdiğinde "npm run dev" komutunu çalıştır ve benim tarayıcıdan test edebilmem için bekle.
```

*(Kodu test et. Her şey istediğin gibi görünüyorsa ve animasyonlar akıcıysa sonraki adıma geç.)*

---

### 🟡 Faz 2: Motor ve State (Zustand + Web Workers)
```text
Tebrikler, UI gayet güzel oldu. Şimdi Sheets/Faz_2_Motor_ve_State/Sprint_2.1.md dosyasını oku ve sadece oradaki görevleri yap. Mevcut UI tasarımlarımı bozma. Zustand store ve Web Worker altyapısını kurduğunda, konsola çıktıları yazdır ve test edebilmem için bekle.
```

*(Test et. 'Test Worker' butonuna basınca konsolda hesaplamaların geldiğinden emin ol.)*

---

### 🟠 Faz 3: Görselleştirme (Canvas)
```text
Arka plan motoru kusursuz. Lütfen Sheets/Faz_3_Gorsellestirme/Sprint_3.1.md dosyasını incele. Canvas API kullanarak performanslı bir çizim alanı oluştur. Renklerin ve animasyonların "keskin (sharp) olmadan", akıcı (smooth) bir interpolasyonla hareket etmesine çok dikkat et. Bitince bana test etmem için haber ver.
```

*(Test et. Animasyonların o istediğin 'yağ gibi akan' hissini verip vermediğini kontrol et. Sorun varsa "Animasyonları biraz daha yavaşlat/yumuşat" diyerek düzelttirebilirsin.)*

---

### 🔵 Faz 4: Grid ve Karşılaştırma Motoru
```text
Görsellik mükemmel oldu. Şimdi yarış motorunu kuracağız. Sheets/Faz_4_Karsilastirma/Sprint_4.1.md dosyasını oku. Ekranda aynı anda 1'den 4'e kadar algoritmayı yarıştıran Grid sistemini kodla. Oto-duraklatma ve Timeline (Geri sarma) özelliklerini hatasız entegre et. Bitirdiğinde test etmem için bekle.
```

*(Test et. 4 farklı algoritmayı aynı anda başlatıp çökmeye neden olmadığını ve ilk bitenin diğerlerini durdurduğunu test et.)*

---

### 🟣 Faz 5: Ses ve Final Cila
```text
Grid sistemi harika çalışıyor. Son aşamaya geldik. Sheets/Faz_5_Ses_ve_Ekstralar/Sprint_5.1.md dosyasını oku. Kulak tırmalamayan, profesyonel synthesizer (triangle wave) seslerini Web Audio API ile bağla ve eksik olan tüm algoritmaları projeye ekle. Bu sprint bittiğinde projeyi genel olarak test edeceğim.
```

---

### 💡 Ekstra Hata Çözüm Komutu (Gerekirse)
Eğer Claude Code bir yerde hata yaparsa veya bir animasyon keskinleşirse, ona şu tarz direktifler verebilirsin:
```text
Az önce yaptığın değişiklik UI'da bir bozulmaya/keskinleşmeye neden oldu. Lütfen tüm dosyaları baştan OKUMA. Sadece değiştirdiğin son dosyayı (örneğin CanvasRenderer.jsx) kontrol et ve sorunu düzeltip tekrar test etmem için haber ver.
```
