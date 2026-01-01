# Güvenlik Notları

## API Key Yönetimi

Bu projede API key'ler ve hassas bilgiler `config.js` dosyasında saklanmaktadır.

### Önemli Güvenlik Adımları

1. **config.js dosyası .gitignore'a eklenmiştir**
   - Bu dosya Git repository'ye commit edilmemelidir
   - Her ortam için ayrı config.js dosyası oluşturulmalıdır

2. **Google Maps API Key Kısıtlamaları**
   - Google Cloud Console'da API key'inize HTTP referrer kısıtlaması ekleyin
   - Sadece şu domain'lerden erişime izin verin:
     - `https://jetla.com.tr/*`
     - `https://www.jetla.com.tr/*`
     - `https://jetlakurye.com/*`
     - `https://www.jetlakurye.com/*`
   - Geliştirme için: `http://localhost/*`

3. **Google Apps Script Deployment Ayarları**
   - Web App deployment'larında "Who has access" ayarını kontrol edin
   - Mümkünse "Anyone with Google account" veya daha kısıtlı erişim kullanın
   - Script URL'lerini düzenli olarak yenileyin

4. **Production Ortamı İçin**
   - config.js dosyasını server-side'da environment variable olarak saklayın
   - Client-side'da API key'leri tamamen gizlemek mümkün değildir
   - API key kısıtlamaları ile güvenliği sağlayın

### config.js Dosyası Yapısı

```javascript
const CONFIG = {
    GOOGLE_MAPS_API_KEY: 'YOUR_API_KEY',
    IMZA_WEB_APP_URL: 'YOUR_WEB_APP_URL',
    KURYE_BASVURU_SCRIPT_URL: 'YOUR_SCRIPT_URL',
    ISLETME_BASVURU_SCRIPT_URL: 'YOUR_SCRIPT_URL'
};
```

### Yeni Ortam Kurulumu

1. `config.js` dosyasını oluşturun
2. API key'leri ve URL'leri doldurun
3. `.gitignore` dosyasının `config.js` içerdiğinden emin olun
4. Dosyayı commit etmeyin

