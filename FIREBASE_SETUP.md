# 🔥 Firebase Kurulum Rehberi - DoguBlog

Bu rehber, DoguBlog projesi için Firebase backend kurulumunu adım adım açıklar.

## 📋 İçindekiler

1. [Firebase Projesi Oluşturma](#1-firebase-projesi-oluşturma)
2. [Web Uygulaması Ekleme](#2-web-uygulaması-ekleme)
3. [Authentication Kurulumu](#3-authentication-kurulumu)
4. [Firestore Database Kurulumu](#4-firestore-database-kurulumu)
5. [Storage Kurulumu](#5-storage-kurulumu)
6. [Güvenlik Kuralları](#6-güvenlik-kuralları)
7. [Konfigürasyon](#7-konfigürasyon)
8. [Test Etme](#8-test-etme)

## 1. Firebase Projesi Oluşturma

### Adım 1: Firebase Console'a Giriş
- [Firebase Console](https://console.firebase.google.com/) adresine gidin
- Google hesabınızla giriş yapın

### Adım 2: Yeni Proje Oluşturma
- "Create a project" veya "Proje oluştur" butonuna tıklayın
- Proje adını **"DoguBlog"** olarak girin
- Google Analytics'i etkinleştirin (isteğe bağlı)
- "Create project" ile projeyi oluşturun

## 2. Web Uygulaması Ekleme

### Adım 1: Web Uygulaması Ekleme
- Proje oluşturulduktan sonra "Add app" veya "Uygulama ekle" butonuna tıklayın
- Web simgesini seçin (</>)
- Uygulama takma adını **"DoguBlog-Web"** olarak girin
- "Register app" ile kaydedin

### Adım 2: Konfigürasyon Bilgilerini Kopyalama
Firebase size şuna benzer bir konfigürasyon verecek:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "dogublog-xxxxx.firebaseapp.com",
  projectId: "dogublog-xxxxx",
  storageBucket: "dogublog-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

## 3. Authentication Kurulumu

### Adım 1: Authentication'ı Etkinleştirme
- Firebase Console'da sol menüden "Authentication" seçin
- "Get started" veya "Başlayın" butonuna tıklayın

### Adım 2: Sign-in Method Ekleme
- "Sign-in method" sekmesine gidin
- "Email/Password" sağlayıcısını seçin
- "Enable" ile etkinleştirin
- "Save" ile kaydedin

### Adım 3: Ek Sağlayıcılar (İsteğe Bağlı)
- Google, Facebook, Twitter gibi sosyal medya girişlerini de ekleyebilirsiniz
- Her biri için ayrı konfigürasyon gerekir

## 4. Firestore Database Kurulumu

### Adım 1: Firestore Database Oluşturma
- Firebase Console'da "Firestore Database" seçin
- "Create database" veya "Veritabanı oluştur" butonuna tıklayın

### Adım 2: Güvenlik Modu Seçimi
- **Geliştirme için:** "Start in test mode" seçin
- **Üretim için:** "Start in locked mode" seçin

### Adım 3: Veritabanı Konumu
- Avrupa için: `europe-west1` (önerilen)
- ABD için: `us-central1`
- "Done" ile tamamlayın

## 5. Storage Kurulumu

### Adım 1: Storage'ı Etkinleştirme
- Firebase Console'da "Storage" seçin
- "Get started" veya "Başlayın" butonuna tıklayın

### Adım 2: Güvenlik Kuralları
- **Geliştirme için:** "Start in test mode" seçin
- **Üretim için:** "Start in locked mode" seçin

### Adım 3: Storage Konumu
- Firestore ile aynı konumu seçin
- "Done" ile tamamlayın

## 6. Güvenlik Kuralları

### Firestore Güvenlik Kuralları
Proje kök dizinindeki `firestore.rules` dosyasını Firebase Console'da yayınlayın:

1. Firebase Console'da "Firestore Database" seçin
2. "Rules" sekmesine gidin
3. `firestore.rules` dosyasının içeriğini kopyalayın
4. "Publish" ile yayınlayın

### Storage Güvenlik Kuralları
Proje kök dizinindeki `storage.rules` dosyasını Firebase Console'da yayınlayın:

1. Firebase Console'da "Storage" seçin
2. "Rules" sekmesine gidin
3. `storage.rules` dosyasının içeriğini kopyalayın
4. "Publish" ile yayınlayın

## 7. Konfigürasyon

### Adım 1: Firebase Config Dosyasını Güncelleme
`src/firebase/config.js` dosyasını açın ve Firebase Console'dan aldığınız bilgileri girin:

```javascript
const firebaseConfig = {
  apiKey: "SİZİN_API_KEY'İNİZ",
  authDomain: "SİZİN_PROJE_ID.firebaseapp.com",
  projectId: "SİZİN_PROJE_ID",
  storageBucket: "SİZİN_PROJE_ID.appspot.com",
  messagingSenderId: "SİZİN_SENDER_ID",
  appId: "SİZİN_APP_ID",
  measurementId: "SİZİN_MEASUREMENT_ID"
};
```

### Adım 2: Environment Variables (Önerilen)
Güvenlik için `.env` dosyası oluşturun:

```bash
# .env dosyası
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

Sonra `config.js` dosyasını güncelleyin:

```javascript
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};
```

## 8. Test Etme

### Adım 1: Uygulamayı Başlatma
```bash
npm start
```

### Adım 2: Firebase Bağlantısını Test Etme
Tarayıcıda ` http://localhost:3000` adresine gidin ve:
1. Kayıt olmayı deneyin
2. Giriş yapmayı deneyin
3. Blog yazısı oluşturmayı deneyin

### Adım 3: Firebase Console'da Kontrol
- Authentication > Users: Kullanıcıların oluştuğunu görün
- Firestore Database > Data: Verilerin kaydedildiğini görün
- Storage > Files: Yüklenen dosyaları görün

## 🚀 Backend Servisleri

Proje şu backend servislerini içerir:

### Kullanıcı İşlemleri
- ✅ Kullanıcı profili oluşturma
- ✅ Profil güncelleme
- ✅ Profil getirme

### Blog Yazısı İşlemleri
- ✅ Blog yazısı oluşturma
- ✅ Blog yazısı güncelleme
- ✅ Blog yazısı silme
- ✅ Tüm yazıları getirme (sayfalama ile)
- ✅ Kullanıcı yazılarını getirme
- ✅ Blog yazısı detayı getirme

### Yorum İşlemleri
- ✅ Yorum ekleme
- ✅ Blog yazısı yorumlarını getirme

### Beğeni İşlemleri
- ✅ Blog yazısını beğenme/beğenmekten vazgeçme

### Dosya Yükleme
- ✅ Profil resmi yükleme
- ✅ Blog yazısı resmi yükleme

### Arama ve İstatistikler
- ✅ Blog yazılarında arama
- ✅ Blog yazısı istatistikleri
- ✅ Kullanıcı istatistikleri

## 📁 Dosya Yapısı

```
src/
├── firebase/
│   └── config.js          # Firebase konfigürasyonu
├── services/
│   ├── BackendService.js  # Ana backend servisleri
│   ├── AuthService.js     # Kimlik doğrulama servisleri
│   ├── PostService.js     # Blog yazısı servisleri
│   └── UserService.js     # Kullanıcı servisleri
└── examples/
    └── BackendUsage.js    # Kullanım örnekleri

firestore.rules            # Firestore güvenlik kuralları
storage.rules              # Storage güvenlik kuralları
```

## 🔧 Kullanım Örnekleri

### Blog Yazısı Oluşturma
```javascript
import backendService from './services/BackendService';

const createPost = async () => {
  try {
    const result = await backendService.createPost({
      title: "İlk Blog Yazım",
      content: "Bu benim ilk blog yazım...",
      excerpt: "Kısa özet...",
      tags: ["react", "firebase"],
      category: "Teknoloji"
    });
    console.log('Blog yazısı oluşturuldu:', result);
  } catch (error) {
    console.error('Hata:', error);
  }
};
```

### Tüm Blog Yazılarını Getirme
```javascript
const getAllPosts = async () => {
  try {
    const result = await backendService.getAllPosts(1, 10);
    console.log('Blog yazıları:', result.data);
  } catch (error) {
    console.error('Hata:', error);
  }
};
```

## 🛡️ Güvenlik

### Firestore Güvenlik Kuralları
- Kullanıcılar sadece kendi profillerini düzenleyebilir
- Blog yazıları herkes tarafından okunabilir
- Blog yazıları sadece yazarı tarafından düzenlenebilir
- Yorumlar giriş yapmış kullanıcılar tarafından eklenebilir

### Storage Güvenlik Kuralları
- Profil resimleri sadece kullanıcının kendisi tarafından yüklenebilir
- Blog resimleri giriş yapmış kullanıcılar tarafından yüklenebilir
- Tüm dosyalar herkes tarafından okunabilir

## 🚨 Önemli Notlar

1. **Güvenlik Kuralları:** Üretim ortamında güvenlik kurallarını mutlaka güncelleyin
2. **API Anahtarları:** API anahtarlarını asla public repository'de paylaşmayın
3. **Environment Variables:** Hassas bilgileri `.env` dosyasında saklayın
4. **Backup:** Düzenli olarak veritabanı yedeği alın
5. **Monitoring:** Firebase Console'da uygulama performansını takip edin

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. Firebase Console'da hata mesajlarını kontrol edin
2. Browser console'da hata mesajlarını kontrol edin
3. Firebase dokümantasyonunu inceleyin: [Firebase Docs](https://firebase.google.com/docs)

---

**🎉 Tebrikler!** Firebase backend'iniz başarıyla kuruldu ve kullanıma hazır! 