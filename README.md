# 📅 TodoV2 - Akıllı Zaman ve Görev Yönetimi

TodoV2, modern tasarımı ve güçlü özellikleriyle zamanınızı en verimli şekilde yönetmeniz için geliştirilmiş bir kişisel asistan uygulamasıdır. **Google Calendar API** entegrasyonu sayesinde tüm planlarınız hem uygulamanızda hem de takviminizde her an yanınızda.

## ✨ Öne Çıkan Özellikler

- **🔒 Güvenli Giriş:** Google Firebase Auth ile hızlı ve güvenli kimlik doğrulama.
- **🔄 Google Takvim Senkronizasyonu:** Uygulama üzerinden oluşturulan tüm etkinlikler otomatik olarak Google Takviminize işlenir.
- **📝 Gelişmiş Görev (Task) Takibi:**
  - Görevleri kategorize etme.
  - Hedef tarih ve hatırlatıcı ekleme.
  - Dinamik durum güncellemeleri.
- **📅 Etkinlik (Event) Yönetimi:**
  - Başlangıç ve bitiş saatlerine göre planlama.
  - **Google Meet** entegrasyonu ile otomatik toplantı linki oluşturma.
  - Özel katılımcı listeleri ve davetiyeler.
- **🎨 Modern UI/UX:** Tailwind CSS kullanılarak hazırlanan, **Glassmorphism** efektli ve göz yormayan arayüz.
- **🌗 Tema Desteği:** Sistem tercihine göre otomatik veya manuel değişen Dark/Light mod.

## 🛠 Kullanılan Teknolojiler

- **Frontend:** React.js, React Router DOM
- **Stilleme:** Tailwind CSS
- **State Yönetimi:** React Context API
- **Backend & Veritabanı:** Firebase (Auth & Firestore)
- **API:** Google Calendar API
- **Bildirimler:** SweetAlert2 & React Hot Toast

## 🚀 Kurulum

1.  **Projeyi Klonlayın:**
    ```bash
    git clone https://github.com/aenes-dev/google-task-event-manager.git
    cd google-task-event-manager
    ```

2.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    ```

3.  **Çevre Değişkenlerini Ayarlayın:**
    `firebase/config.js` dosyasına girip Firebase anahtarlarınızı ekleyin.

4.  **Uygulamayı Başlatın:**
    ```bash
    npm run dev
    ```

## 🤝 Katkıda Bulunma

Bu proje açık kaynağa açıktır. Her türlü katkı, hata bildirimi veya özellik önerisi için lütfen bir Pull Request (PR) oluşturun veya Issue açın.

---
*Geliştirici:* [Akif Enes](https://github.com/aenes-dev)  
*Lisans:* [MIT](LICENSE)
