# Sprint 2.1: Web Worker Motoru ve Zustand State Yönetimi

## Hedef
Arayüzden gelen komutları yönetecek merkezi bir State (Zustand) kurmak ve 50.000 elemanlı dizilerde bile tarayıcıyı dondurmayacak Web Worker altyapısını oluşturmak. 

## Talimatlar (Claude İçin)
1. **State Yönetimi (`src/store/useStore.js`):**
   - **Kritik Mimari (Multi-Grid için):** 4 farklı algoritmanın aynı anda yarışabilmesi için Zustand store'unda tek bir `array` state'i tutmak yerine, bağımsız çalışan örnekler (instances) tutmalısın. Örn: `instances: { id1: { array: [], alg: 'Bubble', isFinished: false }, id2: ... }`. Ana başlangıç dizisi (initialArray) klonlanarak her instance'a dağıtılmalı.
   - Fonksiyonlar: `generateArray(size, type, customInput)` (Ters sıralı, neredeyse sıralı veya kullanıcının girdiği özel dizi mantığı dahil).
2. **Web Worker (`src/workers/sortWorker.js`):**
   - Basit bir Bubble Sort algoritmasını `function*` (generator) mantığıyla yaz. İşlemleri (compare, swap) yield etsin.
   - **Mühendislik Stres Testi (Delay=0):** Eğer gönderilen gecikme 0 ms ise, worker adımları yield etmesin. Arka planda algoritmayı en yüksek hızda çözsün.
   - **Saf İşlem Süresi:** Worker, algoritmanın işini bitirmesinin gerçek hayatta ne kadar sürdüğünü (Performance.now() ile) ölçsün ve "Saf CPU Süresi" olarak ana thread'e döndürsün.
3. **Modülerlik:** Sadece Store ve Worker'ı oluştur, `App.jsx` içine basit bir "Test Worker" butonu koyarak konsola çıktı yazdır.

## Çıktı ve Test
- Kullanıcıya: "Sprint 2.1 tamamlandı. Arka plan motoru hazır. Ekranda 'Test Worker' butonuna basarak konsoldan Bubble Sort adımlarının ve 'Saf CPU Süresi' metriklerinin geldiğini test edebilirsiniz." mesajını ver.
